import React, { useState } from 'react';
import { ArrowDown, RotateCcw, GitFork, CheckCircle2, CircleDot } from 'lucide-react';

type NodeResult = {
  label: string;
  nextNodeId?: string;
  finalResult?: string;
  description?: string;
};

type TreeNode = {
  id: string;
  title: string;
  test: string;
  options: NodeResult[];
};

const DECISION_TREES: Record<string, TreeNode> = {
  // STARTING POINTS
  'ROOT': {
    id: 'ROOT',
    title: 'Select Starting Point',
    test: 'Gram Stain Morphology',
    options: [
      { label: 'Gram Positive Cocci', nextNodeId: 'GPC_START' },
      { label: 'Gram Negative Bacilli', nextNodeId: 'GNB_START' },
      { label: 'Gram Positive Bacilli', nextNodeId: 'GPB_START' },
      { label: 'Gram Negative Cocci', nextNodeId: 'GNC_START' }
    ]
  },

  // --- GPC ---
  'GPC_START': {
    id: 'GPC_START',
    title: 'Gram Positive Cocci',
    test: 'Catalase Test',
    options: [
      { label: 'Positive (+)', nextNodeId: 'STAPH_START', description: 'Bubbles detected' },
      { label: 'Negative (-)', nextNodeId: 'STREP_START', description: 'No bubbles' }
    ]
  },

  // STAPHYLOCOCCUS
  'STAPH_START': {
    id: 'STAPH_START',
    title: 'Staphylococcus Genus',
    test: 'Coagulase Test',
    options: [
      { label: 'Positive (+)', finalResult: 'Staphylococcus aureus', description: 'Clot formation (Tube) or Agglutination (Slide)' },
      { label: 'Negative (-)', nextNodeId: 'STAPH_COAG_NEG' }
    ]
  },
  'STAPH_COAG_NEG': {
    id: 'STAPH_COAG_NEG',
    title: 'Coagulase Negative Staph',
    test: 'Novobiocin Sensitivity',
    options: [
      { label: 'Sensitive', finalResult: 'Staphylococcus epidermidis', description: 'Zone of inhibition > 16mm' },
      { label: 'Resistant', finalResult: 'Staphylococcus saprophyticus', description: 'No zone or small zone' }
    ]
  },

  // STREPTOCOCCUS
  'STREP_START': {
    id: 'STREP_START',
    title: 'Streptococcus / Enterococcus',
    test: 'Hemolysis on Blood Agar',
    options: [
      { label: 'Alpha (Green)', nextNodeId: 'STREP_ALPHA' },
      { label: 'Beta (Clear)', nextNodeId: 'STREP_BETA' },
      { label: 'Gamma (None)', nextNodeId: 'STREP_GAMMA' }
    ]
  },
  'STREP_ALPHA': {
    id: 'STREP_ALPHA',
    title: 'Alpha-Hemolytic Strep',
    test: 'Optochin (Taxo P) Sensitivity',
    options: [
      { label: 'Sensitive (>14mm)', finalResult: 'Streptococcus pneumoniae' },
      { label: 'Resistant', finalResult: 'Viridans Streptococci', description: 'e.g., S. mitis, S. mutans' }
    ]
  },
  'STREP_BETA': {
    id: 'STREP_BETA',
    title: 'Beta-Hemolytic Strep',
    test: 'Bacitracin (Taxo A) Sensitivity',
    options: [
      { label: 'Sensitive', finalResult: 'Streptococcus pyogenes (Group A)' },
      { label: 'Resistant', nextNodeId: 'STREP_BETA_RES' }
    ]
  },
  'STREP_BETA_RES': {
    id: 'STREP_BETA_RES',
    title: 'Beta-Hemolytic Non-Group A',
    test: 'CAMP Test',
    options: [
      { label: 'Positive (Arrowhead)', finalResult: 'Streptococcus agalactiae (Group B)' },
      { label: 'Negative', finalResult: 'Group C / G Streptococcus', description: 'Check SXT sensitivity to confirm' }
    ]
  },
  'STREP_GAMMA': {
    id: 'STREP_GAMMA',
    title: 'Non-Hemolytic Strep',
    test: 'Bile Esculin Hydrolysis',
    options: [
      { label: 'Positive (Black)', nextNodeId: 'GRP_D_CHECK' },
      { label: 'Negative', finalResult: 'Non-hemolytic Streptococci / Other' }
    ]
  },
  'GRP_D_CHECK': {
    id: 'GRP_D_CHECK',
    title: 'Group D Strep / Enterococcus',
    test: 'Growth in 6.5% NaCl',
    options: [
      { label: 'Positive (Turbid)', finalResult: 'Enterococcus faecalis / faecium' },
      { label: 'Negative (Clear)', finalResult: 'Streptococcus bovis (Group D)' }
    ]
  },

  // --- GNB ---
  'GNB_START': {
    id: 'GNB_START',
    title: 'Gram Negative Bacilli',
    test: 'Oxidase Test',
    options: [
      { label: 'Positive (+)', nextNodeId: 'OXIDASE_POS' },
      { label: 'Negative (-)', nextNodeId: 'ENTERO_START' }
    ]
  },
  'OXIDASE_POS': {
    id: 'OXIDASE_POS',
    title: 'Oxidase Positive GNB',
    test: 'Pigment Production',
    options: [
      { label: 'Green (Pyocyanin)', finalResult: 'Pseudomonas aeruginosa', description: 'Grape-like smell, growth at 42°C' },
      { label: 'None / Yellow', finalResult: 'Other Non-Fermenter', description: 'Consider Burkholderia, Alcaligenes, etc. Use API 20NE.' }
    ]
  },
  'ENTERO_START': {
    id: 'ENTERO_START',
    title: 'Enterobacteriaceae (Oxidase -)',
    test: 'Lactose Fermentation (CLED)',
    options: [
      { label: 'Positive (Yellow Colonies)', nextNodeId: 'LAC_POS' },
      { label: 'Negative (Blue/Green)', nextNodeId: 'LAC_NEG' }
    ]
  },
  'LAC_POS': {
    id: 'LAC_POS',
    title: 'Lactose Fermenters',
    test: 'Indole Test',
    options: [
      { label: 'Positive (+)', nextNodeId: 'IND_POS_LAC_POS' },
      { label: 'Negative (-)', nextNodeId: 'IND_NEG_LAC_POS' }
    ]
  },
  'IND_POS_LAC_POS': {
    id: 'IND_POS_LAC_POS',
    title: 'Indole (+) Lactose (+)',
    test: 'Citrate (Simmons)',
    options: [
      { label: 'Negative', finalResult: 'Escherichia coli' },
      { label: 'Positive', finalResult: 'Citrobacter koseri / diversus' }
    ]
  },
  'IND_NEG_LAC_POS': {
    id: 'IND_NEG_LAC_POS',
    title: 'Indole (-) Lactose (+)',
    test: 'Motility',
    options: [
      { label: 'Non-Motile', finalResult: 'Klebsiella pneumoniae' },
      { label: 'Motile', finalResult: 'Enterobacter cloacae / aerogenes' }
    ]
  },
  'LAC_NEG': {
    id: 'LAC_NEG',
    title: 'Non-Lactose Fermenters',
    test: 'H2S Production (Kligler/TSI)',
    options: [
      { label: 'Positive (Black)', nextNodeId: 'H2S_POS' },
      { label: 'Negative', nextNodeId: 'H2S_NEG' }
    ]
  },
  'H2S_POS': {
    id: 'H2S_POS',
    title: 'H2S Positive GNB',
    test: 'Urease Test',
    options: [
      { label: 'Positive (Pink rapid)', finalResult: 'Proteus species', description: 'Check Indole: (+) vulgaris, (-) mirabilis. Swarming.' },
      { label: 'Negative', finalResult: 'Salmonella species', description: 'Confirm with serology.' }
    ]
  },
  'H2S_NEG': {
    id: 'H2S_NEG',
    title: 'H2S Negative GNB',
    test: 'Motility',
    options: [
      { label: 'Non-Motile', finalResult: 'Shigella species' },
      { label: 'Motile', finalResult: 'Serratia / Morganella / Providencia', description: 'Check DNAse (Serratia +) or TDA (Morganella/Providencia +)' }
    ]
  },

  // --- GPB (Gram Positive Rods) ---
  'GPB_START': {
    id: 'GPB_START',
    title: 'Gram Positive Rods',
    test: 'Spore Formation',
    options: [
      { label: 'Spore Formers', nextNodeId: 'SPORE_FORMERS' },
      { label: 'Non-Spore Formers', nextNodeId: 'NON_SPORE' }
    ]
  },
  'SPORE_FORMERS': {
    id: 'SPORE_FORMERS',
    title: 'Spore Forming GPB',
    test: 'Aerobic Growth',
    options: [
      { label: 'Growth (Aerobe/Facultative)', nextNodeId: 'BACILLUS_CHECK' },
      { label: 'No Growth (Anaerobe)', finalResult: 'Clostridium species', description: 'Obligate anaerobe. Box-car shape.' }
    ]
  },
  'BACILLUS_CHECK': {
    id: 'BACILLUS_CHECK',
    title: 'Bacillus species',
    test: 'Motility & Hemolysis',
    options: [
      { label: 'Motile / Beta-Hemolytic', finalResult: 'Bacillus cereus / subtilis', description: 'Large, rough colonies. Common contaminant or food poisoning.' },
      { label: 'Non-Motile / Non-Hemolytic', finalResult: 'Bacillus anthracis (Suspect)', description: 'Medusa head colonies. ALERT LAB SAFETY IMMEDIATEY.' }
    ]
  },
  'NON_SPORE': {
    id: 'NON_SPORE',
    title: 'Non-Spore Forming GPB',
    test: 'Catalase Test',
    options: [
      { label: 'Positive (+)', nextNodeId: 'GPB_CAT_POS' },
      { label: 'Negative (-)', nextNodeId: 'GPB_CAT_NEG' }
    ]
  },
  'GPB_CAT_POS': {
    id: 'GPB_CAT_POS',
    title: 'Catalase (+) Non-Spore GPB',
    test: 'Motility at 25°C',
    options: [
      { label: 'Positive (Umbrella)', finalResult: 'Listeria monocytogenes', description: 'Small GPR. Bile Esculin (+). Beta-hemolysis (weak).' },
      { label: 'Negative', nextNodeId: 'CORYNE_CHECK' }
    ]
  },
  'CORYNE_CHECK': {
    id: 'CORYNE_CHECK',
    title: 'Catalase (+) Non-Motile',
    test: 'Morphology & Arrangement',
    options: [
      { label: 'Palisades / Chinese Letters', finalResult: 'Corynebacterium species', description: 'Diphtheroids. If Tinsdale (+) -> C. diphtheriae suspect.' },
      { label: 'Branching / Beaded', finalResult: 'Nocardia / Actinomyces', description: 'Modified Acid-Fast Stain recommended. Earthy smell.' }
    ]
  },
  'GPB_CAT_NEG': {
    id: 'GPB_CAT_NEG',
    title: 'Catalase (-) Non-Spore GPB',
    test: 'H2S on TSI/Kligler',
    options: [
      { label: 'Positive (Black)', finalResult: 'Erysipelothrix rhusiopathiae', description: 'Bottle brush motility in gelatin.' },
      { label: 'Negative', nextNodeId: 'GPB_H2S_NEG' }
    ]
  },
  'GPB_H2S_NEG': {
    id: 'GPB_H2S_NEG',
    title: 'H2S Negative GPB',
    test: 'Hemolysis / Morphology',
    options: [
      { label: 'Beta Hemolytic', finalResult: 'Arcanobacterium haemolyticum', description: 'Reverse CAMP positive.' },
      { label: 'Alpha / Gamma', finalResult: 'Lactobacillus species', description: 'Long thin rods in chains. Resistant to Vancomycin.' },
      { label: 'Coccobacilli (Gram Var)', finalResult: 'Gardnerella vaginalis', description: 'Associated with BV. Clue Cells in direct exam.' }
    ]
  },

  // --- GNC (Gram Negative Cocci) ---
  'GNC_START': {
    id: 'GNC_START',
    title: 'Gram Negative Cocci',
    test: 'Oxidase Test',
    options: [
      { label: 'Positive (+)', nextNodeId: 'GNC_OX_POS' },
      { label: 'Negative (-)', nextNodeId: 'GNC_OX_NEG' }
    ]
  },
  'GNC_OX_POS': {
    id: 'GNC_OX_POS',
    title: 'Oxidase Positive GNC',
    test: 'Carbohydrate Utilization (CTA Sugars)',
    options: [
      { label: 'Glucose (+) Only', finalResult: 'Neisseria gonorrhoeae', description: 'Intracellular diplococci. STI. Thayer-Martin growth.' },
      { label: 'Glucose (+) & Maltose (+)', finalResult: 'Neisseria meningitidis', description: 'Associated with meningitis/sepsis.' },
      { label: 'Sugars Negative / DNAse (+)', finalResult: 'Moraxella catarrhalis', description: 'Hockey puck colonies. Butyrate esterase (+).' },
      { label: 'Glu (+), Mal (+), Suc (+)', finalResult: 'Neisseria sicca / mucosa', description: 'Commensal flora.' }
    ]
  },
  'GNC_OX_NEG': {
    id: 'GNC_OX_NEG',
    title: 'Oxidase Negative GNC',
    test: 'Growth Condition',
    options: [
      { label: 'Aerobic Growth', finalResult: 'Acinetobacter species', description: 'Strict aerobe. Coccobacilli often mistaken for GNC. Oxidase (-).' },
      { label: 'Strict Anaerobe', finalResult: 'Veillonella species', description: 'Small GNC. Oral/Gut flora.' }
    ]
  }
};

