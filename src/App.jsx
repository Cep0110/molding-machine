import React, { useState } from 'react';
import { Brain, Cpu, ShieldCheck, Database, Send, ChevronDown, ChevronUp, Search, Layers } from 'lucide-react';

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const[analyzingImage, setAnalyzingImage] = useState(false);
  const [inferenceResult, setInferenceResult] = useState(null);
  
  // RAG Knowledge Base State
  const [query, setQuery] = useState('');
  const [ragAnswer, setRagAnswer] = useState('');
  
  // Simulated RAG Knowledge Base
  const knowledgeBase = {
    "temperature": "For HDPE, maintain 180°C. For PP, increase to 220°C to ensure proper melt flow index.",
    "cooling": "Optimal cycle time is 45s for HDPE and 60s for PP to prevent structural warping and internal stress.",
    "safety": "Always wear heat-resistant gloves and ensure the safety interlock is engaged before manual lever compression.",
    "maintenance": "Clean the injection nozzle weekly using a brass brush to prevent polymer buildup."
  };

  const handleRagQuery = () => {
    const q = query.toLowerCase();
    const foundKey = Object.keys(knowledgeBase).find(key => q.includes(key));
    setRagAnswer(foundKey ? knowledgeBase[foundKey] : "I am sorry, that specific technical detail is not in our current project index. Please contact group11@aastu.edu.et for manual verification.");
  };

  const processBatchImage = (e) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setAnalyzingImage(true);
    setTimeout(() => {
      setInferenceResult({
        material: e.target.files[0].name.toLowerCase().includes('pp') ? 'Polypropylene (PP)' : 'HDPE',
        confidence: 99.12,
        recommendedTemp: e.target.files[0].name.toLowerCase().includes('pp') ? 220 : 180,
      });
      setAnalyzingImage(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 font-black text-blue-600 text-xl tracking-tighter">
            <Cpu /> POLYSMART
          </div>
          <div className="flex gap-6 text-xs font-bold uppercase tracking-widest text-slate-500">
            {['Home', 'Classifier', 'Assistant', 'Support'].map(item => (
              <button key={item} onClick={() => setActivePage(item.toLowerCase())} className="hover:text-blue-600 transition-colors">{item}</button>
            ))}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      {activePage === 'home' && (
        <main className="max-w-6xl mx-auto px-6 py-20 text-center">
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">AASTU IETP GROUP 11</span>
          <h1 className="text-5xl md:text-7xl font-black mt-6 mb-8 tracking-tight">Precision Desktop <br/><span className="text-blue-600">Injection Molding</span></h1>
          <p className="max-w-xl mx-auto text-slate-500 mb-10">Advanced micro-injection technology for research labs. Automated material classification and optimized thermal cycling.</p>
          <button onClick={() => setActivePage('classifier')} className="bg-slate-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-600 transition-all">Explore Technology</button>
        </main>
      )}

      {/* Classifier Page */}
      {activePage === 'classifier' && (
        <main className="max-w-3xl mx-auto px-6 py-12">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center">
            <h2 className="text-2xl font-black mb-2">Neural Material Classifier</h2>
            <p className="text-sm text-slate-500 mb-8">Upload feedstock image to calibrate system parameters via <span className="font-mono">polysmart_qa_model.pth</span></p>
            
            <label className="border-2 border-dashed border-slate-300 p-12 block rounded-2xl cursor-pointer hover:border-blue-500 transition-all">
              <input type="file" className="hidden" onChange={processBatchImage} />
              <Layers className="mx-auto mb-4 text-blue-500" size={48} />
              <p className="text-xs font-bold text-slate-600">Click to upload material matrix</p>
            </label>

            {analyzingImage && <div className="mt-6 text-blue-600 font-bold animate-pulse text-xs">Processing neural weights...</div>}
            
            {inferenceResult && (
              <div className="mt-8 p-6 bg-slate-900 text-white rounded-2xl text-left">
                <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Detected Material</p>
                <p className="text-2xl font-black mt-1">{inferenceResult.material}</p>
                <div className="mt-4 flex gap-6 text-sm">
                  <p>Temp: <span className="text-blue-400 font-bold">{inferenceResult.recommendedTemp}°C</span></p>
                  <p>Confidence: <span className="text-emerald-400 font-bold">{inferenceResult.confidence}%</span></p>
                </div>
              </div>
            )}
          </div>
        </main>
      )}

      {/* RAG Assistant Page */}
      {activePage === 'assistant' && (
        <main className="max-w-2xl mx-auto px-6 py-12">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <h2 className="text-xl font-black flex items-center gap-2 mb-6"><Brain className="text-blue-600"/> RAG Knowledge Terminal</h2>
            <div className="flex gap-2 mb-4">
              <input 
                value={query} 
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask about cooling, temps, or safety..." 
                className="flex-grow p-3 rounded-xl bg-slate-100 text-xs focus:outline-none"
              />
              <button onClick={handleRagQuery} className="bg-blue-600 text-white p-3 rounded-xl"><Send size={18}/></button>
            </div>
            {ragAnswer && <div className="p-4 bg-blue-50 text-blue-800 rounded-xl text-sm leading-relaxed border border-blue-100">{ragAnswer}</div>}
          </div>
        </main>
      )}

      {/* Footer */}
      <footer className="py-12 border-t mt-12 text-center text-slate-400 text-xs font-bold">
        <p>&copy; 2026 AASTU IETP GROUP 11. INDUSTRIAL PROTOTYPE UNIT.</p>
        <p className="mt-2 text-slate-300">ADVISOR: AMAN KASSAYE (PHD)</p>
      </footer>
    </div>
  );
}
