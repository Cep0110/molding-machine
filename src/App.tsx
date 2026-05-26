import React, { useState, useEffect, useCallback } from 'react';

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
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentPV((prevPV) => {
        let nextPV = prevPV;
        if (targetSV > 0) {
          // PID-like simulation: approach target
          const diff = targetSV - prevPV;
          nextPV = prevPV + (diff * 0.1) + (Math.random() - 0.5) * 0.5;
        } else {
          // Cooling down
          nextPV = prevPV > 24.5 ? prevPV - 0.5 : 24.0;
        }
        return parseFloat(nextPV.toFixed(2));
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [targetSV]);

  const selectMaterialProfile = (profileKey) => {
    const spec = SYSTEM_SPECS[profileKey];
    setTargetSV(spec.temp);
    setSelectedMaterial(spec.label);
    setStatusMessage(spec.status);
    setHistory(prev => [`[${new Date().toLocaleTimeString()}] Material selected: ${spec.label}`, ...prev].slice(0, 5));
  };

  return (
    <div className="min-h-screen bg-[#05070a] text-slate-300 p-4 md:p-8 font-sans selection:bg-blue-500/30">
      <header className="max-w-7xl mx-auto mb-8 border-b border-blue-900/40 pb-6 flex flex-col md:flex-row justify-between items-start md:items-end">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tighter text-blue-50">POLYSMART <span className="text-blue-600">INDUSTRIAL</span></h1>
          <p className="text-blue-400/60 font-mono text-xs tracking-widest mt-1 uppercase">AASTU GROUP 11 // PID TELEMETRY INTERFACE</p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-4 text-xs font-mono">
          <div className="px-3 py-1 rounded bg-blue-950/30 border border-blue-800 text-blue-300">CORE v2.4.0</div>
          <div className="px-3 py-1 rounded bg-emerald-950/30 border border-emerald-800 text-emerald-400">SYSTEM ONLINE</div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Control Section */}
        <section className="lg:col-span-2 space-y-6">
          <div className="bg-[#0b101d] border border-blue-900/30 p-6 rounded-2xl shadow-2xl">
            <h2 className="text-sm font-bold text-blue-200 mb-6 flex items-center gap-2 uppercase tracking-wide">
              <span className="w-1.5 h-4 bg-blue-500 rounded-sm"></span> Material Ingestion Deck
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.keys(SYSTEM_SPECS).map(key => (
                <button 
                  key={key} 
                  onClick={() => selectMaterialProfile(key)}
                  className={`p-4 rounded-xl border transition-all duration-300 group ${targetSV === SYSTEM_SPECS[key].temp && targetSV !== 0 ? 'bg-blue-900/40 border-blue-500' : 'bg-[#151c2e] border-blue-900/30 hover:border-blue-700'}`}
                >
                  <div className="text-xl font-black group-hover:text-white">{key}</div>
                  <div className="text-[10px] opacity-60 mt-1">{SYSTEM_SPECS[key].temp > 0 ? `${SYSTEM_SPECS[key].temp}°C` : "SAFETY LOCK"}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-[#0b101d] border border-blue-900/30 p-6 rounded-2xl">
            <h2 className="text-sm font-bold text-blue-200 mb-4 uppercase tracking-wide">System Log</h2>
            <div className="bg-black/40 p-4 rounded-lg border border-blue-900/20 text-blue-300 font-mono text-xs space-y-2">
              <p className="text-blue-500">{statusMessage}</p>
              {history.map((log, i) => <p key={i} className="opacity-60">{log}</p>)}
            </div>
          </div>
        </section>

        {/* Telemetry Section */}
        <section className="space-y-6">
          <div className="bg-blue-950/20 border border-blue-900/50 p-6 rounded-2xl flex flex-col justify-center items-center text-center">
            <div className="text-blue-400 text-[10px] font-mono mb-1 uppercase tracking-widest">Process Value (PV)</div>
            <div className="text-5xl font-black text-white tabular-nums">{currentPV}°C</div>
            <div className="w-full bg-blue-900/30 h-1 mt-4 rounded-full overflow-hidden">
              <div className="bg-blue-500 h-full transition-all duration-500" style={{ width: `${Math.min((currentPV / 250) * 100, 100)}%` }}></div>
            </div>
          </div>

          <div className="bg-[#0b101d] border border-blue-900/30 p-6 rounded-2xl">
            <div className="text-blue-400 text-[10px] font-mono mb-2 uppercase tracking-widest">Operational Status</div>
            <div className="text-lg font-bold text-white mb-6 tracking-tight">{selectedMaterial}</div>
            
            <div className="flex gap-2">
              <button onClick={() => setControlMode('manual')} className={`flex-1 py-2 text-[11px] uppercase font-bold tracking-widest rounded ${controlMode === 'manual' ? 'bg-blue-600' : 'bg-slate-800'}`}>Manual</button>
              <button onClick={() => setControlMode('vision')} className={`flex-1 py-2 text-[11px] uppercase font-bold tracking-widest rounded ${controlMode === 'vision' ? 'bg-blue-600' : 'bg-slate-800'}`}>AI Scan</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
