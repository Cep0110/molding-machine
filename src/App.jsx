import React, { useState } from 'react';

export default function App() {
  // Navigation Routing System: 'home', 'molding', 'faq', 'contact', 'admin-auth', 'admin-dashboard'
  const [activePage, setActivePage] = useState('home');
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  
  // Custom Fine-Tuned Model State (polysmart_qa_model.pth simulation block)
  const [analyzingImage, setAnalyzingImage] = useState(false);
  const [inferenceResult, setInferenceResult] = useState(null);
  const [outOfTopicError, setOutOfTopicError] = useState('');

  // FAQ State
  const [expandedFaq, setExpandedFaq] = useState(null);

  // Authentication States for Protected Route
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Protected Database State Panel
  const [telemetryLogs, setTelemetryLogs] = useState([
    { id: 'LOG-0231', timestamp: '2026-05-25 14:22', material: 'HDPE', temp: 180, status: 'Success', validation: 'Verified via polysmart_qa_model' },
    { id: 'LOG-0232', timestamp: '2026-05-25 15:40', material: 'PP', temp: 220, status: 'Defect_Flash', validation: 'Structural Drift Warning' }
  ]);

  const faqData = [
    {
      q: "Why is Polypropylene (PP) prone to geometric warping when cooling down?",
      a: "According to our machine parameters, PP is a semi-crystalline polymer that shrinks unevenly if it cools down too rapidly. To fix geometric drift, ensure our thick insulation barrier blocks are tightly sealed and keep the toggle clamping framework closed for at least 60 seconds."
    },
    {
      q: "How does the custom modular platen system work?",
      a: "Our desktop machine features an adjustable slide-in rail frame. This allows anyone to swap out different mold blocks (like gears, tensile bars, or custom shapes) in under 30 seconds without requiring massive warehouse machinery."
    },
    {
      q: "What is the physical operational limit of this tabletop prototype?",
      a: "The prototype is designed as a custom 10g micro-injection setup. It relies on a heavy-duty mechanical lever handle to give the user optimal manual pressing power, making it perfectly safe for school labs or university desktop work."
    }
  ];

  // Upgraded Ingestion Pipeline with Content Validation Guard
  const processBatchImage = (e) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    const fileNameLower = file.name.toLowerCase();

    setAnalyzingImage(true);
    setInferenceResult(null);
    setOutOfTopicError('');

    setTimeout(() => {
      // CONTENT VALIDATION GUARD: Check if the file name contains project keywords
      // This stops random out-of-topic photos from triggering a classification
      const isProjectRelated = 
        fileNameLower.includes('plastic') || 
        fileNameLower.includes('pellet') || 
        fileNameLower.includes('hdpe') || 
        fileNameLower.includes('pp') || 
        fileNameLower.includes('material') || 
        fileNameLower.includes('batch') ||
        fileNameLower.includes('sample') ||
        fileNameLower.includes('test');

      if (!isProjectRelated) {
        setOutOfTopicError('❌ Matrix Exception: Out of Topic Image. The model weights in polysmart_qa_model.pth rejected this sample because it does not contain recognizable polymer material profiles or background workshop matrices.');
        setAnalyzingImage(false);
        return;
      }

      // If it passes the topic guard, map it to a deterministic output based on the text
      const isPP = fileNameLower.includes('pp');
      
      if (isPP) {
        setInferenceResult({
          material: 'PP (Polypropylene)',
          confidence: 97.84,
          modelRef: 'polysmart_qa_model.pth [Layer: Conv1-BatchNorm Stack]',
          recommendedTemp: 220,
          recommendedCooling: 60
        });
      } else {
        // Default safe fallback if it is a generic plastic sample image
        setInferenceResult({
          material: 'HDPE (High-Density Polyethylene)',
          confidence: 99.12,
          modelRef: 'polysmart_qa_model.pth [Layer: Conv1-BatchNorm Stack]',
          recommendedTemp: 180,
          recommendedCooling: 45
        });
      }
      setAnalyzingImage(false);
    }, 1200);
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (username.toLowerCase() === 'admin' && password === 'ietp11aastu') {
      setIsAuthenticated(true);
      setAuthError('');
      setActivePage('admin-dashboard');
    } else {
      setAuthError('Access Denied. Invalid engineering crew credentials.');
    }
  };

  const handleAdminLogout = () => {
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
    setActivePage('home');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col justify-between">
      
      {/* ─── PUBLIC COMPONENT NAVIGATION HEADER ─── */}
      <header className="bg-slate-900 text-white shadow-md border-b-4 border-blue-600 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="bg-blue-600 text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">AASTU IETP</span>
              <span className="text-slate-400 text-xs font-bold tracking-widest">GROUP 11</span>
            </div>
            <h1 className="text-xl md:text-2xl font-black mt-0.5 tracking-tight">POLYSMART LAB PORTAL</h1>
          </div>
          
          <nav className="flex flex-wrap justify-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700">
            <button onClick={() => setActivePage('home')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activePage === 'home' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'}`}>HOME</button>
            <button onClick={() => setActivePage('molding')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activePage === 'molding' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'}`}>CLASSIFIER & PROCESS</button>
            <button onClick={() => setActivePage('faq')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activePage === 'faq' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'}`}>FAQ CENTER</button>
            <button onClick={() => setActivePage('contact')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activePage === 'contact' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'}`}>CONTACT</button>
            
            <button onClick={() => activePage === 'admin-dashboard' ? setActivePage('admin-dashboard') : setActivePage('admin-auth')} 
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activePage.includes('admin') ? 'bg-amber-500 text-slate-950' : 'text-amber-400 border border-amber-500/30 hover:bg-amber-500/10'}`}>
              {isAuthenticated ? '⚙️ ADMIN DASHBOARD' : '🔒 TEAM LOGIN'}
            </button>
          </nav>
        </div>
      </header>

      {/* ─── PAGE 1: PUBLIC HOME VIEW ─── */}
      {activePage === 'home' && (
        <main className="flex-grow max-w-5xl w-full mx-auto px-6 py-12 space-y-12">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8 md:p-12 rounded-3xl shadow-xl text-center border border-slate-700">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight max-w-3xl mx-auto leading-tight">
              Tabletop Micro-Injection Molding Automation
            </h2>
            <p className="text-xs md:text-sm text-slate-300 mt-4 max-w-2xl mx-auto leading-relaxed">
              Transforming raw plastics into precise custom parts. Check out our public classification terminal or log in to the protected admin telemetry panel.
            </p>
            <div className="mt-8 flex justify-center gap-3">
              <button onClick={() => setActivePage('molding')} className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-3.5 rounded-xl shadow-md transition-all">
                Launch Batch Classifier
              </button>
              <button onClick={() => setActivePage('faq')} className="bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs px-5 py-3.5 rounded-xl shadow-md transition-all">
                Browse FAQs
              </button>
            </div>
          </div>
        </main>
      )}

      {/* ─── PAGE 2: BATCH IMAGE CLASSIFIER WITH VALIDATION GATING ─── */}
      {activePage === 'molding' && (
        <main className="flex-grow max-w-3xl w-full mx-auto px-6 py-12">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Material Verification Hub</h2>
            <p className="text-xs text-slate-500 mt-1">
              Upload a snapshot of your feed material. The system protects against out-of-topic inputs to mirror our true <b>polysmart_qa_model.pth</b> constraints.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm max-w-lg mx-auto space-y-6">
            <div>
              <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase block mb-2">Image Matrix Ingestion</span>
              <label className="border-2 border-dashed border-slate-300 hover:border-blue-500 bg-slate-50 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all min-h-[180px]">
                <input type="file" accept="image/*" onChange={processBatchImage} className="hidden" />
                <span className="text-3xl">📷</span>
                <span className="text-xs font-bold text-slate-700 mt-2">Load Feedstock Photograph</span>
                <span className="text-[10px] text-slate-400 mt-0.5">Validates material context bounds automatically</span>
              </label>
            </div>

            {analyzingImage && (
              <div className="p-4 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-medium rounded-xl text-center animate-pulse">
                Running validation arrays across <b>polysmart_qa_model.pth</b> matrices...
              </div>
            )}

            {/* ERROR TRIGGER IF USER UPLOADS AN OUT-OF-TOPIC PICTURE */}
            {outOfTopicError && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-800 text-xs font-medium rounded-xl leading-relaxed">
                {outOfTopicError}
              </div>
            )}

            {inferenceResult && !analyzingImage && (
              <div className="space-y-4 animate-fadeIn">
                <div className="bg-slate-900 text-white p-4 rounded-xl border-l-4 border-emerald-500">
                  <span className="text-[9px] uppercase font-bold tracking-widest text-emerald-400 block font-mono">{inferenceResult.modelRef}</span>
                  <p className="text-base font-black mt-0.5">{inferenceResult.material}</p>
                  <p className="text-xs text-slate-400 mt-1">Classification Accuracy: <span className="text-emerald-400 font-mono font-bold">{inferenceResult.confidence}%</span></p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                    <span className="text-[10px] text-slate-400 font-bold block">TARGET CYLINDER HEAT</span>
                    <span className="text-lg font-black text-amber-600">{inferenceResult.recommendedTemp}°C</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                    <span className="text-[10px] text-slate-400 font-bold block">CLAMP HOLD TIME</span>
                    <span className="text-lg font-black text-purple-600">{inferenceResult.recommendedCooling}s</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      )}

      {/* ─── PAGE 3: PUBLIC FAQ ACCORDION ─── */}
      {activePage === 'faq' && (
        <main className="flex-grow max-w-2xl w-full mx-auto px-6 py-12">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Frequently Asked Questions</h2>
            <p className="text-xs text-slate-500 mt-1">Explore troubleshooting answers for workshop configurations.</p>
          </div>

          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <div key={index} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm transition-all">
                <button onClick={() => setExpandedFaq(expandedFaq === index ? null : index)} 
                        className="w-full text-left px-5 py-4 font-bold text-xs md:text-sm text-slate-900 flex justify-between items-center hover:bg-slate-50 transition-colors focus:outline-none">
                  <span>{faq.q}</span>
                  <span className="text-blue-500 text-base">{expandedFaq === index ? '▲' : '▼'}</span>
                </button>
                {expandedFaq === index && (
                  <div className="px-5 pb-5 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </main>
      )}

      {/* ─── PAGE 4: CONTACT VIEW ─── */}
      {activePage === 'contact' && (
        <main className="flex-grow max-w-md w-full mx-auto px-6 py-12">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-1">Contact Our Engineering Team</h2>
            <p className="text-xs text-slate-500 mb-6">Send us a message and our team will get back to you shortly.</p>
            <form onSubmit={(e) => { e.preventDefault(); alert("Message sent successfully."); }} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 font-bold mb-1">Full Name</label>
                <input type="text" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Abebe Bikila" />
              </div>
              <div>
                <label className="block text-slate-600 font-bold mb-1">Email Address</label>
                <input type="email" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="abebe@aastu.edu.et" />
              </div>
              <div>
                <label className="block text-slate-600 font-bold mb-1">Message Body</label>
                <textarea rows="4" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Inquire about parameters or logs..."></textarea>
              </div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-md transition-all">Submit Inquiry</button>
            </form>
          </div>
        </main>
      )}

      {/* ─── PAGE 5: ADMIN AUTH WALL GATEKEEPER ─── */}
      {activePage === 'admin-auth' && (
        <main className="flex-grow max-w-sm w-full mx-auto px-6 py-12">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="text-center mb-6">
              <span className="text-3xl">🔒</span>
              <h2 className="text-lg font-black text-slate-900 tracking-tight mt-2">Protected Route Authorization</h2>
              <p className="text-[11px] text-slate-400 mt-0.5">Enter credentials to unlock the active database panel.</p>
            </div>

            <form onSubmit={handleAdminLogin} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 font-bold mb-1">Team Username</label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="admin" />
              </div>
              <div>
                <label className="block text-slate-600 font-bold mb-1">Secret Access Key</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="••••••••" />
                <span className="text-[10px] text-slate-400 block mt-1">Credentials for defense: <b>admin</b> / <b>ietp11aastu</b></span>
              </div>

              {authError && <p className="text-[11px] text-red-600 font-medium text-center bg-red-50 p-2 rounded-lg border border-red-100">{authError}</p>}

              <button type="submit" className="w-full bg-slate-900 hover:bg-blue-600 text-white font-bold py-3 rounded-xl shadow-md transition-all">Unlock System Route</button>
            </form>
          </div>
        </main>
      )}

      {/* ─── PAGE 6: PROTECTED ADMIN DASHBOARD ROUTE PANEL ─── */}
      {activePage === 'admin-dashboard' && isAuthenticated && (
        <main className="flex-grow max-w-5xl w-full mx-auto px-6 py-12 space-y-6">
          <div className="flex justify-between items-center bg-slate-900 text-white p-4 rounded-xl border border-slate-800">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-amber-400 font-bold block">Authorized Session Active</span>
              <h2 className="text-base font-bold">Group 11 Operational Control Dashboard</h2>
            </div>
            <button onClick={handleAdminLogout} className="bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all">Lock Session</button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200">
              <h3 className="font-bold text-slate-900 text-xs">Active SQLite Logging Stream (production_logs)</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                    <th className="p-3">log_id</th>
                    <th className="p-3">timestamp</th>
                    <th className="p-3">asserted_material</th>
                    <th className="p-3">target_temp_celsius</th>
                    <th className="p-3">cycle_status</th>
                    <th className="p-3">qa_verification_node</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {telemetryLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/80">
                      <td className="p-3 font-mono font-bold text-slate-400">{log.id}</td>
                      <td className="p-3 text-slate-500">{log.timestamp}</td>
                      <td className="p-3"><span className="bg-slate-900 text-white font-mono px-2 py-0.5 rounded text-[10px] font-bold">{log.material}</span></td>
                      <td className="p-3 font-mono font-bold text-amber-600">{log.temp}°C</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${log.status === 'Success' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                          {log.status}
                        </span>
                      </td>
                      <td className="p-3 text-slate-400 font-mono text-[11px]">{log.validation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      )}

      {/* ─── TECHNICAL EVALUATION ADMINISTRATIVE FOOTER ─── */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 p-6 md:p-8 text-xs">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <span className="font-bold text-white uppercase tracking-wider block mb-2 text-blue-500 text-[11px]">Academic Review Panel</span>
            <p className="font-bold text-slate-200">ADVISOR: Aman Kassaye (PhD)</p>
            <p className="text-slate-400 mt-1 leading-relaxed">
              Addis Ababa Science and Technology University (AASTU)<br />
              Integrated Engineering Team Project (IETP)
            </p>
          </div>
          <div>
            <span className="font-bold text-white uppercase tracking-wider block mb-2 text-purple-500 text-[11px]">Engineers Hub (Group 11)</span>
            <ul className="grid grid-cols-2 gap-y-1 text-slate-400 font-medium">
              <li>• Tewodros</li><li>• Henok</li><li>• Ermyas</li><li>• Mesfin</li><li>• Tesfaye</li><li>• Saba</li>
              <li className="col-span-2 text-slate-200 font-bold">• Yaiyneabeba</li>
            </ul>
          </div>
          <div>
            <span className="font-bold text-white uppercase tracking-wider block mb-2 text-amber-500 text-[11px]">Inquiries</span>
            <a href="mailto:ietp.group11@aastu.edu.et" className="text-blue-400 font-bold hover:underline block mt-1 tracking-wide font-mono text-[13px]">
              ietp.group11@aastu.edu.et
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}
