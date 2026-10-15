import React from 'react';
import { TestType, TestResultValue } from '../types';

interface TestTubeProps {
  type: TestType;
  result: TestResultValue;
  onClick: () => void;
  gas?: boolean;
  h2s?: boolean;
  motility?: boolean;
}

const TestTube: React.FC<TestTubeProps> = ({ type, result, onClick, gas, h2s, motility }) => {
  
  const getColors = () => {
    if (result === TestResultValue.PENDING) return 'bg-gray-200 border-gray-300 text-gray-400';
    
    // Kligler Logic
    if (type === TestType.KLIGLER) {
      let fromColor = '';
      let toColor = '';
      let borderColor = 'border-red-600';
      let textColor = 'text-white';

      // Top (Slant)
      if (result === TestResultValue.ACID_ACID) {
        fromColor = 'from-yellow-400';
        borderColor = 'border-yellow-500';
        textColor = 'text-yellow-900';
      } else if (result === TestResultValue.ALK_ACID || result === TestResultValue.ALK_ALK) {
        fromColor = 'from-red-500';
      } else {
        // Pending or invalid
        return 'bg-gray-200 border-gray-300 text-gray-400';
      }

      // Bottom (Butt)
      if (h2s) {
        toColor = 'to-slate-900'; // Black for H2S
        textColor = 'text-white'; // Ensure text is visible on black
      } else {
        if (result === TestResultValue.ACID_ACID || result === TestResultValue.ALK_ACID) {
          toColor = 'to-yellow-400';
        } else {
          toColor = 'to-red-500';
        }
      }

      // Override text color if A/A and no H2S (Yellow background needs dark text)
      if (result === TestResultValue.ACID_ACID && !h2s) {
        textColor = 'text-yellow-900';
      }

      return `bg-gradient-to-b ${fromColor} ${toColor} ${borderColor} ${textColor}`;
    }

    // Urea
    if (type === TestType.UREA) {
      if (result === TestResultValue.POSITIVE) return 'bg-pink-500 border-pink-600 text-white'; // Urease +
      if (result === TestResultValue.NEGATIVE) return 'bg-yellow-100 border-yellow-300 text-yellow-800'; // Urease -
    }

    // Indole
    if (type === TestType.INDOLE) {
      if (result === TestResultValue.POSITIVE) return 'bg-rose-50 border-rose-200 text-rose-700 ring-4 ring-inset ring-rose-300'; // Ring logic visually
      if (result === TestResultValue.NEGATIVE) return 'bg-yellow-50 border-yellow-200 text-yellow-700'; 
    }

    // TDA
    if (type === TestType.TDA) {
      if (result === TestResultValue.POSITIVE) return 'bg-amber-900 border-amber-950 text-white'; // Dark brown
      if (result === TestResultValue.NEGATIVE) return 'bg-yellow-200 border-yellow-400 text-yellow-800';
    }

    // Citrate
    if (type === TestType.CITRATE) {
      if (result === TestResultValue.POSITIVE) return 'bg-blue-600 border-blue-700 text-white'; // Citrate + (Blue)
      if (result === TestResultValue.NEGATIVE) return 'bg-green-500 border-green-600 text-white'; // Citrate - (Green)
    }

    // Bile Esculin (BE)
    if (type === TestType.BILE_ESCULIN) {
      if (result === TestResultValue.POSITIVE) return 'bg-neutral-900 border-neutral-950 text-white'; // Black
      if (result === TestResultValue.NEGATIVE) return 'bg-amber-200 border-amber-300 text-amber-900'; // Amber/Tan
    }

    // NaCl 6.5%
    if (type === TestType.NACL_6_5) {
      if (result === TestResultValue.POSITIVE) return 'bg-slate-200 border-slate-300 text-slate-800 opacity-90'; // Turbid
      if (result === TestResultValue.NEGATIVE) return 'bg-purple-100 border-purple-200 text-purple-400 opacity-40'; // Clear (Purple broth base often)
    }

    // Antibiotic Disks (Novobiocin, Optochin, Bacitracin)
    if ([TestType.NOVOBIOCIN, TestType.OPTOCHIN, TestType.BACITRACIN].includes(type)) {
       if (result === TestResultValue.SENSITIVE) return 'bg-green-100 border-green-400 text-green-800 border-dashed';
       if (result === TestResultValue.RESISTANT) return 'bg-red-50 border-red-200 text-red-800';
       return 'bg-white border-slate-200 text-slate-500 rounded-full h-16 w-16 items-center justify-center'; // Disk shape
    }
    
    // CAMP
    if (type === TestType.CAMP) {
      if (result === TestResultValue.POSITIVE) return 'bg-red-100 border-red-300 text-red-800'; // Arrowhead hemolysis
      if (result === TestResultValue.NEGATIVE) return 'bg-red-50 border-red-200 text-red-800 opacity-50';
    }

    // Standard Positive/Negative for others
    if (result === TestResultValue.POSITIVE) return 'bg-teal-500 border-teal-600 text-white';
    if (result === TestResultValue.NEGATIVE) return 'bg-rose-100 border-rose-300 text-rose-800';
    
    return 'bg-slate-100 border-slate-300 text-slate-600';
  };

  // Special rendering for disks
  if ([TestType.NOVOBIOCIN, TestType.OPTOCHIN, TestType.BACITRACIN].includes(type)) {
     return (
        <div 
          onClick={onClick}
          className={`relative h-20 w-20 rounded-full border-4 flex flex-col items-center justify-center p-2 cursor-pointer transition-transform hover:scale-105 shadow-sm ${getColors()}`}
        >
          <span className="text-[10px] uppercase font-bold text-slate-500 mb-1">{type.substring(0, 4)}</span>
          <span className="text-xs font-bold">{result === TestResultValue.PENDING ? '?' : (result === TestResultValue.SENSITIVE ? 'S' : 'R')}</span>
        </div>
     );
  }

  return (
    <div 
      onClick={onClick}
      className={`relative h-24 w-16 rounded-b-2xl rounded-t-md border-2 flex flex-col items-center justify-end p-2 cursor-pointer transition-transform hover:scale-105 shadow-sm ${getColors()}`}
    >
      <div className="absolute top-[-10px] w-full text-center">
         <span className="text-[10px] uppercase font-bold tracking-tighter text-slate-500 bg-white/80 px-1 rounded shadow-sm border border-slate-200">
          {type.split(' ')[0]}
         </span>
      </div>
      
      {/* Visual Indicators for Gas and H2S */}
      {gas && (
        <div className="absolute top-8 right-1 bg-white/30 backdrop-blur-sm rounded-full w-5 h-5 flex items-center justify-center border border-white/50 shadow-sm z-20" title="Gas Production">
          <span className="text-[9px] font-bold">G</span>
        </div>
      )}
      
      {h2s && (
        <div className="absolute bottom-6 left-1 text-[8px] font-bold text-white/90 bg-black/20 px-1 rounded z-20" title="H2S Production">
          H2S
        </div>
      )}

      {motility && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[9px] font-bold text-slate-700 bg-white/60 px-1 rounded shadow-sm border border-slate-300 z-20" title="Motility Positive">
          MOT+
        </div>
      )}

      <span className="text-xs font-bold text-center leading-tight z-10">
        {result === TestResultValue.PENDING ? '?' : result.replace(/\(.\)/, '')}
      </span>
    </div>
  );
};

export default TestTube;