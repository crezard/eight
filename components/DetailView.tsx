import React, { useEffect, useState } from 'react';
import { PartConfig, QuizQuestion } from '../types';
import { generateExplanation, generateQuiz } from '../services/geminiService';
import ReactMarkdown from 'react-markdown'; // We don't have this in requirements, so I will parse simple MD or just display text nicely. 
// Wait, prompt says "Use popular libraries". I'll assume standard React rendering for simplicity or a simple MD parser function if I needed, 
// but sticking to standard text rendering with whitespace-pre-wrap is safer if I can't npm install.
// I will implement a simple Markdown renderer for bolding and lists to keep it single-file compliant without external deps if possible, 
// but to make it "World Class", I should probably just style the text output carefully.
// Actually, I can format the Gemini output as simple paragraphs.

import { ArrowLeft, BookOpen, BrainCircuit, RefreshCw, CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface DetailViewProps {
  part: PartConfig;
  onBack: () => void;
}

const DetailView: React.FC<DetailViewProps> = ({ part, onBack }) => {
  const [activeTab, setActiveTab] = useState<'learn' | 'quiz'>('learn');
  const [explanation, setExplanation] = useState<string>('');
  const [loadingExpl, setLoadingExpl] = useState(false);
  
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [loadingQuiz, setLoadingQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Fetch explanation on mount
  useEffect(() => {
    const fetchContent = async () => {
      setLoadingExpl(true);
      const text = await generateExplanation(part.id, part.koreanName);
      setExplanation(text);
      setLoadingExpl(false);
    };
    fetchContent();
  }, [part]);

  // Fetch quiz when tab changes to quiz
  useEffect(() => {
    if (activeTab === 'quiz' && quizQuestions.length === 0 && !loadingQuiz) {
      const fetchQuiz = async () => {
        setLoadingQuiz(true);
        const questions = await generateQuiz(part.id);
        setQuizQuestions(questions);
        setQuizAnswers(new Array(questions.length).fill(-1));
        setLoadingQuiz(false);
      };
      fetchQuiz();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, part]);

  const handleOptionSelect = (qIndex: number, optionIndex: number) => {
    if (quizSubmitted) return;
    const newAnswers = [...quizAnswers];
    newAnswers[qIndex] = optionIndex;
    setQuizAnswers(newAnswers);
  };

  const handleQuizSubmit = () => {
    setQuizSubmitted(true);
  };

  const resetQuiz = () => {
    setQuizQuestions([]);
    setQuizSubmitted(false);
    setQuizAnswers([]);
    const fetchQuiz = async () => {
        setLoadingQuiz(true);
        const questions = await generateQuiz(part.id);
        setQuizQuestions(questions);
        setQuizAnswers(new Array(questions.length).fill(-1));
        setLoadingQuiz(false);
      };
      fetchQuiz();
  }

  // Simple Markdown-ish renderer
  const renderContent = (text: string) => {
    return text.split('\n').map((line, idx) => {
      if (line.startsWith('### ')) return <h3 key={idx} className="text-xl font-bold mt-4 mb-2 text-indigo-800">{line.replace('### ', '')}</h3>;
      if (line.startsWith('## ')) return <h2 key={idx} className="text-2xl font-bold mt-6 mb-3 text-indigo-900 border-b pb-2">{line.replace('## ', '')}</h2>;
      if (line.startsWith('**') && line.endsWith('**')) return <strong key={idx} className="block mt-2 mb-1 text-lg">{line.replace(/\*\*/g, '')}</strong>;
      if (line.trim().startsWith('- ')) return <li key={idx} className="ml-4 mb-1">{line.replace('- ', '')}</li>;
      // Handle bolding inside lines
      const parts = line.split(/(\*\*.*?\*\*)/);
      return (
        <p key={idx} className="mb-3 leading-relaxed text-slate-700">
          {parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={i} className="text-indigo-600 font-semibold">{part.slice(2, -2)}</strong>;
            }
            return part;
          })}
        </p>
      );
    });
  };

  return (
    <div className="max-w-4xl mx-auto min-h-screen bg-white shadow-2xl overflow-hidden flex flex-col md:my-8 md:rounded-3xl">
      {/* Header */}
      <div className={`relative ${part.color} p-6 md:p-10 text-white overflow-hidden`}>
        <div className="absolute top-0 right-0 p-10 opacity-20 transform rotate-12 scale-150 text-9xl">
            {part.icon}
        </div>
        <button 
          onClick={onBack} 
          className="relative z-10 flex items-center text-white/80 hover:text-white mb-6 transition-colors font-medium"
        >
          <ArrowLeft size={20} className="mr-2" /> 돌아가기
        </button>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-2">
            <span className="text-5xl">{part.icon}</span>
            <h1 className="text-4xl md:text-5xl font-bold">{part.koreanName}</h1>
          </div>
          <p className="text-xl text-white/90 font-light tracking-wide">{part.id}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-100">
        <button
          onClick={() => setActiveTab('learn')}
          className={`flex-1 py-4 text-center font-semibold text-lg flex items-center justify-center gap-2 transition-colors ${
            activeTab === 'learn' 
              ? `text-indigo-600 border-b-4 border-indigo-600 bg-indigo-50` 
              : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
          }`}
        >
          <BookOpen size={20} /> 학습하기
        </button>
        <button
          onClick={() => setActiveTab('quiz')}
          className={`flex-1 py-4 text-center font-semibold text-lg flex items-center justify-center gap-2 transition-colors ${
            activeTab === 'quiz' 
              ? `text-indigo-600 border-b-4 border-indigo-600 bg-indigo-50` 
              : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
          }`}
        >
          <BrainCircuit size={20} /> 퀴즈 풀기
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-6 md:p-10 bg-slate-50/50 overflow-y-auto">
        {activeTab === 'learn' && (
          <div className="animate-fade-in-up">
            {loadingExpl ? (
              <div className="flex flex-col items-center justify-center h-64 space-y-4">
                 <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
                 <p className="text-slate-500 animate-pulse">AI 선생님이 재미있는 설명을 준비하고 있어요...</p>
              </div>
            ) : (
              <div className="prose prose-lg max-w-none text-slate-800 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                 {renderContent(explanation)}
              </div>
            )}
          </div>
        )}

        {activeTab === 'quiz' && (
           <div className="animate-fade-in-up">
             {loadingQuiz ? (
               <div className="flex flex-col items-center justify-center h-64 space-y-4">
                  <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
                  <p className="text-slate-500 animate-pulse">AI 선생님이 퀴즈를 만들고 있어요...</p>
               </div>
             ) : quizQuestions.length > 0 ? (
               <div className="space-y-8">
                 {quizQuestions.map((q, idx) => {
                   const isCorrect = quizAnswers[idx] === q.correctAnswer;
                   const isSelected = quizAnswers[idx] !== -1;
                   
                   return (
                     <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                       <h3 className="text-lg font-bold text-slate-900 mb-4 flex gap-3">
                         <span className="bg-indigo-100 text-indigo-700 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm">Q{idx + 1}</span>
                         {q.question}
                       </h3>
                       <div className="grid grid-cols-1 gap-3">
                         {q.options.map((opt, optIdx) => {
                            let btnClass = "w-full text-left p-4 rounded-xl border-2 transition-all ";
                            if (quizSubmitted) {
                                if (optIdx === q.correctAnswer) btnClass += "border-green-500 bg-green-50 text-green-900 font-bold";
                                else if (quizAnswers[idx] === optIdx) btnClass += "border-red-300 bg-red-50 text-red-900";
                                else btnClass += "border-slate-100 text-slate-400";
                            } else {
                                if (quizAnswers[idx] === optIdx) btnClass += "border-indigo-500 bg-indigo-50 text-indigo-900 font-medium";
                                else btnClass += "border-slate-100 hover:border-indigo-200 hover:bg-slate-50 text-slate-700";
                            }

                            return (
                              <button
                                key={optIdx}
                                onClick={() => handleOptionSelect(idx, optIdx)}
                                disabled={quizSubmitted}
                                className={btnClass}
                              >
                                {opt}
                                {quizSubmitted && optIdx === q.correctAnswer && <CheckCircle className="inline ml-2 w-4 h-4 text-green-600"/>}
                                {quizSubmitted && quizAnswers[idx] === optIdx && optIdx !== q.correctAnswer && <XCircle className="inline ml-2 w-4 h-4 text-red-600"/>}
                              </button>
                            );
                         })}
                       </div>
                       {quizSubmitted && (
                         <div className={`mt-4 p-4 rounded-lg text-sm ${isCorrect ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                           <strong>해설:</strong> {q.explanation}
                         </div>
                       )}
                     </div>
                   );
                 })}

                 {!quizSubmitted ? (
                    <button 
                      onClick={handleQuizSubmit}
                      disabled={quizAnswers.includes(-1)}
                      className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all text-lg"
                    >
                      제출하기
                    </button>
                 ) : (
                    <button 
                      onClick={resetQuiz}
                      className="w-full py-4 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl shadow-lg transition-all text-lg flex items-center justify-center gap-2"
                    >
                      <RefreshCw size={20}/> 새로운 퀴즈 만들기
                    </button>
                 )}
               </div>
             ) : (
                <div className="text-center p-10 text-slate-500">
                    퀴즈를 불러오지 못했습니다. 다시 시도해주세요.
                </div>
             )}
           </div>
        )}
      </div>
    </div>
  );
};

export default DetailView;
