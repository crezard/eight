import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Bot, Sparkles, Loader2 } from 'lucide-react';
import { chatWithTeacher } from '../services/geminiService';
import { ChatMessage } from '../types';

const ChatAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: '안녕하세요! 저는 AI 문법 선생님입니다. 무엇이든 물어보세요!' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    const history = messages.map(m => ({
        role: m.role === 'model' ? 'model' : 'user',
        parts: [{ text: m.text }]
    }));

    const responseText = await chatWithTeacher(userMsg, history);
    
    setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    setIsTyping(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[360px] md:w-[400px] h-[600px] bg-white rounded-3xl shadow-2xl flex flex-col border border-slate-200 animate-in slide-in-from-bottom-10 fade-in duration-300 overflow-hidden">
          {/* Header */}
          <div className="p-4 bg-white border-b border-slate-100 flex justify-between items-center shadow-sm z-10">
            <div className="flex items-center gap-3">
              <div className="bg-blue-50 p-2 rounded-full">
                <Sparkles size={18} className="text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">AI Grammar Guide</h3>
                <p className="text-xs text-slate-500">Always here to help</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-slate-100 rounded-full p-2 transition-colors text-slate-400 hover:text-slate-600">
              <X size={20} />
            </button>
          </div>
          
          {/* Messages */}
          <div className="flex-1 p-5 overflow-y-auto bg-slate-50" ref={scrollRef}>
            {messages.map((msg, idx) => (
              <div key={idx} className={`mb-6 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-2xl text-[15px] leading-relaxed shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-br-sm' 
                    : 'bg-white text-slate-700 border border-slate-200 rounded-bl-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start mb-4">
                <div className="bg-white p-4 rounded-2xl rounded-bl-sm border border-slate-200 shadow-sm flex items-center gap-2">
                   <Loader2 size={16} className="animate-spin text-blue-500" />
                   <span className="text-xs text-slate-400">생각 중...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-100">
            <div className="flex gap-2 relative">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="문법에 대해 물어보세요..." 
                className="flex-1 bg-slate-100 border-transparent focus:bg-white border focus:border-blue-500 rounded-full pl-5 pr-12 py-3.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-50 transition-all"
              />
              <button 
                type="submit" 
                disabled={!input.trim() || isTyping}
                className="absolute right-1.5 top-1.5 bottom-1.5 bg-blue-600 hover:bg-blue-700 text-white w-10 h-10 rounded-full disabled:bg-slate-200 disabled:text-slate-400 transition-colors flex items-center justify-center shadow-sm"
              >
                <Send size={18} />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Toggle Button (Floating Action Button) */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex items-center justify-center ${isOpen ? 'bg-slate-800 rotate-90' : 'bg-blue-600'}`}
      >
        {isOpen ? <X size={24} className="text-white" /> : <Bot size={28} className="text-white" />}
      </button>
    </div>
  );
};

export default ChatAssistant;