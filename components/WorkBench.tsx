import React, { useState } from 'react';
import { Sample, GramStatus, TestType, TestResultValue, PlateObservation, TestEntry, SampleType, VaginalExam, ECBUExam } from '../types';
import { MEDIA_TYPES, TEST_OPTIONS, MINI_GALLERIE, SMELL_OPTIONS, QUANTITY_OPTIONS, FLORA_TYPE_OPTIONS, DEFAULT_VAGINAL_EXAM, DEFAULT_ECBU_EXAM, EXPECTED_BACTERIA } from '../constants';
import { analyzeBacteriologyCase } from '../services/geminiService';
import TestTube from './TestTube';
import InterpretationGuide from './InterpretationGuide';
import { Plus, Trash2, Microscope, Wand2, ArrowRight, Loader2, Activity, CheckCircle2, Wind, Beaker, Droplets, Info, X, BookOpen, Pill } from 'lucide-react';

interface WorkBenchProps {
  sample: Sample;
  onUpdateSample: (updated: Sample) => void;
}

const WorkBench: React.FC<WorkBenchProps> = ({ sample, onUpdateSample }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState<'plates' | 'guide' | 'biochem' | 'id'>('plates');
  const [showTypeInfo, setShowTypeInfo] = useState(false);

  // Local state for forms
  const [newPlateMedia, setNewPlateMedia] = useState(MEDIA_TYPES[0]);
  const [newPlateMorph, setNewPlateMorph] = useState('');
  const [newPlateGrowth, setNewPlateGrowth] = useState<PlateObservation['growth']>('Moderate');
  const [newPlateSmell, setNewPlateSmell] = useState(SMELL_OPTIONS[0]);

  const updateGram = (status: GramStatus) => {
    onUpdateSample({ ...sample, gramStatus: status });
  };

  const toggleAntibiotics = () => {
    onUpdateSample({ ...sample, underAntibiotics: !sample.underAntibiotics });
  };

  const updateSampleType = (newType: SampleType) => {
     let updated = { ...sample, type: newType };
     // Initialize specific exam data if missing
     if (newType === SampleType.VAGINAL && !updated.vaginalExam) {
       updated.vaginalExam = { ...DEFAULT_VAGINAL_EXAM };
     }
     if (newType === SampleType.ECBU && !updated.ecbuExam) {
       updated.ecbuExam = { ...DEFAULT_ECBU_EXAM };
     }
     onUpdateSample(updated);
  };

  const updateVaginalExam = (field: keyof VaginalExam, value: any) => {
    if (!sample.vaginalExam) return;
    onUpdateSample({
      ...sample,
      vaginalExam: {
        ...sample.vaginalExam,
        [field]: value
      }
    });
  };

  const updateECBUExam = (field: keyof ECBUExam, value: string) => {
    if (!sample.ecbuExam) return;
    onUpdateSample({
      ...sample,
      ecbuExam: {
        ...sample.ecbuExam,
        [field]: value
      }
    });
  };

  const updateMycoplasma = (germ: 'mHominis' | 'uUrealyticum', field: 'result' | 'titerHigh', value: any) => {
    if (!sample.vaginalExam) return;
    onUpdateSample({
      ...sample,
      vaginalExam: {
        ...sample.vaginalExam,
        mycoplasma: {
          ...sample.vaginalExam.mycoplasma,
          [germ]: {
            ...sample.vaginalExam.mycoplasma[germ],
            [field]: value
          }
        }
      }
    });
  };

  const toggleMycoplasmaPerformed = () => {
    if (!sample.vaginalExam) return;
    onUpdateSample({
      ...sample,
      vaginalExam: {
        ...sample.vaginalExam,
        mycoplasma: {
          ...sample.vaginalExam.mycoplasma,
          performed: !sample.vaginalExam.mycoplasma.performed
        }
      }
    });
  };


  const addPlateObservation = () => {
    const newPlate: PlateObservation = {
      id: Date.now().toString(),
      media: newPlateMedia,
      morphology: newPlateMorph || 'No description provided',
      growth: newPlateGrowth,
      smell: newPlateSmell
    };
    onUpdateSample({ ...sample, plates: [...sample.plates, newPlate] });
    setNewPlateMorph('');
    setNewPlateSmell(SMELL_OPTIONS[0]);
  };

  const removePlate = (id: string) => {
    onUpdateSample({ ...sample, plates: sample.plates.filter(p => p.id !== id) });
  };

  const setTestResult = (type: TestType, result: TestResultValue) => {
    const existing = sample.tests.find(t => t.type === type);
    let newTests = [...sample.tests];
    
    if (existing) {
      newTests = newTests.map(t => t.type === type ? { ...t, result } : t);
    } else {
      newTests.push({
        id: Date.now().toString(),
        type,
        result,
        timestamp: Date.now()
      });
    }
    onUpdateSample({ ...sample, tests: newTests });
  };

  const toggleTestDetail = (type: TestType, field: 'gas' | 'h2s' | 'motility') => {
    const existing = sample.tests.find(t => t.type === type);
    if (!existing) {
      // Create if doesn't exist, default to first option + toggle
      const firstOption = TEST_OPTIONS[type][0];
      const newTest: TestEntry = {
        id: Date.now().toString(),
        type,
        result: firstOption,
        timestamp: Date.now(),
        [field]: true
      };
      onUpdateSample({ ...sample, tests: [...sample.tests, newTest] });
    } else {
      // Update existing
      const updatedTests = sample.tests.map(t => 
        t.type === type ? { ...t, [field]: !t[field] } : t
      );
      onUpdateSample({ ...sample, tests: updatedTests });
    }
  };

  const handleAIAnalysis = async () => {
    setIsAnalyzing(true);
    const advice = await analyzeBacteriologyCase(sample, sample.aiQuery);
    onUpdateSample({ ...sample, aiAnalysis: advice });
    setIsAnalyzing(false);
    setActiveTab('id'); // Switch to results tab
  };

  const handleVitekSetup = () => {
    if (sample.tests.some(t => t.type === TestType.VITEK)) return;

    const newTest: TestEntry = {
      id: Date.now().toString(),
      type: TestType.VITEK,
      result: TestResultValue.PENDING,
      timestamp: Date.now()
    };
    
    onUpdateSample({
      ...sample,
      status: 'Ready for ID',
      tests: [...sample.tests, newTest]
    });
  };

  const handleAPISetup = () => {
    const type = sample.gramStatus === GramStatus.GPC ? TestType.API_STAPH : TestType.API_20E;
    if (sample.tests.some(t => t.type === type)) return;

    const newTest: TestEntry = {
      id: Date.now().toString(),
      type: type,
      result: TestResultValue.PENDING,
      timestamp: Date.now()
    };

    onUpdateSample({
      ...sample,
      status: 'Ready for ID',
      tests: [...sample.tests, newTest]
    });
  };

  const hasVitek = sample.tests.some(t => t.type === TestType.VITEK);
  const hasAPI = sample.tests.some(t => t.type === TestType.API_20E || t.type === TestType.API_STAPH);

  const getSuggestedTests = () => {
    const suggestions: TestType[] = [];
    const hasTest = (t: TestType) => sample.tests.some(test => test.type === t);

    // Initial logic based on Gram Status
    if (sample.gramStatus === GramStatus.GNB) {
      if (!hasTest(TestType.OXIDASE)) suggestions.push(TestType.OXIDASE);
      else {
        // If Oxidase Negative -> Enterobacteriaceae logic
        const ox = sample.tests.find(t => t.type === TestType.OXIDASE);
        if (ox?.result === TestResultValue.NEGATIVE) {
          MINI_GALLERIE.forEach(t => {
            if (!hasTest(t)) suggestions.push(t);
          });
        }
      }
    } else if (sample.gramStatus === GramStatus.GPC) {
      if (!hasTest(TestType.CATALASE)) suggestions.push(TestType.CATALASE);
      else {
        const cat = sample.tests.find(t => t.type === TestType.CATALASE);
        
        if (cat?.result === TestResultValue.POSITIVE) {
           // Staphylococcus Pathway
           if (!hasTest(TestType.COAGULASE)) suggestions.push(TestType.COAGULASE);
           const coag = sample.tests.find(t => t.type === TestType.COAGULASE);
           // If Coagulase Negative -> Check Novobiocin for S. sapro vs S. epidermidis
           if (coag?.result === TestResultValue.NEGATIVE && !hasTest(TestType.NOVOBIOCIN)) {
              suggestions.push(TestType.NOVOBIOCIN);
           }
        } else if (cat?.result === TestResultValue.NEGATIVE) {
           // Streptococcus Pathway
           // We can't easily know hemolysis from here structurally, so suggest the panel
           if (!hasTest(TestType.OPTOCHIN)) suggestions.push(TestType.OPTOCHIN);
           if (!hasTest(TestType.BACITRACIN)) suggestions.push(TestType.BACITRACIN);
           if (!hasTest(TestType.CAMP)) suggestions.push(TestType.CAMP);
           if (!hasTest(TestType.BILE_ESCULIN)) suggestions.push(TestType.BILE_ESCULIN);
           if (!hasTest(TestType.NACL_6_5)) suggestions.push(TestType.NACL_6_5);
        }
      }
    } else if (sample.gramStatus === GramStatus.YEAST) {
      if (!hasTest(TestType.GERM_TUBE)) suggestions.push(TestType.GERM_TUBE);
      if (!hasTest(TestType.YEAST_ID)) suggestions.push(TestType.YEAST_ID);
    } else if (sample.gramStatus === GramStatus.GPB) {
      if (!hasTest(TestType.CATALASE)) suggestions.push(TestType.CATALASE);
    } else if (sample.gramStatus === GramStatus.GNC) {
      if (!hasTest(TestType.OXIDASE)) suggestions.push(TestType.OXIDASE);
    }
    return suggestions;
  };

  const suggestedTests = getSuggestedTests();

  // Helper for rendering Quantity Selects
  const renderQuantitySelect = (label: string, field: keyof VaginalExam, isBold = false) => (
    <div className="flex flex-col gap-1">
      <label className={`text-xs ${isBold ? 'font-bold text-slate-800' : 'text-slate-600'}`}>{label}</label>
      <select 
        value={sample.vaginalExam?.[field] || ''} 
        onChange={(e) => updateVaginalExam(field, e.target.value)}
        className="p-1.5 rounded border border-slate-300 text-sm focus:ring-1 focus:ring-pink-500 outline-none"
      >
        {QUANTITY_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      
      {/* Header */}
      <div className="bg-slate-50 border-b border-slate-200 p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Microscope className="text-teal-600" />
            <span className="font-mono text-teal-700">{sample.id}</span>
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <div className="relative">
              <div className="flex items-center gap-2">
                <select 
                  value={sample.type}
                  onChange={(e) => updateSampleType(e.target.value as SampleType)}
                  className="bg-transparent text-sm font-semibold text-slate-600 border-none outline-none focus:ring-0 cursor-pointer hover:text-slate-900"
                >
                  {Object.values(SampleType).map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <button 
                  onClick={() => setShowTypeInfo(!showTypeInfo)}
                  className="text-slate-400 hover:text-teal-600 transition-colors"
                  title="Bactéries attendues / commensales"
                >
                  <Info className="w-3.5 h-3.5" />
                </button>
              </div>

              {showTypeInfo && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-slate-200 shadow-xl rounded-xl p-4 z-[100] animate-in fade-in zoom-in duration-200">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Flore attendue / Pathogènes</h4>
                    <button onClick={() => setShowTypeInfo(false)} className="text-slate-400 hover:text-slate-600">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                  <ul className="space-y-1.5">
                    {EXPECTED_BACTERIA[sample.type].map((germ, i) => (
                      <li key={i} className="text-xs text-slate-600 flex items-start gap-2">
                        <div className="w-1 h-1 rounded-full bg-teal-400 mt-1.5 flex-shrink-0" />
                        <span className="italic">{germ}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <span className="text-slate-300">|</span>
            <span className="text-sm text-slate-500">{sample.collectionDate.split('T')[0]}</span>
            <span className="text-slate-300">|</span>
            <button 
              onClick={toggleAntibiotics}
              className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all border ${
                sample.underAntibiotics 
                  ? 'bg-amber-50 text-amber-600 border-amber-200 shadow-sm' 
                  : 'bg-white text-slate-400 border-slate-200 hover:bg-slate-50 hover:text-slate-600'
              }`}
            >
              <Pill className="w-3 h-3" />
              {sample.underAntibiotics ? 'Antibiotiques' : 'Aucun'}
            </button>
          </div>
        </div>
        <div className="flex space-x-2 w-full sm:w-auto">
           <button 
             onClick={handleAIAnalysis}
             className="flex-1 sm:flex-none justify-center flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:shadow-lg hover:scale-105 transition-all text-sm font-medium disabled:opacity-70"
             disabled={isAnalyzing}
           >
             {isAnalyzing ? <Loader2 className="animate-spin w-4 h-4"/> : <Wand2 className="w-4 h-4" />}
             Analyse IA
           </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-white sticky top-0 z-10 overflow-x-auto">
        <button 
          onClick={() => setActiveTab('plates')}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'plates' ? 'border-teal-500 text-teal-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          1. {sample.type === SampleType.VAGINAL ? 'Examen Direct, Gram & Boîtes' : 'Lecture & Gram'}
        </button>
        <button 
          onClick={() => setActiveTab('guide')}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'guide' ? 'border-teal-500 text-teal-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Guide d'Orientation
        </button>
        <button 
          onClick={() => setActiveTab('biochem')}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'biochem' ? 'border-teal-500 text-teal-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          2. Tests Biochimiques
        </button>
        <button 
          onClick={() => setActiveTab('id')}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'id' ? 'border-teal-500 text-teal-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          3. Identification & Résumé
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
        
        {/* TAB 1: PLATES / EXAMS */}
        {activeTab === 'plates' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            
            {/* ECBU SPECIFIC EXAM */}
            {sample.type === SampleType.ECBU && sample.ecbuExam && (
              <div className="bg-yellow-50 p-5 rounded-xl border border-yellow-200 shadow-sm animate-in fade-in slide-in-from-top-4">
                 <h3 className="font-semibold text-yellow-800 mb-4 flex items-center gap-2">
                  <Droplets className="w-5 h-5" /> Cytologie Urinaire (ECBU)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-slate-700">Leucocytes / mm³</label>
                    <input 
                      type="text" 
                      placeholder="ex: 10000 or >10⁴"
                      value={sample.ecbuExam.leukocytes}
                      onChange={(e) => updateECBUExam('leukocytes', e.target.value)}
                      className="p-2 rounded border border-yellow-300 text-sm focus:ring-2 focus:ring-yellow-500 outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-slate-700">Hématies (RBC) / mm³</label>
                    <input 
                      type="text" 
                      placeholder="ex: 5000"
                      value={sample.ecbuExam.redBloodCells}
                      onChange={(e) => updateECBUExam('redBloodCells', e.target.value)}
                      className="p-2 rounded border border-yellow-300 text-sm focus:ring-2 focus:ring-yellow-500 outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* VAGINAL SPECIFIC EXAM */}
            {sample.type === SampleType.VAGINAL && sample.vaginalExam && (
              <div className="bg-pink-50 p-5 rounded-xl border border-pink-100 shadow-sm animate-in fade-in slide-in-from-top-4">
                <h3 className="font-semibold text-pink-800 mb-4 flex items-center gap-2">
                  <Beaker className="w-5 h-5" /> Analyse du Prélèvement Vaginal
                </h3>
                
                {/* Direct Exam Section */}
                <div className="mb-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-pink-600 mb-3 border-b border-pink-200 pb-1">Examen Direct (Fresh)</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    {renderQuantitySelect('C. Épithéliales', 'epithelialCells')}
                    {renderQuantitySelect('Leucocytes', 'leukocytes')}
                    {renderQuantitySelect('Hématies', 'redBloodCells')}
                    {renderQuantitySelect('Levures', 'yeasts', true)}
                    {renderQuantitySelect('T. vaginalis', 'trichomonas', true)}
                  </div>
                </div>

                {/* Gram / Flora Section */}
                <div className="mb-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-pink-600 mb-3 border-b border-pink-200 pb-1">Gram - Score & Flore</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-slate-800">Type de Flore</label>
                      <select 
                         value={sample.vaginalExam.floraType}
                         onChange={(e) => updateVaginalExam('floraType', e.target.value)}
                         className="p-1.5 rounded border border-slate-300 text-sm focus:ring-1 focus:ring-pink-500 outline-none"
                      >
                        {FLORA_TYPE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 bg-white p-3 rounded-lg border border-pink-100">
                    {renderQuantitySelect('Lactobacillus (Doderlein)', 'doderlein')}
                    {renderQuantitySelect('G. vaginalis / Clue Cells / Mobiluncus', 'gardnerella', true)}
                    {renderQuantitySelect('Autres: Cocci +', 'cocciPos')}
                    
                    <div className="col-span-1">
                       {renderQuantitySelect('Autres: Cocci -', 'cocciNeg')}
                       <div className="mt-2 flex items-center gap-2">
                         <input 
                           type="checkbox" 
                           id="gncIntra"
                           checked={sample.vaginalExam.gncIntracellular}
                           onChange={(e) => updateVaginalExam('gncIntracellular', e.target.checked)}
                           className="w-4 h-4 text-pink-600 rounded focus:ring-pink-500"
                         />
                         <label htmlFor="gncIntra" className="text-xs font-semibold text-red-600 flex items-center gap-1 cursor-pointer">
                           Intracellulaire? (Grains de café)
                         </label>
                       </div>
                    </div>

                    {renderQuantitySelect('Autres: BGN', 'bgn')}
                    {renderQuantitySelect('Autres: BGP', 'bgp')}
                  </div>
                </div>

                {/* Mycoplasma Section */}
                 <div>
                  <div className="flex items-center justify-between mb-3 border-b border-pink-200 pb-1">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-pink-600">Recherche Mycoplasmes</h4>
                     <label className="flex items-center gap-2 cursor-pointer">
                        <span className="text-xs text-slate-500">Kit utilisé?</span>
                        <div className={`w-8 h-4 rounded-full p-0.5 transition-colors ${sample.vaginalExam.mycoplasma.performed ? 'bg-pink-500' : 'bg-slate-300'}`} onClick={toggleMycoplasmaPerformed}>
                          <div className={`w-3 h-3 bg-white rounded-full shadow-sm transform transition-transform ${sample.vaginalExam.mycoplasma.performed ? 'translate-x-4' : 'translate-x-0'}`}></div>
                        </div>
                     </label>
                  </div>
                  
                  {sample.vaginalExam.mycoplasma.performed && (
                    <div className="bg-white p-3 rounded-lg border border-pink-100 grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* M. Hominis */}
                      <div className="flex flex-col gap-2 p-2 rounded bg-slate-50">
                        <span className="text-sm font-bold text-slate-700">Mycoplasma hominis</span>
                        <div className="flex items-center gap-3">
                          <select 
                            value={sample.vaginalExam.mycoplasma.mHominis.result}
                            onChange={(e) => updateMycoplasma('mHominis', 'result', e.target.value)}
                            className="p-1 rounded border border-slate-300 text-xs w-24"
                          >
                            <option value="Negative">Négatif</option>
                            <option value="Positive">Positif</option>
                          </select>
                          
                          {sample.vaginalExam.mycoplasma.mHominis.result === 'Positive' && (
                            <label className="flex items-center gap-1 cursor-pointer bg-red-50 px-2 py-1 rounded border border-red-100">
                              <input 
                                type="checkbox"
                                checked={sample.vaginalExam.mycoplasma.mHominis.titerHigh}
                                onChange={(e) => updateMycoplasma('mHominis', 'titerHigh', e.target.checked)}
                                className="text-red-600 rounded w-3 h-3" 
                              />
                              <span className="text-xs font-bold text-red-700">{'>'} 10⁴ CFU</span>
                            </label>
                          )}
                        </div>
                      </div>

                      {/* U. Urealyticum */}
                      <div className="flex flex-col gap-2 p-2 rounded bg-slate-50">
                        <span className="text-sm font-bold text-slate-700">Ureaplasma urealyticum</span>
                        <div className="flex items-center gap-3">
                           <select 
                            value={sample.vaginalExam.mycoplasma.uUrealyticum.result}
                            onChange={(e) => updateMycoplasma('uUrealyticum', 'result', e.target.value)}
                            className="p-1 rounded border border-slate-300 text-xs w-24"
                          >
                            <option value="Negative">Négatif</option>
                            <option value="Positive">Positif</option>
                          </select>
                          
                          {sample.vaginalExam.mycoplasma.uUrealyticum.result === 'Positive' && (
                             <label className="flex items-center gap-1 cursor-pointer bg-red-50 px-2 py-1 rounded border border-red-100">
                              <input 
                                type="checkbox"
                                checked={sample.vaginalExam.mycoplasma.uUrealyticum.titerHigh}
                                onChange={(e) => updateMycoplasma('uUrealyticum', 'titerHigh', e.target.checked)}
                                className="text-red-600 rounded w-3 h-3" 
                              />
                              <span className="text-xs font-bold text-red-700">{'>'} 10⁴ CFU</span>
                            </label>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* General Gram Stain (Keep for all, but maybe optional if Vaginal is full) */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-xs">G</div>
                Statut Coloration de Gram (Isolat Principal)
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Object.values(GramStatus).map((status) => (
                  <button
                    key={status}
                    onClick={() => updateGram(status as GramStatus)}
                    className={`px-3 py-2 text-sm rounded-lg border transition-all text-left ${
                      sample.gramStatus === status 
                        ? 'bg-purple-50 border-purple-500 text-purple-700 ring-1 ring-purple-500' 
                        : 'bg-white border-slate-200 text-slate-600 hover:border-purple-300'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Plate List */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                 <div className="w-6 h-6 rounded bg-teal-100 text-teal-600 flex items-center justify-center font-bold text-xs">P</div>
                 Boîtes Observées
              </h3>
              
              <div className="space-y-3 mb-6">
                {sample.plates.map(plate => (
                  <div key={plate.id} className="flex items-start justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-slate-700">{plate.media}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          plate.growth === 'Heavy' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                        }`}>{plate.growth}</span>
                        {plate.smell && plate.smell !== 'Not Recorded' && plate.smell !== 'None / Neutral' && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 flex items-center gap-1">
                            <Wind className="w-3 h-3"/> {plate.smell}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-600 mt-1">{plate.morphology}</p>
                    </div>
                    <button onClick={() => removePlate(plate.id)} className="text-slate-400 hover:text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {sample.plates.length === 0 && <p className="text-sm text-slate-400 italic">Aucune boîte enregistrée.</p>}
              </div>

              {/* Add New Plate Form */}
              <div className="bg-teal-50/50 p-4 rounded-lg border border-teal-100">
                <h4 className="text-sm font-semibold text-teal-800 mb-3">Ajouter une Observation</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                  <select 
                    value={newPlateMedia}
                    onChange={(e) => setNewPlateMedia(e.target.value)}
                    className="p-2 rounded border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 outline-none"
                  >
                    {MEDIA_TYPES.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                  <select
                    value={newPlateGrowth}
                    onChange={(e) => setNewPlateGrowth(e.target.value as any)}
                    className="p-2 rounded border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 outline-none"
                  >
                    {['Pas de culture', 'Rare', 'Modérée', 'Abondante'].map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                  <select
                    value={newPlateSmell}
                    onChange={(e) => setNewPlateSmell(e.target.value)}
                    className="p-2 rounded border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 outline-none"
                  >
                     {SMELL_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <textarea
                  placeholder="Décrire la morphologie des colonies (taille, couleur, hémolyse, odeur, fermentation lactose...) - Optionnel"
                  value={newPlateMorph}
                  onChange={(e) => setNewPlateMorph(e.target.value)}
                  className="w-full p-2 rounded border border-slate-300 text-sm mb-3 focus:ring-2 focus:ring-teal-500 outline-none h-20 resize-none"
                />
                <button 
                  onClick={addPlateObservation}
                  className="w-full bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                >
                  <Plus className="w-4 h-4" /> Ajouter la lecture
                </button>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button 
                onClick={() => setActiveTab('biochem')}
                className="flex items-center gap-2 bg-slate-800 text-white px-6 py-2 rounded-lg hover:bg-slate-700"
              >
                Passer aux Tests <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* TAB: GUIDE */}
        {activeTab === 'guide' && (
          <div className="max-w-5xl mx-auto h-full">
            <InterpretationGuide type={sample.type} />
          </div>
        )}

        {/* TAB 2: BIOCHEM */}
        {activeTab === 'biochem' && (
          <div className="space-y-8 max-w-5xl mx-auto">
            
            {/* Suggested Workflow */}
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
              <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                <Activity className="w-5 h-5" /> Suite Recommandée
              </h3>
              <p className="text-sm text-blue-700 mb-3">
                Basé sur la coloration de <strong>{sample.gramStatus}</strong>, les tests suivants sont recommandés :
              </p>
              <div className="flex flex-wrap gap-2">
                {suggestedTests.length > 0 ? suggestedTests.map(t => (
                  <span key={t} className="px-3 py-1 bg-white text-blue-600 text-xs font-bold border border-blue-200 rounded-full shadow-sm animate-pulse">
                    {t}
                  </span>
                )) : (
                  <span className="text-sm italic text-blue-500">
                    {sample.gramStatus === GramStatus.UNKNOWN 
                      ? "Veuillez d'abord renseigner le Gram." 
                      : "Aucun test supplémentaire n'est strictement recommandé par le système pour ce Gram (ID probable ou tests déjà en cours)."}
                  </span>
                )}
              </div>
            </div>

            {/* Test Bench Visualization */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="font-semibold text-slate-800 mb-6 border-b pb-2">Tests de Paillasse (Cliquer pour changer)</h3>
              
              {/* Flex container for tubes */}
              <div className="flex flex-wrap gap-8 justify-center items-end min-h-[140px]">
                {/* Always show relevant tests or already added tests */}
                {Array.from(new Set([...suggestedTests, ...sample.tests.map(t => t.type)])).map(testType => {
                  const existingTest = sample.tests.find(t => t.type === testType);
                  const currentResult = existingTest ? existingTest.result : TestResultValue.PENDING;
                  const gas = existingTest?.gas || false;
                  const h2s = existingTest?.h2s || false;
                  const motility = existingTest?.motility || false;

                  return (
                    <div key={testType} className="flex flex-col items-center gap-2">
                       <TestTube 
                          type={testType} 
                          result={currentResult}
                          gas={gas}
                          h2s={h2s}
                          motility={motility}
                          onClick={() => {
                            // Cycle through options
                            const options = TEST_OPTIONS[testType] || [];
                            const currIdx = options.indexOf(currentResult);
                            const nextResult = currIdx === -1 ? options[0] : options[(currIdx + 1) % options.length];
                            setTestResult(testType, nextResult);
                          }} 
                       />
                       
                       {/* Dropdown fallback/override */}
                       <select 
                        className="text-[10px] w-24 p-1 border rounded bg-slate-50"
                        value={currentResult}
                        onChange={(e) => setTestResult(testType, e.target.value as TestResultValue)}
                       >
                         <option value={TestResultValue.PENDING}>En attente</option>
                         {TEST_OPTIONS[testType]?.map(opt => (
                           <option key={opt} value={opt}>{opt}</option>
                         ))}
                       </select>

                       {/* Kligler Specific Controls */}
                       {testType === TestType.KLIGLER && (
                         <div className="flex gap-1 mt-1">
                           <button 
                             onClick={() => toggleTestDetail(testType, 'gas')}
                             className={`text-[9px] px-1.5 py-0.5 rounded border transition-colors ${
                               gas ? 'bg-slate-700 text-white border-slate-800' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                             }`}
                           >
                             Gas
                           </button>
                           <button 
                             onClick={() => toggleTestDetail(testType, 'h2s')}
                             className={`text-[9px] px-1.5 py-0.5 rounded border transition-colors ${
                               h2s ? 'bg-black text-white border-black' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                             }`}
                           >
                             H2S
                           </button>
                         </div>
                       )}

                       {/* Mannitol Motility Control */}
                       {testType === TestType.MANNITOL && (
                         <div className="flex gap-1 mt-1">
                            <button 
                             onClick={() => toggleTestDetail(testType, 'motility')}
                             className={`text-[9px] px-1.5 py-0.5 rounded border transition-colors ${
                               motility ? 'bg-teal-600 text-white border-teal-700' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                             }`}
                           >
                             Motility
                           </button>
                         </div>
                       )}
                    </div>
                  );
                })}

                {/* Button to manually add other tests if logic misses them */}
                <div className="relative group">
                   <button className="h-24 w-16 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center text-slate-400 hover:border-teal-400 hover:text-teal-500 transition-colors">
                     <Plus className="w-6 h-6" />
                     <span className="text-xs mt-1">Add</span>
                   </button>
                   <div className="absolute top-full mt-2 left-0 w-48 bg-white shadow-xl rounded-lg border border-slate-100 hidden group-hover:block p-2 z-50">
                      {Object.values(TestType).map(t => (
                        <button 
                          key={t}
                          onClick={() => setTestResult(t as TestType, TestResultValue.PENDING)}
                          className="block w-full text-left text-xs p-2 hover:bg-slate-50 rounded"
                        >
                          {t}
                        </button>
                      ))}
                   </div>
                </div>
              </div>
            </div>

             <div className="flex justify-between">
              <button 
                onClick={() => setActiveTab('plates')}
                className="text-slate-500 hover:text-slate-800 text-sm font-medium"
              >
                Retour
              </button>
                <button 
                  onClick={() => {
                    setActiveTab('id');
                    handleAIAnalysis();
                  }}
                  className="flex items-center gap-2 bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 shadow-md transition-all"
                >
                   <Wand2 className="w-4 h-4" /> Analyser & Identifier
                </button>
            </div>
          </div>
        )}

        {/* TAB 3: IDENTIFICATION */}
        {activeTab === 'id' && (
          <div className="max-w-4xl mx-auto space-y-6">
            
            {/* AI Custom Query Input */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
               <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                 Données supplémentaires ou questions spécifiques
               </label>
               <textarea 
                className="w-full h-20 p-3 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all placeholder:text-slate-300"
                placeholder="ex: 'Patient porteur d'une prothèse cardiaque', 'Est-ce une Listeria ?', 'Pourquoi la catalase est négative ?'"
                value={sample.aiQuery || ''}
                onChange={(e) => onUpdateSample({ ...sample, aiQuery: e.target.value })}
               />
               <div className="mt-2 flex justify-end">
                 <button 
                  onClick={handleAIAnalysis}
                  disabled={isAnalyzing}
                  className="flex items-center gap-2 bg-teal-600 text-white px-4 py-1.5 rounded-full text-xs font-bold hover:bg-teal-700 disabled:opacity-50 transition-all shadow-sm"
                 >
                   {isAnalyzing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />}
                   {sample.aiAnalysis ? "Mettre à jour l'analyse" : 'Analyser maintenant'}
                 </button>
               </div>
            </div>

            {/* AI Result Card */}
            <div className="bg-white rounded-xl border border-indigo-100 shadow-lg overflow-hidden">
               <div className="bg-gradient-to-r from-indigo-50 to-white p-4 border-b border-indigo-100 flex justify-between items-center">
                 <h3 className="font-bold text-indigo-900 flex items-center gap-2">
                   <Wand2 className="w-5 h-5 text-indigo-600" />
                   Interprétation de l'IA (Bactériologiste)
                 </h3>
                 <span className="text-xs text-indigo-400">Powered by Gemini 2.5 Flash</span>
               </div>
               <div className="p-6 text-slate-700 leading-relaxed text-sm whitespace-pre-wrap">
                 {sample.aiAnalysis ? sample.aiAnalysis : (
                   <div className="text-center py-8 text-slate-400">
                     Aucune analyse générée. Cliquez sur "Analyser" pour obtenir un avis expert.
                   </div>
                 )}
               </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {/* VITEK CARD */}
               <div className={`p-4 rounded-xl border transition-all ${
                 hasVitek 
                   ? 'bg-green-100 border-green-300' 
                   : 'bg-green-50 border-green-200 hover:shadow-md'
               }`}>
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-green-800 mb-2">Prêt pour VITEK ?</h4>
                    {hasVitek && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                  </div>
                  <p className="text-xs text-green-700 mb-3">Si l'orientation concorde, préparez la suspension.</p>
                  <button 
                    onClick={handleVitekSetup}
                    disabled={hasVitek}
                    className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${
                      hasVitek 
                        ? 'bg-green-200 text-green-800 cursor-not-allowed'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {hasVitek ? 'ID VITEK enregistrée' : 'Marquer prêt pour ID VITEK'}
                  </button>
               </div>
               
               {/* API GALLERY CARD */}
               <div className={`p-4 rounded-xl border transition-all ${
                 hasAPI 
                   ? 'bg-yellow-100 border-yellow-300' 
                   : 'bg-yellow-50 border-yellow-200 hover:shadow-md'
               }`}>
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-yellow-800 mb-2">Galerie API nécessaire ?</h4>
                    {hasAPI && <CheckCircle2 className="w-5 h-5 text-yellow-600" />}
                  </div>
                  <p className="text-xs text-yellow-700 mb-3">
                    {sample.gramStatus === GramStatus.GPC ? 'API Staph' : 'API 20E (Entero)'} selon l'orientation.
                  </p>
                  <button 
                    onClick={handleAPISetup}
                    disabled={hasAPI}
                    className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${
                      hasAPI 
                        ? 'bg-yellow-200 text-yellow-800 cursor-not-allowed'
                        : 'bg-yellow-500 text-white hover:bg-yellow-600'
                    }`}
                  >
                    {hasAPI ? 'Galerie API enregistrée' : 'Enregistrer Galerie API'}
                  </button>
               </div>
            </div>

             <div className="flex justify-start">
              <button 
                onClick={() => setActiveTab('biochem')}
                className="text-slate-500 hover:text-slate-800 text-sm font-medium"
              >
                Retour aux Tests
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default WorkBench;