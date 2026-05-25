 import React, { useState } from 'react';
import { Brain, Cpu, ShieldCheck, Database, Send, Upload, ChevronRight, Activity } from 'lucide-react';
import { classifyMaterial, queryKnowledgeBase } from './services/api';

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const[loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [ragQuery, setRagQuery] = useState('');
  const [ragResult, setRagResult] = useState('');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setLoading(true);
    try {
      const data = await classifyMaterial(e.target.files[0]);
      setResult(data);
    } catch (err) { alert("Failed to connect to backend model."); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Professional Navbar */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold tracking-tight flex items-center gap-2 text-blue-900">
            <Activity className="text-blue-600" /> POLYSMART-11
          </h1>
          <div className="flex gap-8 text-xs font-bold uppercase tracking-wider text-slate-600">
            {['Home', 'Classifier', 'Knowledge-Base', 'Dashboard'].map(i => (
              <button key={i} onClick={() => setActivePage(i.toLowerCase())} className="hover:text-blue-600 transition-colors">
                {i}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Landing Hero Section */}
      {activePage === 'home' && (
        <main className="max-w-7xl mx-auto px-8 py-24">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-blue-600 font-bold text-sm tracking-widest uppercase">Industrial Innovation</span>
              <h1 className="text-6xl font-black mt-4 mb-6 leading-tight">Advanced Injection Molding <br/>Intelligence</h1>
              <p className="text-lg text-slate-600 mb-8">
                Optimizing polymer production through AI-driven material classification and intelligent RAG-based technical retrieval systems. Built by IETP Group 11.
              </p>
              <button onClick={() => setActivePage('classifier')} className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all">
                Launch System Portal <ChevronRight size={18} />
              </button>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl">
              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <Brain className="text-blue-500 mt-1" />
                  <div>
                    <h4 className="font-bold">PyTorch Integration</h4>
                    <p className="text-sm text-slate-500">Real-time inference using fine-tuned model weights (polysmart_qa_model.pth).</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <Database className="text-blue-500 mt-1" />
                  <div>
                    <h4 className="font-bold">RAG Retrieval</h4>
                    <p className="text-sm text-slate-500">Vector database support for instant technical documentation access.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* Classifier Integration */}
      {activePage === 'classifier' && (
        <main className="max-w-4xl mx-auto px-8 py-16">
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center">
            <h2 className="text-3xl font-black mb-2">Material Inference Module</h2>
            <p className="text-slate-500 mb-10">Direct link to backend classification inference.</p>
            
            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-slate-300 rounded-3xl cursor-pointer hover:bg-slate-50 transition-all">
              <Upload className="mb-4 text-blue-500" size={40} />
              <span className="font-bold">Upload Feedstock Matrix</span>
              <input type="file" className="hidden" onChange={handleFileUpload} />
            </label>
            
            {loading && <div className="mt-8 font-bold text-blue-600 animate-pulse">Running forward pass...</div>}
          </div>
        </main>
      )}

      {/* RAG Knowledge Page */}
      {activePage === 'knowledge-base' && (
        <main className="max-w-3xl mx-auto px-8 py-16">
          <div className="bg-slate-900 text-white p-12 rounded-3xl">
            <h2 className="text-2xl font-black mb-6">Technical RAG Assistant</h2>
            <div className="flex gap-4 mb-8">
              <input 
                className="flex-grow p-4 rounded-xl bg-slate-800 text-white focus:outline-none"
                placeholder="Ask technical questions..."
                value={ragQuery}
                onChange={(e) => setRagQuery(e.target.value)}
              />
              <button onClick={async () => setRagResult(await queryKnowledgeBase(ragQuery))} className="bg-blue-600 p-4 rounded-xl">
                <Send />
              </button>
            </div>
            {ragResult && <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">{ragResult}</div>}
          </div>
        </main>
      )}
    </div>
  );
}
