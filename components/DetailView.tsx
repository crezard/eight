import React, { useEffect, useState } from 'react';
import { PartConfig, QuizQuestion } from '../types';
import { generateExplanation, generateQuiz } from '../services/geminiService';
import { ArrowLeft, CheckCircle, HelpCircle, XCircle, Loader2 } from 'lucide-react';

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

  const baseColor = part.color.replace('bg-', '').replace('-500', '');

  useEffect(() => {
    const fetchContent = async () => {
      setLoadingExpl(true);
      const text = await generateExplanation(part.id, part.koreanName);
      setExplanation(text);
      setLoadingExpl(false);
    };
    fetchContent();
  }, [part]);

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

  const renderContent = (text: string) => {
    return text.split('\n').map((line, idx) => {
      if (line.startsWith('### ')) return <h3 key={idx} className={`text-base font-bold mt-6 mb-2 text-${baseColor}-600 flex items-center gap-2`}>{line.replace('### ', '')}</h3>;
      if (line.startsWith('## ')) return <h2 key={idx} className="text-xl font-bold mt-8 mb-4 text-slate-900 border-b border-slate-100 pb-2">{line.replace('## ', '')}</h2>;
      if (line.startsWith('**') && line.endsWith('**')) return <div key={idx} className={`mt-4 mb-4 p-4 rounded-xl bg-${baseColor}-50 text-${baseColor}-900 text-sm font-medium`}>{line.replace(/\*\*/g, '')}</div>;
      if (line.trim().startsWith('- ')) return <li key={idx} className="ml-4 mb-1.5 text-slate-600 list-disc pl-1 marker:text-slate-300 leading-7 text-sm md:text-base">{line.replace('- ', '')}</li>;
      
      const parts = line.split(/(\*\*.*?\*\*)/);
      if (line.trim() === '') return null; // Skip empty lines for tighter spacing

      return (
        <p key={idx} className="mb-3 leading-7 text-slate-600 text-sm md:text-base">
          {parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={i} className={`font-semibold text-slate-900`}>{part.slice(2, -2)}</strong>;
            }
            return part;
          })}
        </p>
      );
    });
  };

  return (
    <div className="max-w-4xl mx-auto min-h-screen px-4 md:px-8 py-6">
      {/* Compact Header & Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack} 
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-400 hover:text-slate-900 hover:border-slate-300 transition-all shadow-sm"
          >
            <ArrowLeft size={20} />
          </button>
          
          <div className="flex items-center gap-3">
             <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl bg-${baseColor}-50`}>
              {part.icon}
             </div>
             <div>
                <h1 className="text-2xl font-bold text-slate-900 leading-none">{part.koreanName}</h1>
                <span className="text-xs text-slate-400 font-medium">{part.id}</span>
             </div>
          </div>
        </div>
        
        {/* Compact Tab Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-lg self-start md:self-auto">
          {['learn', 'quiz'].map((tab) => (
             <button
             key={tab}
             onClick={() => setActiveTab(tab as 'learn' | 'quiz')}
             className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${
               activeTab === tab
                 ? 'bg-white text-slate-900 shadow-sm' 
                 : 'text-slate-500 hover:text-slate-700'
             }`}
           >
             {tab === 'learn' ? '학습' : '퀴즈'}
           </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 bg-white rounded-2xl md:p-8 p-0">
        {activeTab === 'learn' && (
          <div>
            {loadingExpl ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-3">
                  <Loader2 className={`w-6 h-6 text-${baseColor}-500 animate-spin`} />
                  <p className="text-slate-400 text-sm">설명 생성 중...</p>
              </div>
            ) : (
              <article className="prose prose-slate max-w-none">
                  {renderContent(explanation)}
              </article>
            )}
          </div>
        )}

        {activeTab === 'quiz' && (
            <div className="space-y-8">
              {loadingQuiz ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-3">
                  <Loader2 className={`w-6 h-6 text-${baseColor}-500 animate-spin`} />
                  <p className="text-slate-400 text-sm">퀴즈 생성 중...</p>
                </div>
              ) : quizQuestions.length > 0 ? (
                <>
                  {quizQuestions.map((q, idx) => {
                    const isCorrect = quizAnswers[idx] === q.correctAnswer;
                    return (
                      <div key={idx} className="pb-6 border-b border-slate-100 last:border-0">
                        <div className="flex gap-3 mb-4">
                           <span className={`flex items-center justify-center w-6 h-6 rounded-md bg-${baseColor}-100 text-${baseColor}-700 font-bold text-xs flex-shrink-0 mt-1`}>Q{idx + 1}</span>
                           <h3 className="text-base font-bold text-slate-800 leading-snug">{q.question}</h3>
                        </div>
                        
                        <div className="space-y-2 pl-9">
                          {q.options.map((opt, optIdx) => {
                             let btnClass = "w-full text-left px-4 py-3 rounded-lg transition-all flex items-center text-slate-600 hover:bg-slate-50 text-sm font-medium border border-transparent ";
                             
                             if (quizSubmitted) {
                                if (optIdx === q.correctAnswer) btnClass = "w-full text-left px-4 py-3 rounded-lg flex items-center bg-green-50 text-green-900 font-bold border border-green-200 text-sm";
                                else if (quizAnswers[idx] === optIdx) btnClass = "w-full text-left px-4 py-3 rounded-lg flex items-center bg-red-50 text-red-900 border border-red-200 opacity-75 text-sm";
                                else btnClass = "w-full text-left px-4 py-3 rounded-lg flex items-center text-slate-300 text-sm";
                             } else if (quizAnswers[idx] === optIdx) {
                                btnClass = `w-full text-left px-4 py-3 rounded-lg flex items-center bg-${baseColor}-50 text-${baseColor}-900 font-bold shadow-sm ring-1 ring-${baseColor}-200 text-sm`;
                             }

                             return (
                               <button
                                 key={optIdx}
                                 onClick={() => handleOptionSelect(idx, optIdx)}
                                 disabled={quizSubmitted}
                                 className={btnClass}
                               >
                                 <span className="flex-1">{opt}</span>
                                 {quizSubmitted && optIdx === q.correctAnswer && <CheckCircle className="w-4 h-4 text-green-600 ml-2"/>}
                                 {quizSubmitted && quizAnswers[idx] === optIdx && optIdx !== q.correctAnswer && <XCircle className="w-4 h-4 text-red-500 ml-2"/>}
                               </button>
                             );
                          })}
                        </div>

                        {quizSubmitted && (
                          <div className={`mt-4 ml-9 p-4 rounded-lg text-sm flex gap-2 leading-relaxed ${isCorrect ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                            <HelpCircle size={16} className="flex-shrink-0 mt-0.5" />
                            <div>
                              <span className="font-bold mr-1">해설:</span> 
                              {q.explanation}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  <div className="pt-4 pb-10">
                    {!quizSubmitted ? (
                      <button 
                        onClick={handleQuizSubmit}
                        disabled={quizAnswers.includes(-1)}
                        className={`w-full py-3 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold rounded-xl transition-all text-base shadow-lg shadow-slate-200`}
                      >
                        채점하기
                      </button>
                    ) : (
                      <button 
                        onClick={resetQuiz}
                        className="w-full py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-900 font-bold rounded-xl transition-all text-base"
                      >
                        다시 풀기
                      </button>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center p-10 text-slate-400 text-sm">문제를 불러올 수 없습니다.</div>
              )}
            </div>
        )}
      </div>
    </div>
  );
};

export default DetailView;