import React, { useState } from 'react';
import { Search, Loader2, BookOpen, AlertCircle, TestTube2, Dna } from 'lucide-react';
import { getGermKnowledge } from '../services/geminiService';
import { GermKnowledge } from '../types';

const GermReference: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<GermKnowledge | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchTerm.trim()) return;

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const result = await getGermKnowledge(searchTerm);
      if (result.name === 'Unknown') {
        setError("Germ not found or not a bacteria. Please check spelling.");
      } else {
        setData(result);
      }
    } catch (err) {
      setError("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const TestBadge = ({ label, value }: { label: string, value: string }) => {
    let colorClass = 'bg-slate-100 text-slate-600 border-slate-200';
    if (value.includes('+') || value.toLowerCase() === 'positive') colorClass = 'bg-teal-100 text-teal-800 border-teal-200';
    if (value.includes('-') || value.toLowerCase() === 'negative') colorClass = 'bg-rose-100 text-rose-800 border-rose-200';
    
    return (
      <div className={`flex flex-col items-center p-3 rounded-lg border ${colorClass} w-full shadow-sm`}>
        <span className="text-[10px] uppercase font-bold tracking-wider opacity-70 mb-1">{label}</span>
        <span className="text-lg font-bold">{value}</span>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 p-6 overflow-hidden">
      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col">
        
        {/* Header */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-slate-800 flex items-center justify-center gap-3">
            <BookOpen className="text-indigo-600 w-8 h-8" />
            Germ Encyclopedia
          </h2>
          <p className="text-slate-500 mt-2">Enter a germ name to view its expected biochemical profile.</p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-8 relative max-w-xl mx-auto w-full">
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="e.g. Escherichia coli, Staphylococcus aureus..."
            className="w-full pl-12 pr-4 py-4 rounded-full border border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none text-lg shadow-sm transition-all"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-6 h-6" />
          <button 
            type="submit"
            disabled={loading || !searchTerm}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-indigo-600 text-white px-6 py-2 rounded-full font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Search'}
          </button>
        </form>

        {/* Error State */}
        {error && (
          <div className="max-w-xl mx-auto w-full bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 text-red-700 animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        {/* Results */}
        {data && (
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 flex-1 flex flex-col">
            <div className="bg-slate-900 p-6 text-white">
              <div className="flex justify-between items-start">
                <div>
                   <h3 className="text-2xl font-bold italic font-serif tracking-wide">{data.name}</h3>
                   <span className="inline-block mt-2 px-3 py-1 bg-slate-800 rounded-full text-xs font-medium text-indigo-200 border border-slate-700">
                     {data.family}
                   </span>
                </div>
                <div className={`px-4 py-2 rounded-lg font-bold border ${data.gram.includes('Positive') || data.gram.includes('GPC') || data.gram.includes('GPB') ? 'bg-purple-900 border-purple-700 text-purple-100' : 'bg-pink-900 border-pink-700 text-pink-100'}`}>
                  {data.gram}
                </div>
              </div>
            </div>

            <div className="p-6 overflow-y-auto">
              <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <TestTube2 className="w-4 h-4" /> Biochemical Profile
              </h4>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                 <TestBadge label="Catalase" value={data.catalase} />
                 <TestBadge label="Oxidase" value={data.oxidase} />
                 <TestBadge label="Coagulase" value={data.coagulase} />
                 <TestBadge label="Indole" value={data.indole} />
                 <TestBadge label="Urea" value={data.urea} />
                 <TestBadge label="TDA" value={data.tda} />
                 <TestBadge label="Citrate (CS)" value={data.citrate} />
                 <TestBadge label="Mannitol" value={data.mannitol} />
                 <TestBadge label="Motility" value={data.motility} />
              </div>

              <div className="mb-6">
                <div className="bg-amber-50 rounded-xl border border-amber-200 p-4">
                  <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block mb-2">Kligler-Hajna (TSI)</span>
                  <div className="flex items-center gap-3">
                    <div className="h-16 w-8 bg-gradient-to-b from-red-500 to-yellow-500 rounded-md border border-amber-300 shadow-sm opacity-80"></div>
                    <p className="text-lg font-mono font-semibold text-amber-900">{data.kligler}</p>
                  </div>
                </div>
              </div>

              {data.notes && (
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Dna className="w-4 h-4" /> Key Characteristics & Notes
                  </h4>
                  <p className="text-slate-700 leading-relaxed">{data.notes}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {!data && !loading && !error && (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-300">
            <Dna className="w-32 h-32 mb-4 opacity-20" />
            <p className="text-sm font-medium">Search for a bacteria to see details</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GermReference;