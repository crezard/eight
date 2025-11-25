import React from 'react';
import { PARTS_DATA } from '../constants';
import { PartConfig } from '../types';

interface DashboardProps {
  onSelect: (part: PartConfig) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onSelect }) => {
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-screen flex flex-col items-center">
      {/* Header with Side-by-Side Titles */}
      <header className="mb-12 mt-8 text-center max-w-4xl">
        <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 mb-3">
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight font-display">
            Grammar Galaxy
            </h1>
            <span className="hidden md:block text-slate-300 text-3xl font-light">|</span>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
            8품사 탐험대
            </h1>
        </div>
        <p className="text-slate-500 text-lg">
          중학교 1학년 필수 영문법 완전 정복!
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full pb-20">
        {PARTS_DATA.map((part) => {
          const baseColor = part.color.replace('bg-', '').replace('-500', '');
          
          return (
            <button
              key={part.id}
              onClick={() => onSelect(part)}
              className="group flex flex-col bg-white rounded-2xl p-6 text-left transition-all duration-200 hover:shadow-xl hover:shadow-slate-200 hover:-translate-y-1 relative overflow-hidden border border-transparent hover:border-slate-100"
            >
              <div className="flex items-center gap-4 mb-5">
                {/* Icon - Increased size */}
                <div className={`w-14 h-14 rounded-2xl flex-shrink-0 flex items-center justify-center text-3xl transition-colors bg-slate-50 group-hover:bg-${baseColor}-50`}>
                  {part.icon}
                </div>
                
                {/* Title Side-by-Side */}
                <div className="flex flex-col justify-center">
                  <div className="flex flex-wrap items-baseline gap-x-2">
                    <h3 className="text-xl font-bold text-slate-900 leading-tight">
                        {part.koreanName}
                    </h3>
                    <span className={`text-sm font-semibold text-slate-400 group-hover:text-${baseColor}-600 transition-colors font-display`}>
                        {part.id}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex-1 relative z-10">
                <p className="text-slate-600 text-base leading-relaxed">
                  {part.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;