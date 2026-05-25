import React, { useState, useEffect } from 'react';

export default function App() {
  // --- STATE MANAGEMENT ---
  const [analyzingImage, setAnalyzingImage] = useState(false);
  const [inferenceResult, setInferenceResult] = useState(null);
  const [outOfTopicError, setOutOfTopicError] = useState('');
  const [selectedImagePreview, setSelectedImagePreview] = useState(null);
  
  // --- CONNECTION MONITORING STATES ---
  const [backendConnected, setBackendConnected] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);

  const BACKEND_URL = 'https://yani-321212-me-backend.hf.space';

  // --- AUTOMATED HEALTH-CHECK MONITOR ---
  useEffect(() => {
    const verifySystemHeartbeat = async () => {
      try {
        // Ping the raw root endpoint of your Hugging Face Space container
        const ping = await fetch(`${BACKEND_URL}/`);
        if (ping.ok) {
          setBackendConnected(true);
        } else {
          setBackendConnected(false);
        }
      } catch (err) {
        setBackendConnected(false);
        console.error("Heartbeat Connection Failed:", err);
      } {
        setCheckingStatus(false);
      }
    };

    verifySystemHeartbeat();
    // Run status check automatically every 10 seconds to keep the dashboard accurate
    const interval = setInterval(verifySystemHeartbeat, 10000);
    return () => clearInterval(interval);
  }, []);

  // --- BASE64 TO BINARY BLOB CONVERTER ---
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

  // --- AUTOMATED INFERENCE PROCESSING ENGINE ---
  const processBatchImage = async (e) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    // Double-check connectivity status flags before processing
    if (!backendConnected) {
      setOutOfTopicError('❌ Aborted: The connection to the Hugging Face engine is down.');
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
        const imageBlob = makeBlobFromBase64(base64Data);

        const formData = new FormData();
        formData.append('data', imageBlob, 'feedstock_sample.jpg');

        // Target the dedicated execution prediction endpoint explicitly
        const response = await fetch(`${BACKEND_URL}/api/predict`, {
          method: 'POST',
          body: formData,
        });

        // 1. HTTP Status Gatekeeper
        if (!response.ok) {
          throw new Error(`Server dropped network request packages. Status: ${response.status}`);
        }

        const json = await response.json();
        
        // 2. Validate structural response format matches Gradio framework outputs
        if (!json || !json.data || !Array.isArray(json.data)) {
          throw new Error("Invalid matrix payload received from backend server node.");
        }

        const data = json.data[0]; 

        // 3. Process application error exceptions thrown by PyTorch layers
        if (data.error) {
          setOutOfTopicError(data.error);
        } else if (!data.material || data.confidence === undefined) {
          // If the model script fails and returns empty fields, force connection crash visualization
          throw new Error("Model file mismatch. The live endpoint did not run authentic weights.");
        } else {
          setInferenceResult({
            material: data.material,
            confidence: data.confidence,
            modelRef: 'polysmart_qa_model.pth [Active ResNet-18 Core Layer]',
            recommendedTemp: data.recommendedTemp,
            recommendedCooling: data.recommendedCooling,
          });
        }
      } catch (err) {
        setOutOfTopicError('❌ System Fault: Response processing failure. Verify that polysmart_qa_model.pth is compiled successfully inside your Space backend.');
        console.error("Network Exception:", err);
      } finally {
        setAnalyzingImage(false);
      }
    };
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 font-sans">
      {/* HEADER BAND */}
      <header className="max-w-6xl mx-auto mb-8 border-b border-slate-800 pb-4 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
            POLYSMART QA COCKPIT
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Integrated Engineering Project // Team Group 1
          </p>
        </div>
        
        {/* NETWORK CONNECTIVITY HUB STATUS INDICATOR */}
        <div className="flex items-center gap-2">
          {checkingStatus ? (
            <span className="text-xs font-mono text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1 rounded animate-pulse">
              🔄 SCANNING BACKEND CORES...
            </span>
          ) : backendConnected ? (
            <div className="flex items-center gap-2 bg-emerald-950/40 border border-emerald-800 px-3 py-1 rounded">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-mono text-emerald-400">HF MODEL STATUS: CONNECTED</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-red-950/40 border border-red-800 px-3 py-1 rounded animate-bounce">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              <span className="text-xs font-mono text-red-400 font-bold">HF MODEL STATUS: DISCONNECTED</span>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* LEFT COLUMN: CAMERA FEED / IMAGE INGESTION */}
        <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold mb-2 flex items-center gap-2 text-blue-400">
              📸 Machine Vision Material Capture
            </h2>
            <p className="text-xs text-slate-400 mb-4">
              Upload a feedstock frame sample to analyze material type and configure barrel calibration values.
            </p>
            
            {/* IMAGE PREVIEW DRAWER */}
            <div className="border-2 border-dashed border-slate-800 rounded-lg h-64 bg-slate-950 flex items-center justify-center overflow-hidden relative group">
              {selectedImagePreview ? (
                <img 
                  src={selectedImagePreview} 
                  alt="Feedstock preview" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-4">
                  <span className="text-4xl block mb-2 text-slate-700">📥</span>
                  <span className="text-xs text-slate-500 font-mono">No Image Mounted to System Scanner</span>
                </div>
              )}
              
              {/* LOADING INDICATOR MASK */}
              {analyzingImage && (
                <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center text-center p-4">
                  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                  <p className="text-sm font-bold text-blue-400 animate-pulse">RUNNING MODEL INFERENCE...</p>
                  <p className="text-[10px] text-slate-500 font-mono mt-1">Evaluating weights matrix via ResNet-18 core</p>
                </div>
              )}
            </div>
          </div>

          {/* INPUT FORM BLOCK */}
          <div className="mt-6">
            <label 
              className={`block w-full text-white font-medium text-center text-sm py-3 px-4 rounded-lg cursor-pointer transition shadow-lg ${
                backendConnected 
                  ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-900/20' 
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed shadow-none'
              }`}
            >
              {selectedImagePreview ? "🔄 Capture / Rescan Feedstock Frame" : "🔌 Initialize Vision Scanner"}
              <input 
                type="file" 
                accept="image/*" 
                onChange={processBatchImage} 
                className="hidden" 
                disabled={analyzingImage || !backendConnected}
              />
            </label>
          </div>
        </section>

        {/* RIGHT COLUMN: CYLINDER CALIBRATION CONTROLS */}
        <section className="flex flex-col gap-6">
          
          {/* TOP BOX: AUTOMATION PANEL */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl flex-1">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-emerald-400">
              ⚙️ Automated Process Control Loop
            </h2>

            {/* LIVE DISCONNECTION BANNER MASK OVERRIDE */}
            {!backendConnected && !checkingStatus ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-red-950/10 border border-red-900/50 rounded-lg min-h-[200px]">
                <span className="text-3xl mb-2">⚠️</span>
                <h4 className="text-sm font-bold text-red-400 uppercase font-mono">System Core Off-line</h4>
                <p className="text-xs text-slate-400 max-w-sm mt-2 leading-relaxed">
                  Vercel application is not connected to your Hugging Face Space. Verify your backend container status is set to "Running".
                </p>
              </div>
            ) : (
              <>
                {/* ERROR BOUND ALERTS */}
                {outOfTopicError && (
                  <div className="bg-red-950/40 border border-red-500/50 text-red-400 p-4 rounded-lg text-xs font-mono mb-4 leading-relaxed">
                    {outOfTopicError}
                  </div>
                )}

                {/* INITIAL BLANK PANEL STATE */}
                {!inferenceResult && !outOfTopicError && !analyzingImage && (
                  <div className="h-48 border border-slate-800 rounded-lg bg-slate-950/50 flex items-center justify-center text-center p-6">
                    <p className="text-xs font-mono text-slate-500">
                      Waiting for clean visual data input stream from material capture sensor...
                    </p>
                  </div>
                )}

                {/* AI LOADING PLACEHOLDER PANELS */}
                {analyzingImage && (
                  <div className="space-y-3 animate-pulse">
                    <div className="h-6 bg-slate-800 rounded w-2/3"></div>
                    <div className="h-20 bg-slate-800 rounded"></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="h-16 bg-slate-800 rounded"></div>
                      <div className="h-16 bg-slate-800 rounded"></div>
                    </div>
                  </div>
                )}

                {/* SUCCESSFUL MODEL OUTPUT LAYER DISPLAY */}
                {inferenceResult && (
                  <div className="space-y-4">
                    <div className="bg-slate-950 border border-slate-800 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block">Identified Target</span>
                        <span className="text-[10px] font-mono text-slate-500 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                          {inferenceResult.modelRef}
                        </span>
                      </div>
                      <div className="text-2xl font-black text-emerald-400 tracking-tight">
                        {inferenceResult.material}
                      </div>
                      <div className="mt-2 text-xs font-mono flex items-center gap-2 text-slate-300">
                        <span>🎯 Model Confidence Score:</span>
                        <span className="text-emerald-400 font-bold">{inferenceResult.confidence}%</span>
                      </div>
                    </div>

                    {/* AUTOMATED ACTUATOR REGULATION VALUE BLOCK */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 text-center">
                        <span className="text-xs font-mono text-slate-400 block uppercase mb-1">Cylinder Heating Setpoint</span>
                        <span className="text-3xl font-black text-orange-400 font-mono tracking-tight">
                          {inferenceResult.recommendedTemp}°C
                        </span>
                      </div>
                      <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 text-center">
                        <span className="text-xs font-mono text-slate-400 block uppercase mb-1">Cooling Toggle Cycle</span>
                        <span className="text-3xl font-black text-cyan-400 font-mono tracking-tight">
                          {inferenceResult.recommendedCooling}s
                    </span>
                      </div>
                    </div>

                    <div className="bg-emerald-950/20 border border-emerald-500/30 text-[11px] font-mono text-emerald-400 p-3 rounded-lg leading-relaxed">
                      ✅ <strong>Cylinder Interlock Released:</strong> Parameters synchronized to the heating coils. Ready to feed raw granules into the injection plunger.
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* BOTTOM BOX: PROTOTYPE PROJECT SPECIFICATIONS RECAP */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs text-slate-400 font-mono grid grid-cols-2 gap-2 shadow-md">
            <div>⚙️ Prototype: <span className="text-slate-200">v2.5 Machine</span></div>
            <div>📦 Shot Capacity: <span className="text-slate-200">10g Capacity</span></div>
            <div>📍 Defense Node: <span className="text-slate-200">AASTU Block 57</span></div>
            <div>👥 System Engineering: <span className="text-slate-200">Group 1 Team</span></div>
          </div>
        </section>
      </main>
    </div>
  );
}
