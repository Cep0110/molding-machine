import React, { useState, useEffect } from 'react';

export default function App() {
  const [analyzingImage, setAnalyzingImage] = useState(false);
  const [inferenceResult, setInferenceResult] = useState(null);
  const [outOfTopicError, setOutOfTopicError] = useState('');
  const [selectedImagePreview, setSelectedImagePreview] = useState(null);
  const [backendConnected, setBackendConnected] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);

  const BACKEND_URL = 'https://yani-321212-me-backend.hf.space';

  useEffect(() => {
    const verifySystemHeartbeat = async () => {
      try {
        const ping = await fetch(`${BACKEND_URL}/`);
        if (ping.ok) setBackendConnected(true);
        else setBackendConnected(false);
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

  const processBatchImage = async (e) => {
    if (!e.target.files || e.target.files.length === 0) return;
    if (!backendConnected) {
      setOutOfTopicError('❌ Aborted: Hierarchical classification cluster connection down.');
      return;
    }

    const file = e.target.files[0];
    setSelectedImagePreview(URL.createObjectURL(file));
    setAnalyzingImage(true);
    setInferenceResult(null);
    setOutOfTopicError('');

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      try {
        const base64Data = reader.result;
        const payload = { data: [ base64Data ] };

        const response = await fetch(`${BACKEND_URL}/api/predict`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error(`HTTP Matrix Fault: ${response.status}`);

        const json = await response.json();
        const rawResponseData = json.data[0];
        const data = Array.isArray(rawResponseData) ? rawResponseData[0] : rawResponseData;

        if (data.error) {
          setOutOfTopicError(data.error);
        } else {
          setInferenceResult({
            isPlastic: data.is_plastic,
            material: data.detected_material,
            confidence: data.confidence,
            recommendedTemp: data.recommendedTemp,
            recommendedCooling: data.recommendedCooling,
            statusText: data.action_status,
            modelRef: 'Hierarchical Node Chain [ResNet-18 Dual Stack]'
          });
        }
      } catch (err) {
        setOutOfTopicError('❌ System Exception: Payload transmission routing failure.');
        console.error(err);
      } finally {
        setAnalyzingImage(false);
      }
    };
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 font-sans">
      <header className="max-w-6xl mx-auto mb-8 border-b border-slate-800 pb-4 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
            POLYSMART MULTI-STAGE COCKPIT
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">Integrated Engineering Project // Team Group 1 // AASTU</p>
        </div>
        <div>
          {checkingStatus ? (
            <span className="text-xs font-mono text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1 rounded">SCANNING CORES...</span>
          ) : backendConnected ? (
            <div className="bg-emerald-950/40 border border-emerald-800 px-3 py-1 rounded text-xs text-emerald-400 font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> DUAL MODELS: OPERATIONAL
            </div>
          ) : (
            <div className="bg-red-950/40 border border-red-800 px-3 py-1 rounded text-xs text-red-400 font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500"></span> BACKEND CONNECTIVITY FAULT
            </div>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* LEFT COLUMN: VISUAL INSPECTION FIELD */}
        <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold mb-2 text-blue-400">📸 Machine Vision Capture Node</h2>
            <p className="text-xs text-slate-400 mb-4">Mount raw structural targets into the visual scanner to execute multi-stage verification passes.</p>
            
            <div className="border-2 border-dashed border-slate-800 rounded-lg h-72 bg-slate-950 flex items-center justify-center overflow-hidden relative">
              {selectedImagePreview ? (
                <img src={selectedImagePreview} alt="Live feed preview" className="w-full h-full object-contain p-2" />
              ) : (
                <div className="text-center p-4">
                  <span className="text-5xl block mb-2">📥</span>
                  <span className="text-xs text-slate-500 font-mono">Camera Frame Matrix Empty</span>
                </div>
              )}
              {analyzingImage && (
                <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center text-sm font-bold text-blue-400 animate-pulse">
                  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                  RUNNING HIERARCHICAL EVALUATION LOOP...
                </div>
              )}
            </div>
          </div>
          <div className="mt-6">
            <label className={`block w-full text-white font-medium text-center text-sm py-3 px-4 rounded-lg cursor-pointer transition ${backendConnected ? 'bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-900/20' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}>
              Capture / Scan Material Target
              <input type="file" accept="image/*" onChange={processBatchImage} className="hidden" disabled={analyzingImage || !backendConnected} />
            </label>
          </div>
        </section>

        {/* RIGHT COLUMN: CALIBRATION CONTROL PROCESS LOOP */}
        <section className="flex flex-col gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl flex-1">
            <h2 className="text-lg font-bold mb-4 text-emerald-400">⚙️ Automated Process Control Loop</h2>
            
            {outOfTopicError && <div className="bg-red-950/40 border border-red-500/50 text-red-400 p-4 rounded-lg text-xs font-mono mb-4">{outOfTopicError}</div>}
            {!inferenceResult && !outOfTopicError && !analyzingImage && <div className="h-56 border border-slate-800 rounded-lg bg-slate-950/50 flex items-center justify-center text-xs font-mono text-slate-500">System idle. Waiting for image ingestion package...</div>}
            
            {inferenceResult && (
              <div className="space-y-4">
                <div className="bg-slate-950 border border-slate-800 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Identified Classification Matrix</span>
                    <span className="text-[10px] font-mono text-slate-500 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">{inferenceResult.modelRef}</span>
                  </div>
                  <div className={`text-2xl font-black tracking-tight ${inferenceResult.isPlastic ? 'text-emerald-400' : 'text-red-400'}`}>
                    {inferenceResult.material}
                  </div>
                  <div className="mt-2 text-xs font-mono text-slate-300">
                    🎯 Pipeline Confidence: <span className={`${inferenceResult.isPlastic ? 'text-emerald-400' : 'text-red-400'} font-bold`}>{inferenceResult.confidence}%</span>
                  </div>
                </div>

                {/* TEMPERATURE CONFIGURATIONS ARRAYS */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 text-center">
                    <span className="text-xs font-mono text-slate-400 block uppercase mb-1">Heating Setpoint</span>
                    <span className={`text-3xl font-black font-mono ${inferenceResult.isPlastic ? 'text-orange-400' : 'text-slate-600'}`}>
                      {inferenceResult.recommendedTemp}°C
                    </span>
                  </div>
                  <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 text-center">
                    <span className="text-xs font-mono text-slate-400 block uppercase mb-1">Cooling Toggle Cycle</span>
                    <span className={`text-3xl font-black font-mono ${inferenceResult.isPlastic ? 'text-cyan-400' : 'text-slate-600'}`}>
                      {inferenceResult.recommendedCooling}s
                    </span>
                  </div>
                </div>

                {/* SYSTEM INTERLOCK FEEDBACK BANNER */}
                <div className={`border p-3 rounded-lg text-xs font-mono leading-relaxed ${inferenceResult.isPlastic ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-400' : 'bg-red-950/20 border-red-500/30 text-red-400'}`}>
                  {inferenceResult.statusText}
                </div>
              </div>
            )}
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs text-slate-400 font-mono grid grid-cols-2 gap-2 shadow-md">
            <div>⚙️ Prototype: <span className="text-slate-200">v2.5 System</span></div>
            <div>📦 Target Inject: <span className="text-slate-200">10g Max Capacity</span></div>
            <div>📍 Defense Node: <span className="text-slate-200">AASTU Block 57</span></div>
            <div>👥 Engineering: <span className="text-slate-200">Group 1 Team</span></div>
          </div>
        </section>
      </main>
    </div>
  );
}
