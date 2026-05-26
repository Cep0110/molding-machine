import React, { useState, useEffect, useRef } from 'react';

// ==========================================
// 1. CONFIGURATION & CONSTANTS
// ==========================================
const BACKEND_URL = 'https://yani-321212-me-backend.hf.space';
const GEMINI_API_KEY = ""; // Managed securely by the runtime environment

// System specification presets
const SYSTEM_SPECS = {
  HDPE: { temp: 180, cooling: 45, label: "HDPE Polymer", status: "Optimal viscosity locked. 180°C calibration profile active." },
  PP: { temp: 220, cooling: 60, label: "PP Polymer", status: "High thermal stability profile logged. 220°C calibration active." },
  PAPER: { temp: 0, cooling: 0, label: "CELLULOSE HAZARD", status: "🚨 SAFETY LOCKOUT: Cellulose matrix paper detected. Power disconnected from heating bands." },
  STONE: { temp: 0, cooling: 0, label: "STONE HAZARD", status: "🚨 HARDWARE INTERLOCK: High hardness mineral fragment detected. Plunger locked to prevent scarring." }
};

export default function App() {
  // --- CORE OPERATIONAL STATE ---
  const [controlMode, setControlMode] = useState('manual'); // 'manual' or 'vision'
  const [selectedMaterial, setSelectedMaterial] = useState('N/A');
  const [targetSV, setTargetSV] = useState(0);
  const [currentPV, setCurrentPV] = useState(24.0); // Room temperature baseline
  const [coolingTime, setCoolingTime] = useState(0);
  const [statusMessage, setStatusMessage] = useState('System standing by. Choose a material profile to initialize the thermodynamic loop.');
  const [isRelayActive, setIsRelayActive] = useState(false);
  const [isAlarmActive, setIsAlarmActive] = useState(false);

  // --- CONNECTIVITY STATES ---
  const [backendConnected, setBackendConnected] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);

  // --- VISION SCANNER STATES ---
  const [analyzingImage, setAnalyzingImage] = useState(false);
  const [selectedImagePreview, setSelectedImagePreview] = useState(null);
  const [visionError, setVisionError] = useState('');

  // --- CHART TELEMETRY QUEUES ---
  const [pvHistory, setPvHistory] = useState(Array(25).fill(24.0));
  const [svHistory, setSvHistory] = useState(Array(25).fill(0.0));

  // --- AI CHATBOT STATES ---
  const [chatMessages, setChatMessages] = useState([
    { sender: 'assistant', text: "Hello! I am the Polysmart R&D Assistant. Ask me anything about the Group 11 tabletop molding machine, REX-C700 PID controller settings, K-Type thermocouples, or HDPE/PP melting properties!" }
  ]);
  const [userQuery, setUserQuery] = useState('');
  const [generatingResponse, setGeneratingResponse] = useState(false);
  const chatBottomRef = useRef(null);

  // ==========================================
  // 2. HEALTH CHECK & HEARTBEAT MONITOR
  // ==========================================
  useEffect(() => {
    const verifySystemHeartbeat = async () => {
      try {
        const ping = await fetch(`${BACKEND_URL}/`);
        if (ping.ok) {
          setBackendConnected(true);
        } else {
          setBackendConnected(false);
        }
      } catch (err) {
        setBackendConnected(false);
      } finally {
        setCheckingStatus(false);
      }
    };

    verifySystemHeartbeat();
    const interval = setInterval(verifySystemHeartbeat, 10000);
    return () => clearInterval(interval);
  }, []);

  // ==========================================
  // 3. MECHATRONIC THERMAL PID SIMULATION LOOP
  // ==========================================
  useEffect(() => {
    const timer = setInterval(() => {
      let nextPV = currentPV;
      
      if (targetSV > 0) {
        if (currentPV < targetSV) {
          // Model a 1.5 kW heat gradient curve with exponential decay as we approach setpoint
          let delta = (targetSV - currentPV) * 0.12;
          nextPV += Math.max(delta, 1.8);
          setIsRelayActive(true);
        } else {
          // Add PID steady-state oscillations around setpoint
          const noise = (Math.random() - 0.5) * 1.5;
          nextPV = targetSV + noise;
          
          // Relay cycling representation
          setIsRelayActive(Math.random() > 0.6);
        }
      } else {
        // Natural ambient thermal cooling back to standard Ethiopian environment room temperature
        if (currentPV > 24.5) {
          nextPV -= (currentPV - 24.0) * 0.05;
        } else {
          nextPV = 24.0;
        }
        setIsRelayActive(false);
      }

      const cleanPV = parseFloat(nextPV.toFixed(2));
      setCurrentPV(cleanPV);

      // Scroll telemetry queues
      setPvHistory(prev => [...prev.slice(1), cleanPV]);
      setSvHistory(prev => [...prev.slice(1), targetSV]);

    }, 1000);

    return () => clearInterval(timer);
  }, [targetSV, currentPV]);

  // Scroll chat automatically to latest message
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // ==========================================
  // 4. OPERATOR INPUT COMMAND HANDLER
  // ==========================================
  const selectMaterialProfile = (profileKey) => {
    const spec = SYSTEM_SPECS[profileKey];
    if (!spec) return;

    setTargetSV(spec.temp);
    setSelectedMaterial(spec.label);
    setCoolingTime(spec.cooling);
    setStatusMessage(spec.status);

    if (profileKey === 'PAPER' || profileKey === 'STONE') {
      setIsAlarmActive(true);
    } else {
      setIsAlarmActive(false);
    }
  };

  // ==========================================
  // 5. BASE64 UTILITY FOR VISION INGESTION
  // ==========================================
  const makeBlobFromBase64 = (base64DataUrl) => {
    const parts = base64DataUrl.split(',');
    const byteString = atob(parts[1]);
    const mimeString = parts[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  const handleVisionImageUpload = async (e) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    if (!backendConnected) {
      setVisionError('❌ Aborted: Connect backend first to evaluate visual profiles.');
      return;
    }

    const file = e.target.files[0];
    setSelectedImagePreview(URL.createObjectURL(file));
    setAnalyzingImage(true);
    setVisionError('');

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      try {
        const base64Data = reader.result;
        const imageBlob = makeBlobFromBase64(base64Data);
        const formData = new FormData();
        formData.append('data', imageBlob, 'feedstock_sample.jpg');

        const response = await fetch(`${BACKEND_URL}/api/predict`, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) throw new Error(`HTTP Matrix error code: ${response.status}`);

        const json = await response.json();
        if (!json || !json.data || !Array.isArray(json.data)) {
          throw new Error("Invalid response payload received from Hugging Face model space.");
        }

        const rawData = json.data[0];
        const data = Array.isArray(rawData) ? rawData[0] : rawData;

        if (data.error) {
          setVisionError(data.error);
        } else {
          // Sync mechatronic loop with deep learning classifier outcomes
          const mappedKey = data.material.includes('HDPE') ? 'HDPE' : 'PP';
          selectMaterialProfile(mappedKey);
          setStatusMessage(`✅ MACHINE VISION INFERENCE CONFIRMED: ${data.confidence}% confidence match via polysmart_qa_model.pth. ${SYSTEM_SPECS[mappedKey].status}`);
        }
      } catch (err) {
        setVisionError('❌ Exception: Connection to neural layer timed out. Reverting to safe manual operator inputs.');
        console.error(err);
      } finally {
        setAnalyzingImage(false);
      }
    };
  };

  // ==========================================
  // 6. EXPONENTIAL BACKOFF GEMINI API CONNECTOR
  // ==========================================
  const fetchWithBackoff = async (url, options, retries = 5, delay = 1000) => {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        if (response.status === 429 || response.status >= 500) {
          if (retries > 0) {
            await new Promise(resolve => setTimeout(resolve, delay));
            return fetchWithBackoff(url, options, retries - 1, delay * 2);
          }
        }
        throw new Error(`HTTP Error: ${response.status}`);
      }
      return response;
    } catch (error) {
      if (retries > 0) {
        await new Promise(resolve => setTimeout(resolve, delay));
        return fetchWithBackoff(url, options, retries - 1, delay * 2);
      }
      throw error;
    }
  };

  const submitChatQuery = async (e) => {
    e.preventDefault();
    if (!userQuery.trim() || generatingResponse) return;

    const queryText = userQuery;
    setChatMessages(prev => [...prev, { sender: 'user', text: queryText }]);
    setUserQuery('');
    setGeneratingResponse(true);

    const systemPrompt = `You are the Polysmart R&D AI Assistant for Group 11 at AASTU Block 57.
    You assist operators with the Mini-Scale Plastic Injection Molding Machine.
    Technical Specifications & Parameters:
    - Shot Capacity: 10g maximum shot volume.
    - Power Rating: Maximum draw 1.5 kW (safely runs on standard single-phase 220V/50Hz residential power lines).
    - Economic Constraint: Kept strictly under 40,000 ETB budget threshold by utilizing locally sourced mild steel for the 1m x 1m support frame.
    - Controller: REX-C700 Digital PID Controller.
    - Temperature Sensor: K-Type Thermocouple (Chromel/Alumel).
    - Materials:
      * HDPE (High-Density Polyethylene) -> Melting point: 180°C, Cooling cycle: 45s.
      * PP (Polypropylene) -> Melting point: 220°C, Cooling cycle: 60s.
      * Hazards: Paper/Stone (Safety cutoff triggered, setpoint falls to 0°C to protect mechanical plunger from scarring/clogging).
    - Platform Architecture: Runs a fast Vercel frontend mapped to high-efficiency Hugging Face backend Spaces.
    Your tone is highly professional, technical, encouraging, and focused on sustainable, localized Ethiopian R&D and import substitution. Keep answers concise.`;

    try {
      const payload = {
        contents: [{ parts: [{ text: queryText }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] }
      };

      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${GEMINI_API_KEY}`;
      
      const response = await fetchWithBackoff(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const json = await response.json();
      const answer = json.candidates?.[0]?.content?.parts?.[0]?.text || "No response received. Please try again.";
      setChatMessages(prev => [...prev, { sender: 'assistant', text: answer }]);
    } catch (err) {
      console.error(err);
      setChatMessages(prev => [...prev, { sender: 'assistant', text: "⚠️ Technical response routing timeout. Please verify network configuration or type again." }]);
    } finally {
      setGeneratingResponse(false);
    }
  };

  // Helper to draw clean reactive responsive line graphs using native React SVGs
  const renderSVGTelemetryChart = () => {
    const width = 500;
    const height = 180;
    const padding = 25;
    
    // Scale ranges
    const maxTemp = 260;
    const dataLength = pvHistory.length;

    const getX = (index) => padding + (index * (width - padding * 2) / (dataLength - 1));
    const getY = (val) => height - padding - (val * (height - padding * 2) / maxTemp);

    // Generate Path points
    let pvPoints = "";
    let svPoints = "";
    for (let i = 0; i < dataLength; i++) {
      pvPoints += `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(pvHistory[i])} `;
      svPoints += `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(svHistory[i])} `;
    }

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full text-slate-400">
        {/* Grid lines */}
        {[50, 100, 150, 200, 250].map((t) => (
          <g key={t}>
            <line x1={padding} y1={getY(t)} x2={width - padding} y2={getY(t)} stroke="#1e293b" strokeWidth="1" strokeDasharray="3,3" />
            <text x={padding - 5} y={getY(t) + 3} textAnchor="end" className="text-[9px] fill-slate-500 font-mono">{t}°</text>
          </g>
        ))}

        {/* Legend */}
        <text x={padding} y={padding - 5} className="text-[9px] fill-slate-400 font-mono">Process Value (PV-Thermocouple)</text>
        <line x1={padding + 160} y1={padding - 8} x2={padding + 180} y2={padding - 8} stroke="#f97316" strokeWidth="2" />
        <text x={padding + 190} y={padding - 5} className="text-[9px] fill-slate-400 font-mono">Set Value (SV-Target)</text>
        <line x1={padding + 310} y1={padding - 8} x2={padding + 330} y2={padding - 8} stroke="#10b981" strokeWidth="1.5" strokeDasharray="2,2" />

        {/* Data Paths */}
        {svPoints && <path d={svPoints} fill="none" stroke="#10b981" strokeWidth="1.5" strokeDasharray="4,3" />}
        {pvPoints && <path d={pvPoints} fill="none" stroke="#f97316" strokeWidth="2.5" className="transition-all duration-300" />}
      </svg>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 font-sans">
      
      {/* HEADER SECTION */}
      <header className="max-w-7xl mx-auto mb-6 border-b border-slate-800 pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-amber-500 to-amber-600 p-2.5 rounded-xl shadow-lg shadow-amber-500/10">
            {/* AASTU Shield Design representation logo */}
            <svg className="w-8 h-8 text-slate-950" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9s2.015-9 4.5-9M3 9.75V9a9 9 0 0118 0v.75" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              POLYSMART DIGITAL COCKPIT <span className="text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-0.5 rounded-full font-mono">GROUP 11</span>
            </h1>
            <p className="text-[10px] sm:text-xs text-slate-400 tracking-wider font-mono">AASTU BLOCK 57 // INTEGRATED ENGINEERING TEAM PROJECT</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-mono text-slate-300">VERCEL DEPLOYED</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 flex items-center gap-2">
            {checkingStatus ? (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-slate-500 animate-ping"></span>
                <span className="text-xs font-mono text-slate-300">SCANNING HF...</span>
              </>
            ) : backendConnected ? (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-mono text-emerald-400">HF BACKEND: LIVE</span>
              </>
            ) : (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                <span className="text-xs font-mono text-red-400">HF BACKEND: OFFLINE</span>
              </>
            )}
          </div>
        </div>
      </header>

      {/* METADATA OVERVIEW */}
      <section className="max-w-7xl mx-auto mb-6 grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden flex flex-col justify-center">
          <div className="absolute -right-12 -top-12 w-28 h-28 bg-amber-500/5 rounded-full blur-2xl"></div>
          <h2 className="text-xs font-bold text-amber-500 tracking-wider uppercase font-mono mb-1">PROTOTYPE CLASSIFICATION METADATA</h2>
          <h3 className="text-base sm:text-lg font-black text-white mb-2 leading-tight">Mini-Scale Plastic Injection Molding System with Distributed Cloud Telemetry</h3>
          <p className="text-xs text-slate-400 leading-relaxed max-w-3xl">
            Optimized for a <span className="text-amber-400 font-bold">10-gram max shot capacity</span> using a locally fabricated <span className="text-slate-200 font-bold">1m x 1m mild steel support frame</span>. Operating within a strict budget ceiling of <span className="text-amber-400 font-bold">40,000 ETB</span> and powered under <span className="text-amber-400 font-bold">1.5 kW</span>, this prototype empowers local innovators by enabling circular economic plastic recycling directly on standard residential single-phase utility grids.
          </p>
        </div>

        <div className="md:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <h3 className="text-xs font-bold text-slate-400 tracking-wider uppercase font-mono mb-2">UNITED NATIONS SDG ALIGNMENT</h3>
          <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono">
            <div className="bg-amber-500/5 border border-amber-500/20 p-2 rounded-xl">
              <span className="text-amber-400 font-black block">SDG 8</span>
              <span className="text-[9px] text-slate-400 uppercase">Decent Work</span>
            </div>
            <div className="bg-orange-500/5 border border-orange-500/20 p-2 rounded-xl">
              <span className="text-orange-400 font-black block">SDG 9</span>
              <span className="text-[9px] text-slate-400 uppercase">Infrastructure</span>
            </div>
            <div className="bg-yellow-500/5 border border-yellow-500/20 p-2 rounded-xl">
              <span className="text-yellow-400 font-black block">SDG 11</span>
              <span className="text-[9px] text-slate-400 uppercase">Cities</span>
            </div>
            <div className="bg-emerald-500/5 border border-emerald-500/20 p-2 rounded-xl">
              <span className="text-emerald-400 font-black block">SDG 12</span>
              <span className="text-[9px] text-slate-400 uppercase">Circular Econ</span>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN COCKPIT DECK */}
      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: MANUAL INPUT & REX-C700 (45%) */}
        <section className="lg:col-span-5 flex flex-col gap-6">
          
          {/* USER SELECTION DECK */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-slate-200 tracking-wider uppercase font-mono">Control Loop Ingestion Mode</h3>
                <p className="text-[11px] text-slate-500">Determine how material properties are mapped to the PID cylinder loops.</p>
              </div>
              <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
                <button 
                  onClick={() => setControlMode('manual')}
                  className={`px-3 py-1 text-[10px] font-mono rounded transition-all ${controlMode === 'manual' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
                >
                  Manual Override
                </button>
                <button 
                  onClick={() => setControlMode('vision')}
                  className={`px-3 py-1 text-[10px] font-mono rounded transition-all ${controlMode === 'vision' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
                >
                  AI Vision Scan
                </button>
              </div>
            </div>

            {controlMode === 'manual' ? (
              <div className="grid grid-cols-2 gap-3">
                {/* HDPE */}
                <button 
                  onClick={() => selectMaterialProfile('HDPE')}
                  className={`border p-4 rounded-xl text-left transition relative group ${targetSV === 180 ? 'border-emerald-500 bg-emerald-950/15' : 'border-slate-800 bg-slate-950 hover:border-slate-700'}`}
                >
                  <span className="text-2xl block mb-1">♻️</span>
                  <span className="text-sm font-black text-slate-200 block">HDPE Profile</span>
                  <span className="text-[10px] font-mono text-emerald-400 block mt-0.5">Target: 180°C</span>
                </button>

                {/* PP */}
                <button 
                  onClick={() => selectMaterialProfile('PP')}
                  className={`border p-4 rounded-xl text-left transition relative group ${targetSV === 220 ? 'border-cyan-500 bg-cyan-950/15' : 'border-slate-800 bg-slate-950 hover:border-slate-700'}`}
                >
                  <span className="text-2xl block mb-1">🥤</span>
                  <span className="text-sm font-black text-slate-200 block">PP Profile</span>
                  <span className="text-[10px] font-mono text-cyan-400 block mt-0.5">Target: 220°C</span>
                </button>

                {/* PAPER HAZARD */}
                <button 
                  onClick={() => selectMaterialProfile('PAPER')}
                  className={`border p-4 rounded-xl text-left transition relative group ${selectedMaterial.includes('CELLULOSE') ? 'border-red-500 bg-red-950/15' : 'border-slate-800 bg-slate-950 hover:border-slate-700'}`}
                >
                  <span className="text-2xl block mb-1">📄</span>
                  <span className="text-sm font-black text-slate-200 block">Paper Fiber</span>
                  <span className="text-[10px] font-mono text-red-400 block mt-0.5">Safety Cutoff</span>
                </button>

                {/* STONE HAZARD */}
                <button 
                  onClick={() => selectMaterialProfile('STONE')}
                  className={`border p-4 rounded-xl text-left transition relative group ${selectedMaterial.includes('STONE') ? 'border-red-500 bg-red-950/15' : 'border-slate-800 bg-slate-950 hover:border-slate-700'}`}
                >
                  <span className="text-2xl block mb-1">🪨</span>
                  <span className="text-sm font-black text-slate-200 block">Mineral / Stone</span>
                  <span className="text-[10px] font-mono text-red-400 block mt-0.5">Plunger Lock</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-slate-800 rounded-xl p-4 bg-slate-950 text-center flex flex-col items-center justify-center min-h-[140px] relative">
                  {selectedImagePreview ? (
                    <img src={selectedImagePreview} alt="Target frame" className="max-h-28 object-contain rounded" />
                  ) : (
                    <div>
                      <span className="text-3xl block mb-2">📸</span>
                      <p className="text-xs text-slate-400 font-mono">Upload sample photograph of raw feedstock flakes</p>
                    </div>
                  )}
                  {analyzingImage && (
                    <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center">
                      <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                      <span className="text-[10px] font-mono text-amber-400">CLASSIFYING RAW MATRIX ON HUGGING FACE...</span>
                    </div>
                  )}
                </div>

                {visionError && (
                  <div className="bg-red-950/30 border border-red-500/30 text-red-400 text-[11px] p-3 rounded-lg font-mono leading-normal">
                    {visionError}
                  </div>
                )}

                <label className={`block w-full text-slate-950 font-bold text-center text-xs py-2.5 px-4 rounded-xl cursor-pointer transition ${backendConnected ? 'bg-amber-500 hover:bg-amber-400' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}>
                  Select Material Image For Inference
                  <input type="file" accept="image/*" onChange={handleVisionImageUpload} className="hidden" disabled={analyzingImage || !backendConnected} />
                </label>
              </div>
            )}
          </div>

          {/* REX-C700 HARDWARE EMULATOR BLOCK */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <h3 className="text-sm font-bold text-slate-400 tracking-wider uppercase font-mono mb-3 flex items-center justify-between">
              <span>REX-C700 Controller Emulation</span>
              <span className="text-[10px] text-slate-500 font-mono bg-slate-950 border border-slate-800 px-2 py-0.5 rounded">Hardware Layer</span>
            </h3>

            <div className="bg-neutral-900 border-4 border-neutral-800 p-4 rounded-xl shadow-inner flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                {/* PV PANEL */}
                <div className="bg-black/90 p-3 rounded-lg border border-neutral-800 flex flex-col items-center">
                  <span className="text-[8px] text-red-500 font-bold uppercase tracking-widest font-mono">PV (K-Type Thermocouple)</span>
                  <span className="text-3xl font-bold font-mono tracking-widest text-red-500">{Math.round(currentPV)}°C</span>
                </div>
                {/* SV PANEL */}
                <div className="bg-black/90 p-3 rounded-lg border border-neutral-800 flex flex-col items-center">
                  <span className="text-[8px] text-emerald-500 font-bold uppercase tracking-widest font-mono">SV (Setpoint Target)</span>
                  <span className="text-3xl font-bold font-mono tracking-widest text-emerald-500">{targetSV}°C</span>
                </div>
              </div>

              {/* CONTROLLER INDICATORS */}
              <div className="flex justify-around items-center bg-black/40 py-2.5 px-4 rounded border border-neutral-800/50">
                <div className="flex items-center gap-1.5">
                  <span className={`w-2.5 h-2.5 rounded-full border transition ${isRelayActive ? 'bg-orange-500 border-orange-400 shadow-md shadow-orange-500/50' : 'bg-slate-800 border-neutral-700'}`}></span>
                  <span className="text-[10px] font-mono text-neutral-400 font-bold">OUT (Relay)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`w-2.5 h-2.5 rounded-full border transition ${isAlarmActive ? 'bg-red-600 border-red-400 animate-pulse shadow-md shadow-red-500/50' : 'bg-slate-800 border-neutral-700'}`}></span>
                  <span className="text-[10px] font-mono text-neutral-400 font-bold">ALM</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-emerald-400"></span>
                  <span className="text-[10px] font-mono text-neutral-400 font-bold">AT (Auto)</span>
                </div>
              </div>
            </div>
          </div>

        </section>

        {/* RIGHT COLUMN: GRAPHS & CHATBOT (55%) */}
        <section className="lg:col-span-7 flex flex-col gap-6">
          
          {/* THERMODYNAMIC PID GRAPH CARD */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between min-h-[300px]">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-200 tracking-wider uppercase font-mono">Thermodynamic Stabilization Loop</h3>
                <p className="text-[11px] text-slate-500">Live K-Type Sensor feedback tracking dynamic PID relay output.</p>
              </div>
              <div className="bg-slate-950 border border-slate-800 px-3 py-1 rounded-lg">
                <span className="text-[10px] text-amber-500 block font-mono">Relay Active</span>
              </div>
            </div>

            <div className="relative flex-grow h-44 bg-slate-950 rounded-xl p-2 border border-slate-800">
              {renderSVGTelemetryChart()}
            </div>
          </div>

          {/* MECHATRONIC LOCK STATS & SHOT DELIVERABLES */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col gap-4">
            <h3 className="text-sm font-bold text-slate-400 tracking-wider uppercase font-mono">⚙️ Mechatronic System Lock</h3>
            
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl">
                <span className="text-[9px] text-slate-500 uppercase font-mono block mb-0.5">Identified Matrix</span>
                <span className="text-sm font-black text-amber-400 block truncate">{selectedMaterial}</span>
              </div>
              <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl">
                <span className="text-[9px] text-slate-500 uppercase font-mono block mb-0.5">Barrel Target</span>
                <span className="text-sm font-black text-orange-400 block">{targetSV}°C</span>
              </div>
              <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl">
                <span className="text-[9px] text-slate-500 uppercase font-mono block mb-0.5">Cooling Target</span>
                <span className="text-sm font-black text-cyan-400 block">{coolingTime}s</span>
              </div>
            </div>

            <div className={`border p-3 rounded-xl text-xs font-mono leading-relaxed transition-all ${isAlarmActive ? 'bg-red-950/20 border-red-500/30 text-red-400' : 'bg-slate-950 border-slate-800 text-slate-300'}`}>
              {statusMessage}
            </div>
          </div>

          {/* AI Companion / Technical Assistant Chatbot */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col h-[320px]">
            <h3 className="text-sm font-bold text-slate-200 tracking-wider uppercase font-mono mb-2 flex items-center justify-between">
              <span>💬 R&D Companion Assistant</span>
              <span className="text-[9px] text-slate-500 font-mono">Gemini-2.5 Core</span>
            </h3>

            {/* MESSAGE FEED CONTAINER */}
            <div className="flex-grow overflow-y-auto bg-slate-950 rounded-xl p-3 border border-slate-800 space-y-3 scrollbar-thin scrollbar-thumb-slate-800">
              {chatMessages.map((msg, index) => (
                <div key={index} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  <span className="text-[9px] font-mono text-slate-500 mb-0.5 uppercase tracking-wide">
                    {msg.sender === 'user' ? 'Operator' : 'AI Assistant'}
                  </span>
                  <div className={`p-2.5 rounded-2xl text-xs max-w-[85%] leading-relaxed ${
                    msg.sender === 'user' 
                      ? 'bg-amber-500 text-slate-950 font-medium rounded-tr-none' 
                      : 'bg-slate-900 text-slate-100 rounded-tl-none border border-slate-800'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {generatingResponse && (
                <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono italic">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  Assistant is typing...
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* SEND FORM */}
            <form onSubmit={submitChatQuery} className="mt-3 flex gap-2">
              <input 
                type="text"
                placeholder="Ask about specs, REX-C700, K-Type, PP melting point..."
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                className="flex-grow bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500 transition-all placeholder-slate-600"
              />
              <button 
                type="submit"
                disabled={generatingResponse || !userQuery.trim()}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition duration-150 flex items-center justify-center disabled:opacity-50"
              >
                Send
              </button>
            </form>
          </div>

        </section>

      </main>

      {/* FOOTER MARKETPLACE CAPABILITIES BAR */}
      <footer className="max-w-7xl mx-auto mt-6 grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col justify-center">
          <h3 className="text-xs font-bold text-slate-400 tracking-wider uppercase font-mono mb-3">Molded Product Deliverables Catalog (Marketplace)</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl flex items-center gap-3">
              <span className="text-2xl">🔌</span>
              <div>
                <span className="text-xs font-black text-slate-200 block">Plastic Wall Plugs</span>
                <span className="text-[10px] font-mono text-slate-500 block">45s Cooling // HDPE</span>
              </div>
            </div>
            <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl flex items-center gap-3">
              <span className="text-2xl">⚙️</span>
              <div>
                <span className="text-xs font-black text-slate-200 block">Alignment Spacers</span>
                <span className="text-[10px] font-mono text-slate-500 block">50s Cooling // PP</span>
              </div>
            </div>
            <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl flex items-center gap-3">
              <span className="text-2xl">🎛️</span>
              <div>
                <span className="text-xs font-black text-slate-200 block">Threaded Knurled Caps</span>
                <span className="text-[10px] font-mono text-slate-500 block">60s Cooling // PP</span>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 text-[11px] text-slate-400 font-mono flex flex-col justify-center gap-1 leading-relaxed">
          <div>🛠️ <span className="text-slate-300 font-bold">Local R&D:</span> Custom Fabricated Prototype</div>
          <div>🔌 <span className="text-slate-300 font-bold">Rating:</span> Under 1.5 kW Max Threshold</div>
          <div>💰 <span className="text-slate-300 font-bold">Costing:</span> Under 40,000 ETB Limit</div>
          <div>🏫 <span className="text-slate-300 font-bold">Defense Node:</span> AASTU Block 57, Addis Ababa</div>
        </div>
      </footer>

    </div>
  );
}
