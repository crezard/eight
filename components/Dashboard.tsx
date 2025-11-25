import React from 'react';
import { PARTS_DATA } from '../constants';
import { PartOfSpeech, PartConfig } from '../types';

interface DashboardProps {
  onSelect: (part: PartConfig) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onSelect }) => {
  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="text-center mb-10 mt-6">
        <h1 className="text-4xl md:text-5xl font-bold font-display text-indigo-900 mb-4">
          Grammar Galaxy
        </h1>
        <p className="text-slate-600 text-lg">
          영어 문법의 8가지 행성을 탐험해보세요!
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {PARTS_DATA.map((part) => (
          <button
            key={part.id}
            onClick={() => onSelect(part)}
            className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-left border border-slate-100"
          >
            <div className={`absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity`}>
               <span className="text-6xl">{part.icon}</span>
            </div>
            
            <div className={`${part.color} w-12 h-12 rounded-full flex items-center justify-center text-white text-2xl mb-4 shadow-sm`}>
              {part.icon}
            </div>
            
            <h3 className="text-xl font-bold text-slate-800 mb-1 flex items-center justify-between">
              {part.koreanName}
              <span className="text-xs font-normal text-slate-400 uppercase tracking-wider">{part.id}</span>
            </h3>
            
            <p className="text-slate-600 text-sm mb-4 line-clamp-2 h-10">
              {part.description}
            </p>

            <div className="bg-slate-50 rounded-lg p-2 text-xs text-slate-500 font-mono border border-slate-100">
              Ex: {part.simpleExample}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
