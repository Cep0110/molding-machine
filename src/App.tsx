 import React, { useState, useEffect, useRef } from 'react';

// --- CONFIGURATION ---
const BACKEND_URL = 'https://yani-321212-me-backend.hf.space';
const GEMINI_API_KEY = ""; 

const SYSTEM_SPECS = {
  HDPE: { temp: 180, cooling: 45, label: "HDPE Polymer", status: "Optimal viscosity locked. 180°C calibration profile active." },
  PP: { temp: 220, cooling: 60, label: "PP Polymer", status: "High thermal stability profile logged. 220°C calibration active." },
  PAPER: { temp: 0, cooling: 0, label: "CELLULOSE HAZARD", status: "🚨 SAFETY LOCKOUT: Cellulose matrix paper detected." },
  STONE: { temp: 0, cooling: 0, label: "STONE HAZARD", status: "🚨 HARDWARE INTERLOCK: Stone fragment detected." }
};

export default function App() {
  const [controlMode, setControlMode] = useState('manual');
  const [selectedMaterial, setSelectedMaterial] = useState('N/A');
  const [targetSV, setTargetSV] = useState(0);
  const [currentPV, setCurrentPV] = useState(24.0);
  const [coolingTime, setCoolingTime] = useState(0);
  const [statusMessage, setStatusMessage] = useState('System standing by.');
  const [isRelayActive, setIsRelayActive] = useState(false);
  const [isAlarmActive, setIsAlarmActive] = useState(false);
  const [pvHistory, setPvHistory] = useState(Array(25).fill(24.0));
  const [svHistory, setSvHistory] = useState(Array(25).fill(0.0));

  // Simulation Loop
  useEffect(() => {
    const timer = setInterval(() => {
      let nextPV = currentPV;
      if (targetSV > 0) {
        if (currentPV < targetSV) {
          nextPV += Math.min((targetSV - currentPV) * 0.12, 5);
          setIsRelayActive(true);
        } else {
          nextPV = targetSV + (Math.random() - 0.5) * 1.5;
          setIsRelayActive(Math.random() > 0.6);
        }
      } else {
        nextPV = currentPV > 24.5 ? currentPV - 0.5 : 24.0;
        setIsRelayActive(false);
      }
      setCurrentPV(parseFloat(nextPV.toFixed(2)));
      setPvHistory(prev => [...prev.slice(1), parseFloat(nextPV.toFixed(2))]);
      setSvHistory(prev => [...prev.slice(1), targetSV]);
    }, 1000);
    return () => clearInterval(timer);
  }, [targetSV, currentPV]);

  const selectMaterialProfile = (profileKey) => {
    const spec = SYSTEM_SPECS[profileKey];
    setTargetSV(spec.temp);
    setSelectedMaterial(spec.label);
    setCoolingTime(spec.cooling);
    setStatusMessage(spec.status);
    setIsAlarmActive(profileKey === 'PAPER' || profileKey === 'STONE');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 font-sans">
      <header className="max-w-7xl mx-auto mb-8 border-b border-slate-800 pb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-white">POLYSMART DIGITAL COCKPIT <span className="text-amber-500 text-sm">G11</span></h1>
          <p className="text-xs text-slate-400 font-mono">AASTU BLOCK 57 // RETEX INTEGRATION</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Control Section */}
        <section className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="font-bold mb-4 uppercase font-mono">Control Mode</h3>
            <div className="flex gap-2 mb-6">
              <button onClick={() => setControlMode('manual')} className={`px-4 py-2 rounded ${controlMode === 'manual' ? 'bg-amber-500 text-black' : 'bg-slate-800'}`}>Manual</button>
              <button onClick={() => setControlMode('vision')} className={`px-4 py-2 rounded ${controlMode === 'vision' ? 'bg-amber-500 text-black' : 'bg-slate-800'}`}>AI Vision</button>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {Object.keys(SYSTEM_SPECS).map(key => (
                <button key={key} onClick={() => selectMaterialProfile(key)} className="border border-slate-700 p-4 rounded-xl hover:bg-slate-800">
                  <div className="text-sm font-bold">{key}</div>
                  <div className="text-xs text-slate-400">{SYSTEM_SPECS[key].temp}°C</div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="font-bold mb-4 font-mono">Hardware Status</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-black p-4 rounded border border-slate-800">
                <div className="text-red-500 font-mono text-2xl">{Math.round(currentPV)}°C</div>
                <div className="text-[10px] text-slate-500 uppercase">Process Value</div>
              </div>
              <div className="bg-black p-4 rounded border border-slate-800">
                <div className="text-emerald-500 font-mono text-2xl">{targetSV}°C</div>
                <div className="text-[10px] text-slate-500 uppercase">Setpoint</div>
              </div>
            </div>
          </div>
        </section>

        {/* Dashboard/Visualization */}
        <section className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-64">
            <h3 className="font-bold mb-4 font-mono uppercase">PID Telemetry</h3>
            <div className="h-40 bg-slate-950 rounded border border-slate-800"></div>
          </div>
          
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="font-bold mb-2 font-mono uppercase">System Log</h3>
            <div className="p-4 bg-slate-950 rounded text-sm text-slate-300 font-mono border border-slate-800">
              {statusMessage}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