interface DecisionTreeExplorerProps {
  initialNode?: string;
}

const DecisionTreeExplorer: React.FC<DecisionTreeExplorerProps> = ({ initialNode = 'ROOT' }) => {
  const [history, setHistory] = useState<string[]>([initialNode]);
  
  const currentNodeId = history[history.length - 1];
  const currentNode = DECISION_TREES[currentNodeId];

  const handleOptionClick = (option: NodeResult) => {
    if (option.nextNodeId) {
      setHistory([...history, option.nextNodeId]);
    } else if (option.finalResult) {
      // Create a fake node for result display
      const resultNodeId = `RESULT_${Date.now()}`;
      DECISION_TREES[resultNodeId] = {
        id: resultNodeId,
        title: 'Identification Reached',
        test: option.finalResult,
        options: [] // End of line
      };
      setHistory([...history, resultNodeId]);
    }
  };

  const reset = () => {
    setHistory(['ROOT']);
  };

  const goBack = () => {
    if (history.length > 1) {
      setHistory(history.slice(0, -1));
    }
  };

  // Render logic if we are at a result node (hacky detection via empty options)
  const isResult = currentNode.options.length === 0;

  return (
    <div className="flex flex-col h-full bg-slate-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <GitFork className="w-5 h-5 text-teal-600" />
          Interactive Identification Tree
        </h2>
        <button 
          onClick={reset}
          className="text-xs flex items-center gap-1 text-slate-500 hover:text-teal-600 font-medium px-3 py-1.5 rounded-full border border-slate-200 bg-white shadow-sm transition-colors"
        >
          <RotateCcw className="w-3 h-3" /> Reset
        </button>
      </div>

      <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full">
        
        {/* Breadcrumbs / Path Visualization */}
        <div className="flex flex-wrap items-center gap-2 mb-8 text-xs text-slate-400">
           {history.map((nodeId, idx) => {
             const node = DECISION_TREES[nodeId];
             if (!node || node.options.length === 0) return null;
             return (
               <React.Fragment key={nodeId}>
                 <span className={`${idx === history.length - 1 ? 'font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded' : ''}`}>
                   {idx === 0 ? 'Start' : node.test.split(' ')[0]}
                 </span>
                 {idx < history.length - 1 && (!DECISION_TREES[history[idx+1]]?.options.length ? null : <ArrowDown className="w-3 h-3 -rotate-90" />)}
               </React.Fragment>
             );
           })}
        </div>

        {/* Current Step Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-300">
          
          <div className={`p-6 ${isResult ? 'bg-green-600' : 'bg-slate-800'} text-white text-center relative`}>
             <h3 className="text-sm font-medium opacity-80 uppercase tracking-widest mb-1">
               {isResult ? 'Likely Identification' : 'Current Decision Point'}
             </h3>
             <h1 className="text-2xl font-bold">
               {currentNode.test}
             </h1>
             {isResult && (
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full flex items-center justify-center opacity-10 pointer-events-none">
                 <CheckCircle2 className="w-48 h-48" />
               </div>
             )}
          </div>

          <div className="p-6">
            {!isResult ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentNode.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleOptionClick(opt)}
                    className="group relative flex flex-col items-center justify-center p-6 rounded-xl border-2 border-slate-100 hover:border-teal-500 hover:bg-teal-50 transition-all duration-200"
                  >
                    <div className="mb-2 w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-teal-200 group-hover:text-teal-800 transition-colors">
                      {idx === 0 ? <CircleDot className="w-5 h-5 text-teal-600" /> : <CircleDot className="w-5 h-5 text-rose-500" />}
                    </div>
                    <span className="text-lg font-bold text-slate-700 group-hover:text-teal-900">{opt.label}</span>
                    {opt.description && (
                      <span className="text-xs text-slate-500 mt-2 text-center group-hover:text-teal-700">{opt.description}</span>
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center">
                 <p className="text-slate-600 mb-6">
                   Based on the selected path, the organism is identified as:
                 </p>
                 <div className="inline-block px-6 py-3 bg-green-50 border border-green-200 rounded-lg text-green-900 font-bold text-xl mb-6">
                   {currentNode.test}
                 </div>
                 <div className="flex justify-center">
                    <button 
                      onClick={reset}
                      className="bg-slate-900 text-white px-6 py-2 rounded-lg hover:bg-slate-800 transition-colors shadow-lg"
                    >
                      Start Over
                    </button>
                 </div>
              </div>
            )}
          </div>
          
          {history.length > 1 && !isResult && (
            <div className="bg-slate-50 p-3 border-t border-slate-100 flex justify-start">
               <button onClick={goBack} className="text-sm text-slate-500 hover:text-slate-800 px-4">
                 ← Back to previous step
               </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default DecisionTreeExplorer;