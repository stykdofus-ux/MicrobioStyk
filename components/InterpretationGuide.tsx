import React from 'react';
import { SampleType } from '../types';
import { AlertCircle, CheckCircle2, XCircle, Info, Beaker, ShieldAlert, Zap } from 'lucide-react';

interface InterpretationGuideProps {
  type: SampleType;
}

const InterpretationGuide: React.FC<InterpretationGuideProps> = ({ type }) => {
  const renderECBU = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <section>
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-500" /> Seuil de significativité
        </h3>
        <div className="overflow-hidden border border-slate-200 rounded-xl shadow-sm bg-white">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-2">Contexte</th>
                <th className="px-4 py-2">Seuil (UFC/mL)</th>
                <th className="px-4 py-2">Bactéries concernées</th>
                <th className="px-4 py-2">Remarques</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="px-4 py-2 font-medium">Infection symptomatique</td>
                <td className="px-4 py-2">≥ 10³</td>
                <td className="px-4 py-2 italic font-serif text-teal-700">E. coli, S. saprophyticus</td>
                <td className="px-4 py-2">Cystite non compliquée.</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-medium">Infection symptomatique</td>
                <td className="px-4 py-2">≥ 10⁴</td>
                <td className="px-4 py-2 italic font-serif text-teal-700">Autres entéro., Enterococcus</td>
                <td className="px-4 py-2">Pyélo, prostatite, IU compliquée.</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-medium">Bactériurie asymptomatique</td>
                <td className="px-4 py-2">≥ 10⁵</td>
                <td className="px-4 py-2 italic font-serif text-teal-700">Tous germes</td>
                <td className="px-4 py-2">Enceinte: seuil à 10⁵ pour SGB.</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-medium">Sondage urinaire</td>
                <td className="px-4 py-2">≥ 10²</td>
                <td className="px-4 py-2 italic font-serif text-teal-700">Tous germes (sauf minoritaires)</td>
                <td className="px-4 py-2">Risque élevé de colonisation.</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-medium">Leucocyturie sans germe</td>
                <td className="px-4 py-2">{'< 10⁴'}</td>
                <td className="px-4 py-2 italic font-serif text-teal-700">Ureaplasma, Mycoplasma...</td>
                <td className="px-4 py-2">PCR ou culture spécifique.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <section className="bg-white p-4 rounded-xl border border-slate-200">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Contamination vs Infection</h3>
          <div className="space-y-3">
             <div className="p-2 rounded bg-red-50 border border-red-100">
               <span className="text-[10px] font-bold text-red-600 uppercase">Contamination</span>
               <p className="text-xs text-slate-600 mt-1">Polymicrobien ({'>'} 2 espèces). Leucocyturie faible ({'<'} 10⁴). Lactobacillus, Corynebacterium.</p>
             </div>
             <div className="p-2 rounded bg-green-50 border border-green-100">
               <span className="text-[10px] font-bold text-green-600 uppercase">Infection</span>
               <p className="text-xs text-slate-600 mt-1">Monomicrobien. E. coli, Klebsiella, Proteus. Leucocyturie {'>'} 10⁴/mL.</p>
             </div>
          </div>
        </section>

        <section className="bg-slate-900 p-4 rounded-xl text-slate-300">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
            <ShieldAlert className="w-3 h-3" /> Pièges à éviter
          </h3>
          <ul className="space-y-2 text-xs">
            <li><span className="text-amber-400 font-bold">Faux Positifs:</span> Gardnerella (vaginale), S. epidermidis (cutanée).</li>
            <li><span className="text-amber-400 font-bold">Faux Négatifs:</span> <span className="italic">Corynebacterium urealyticum</span> (Uréase+, incubation lente {'>'} 48h).</li>
          </ul>
        </section>
      </div>

      <div className="bg-teal-50 border-l-4 border-teal-500 p-4 rounded-r-xl">
        <h4 className="text-xs font-bold text-teal-800 mb-1 flex items-center gap-2">
          <Info className="w-4 h-4" /> Recommandation
        </h4>
        <p className="text-xs text-teal-700 leading-relaxed">
          Toujours corréler avec la leucocyturie. Un ECBU "stérile" avec leucocyturie importante doit faire rechercher 
          <span className="italic ml-1">Ureaplasma, Mycoplasma, Chlamydia</span> ou <span className="italic">M. tuberculosis</span>.
        </p>
      </div>
    </div>
  );

  const renderVaginal = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
       <section>
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Zap className="w-4 h-4 text-pink-500" /> Seuil de significativité
        </h3>
        <div className="overflow-hidden border border-slate-200 rounded-xl shadow-sm bg-white">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-2">Contexte</th>
                <th className="px-4 py-2">Interprétation</th>
                <th className="px-4 py-2">Bactéries concernées</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="px-4 py-2 font-medium">Flore normale</td>
                <td className="px-4 py-2">Lactobacillus dominant ({'>'}90%), pH {'<'} 4.5</td>
                <td className="px-4 py-2 italic font-serif text-teal-700">L. crispatus, L. jensenii</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-medium">Vaginose bactérienne</td>
                <td className="px-4 py-2">↓ Lactobacillus, ↑ anaérobies, clue cells</td>
                <td className="px-4 py-2 italic font-serif text-teal-700">G. vaginalis, Atopobium, Mobiluncus</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-medium">Vaginite à Candida</td>
                <td className="px-4 py-2">Leucocytes + filaments mycéliens</td>
                <td className="px-4 py-2 italic font-serif text-teal-700">Candida albicans (90%)</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-medium">Cervicite / IST</td>
                <td className="px-4 py-2">Leucocytes + bactéries intracellulaires</td>
                <td className="px-4 py-2 italic font-serif text-teal-700">N. gonorrhoeae, C. trachomatis</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-medium">Portage SGB</td>
                <td className="px-4 py-2">Recherche systématique à 35-37 SA</td>
                <td className="px-4 py-2 italic font-serif text-teal-700">Streptococcus agalactiae</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <section className="bg-white p-4 rounded-xl border border-slate-200">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Contamination vs Infection</h3>
          <div className="space-y-3">
             <div className="p-2 rounded bg-red-50 border border-red-100">
               <span className="text-[10px] font-bold text-red-600 uppercase">Contamination</span>
               <p className="text-xs text-slate-600 mt-1">S. epidermidis, Corynebacterium. Lactobacillus dominant sans leucocytes.</p>
             </div>
             <div className="p-2 rounded bg-green-50 border border-green-100">
               <span className="text-[10px] font-bold text-green-600 uppercase">Infection</span>
               <p className="text-xs text-slate-600 mt-1">G. vaginalis, N. gonorrhoeae. Déséquilibre de flore ou présence de leucocytes.</p>
             </div>
          </div>
        </section>

        <section className="bg-slate-900 p-4 rounded-xl text-slate-300">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
            <ShieldAlert className="w-3 h-3" /> Pièges à éviter
          </h3>
          <ul className="space-y-2 text-xs">
            <li><span className="text-amber-400 font-bold">Faux Positifs:</span> E. coli ou Enterococcus (souvent contamination fécale). S. aureus (rarement pathogène ici).</li>
            <li><span className="text-amber-400 font-bold">Faux Négatifs:</span> Gonocoque fragile (milieu Thayer-Martin/CO2). C. trachomatis (PCR obligatoire).</li>
          </ul>
        </section>
      </div>
    </div>
  );

  const renderStool = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <section>
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Zap className="w-4 h-4 text-emerald-500" /> Coproculture & Diarrhées
        </h3>
        <div className="overflow-hidden border border-slate-200 rounded-xl shadow-sm bg-white">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-2">Contexte</th>
                <th className="px-4 py-2">Interprétation</th>
                <th className="px-4 py-2">Bactéries / Toxines</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="px-4 py-2 font-medium">Diarrhée aiguë</td>
                <td className="px-4 py-2">Culture positive + Fièvre / Sang</td>
                <td className="px-4 py-2 italic font-serif text-teal-700">Salmonella, Shigella, Campylobacter</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-medium">TIAC</td>
                <td className="px-4 py-2">Toxine ou bactérie en grande quantité</td>
                <td className="px-4 py-2 italic font-serif text-teal-700">S. aureus, B. cereus, C. perfringens</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-medium">Nosocomiale</td>
                <td className="px-4 py-2">Recherche de Toxines A/B</td>
                <td className="px-4 py-2 italic font-serif text-teal-700">Clostridioides difficile</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-medium">Portage BMR</td>
                <td className="px-4 py-2">Recherche systématique d'entérobactéries</td>
                <td className="px-4 py-2 italic font-serif text-teal-700">E. coli BLSE, KPC+</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="bg-slate-900 p-4 rounded-xl text-slate-300">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
          <ShieldAlert className="w-3 h-3" /> Pièges à éviter
        </h3>
        <ul className="space-y-2 text-xs">
          <li><span className="text-amber-400 font-bold">Faux Positifs:</span> E. coli non pathogène (90% de la flore fécale). C. difficile sans toxine (porteur sain).</li>
          <li><span className="text-amber-400 font-bold">Faux Négatifs:</span> Campylobacter (nécessite 42°C Microaéro). Yersinia (milieu CIN, 28°C).</li>
        </ul>
      </section>
    </div>
  );

  const renderBlood = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-900">
        <h3 className="font-bold text-sm mb-2 flex items-center gap-2">
          <Info className="w-5 h-5 text-indigo-500" /> Règle d'Or en Hémoculture
        </h3>
        <p className="text-xs leading-relaxed">
          Toute bactérie isolée est a priori significative. Seuil de positivité : détection automatisée (24-48h). 
          Toujours prélever 2-3 paires à 30 min d'intervalle.
        </p>
      </div>

      <section className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
            <tr>
              <th className="px-4 py-2">Critère</th>
              <th className="px-4 py-2">Contamination</th>
              <th className="px-4 py-2">Bactériémie vraie</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 italic font-serif">
            <tr>
              <td className="px-4 py-2 font-sans font-bold not-italic">Bactérie</td>
              <td className="px-4 py-2 text-slate-500">S. epidermidis, Corynebacterium, Propionibacterium acnes</td>
              <td className="px-4 py-2 text-teal-700">S. aureus, S. pneumoniae, E. coli, Pseudomonas</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-sans font-bold not-italic">Flacons (+)</td>
              <td className="px-4 py-2 text-slate-500">1 seul flacon (souvent anaérobie)</td>
              <td className="px-4 py-2 text-teal-700">≥ 2 flacons (Aéro + Anaéro)</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-sans font-bold not-italic">Temps (+)</td>
              <td className="px-4 py-2 text-slate-500">{'>'} 48h</td>
              <td className="px-4 py-2 text-teal-700">{'<'} 24h</td>
            </tr>
          </tbody>
        </table>
      </section>

      <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl">
        <h4 className="text-xs font-bold text-amber-800 mb-1 flex items-center gap-2 italic font-serif">
          S. epidermidis?
        </h4>
        <p className="text-xs text-amber-700 leading-relaxed">
          1 flacon = probable contamination. 2 flacons + matériel étranger (cathéter, prothèse) = infection possible.
        </p>
      </div>
    </div>
  );

  const renderFluid = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
       <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-900">
        <h3 className="font-bold text-sm mb-2 flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-red-500" /> Urgence Vitale: LCR
        </h3>
        <p className="text-xs leading-relaxed">
          Toute bactérie isolée dans le LCR est pathogène. Ne pas attendre la culture pour traiter 
          (antibiothérapie probabiliste dès la suspicion).
        </p>
      </div>

      <section>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Seuils de détection</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm text-center">
             <span className="text-2xl font-serif font-bold text-slate-800 italic">10³-10⁵</span>
             <p className="text-[10px] text-slate-500 uppercase mt-1">UFC/mL (Examen Direct)</p>
          </div>
          <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm text-center">
             <span className="text-2xl font-serif font-bold text-slate-800 italic">10-100</span>
             <p className="text-[10px] text-slate-500 uppercase mt-1">UFC/mL (Culture)</p>
          </div>
        </div>
      </section>

      <section className="bg-slate-900 p-4 rounded-xl text-slate-300">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Germes Clés</h3>
        <div className="grid grid-cols-2 gap-2 text-[11px] italic font-serif">
          <div className="bg-slate-800 p-2 rounded">Streptococcus pneumoniae</div>
          <div className="bg-slate-800 p-2 rounded">Neisseria meningitidis</div>
          <div className="bg-slate-800 p-2 rounded">Haemophilus influenzae</div>
          <div className="bg-slate-800 p-2 rounded">Listeria monocytogenes</div>
        </div>
      </section>
    </div>
  );

  const renderPus = (variant: 'deep' | 'superficial') => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
       <div className="p-4 bg-slate-100 border border-slate-200 rounded-xl text-slate-700">
        <h3 className="font-bold text-sm mb-2">Seuil quantitatif: {'>'} 10⁵ UFC/g</h3>
        <p className="text-xs">Sauf S. aureus ou S. pyogenes qui sont pathogènes même en faible quantité.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <section className="bg-white p-4 rounded-xl border border-slate-200">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Contamination vs Infection</h3>
          <div className="space-y-3">
             <div className="p-2 rounded bg-red-50 border border-red-100">
               <span className="text-[10px] font-bold text-red-600 uppercase">Contamination</span>
               <p className="text-xs text-slate-600 mt-1">Polymicrobien ({'>'} 3 espèces). S. epidermidis, Corynebacterium. Plaie propre.</p>
             </div>
             <div className="p-2 rounded bg-green-50 border border-green-100">
               <span className="text-[10px] font-bold text-green-600 uppercase">Infection</span>
               <p className="text-xs text-slate-600 mt-1">Monomicrobien ou 2 germes max. S. aureus, S. pyogenes, P. aeruginosa, Anaérobies.</p>
             </div>
          </div>
        </section>

        <section className="bg-slate-900 p-4 rounded-xl text-slate-300">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Pièges (Pus {variant === 'deep' ? 'Profond' : 'Superficiel'})</h3>
          <ul className="space-y-2 text-[11px] leading-snug">
            {variant === 'superficial' ? (
              <>
                <li><span className="text-amber-400">Morsures:</span> Pasteurella multocida, Capnocytophaga.</li>
                <li><span className="text-amber-400">Chroniques:</span> Pseudomonas (Fruité/Vert).</li>
              </>
            ) : (
              <>
                <li><span className="text-amber-400">Abdominal:</span> Souvent polymicrobien (B. fragilis + E. coli).</li>
                <li><span className="text-amber-400">Ostéites:</span> M. tuberculosis, Propionibacterium acnes.</li>
              </>
            )}
          </ul>
        </section>
      </div>
    </div>
  );

  const getGuide = () => {
    switch (type) {
      case SampleType.ECBU: return renderECBU();
      case SampleType.VAGINAL: return renderVaginal();
      case SampleType.STOOL: return renderStool();
      case SampleType.BLOOD: return renderBlood();
      case SampleType.FLUID: return renderFluid();
      case SampleType.PUS_SUPERFICIAL: return renderPus('superficial');
      case SampleType.PUS_DEEP: return renderPus('deep');
      default: return <div className="text-slate-400 italic">Guide de prélèvement non disponible pour ce type.</div>;
    }
  };

  return (
    <div className="h-full overflow-y-auto pr-2 custom-scrollbar">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <Beaker className="w-5 h-5 text-teal-600" /> Aide à l'Orientation: {type}
        </h2>
        <p className="text-xs text-slate-500">Critères bactériologiques pour choisir les colonies à isoler et identifier.</p>
      </div>
      {getGuide()}
    </div>
  );
};

export default InterpretationGuide;
