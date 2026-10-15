import React, { useState } from 'react';
import { MOCK_SAMPLES } from './constants';
import { Sample, SampleType, GramStatus } from './types';
import SampleCard from './components/SampleCard';
import WorkBench from './components/WorkBench';
import GermReference from './components/GermReference';
import DecisionTreeExplorer from './components/DecisionTreeExplorer';
import { Plus, LayoutGrid, Beaker, Menu, BookOpen, GitFork } from 'lucide-react';

const App: React.FC = () => {
  const [samples, setSamples] = useState<Sample[]>(MOCK_SAMPLES as Sample[]);
  const [activeSampleId, setActiveSampleId] = useState<string | null>(MOCK_SAMPLES[0].id);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [viewMode, setViewMode] = useState<'workbench' | 'reference' | 'trees'>('workbench');

  const activeSample = samples.find(s => s.id === activeSampleId);

  const handleCreateSample = () => {
    const newId = `S-2024-${String(samples.length + 1).padStart(3, '0')}`;
    const newSample: Sample = {
      id: newId,
      patientId: `P-${Math.floor(Math.random() * 10000)}`,
      type: SampleType.ECBU,
      collectionDate: new Date().toISOString(),
      gramStatus: GramStatus.UNKNOWN,
      underAntibiotics: false,
      aiQuery: '',
      plates: [],
      tests: [],
      status: 'Processing'
    };
    setSamples([newSample, ...samples]);
    setActiveSampleId(newId);
    setViewMode('workbench');
  };

  const handleUpdateSample = (updated: Sample) => {
    setSamples(samples.map(s => s.id === updated.id ? updated : s));
  };

  const getHeaderTitle = () => {
    switch (viewMode) {
      case 'workbench': return 'Active Workbench';
      case 'reference': return 'Reference Library';
      case 'trees': return 'Logical Trees';
      default: return 'Workbench';
    }
  };

  return (
    <div className="flex h-screen bg-slate-100 text-slate-900 font-sans overflow-hidden">
      
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-80' : 'w-0'} bg-white border-r border-slate-200 transition-all duration-300 flex flex-col flex-shrink-0 overflow-hidden`}>
        <div className="p-5 border-b border-slate-100 flex items-center gap-3">
          <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center text-white">
            <Beaker className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-slate-800 leading-tight">MicroBio Asst.</h1>
            <p className="text-[10px] text-slate-400 font-medium tracking-wide">LAB WORKFLOW</p>
          </div>
        </div>

        <div className="p-4 space-y-2">
          <button 
            onClick={handleCreateSample}
            className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-2.5 rounded-lg hover:bg-slate-800 transition-colors shadow-sm text-sm font-medium"
          >
            <Plus className="w-4 h-4" /> New Sample
          </button>
          
          <button 
            onClick={() => setViewMode('reference')}
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg transition-colors text-sm font-medium border ${viewMode === 'reference' ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
          >
            <BookOpen className="w-4 h-4" /> Germ Encyclopedia
          </button>

          <button 
            onClick={() => setViewMode('trees')}
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg transition-colors text-sm font-medium border ${viewMode === 'trees' ? 'bg-teal-50 border-teal-200 text-teal-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
          >
            <GitFork className="w-4 h-4" /> Logical Trees
          </button>
        </div>

        <div className="px-4 pb-2">
           <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Recent Samples</p>
        </div>
        <div className="flex-1 overflow-y-auto px-4 space-y-3 pb-4">
          {samples.map(sample => (
            <SampleCard 
              key={sample.id} 
              sample={sample} 
              isActive={sample.id === activeSampleId && viewMode === 'workbench'}
              onClick={(s) => {
                setActiveSampleId(s.id);
                setViewMode('workbench');
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Mobile Sidebar Toggle */}
        <div className="absolute top-4 left-4 z-50 md:hidden">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 bg-white rounded-md shadow-md border"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
        
        {/* Header Strip */}
        <div className="h-16 bg-white border-b border-slate-200 flex items-center px-6 justify-between">
          <div className="flex items-center gap-4">
             <button onClick={() => setSidebarOpen(!sidebarOpen)} className="hidden md:block text-slate-400 hover:text-slate-600">
               <LayoutGrid className="w-5 h-5" />
             </button>
             <div className="h-6 w-px bg-slate-200 mx-2 hidden md:block"></div>
             <span className="text-sm text-slate-500 font-medium">
               {getHeaderTitle()}
             </span>
          </div>
          <div className="flex items-center gap-3">
             <div className="text-right hidden sm:block">
               <p className="text-xs font-bold text-slate-800">Lab Technician</p>
               <p className="text-[10px] text-slate-400">Microbiology Unit</p>
             </div>
             <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white shadow-sm"></div>
          </div>
        </div>

        {/* View Container */}
        <div className="flex-1 overflow-hidden relative">
          {viewMode === 'workbench' && (
             <div className="h-full p-4 md:p-6">
                {activeSample ? (
                  <WorkBench 
                    sample={activeSample} 
                    onUpdateSample={handleUpdateSample} 
                  />
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400">
                    <Beaker className="w-16 h-16 mb-4 opacity-20" />
                    <p>Select or create a sample to start working.</p>
                  </div>
                )}
             </div>
          )}
          
          {viewMode === 'reference' && (
             <GermReference />
          )}

          {viewMode === 'trees' && (
             <div className="h-full p-6">
               <div className="h-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <DecisionTreeExplorer />
               </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;