import React, { useState } from 'react';

export default function App() {
  // Application view controller states
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  
  // Vision classifier simulation states
  const [uploading, setUploading] = useState(false);
  const [predictedClass, setPredictedClass] = useState('');
  const [confidence, setConfidence] = useState(0);

  // Chatbot states
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Hello! I am your RAG-driven Copilot. I have loaded your local workshop manuals. Ask me any troubleshooting or calibration question.' }
  ]);
  const [userInput, setUserInput] = useState('');

  // Database simulator state for process traceability logs
  const [dbLogs, setDbLogs] = useState([
    { id: 1, time: '2026-05-25 10:14', material: 'HDPE', temp: 180, query: 'No', status: 'Success' },
    { id: 2, time: '2026-05-25 11:45', material: 'PP', temp: 220, query: 'Yes', status: 'Defect_Flash' }
  ]);

  // Handle Material Classification Simulation (ConvNeXt-Base Endpoint)
  const handlePhotoUpload = (e) => {
    setUploading(true);
    setTimeout(() => {
      // Simulating JSON response from Hugging Face API Hub
      const isHDPE = Math.random() > 0.5;
      if (isHDPE) {
        setPredictedClass('HDPE (High-Density Polyethylene)');
        setConfidence(98.4);
        setSelectedMaterial({ name: 'HDPE', temp: 180, cooling: 45, rate: 'Medium-Fast' });
      } else {
        setPredictedClass('PP (Polypropylene)');
        setConfidence(96.7);
        setSelectedMaterial({ name: 'PP', temp: 220, cooling: 60, rate: 'Slow-Uniform' });
      }
      setUploading(false);
    }, 1200);
  };

  // Handle Local Document Retrieval (RAG Vector Context Matching Simulation)
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const userMsg = userInput;
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setUserInput('');

    setTimeout(() => {
      let aiResponse = "I have scanned the local documentation repository. ";
      if (userMsg.toLowerCase().includes('warping') || userMsg.toLowerCase().includes('warp')) {
        aiResponse += "According to Manual Section 4.2, warping in thin-walled mold blocks occurs due to non-uniform thermal cooling profiles. Recommendation: Maintain the Toggle Clamping Framework closed for an additional 15 seconds to stabilize the crystalline structure.";
      } else if (userMsg.toLowerCase().includes('heat') || userMsg.toLowerCase().includes('temperature')) {
        aiResponse += "The system ledger logs confirm that HDPE reaches optimal uniform melt flow at 180°C, while PP requires 220°C to bypass structural geometric drift during the ram drive cycle.";
      } else {
        aiResponse += "Context verification complete. To avoid production flashing, verify that the quick-swap modular tool platen is securely locked down against back-pressures before starting the mechanical lever drive down.";
      }
      setMessages(prev => [...prev, { sender: 'ai', text: aiResponse }]);
    }, 800);
  };

  // Add current run configuration parameters directly to local state database log
  const logCurrentCycle = (statusMarker) => {
    if (!selectedMaterial) return;
    const newLog = {
      id: dbLogs.length + 1,
      time: new Date().toISOString().replace('T', ' ').substring(0, 16),
      material: selectedMaterial.name,
      temp: selectedMaterial.temp,
      query: messages.length > 1 ? 'Yes' : 'No',
      status: statusMarker
    };
    setDbLogs([newLog, ...dbLogs]);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col justify-between">
      
      {/* ─── MAIN LANDING APP HEADER ─── */}
      <header className="bg-slate-900 text-white shadow-xl border-b-4 border-blue-600">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <span className="bg-blue-600 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider">AASTU IETP</span>
              <span className="text-slate-400 text-sm font-semibold tracking-widest">GROUP 11</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold mt-1 tracking-tight">PLASTIC MOLDING MACHINE CONTROL NODE</h1>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              Engineering high-precision small-batch production parts. Melting raw polymer granules and injecting them into modular quick-swap mold profiles.
            </p>
          </div>
          
          {/* Navigation Bar */}
          <nav className="flex bg-slate-800 p-1.5 rounded-lg border border-slate-700">
            <button onClick={() => setActiveTab('dashboard')} className={`px-4 py-2 rounded-md text-xs font-bold transition-all ${activeTab === 'dashboard' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-300 hover:text-white'}`}>
              SYSTEM DASHBOARD
            </button>
            <button onClick={() => setActiveTab('architecture')} className={`px-4 py-2 rounded-md text-xs font-bold transition-all ${activeTab === 'architecture' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-300 hover:text-white'}`}>
              SPECIFICATIONS & LOGS
            </button>
          </nav>
        </div>
      </header>

      {/* ─── VIEW 1: SYSTEM CONTROLS DASHBOARD ─── */}
      {activeTab === 'dashboard' && (
        <main className="flex-grow max-w-7xl w-full mx-auto px-4 md:px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Column 1: AI Vision Ingestion (Hugging Face Request Broker Node) */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl">📸</span>
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">ConvNeXt-Base Material Ingestion</h2>
              </div>
              <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                Upload or drag a raw material batch photograph. The image array will be dispatched via HTTPS stream to the cloud model registry for classification.
              </p>
              
              <label className="border-2 border-dashed border-slate-300 hover:border-blue-500 bg-slate-50 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all group min-h-[200px]">
                <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                <span className="text-3xl group-hover:scale-110 transition-transform">📥</span>
                <span className="text-xs font-bold text-slate-700 mt-3">Select Batch Image File</span>
                <span className="text-[10px] text-slate-400 mt-1">Accepts standard .jpg, .jpeg, .png formats</span>
              </label>

              {uploading && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-medium rounded-lg animate-pulse text-center">
                  Executing feed broker pipeline payload... Sending to Hugging Face Engine.
                </div>
              )}

              {predictedClass && !uploading && (
                <div className="mt-4 p-4 bg-slate-900 text-white rounded-xl border-l-4 border-emerald-500">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 block">Inference Response Received</span>
                  <p className="text-sm font-bold mt-0.5">{predictedClass}</p>
                  <p className="text-xs text-slate-400 mt-1">Model Evaluation Confidence Score: <span className="text-emerald-400 font-mono font-bold">{confidence}%</span></p>
                </div>
              )}
            </div>

            {/* Dynamic Parameter Settings Block */}
            <div className="mt-6 pt-6 border-t border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Live Calibration Output</h3>
              {selectedMaterial ? (
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 block">Target Temperature</span>
                    <span className="text-lg font-extrabold text-amber-600">{selectedMaterial.temp}°C</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 block">Cooling Clamp Window</span>
                    <span className="text-lg font-extrabold text-purple-600">{selectedMaterial.cooling}s</span>
                  </div>
                </div>
              ) : (
                <div className="text-center p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-xs text-slate-400 italic">
                  Awaiting ingestion analysis parameter matrix mapping...
                </div>
              )}
            </div>
          </div>

          {/* Column 2: RAG Language Copilot (Local Workshop Context Store) */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between min-h-[450px]">
            <div className="flex flex-col h-full justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">🤖</span>
                  <h2 className="text-lg font-bold text-slate-900 tracking-tight">RAG AI Troubleshooter Copilot</h2>
                </div>
                <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                  Queries cross-reference local flat-file operation manuals. Try asking: <span className="font-medium text-blue-600 underline cursor-pointer" onClick={() => setUserInput("Why is the PP warping?")}>"Why is the PP warping?"</span>
                </p>
                
                {/* Scrollable Message Box */}
                <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1 text-xs">
                  {messages.map((msg, index) => (
                    <div key={index} className={`p-3 rounded-xl max-w-[90%] ${msg.sender === 'user' ? 'bg-blue-600 text-white ml-auto shadow-sm' : 'bg-slate-100 text-slate-800 mr-auto border border-slate-200'}`}>
                      <span className="text-[9px] uppercase font-bold block opacity-60 mb-0.5">{msg.sender === 'user' ? 'Operator' : 'Local Context Bot'}</span>
                      <p className="leading-relaxed font-medium">{msg.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chat Input Bar */}
              <form onSubmit={handleSendMessage} className="mt-4 pt-4 border-t border-slate-100 flex gap-2">
                <input type="text" value={userInput} onChange={(e) => setUserInput(e.target.value)} placeholder="Query system thermal thresholds, bounds, or guidelines..." className="flex-grow bg-slate-50 border border-slate-200 text-xs rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <button type="submit" className="bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold px-4 py-3 rounded-xl transition-all shadow-md">
                  ASK
                </button>
              </form>
            </div>
          </div>

          {/* Column 3: Quality Assurance Management Node (SQLite Persistence Frame) */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl">📊</span>
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">Quality Assurance Logging Node</h2>
              </div>
              <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                Evaluate production outcomes and commit telemetry logs directly to the integrated database. This step locks validation before initiating the next run.
              </p>

              {selectedMaterial ? (
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Commit Entry for {selectedMaterial.name} Run</span>
                  <button onClick={() => logCurrentCycle('Success')} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-all shadow-sm">
                    Log Entry: SUCCESSFUL FORMING
                  </button>
                  <button onClick={() => logCurrentCycle('Defect_ShortShot')} className="w-full bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-all shadow-sm">
                    Log Entry: DEFECT (Short Shot)
                  </button>
                  <button onClick={() => logCurrentCycle('Defect_Flash')} className="w-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-all shadow-sm">
                    Log Entry: DEFECT (Excess Flashing)
                  </button>
                </div>
              ) : (
                <div className="text-center p-6 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-xs text-slate-400 italic">
                  Run validation locked. Please process an ingestion material batch image to enable data commit logs.
                </div>
              )}
            </div>

            {/* Quick-look Project Scope Summary Card */}
            <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <span className="font-bold text-slate-900 block mb-1">Molding Process Summary</span>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                The prototype uses mechanical lever force to compress molten resin into interchangeable mold plates. This bypasses the need for large hydraulic setups, making it safe and efficient for university labs.
              </p>
            </div>
          </div>
        </main>
      )}

      {/* ─── VIEW 2: ARCHITECTURE SPECIFICATIONS & LIVE RECORDS ─── */}
      {activeTab === 'architecture' && (
        <main className="flex-grow max-w-7xl w-full mx-auto px-4 md:px-6 py-8 space-y-8">
          
          {/* Architectural Layout Analysis Panel */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-2">Split Client-Cloud Decoupled Architecture</h2>
            <p className="text-xs text-slate-500 max-w-3xl leading-relaxed">
              This node operates via split logic orchestration: User interaction and state tracking run client-side on the edge via Vercel engines. Intensive computer vision matrix evaluations are sent securely to remote Hugging Face infrastructure endpoints.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 text-xs">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-blue-600 block mb-1">Tier 1: Client UI View</span>
                <p className="text-slate-600">Manages high-resolution photo file ingestion arrays and dynamic telemetry response mapping panels.</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-purple-600 block mb-1">Tier 2: RAG Vector Router</span>
                <p className="text-slate-600">Scans local flat-file workshop manuals using token string match counters to bundle context-optimized prompts.</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-amber-600 block mb-1">Tier 3: Remote Inference</span>
                <p className="text-slate-600">Processes image matrices using custom ConvNeXt-Base layer weights to bypass lighting variance errors.</p>
              </div>
            </div>
          </div>

          {/* SQLite Local Log Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">Active Traceability Table Database: <span className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded text-blue-600">production_logs</span></h2>
              <p className="text-xs text-slate-500 mt-1">Real-time ISO-8601 logging for verification defenses and audit logs.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200">
                    <th className="p-4">log_id</th>
                    <th className="p-4">timestamp</th>
                    <th className="p-4">asserted_material</th>
                    <th className="p-4">target_temp_celsius</th>
                    <th className="p-4">operator_query_logged</th>
                    <th className="p-4">cycle_status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {dbLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-4 font-mono font-bold text-slate-400">#{log.id}</td>
                      <td className="p-4 text-slate-500">{log.time}</td>
                      <td className="p-4"><span className="bg-slate-900 text-white font-bold px-2.5 py-0.5 rounded-md text-[10px]">{log.material}</span></td>
                      <td className="p-4 font-mono font-bold text-amber-600">{log.temp}°C</td>
                      <td className="p-4 text-slate-500">{log.query}</td>
                      <td className="p-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${log.status === 'Success' ? 'bg-emerald-100 text-emerald-800' : log.status === 'Defect_ShortShot' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'}`}>
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      )}

      {/* ─── TECHNICAL EVALUATION ADMINISTRATIVE FOOTER ─── */}
      <footer className="bg-slate-900 text-slate-300 border-t-2 border-slate-800 p-6 md:p-8 text-xs">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Institutional Branding Block */}
          <div>
            <span className="font-extrabold text-white uppercase tracking-wider block mb-2 text-sm text-blue-500">Academic Review Panel</span>
            <p className="font-bold text-slate-200 text-xs">ADVISOR: Aman Kassaye (PhD)</p>
            <p className="text-slate-400 mt-1 leading-relaxed">
              Addis Ababa Science and Technology University<br />
              Integrated Engineering Team Project (IETP)<br />
              Submission Context Date: <span className="text-slate-200 font-medium font-mono">April 14, 2026 GC</span>
            </p>
          </div>

          {/* Group 11 Roster Configuration */}
          <div>
            <span className="font-extrabold text-white uppercase tracking-wider block mb-2 text-sm text-purple-500">Engineers Hub (Group 11)</span>
            <ul className="grid grid-cols-2 gap-y-1 font-medium text-slate-400">
              <li>• Tewodros</li>
              <li>• Henok</li>
              <li>• Ermyas</li>
              <li>• Mesfin</li>
              <li>• Tesfaye</li>
              <li>• Saba</li>
              <li className="col-span-2 text-slate-200 font-bold">• Yaiyneabeba (Systems Log Owner)</li>
            </ul>
          </div>

          {/* Support Information & Contact Point */}
          <div>
            <span className="font-extrabold text-white uppercase tracking-wider block mb-2 text-sm text-amber-500">Contact Us & Support</span>
            <p className="text-slate-400 leading-relaxed">
              For calibration schema inquiries, database system validation logs, or engineering design file support, email your group's active campus registry at:
            </p>
            <a href="mailto:ietp.group11@aastu.edu.et" className="text-blue-400 font-bold hover:underline block mt-2 text-[13px] tracking-wide font-mono">
              ietp.group11@aastu.edu.et
            </a>
          </div>

        </div>
        
        <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-slate-800 text-center text-slate-500 font-medium">
          &copy; 2026 AASTU Group 11 Control Panel System Node. Built with split cloud RAG capabilities.
        </div>
      </footer>

    </div>
  );
}
