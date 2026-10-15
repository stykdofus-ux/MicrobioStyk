import React from 'react';
import { Sample, GramStatus, SampleType } from '../types';
import { FlaskConical, Droplet, Activity, Bug, Syringe, Trash2, User } from 'lucide-react';

interface SampleCardProps {
  sample: Sample;
  onClick: (sample: Sample) => void;
  isActive: boolean;
}

const SampleCard: React.FC<SampleCardProps> = ({ sample, onClick, isActive }) => {
  const getIcon = () => {
    switch (sample.type) {
      case SampleType.ECBU: return <FlaskConical className="w-5 h-5 text-yellow-500" />;
      case SampleType.BLOOD: return <Droplet className="w-5 h-5 text-red-500" />;
      case SampleType.VAGINAL: return <User className="w-5 h-5 text-pink-500" />;
      case SampleType.PUS_DEEP: 
      case SampleType.PUS_SUPERFICIAL:
        return <Bug className="w-5 h-5 text-green-600" />;
      case SampleType.FLUID: return <Syringe className="w-5 h-5 text-blue-500" />;
      case SampleType.STOOL: return <Trash2 className="w-5 h-5 text-amber-700" />;
      default: return <Activity className="w-5 h-5 text-teal-500" />;
    }
  };

  return (
    <div 
      onClick={() => onClick(sample)}
      className={`p-4 rounded-xl cursor-pointer transition-all duration-200 border ${
        isActive 
          ? 'bg-teal-50 border-teal-500 shadow-md' 
          : 'bg-white border-slate-200 hover:border-teal-300 hover:shadow-sm'
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center space-x-2">
          <div className={`p-2 rounded-lg ${isActive ? 'bg-white' : 'bg-slate-100'}`}>
            {getIcon()}
          </div>
          <div className="overflow-hidden">
            <h3 className="font-semibold text-slate-800 text-sm">{sample.id}</h3>
            <p className="text-xs text-slate-500 truncate max-w-[120px]" title={sample.type}>{sample.type}</p>
          </div>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
          sample.status === 'Ready for ID' ? 'bg-green-100 text-green-700' : 'bg-blue-50 text-blue-600'
        }`}>
          {sample.status === 'Ready for ID' ? 'ID Ready' : 'Processing'}
        </span>
      </div>
      
      <div className="flex items-center space-x-2 mt-3 text-xs text-slate-600 bg-slate-50 p-2 rounded">
        <Bug className="w-3 h-3" />
        <span className="truncate">
          {sample.gramStatus === GramStatus.UNKNOWN ? 'Gram: Pending' : sample.gramStatus}
        </span>
      </div>
    </div>
  );
};

export default SampleCard;