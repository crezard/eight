import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import DetailView from './components/DetailView';
import ChatAssistant from './components/ChatAssistant';
import { PartConfig } from './types';

function App() {
  const [selectedPart, setSelectedPart] = useState<PartConfig | null>(null);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-24 relative selection:bg-blue-100 selection:text-blue-900">
      
      <main className="max-w-screen-2xl mx-auto">
        {selectedPart ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             <DetailView 
               part={selectedPart} 
               onBack={() => setSelectedPart(null)} 
             />
          </div>
        ) : (
          <Dashboard onSelect={setSelectedPart} />
        )}
      </main>

      <ChatAssistant />
    </div>
  );
}

export default App;