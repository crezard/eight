import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import DetailView from './components/DetailView';
import ChatAssistant from './components/ChatAssistant';
import { PartConfig } from './types';

function App() {
  const [selectedPart, setSelectedPart] = useState<PartConfig | null>(null);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900 pb-24">
      
      {selectedPart ? (
        <div className="animate-in fade-in zoom-in-95 duration-300">
           <DetailView 
             part={selectedPart} 
             onBack={() => setSelectedPart(null)} 
           />
        </div>
      ) : (
        <Dashboard onSelect={setSelectedPart} />
      )}

      <ChatAssistant />
      
      <footer className="fixed bottom-0 w-full text-center py-2 text-xs text-slate-400 bg-slate-50/80 backdrop-blur-sm pointer-events-none">
        Powered by Google Gemini • Grade 1 Middle School English
      </footer>
    </div>
  );
}

export default App;
