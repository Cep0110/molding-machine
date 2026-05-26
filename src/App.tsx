 import React, { useState, useEffect } from 'react';

// --- CONFIGURATION ---
const SYSTEM_SPECS = {
  HDPE: { temp: 180, cooling: 45, label: "HDPE Polymer", status: "Optimal viscosity locked. 180°C calibration active." },
  PP: { temp: 220, cooling: 60, label: "PP Polymer", status: "High thermal stability profile logged. 220°C calibration active." },
  PAPER: { temp: 0, cooling: 0, label: "CELLULOSE HAZARD", status: "🚨 SAFETY LOCKOUT: Cellulose matrix paper detected." },
  STONE: { temp: 0, cooling: 0, label: "STONE HAZARD", status: "🚨 HARDWARE INTERLOCK: Stone fragment detected." }
};

export default function App() {
  const [controlMode, setControlMode] = useState('manual');
  const [selectedMaterial, setSelectedMaterial] = useState('N/A');
  const [targetSV, setTargetSV] = useState(0);
  const [currentPV, setCurrentPV] = useState(24.0);
  const [statusMessage, setStatusMessage] = useState('System ready. Awaiting input.');

  // Simulation Loop
  useEffect(() => {
    const timer = setInterval(() => {
      let nextPV = currentPV;
      if (targetSV > 0) {
        nextPV = currentPV < targetSV ? nextPV + Math.min((targetSV - currentPV) * 0.12, 5) : targetSV + (Math.random() - 0.5) * 1.5;
      } else {
        nextPV = currentPV > 24.5 ? currentPV - 0.5 : 24.0;
      }
      setCurrentPV(parseFloat(nextPV.toFixed(2)));
    }, 1000);
    return () => clearInterval(timer);
  }, [targetSV, currentPV]);

  const selectMaterialProfile = (profileKey) => {
    const spec = SYSTEM_SPECS[profileKey];
    setTargetSV(spec.temp);
    setSelectedMaterial(spec.label);
    setStatusMessage(spec.status);
  };

  return (
    <div className="min-h-screen bg-[#0a0f1c] text-slate-200 p-8 font-sans selection:bg-blue-500/30">
      <header className="max-w-7xl mx-auto mb-10 border-b border-blue-900/50 pb-8">
        <h1 className="text-3xl font-extrabold tracking-tighter text-blue-100 italic">POLYSMART <span className="text-blue-500">INDUSTRIAL</span></h1>
        <p className="text-blue-400/60 font-mono text-sm tracking-widest mt-1">AASTU GROUP 11 // PID TELEMETRY INTERFACE</p>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Controls */}
        <section className="lg:col-span-2 space-y-8">
          <div className="bg-[#111827] border border-blue-900/30 p-8 rounded-3xl shadow-2xl">
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <span className="w-2 h-6 bg-blue-500 rounded-full"></span> SYSTEM OPERATION
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {Object.keys(SYSTEM_SPECS).map(key => (
                <button 
                  key={key} 
                  onClick={() => selectMaterialProfile(key)}
                  className={`p-6 rounded-2xl border transition-all ${targetSV === SYSTEM_SPECS[key].temp && targetSV !== 0 ? 'bg-blue-600 border-blue-400 shadow-lg shadow-blue-900/20' : 'bg-[#1a2333] border-blue-900/30 hover:border-blue-700'}`}
                >
                  <div className="text-2xl font-black">{key}</div>
                  <div className="text-[10px] opacity-70 mt-1 uppercase tracking-wider">{SYSTEM_SPECS[key].temp}°C</div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-[#111827] border border-blue-900/30 p-8 rounded-3xl">
            <h2 className="text-lg font-bold text-white mb-6">SYSTEM LOG</h2>
            <div className="bg-black p-6 rounded-2xl text-blue-300 font-mono text-sm border border-blue-900/50">
              {statusMessage}
            </div>
          </div>
        </section>

        {/* Status Panels */}
        <section className="space-y-8">
          <div className="bg-blue-950/20 border border-blue-900/50 p-8 rounded-3xl">
            <div className="text-blue-400 text-xs font-mono mb-2 uppercase">Process Value (PV)</div>
            <div className="text-6xl font-black text-white tabular-nums">{Math.round(currentPV)}<span className="text-2xl text-blue-600">°C</span></div>
          </div>

          <div className="bg-[#111827] border border-blue-900/30 p-8 rounded-3xl">
            <div className="text-blue-400 text-xs font-mono mb-2 uppercase">Selected Material</div>
            <div className="text-xl font-bold text-white mb-6">{selectedMaterial}</div>
            
            <div className="flex gap-4">
              <div onClick={() => setControlMode('manual')} className={`flex-1 py-3 text-center rounded-xl font-bold cursor-pointer transition ${controlMode === 'manual' ? 'bg-blue-600' : 'bg-slate-800'}`}>MANUAL</div>
              <div onClick={() => setControlMode('vision')} className={`flex-1 py-3 text-center rounded-xl font-bold cursor-pointer transition ${controlMode === 'vision' ? 'bg-blue-600' : 'bg-slate-800'}`}>AI SCAN</div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
