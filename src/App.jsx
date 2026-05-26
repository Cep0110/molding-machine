import React, { useState } from 'react';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // Image Classifier States
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [inferenceResult, setInferenceResult] = useState(null);
  const [classifierError, setClassifierError] = useState('');

  // Chatbot States
  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', text: 'Welcome to EcoSpark Intelligence Systems. How can I assist you with our circular manufacturing technology today?' }
  ]);
  const [userInput, setUserInput] = useState('');

  // Pre-seeded Logs for Admin View
  const [classificationLogs, setClassificationLogs] = useState([
    { timestamp: '10:14:22 AM', material: 'PP Resin', confidence: '94.2%', status: 'Approved' },
    { timestamp: '11:02:15 AM', material: 'Cellulose Matrix', confidence: '98.7%', status: 'Rejected (Safety Interlock)' }
  ]);
  const [customerInquiries, setCustomerInquiries] = useState([
    { name: 'Abdi Kefele', email: 'abdi@aastu.edu.et', msg: 'Interested in acquiring 3 automated EcoSpark processing rigs for an industrial site in Hawassa.' }
  ]);

  // Contact Form States
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [contactSuccess, setContactSuccess] = useState(false);

  // Directly points to your specified Hugging Face Space endpoint
  const BACKEND_URL = 'https://yani-321212-me-backend.hf.space';

  // --- RAG Knowledge Base System (Strictly excludes internal polymer references) ---
  const RAG_KNOWLEDGE_BASE = {
    "how does the system contribute to the environment?": "EcoSpark transforms post-consumer waste materials into structural products, localizing production pipelines and satisfying global circular manufacturing protocols.",
    "what are the purchase and shipping options?": "The EcoSpark industrial rig is distributed as a turnkey manufacturing cell. Custom modifications and procurement options can be initiated directly via our Marketplace panel.",
    "can this machine operate continuously?": "Yes, our hardware is designed with industrial-grade thermal blocks and automated feed screws, making it fully ready for continuous cyclic micro-factory deployment.",
    "where is this project engineered?": "The system is engineered at Addis Ababa Science and Technology University (AASTU) under the Integrated Engineering Team Project initiative."
  };

  const handleFAQClick = (question) => {
    const answer = RAG_KNOWLEDGE_BASE[question.toLowerCase()];
    setChatMessages(prev => [
      ...prev,
      { sender: 'user', text: question },
      { sender: 'bot', text: answer }
    ]);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const userQuery = userInput.trim().toLowerCase();
    let botResponse = "I cannot locate specific operational logs regarding that parameter in my external knowledge base directory. Please contact an EcoSpark system architect for deep architectural data.";

    for (let key in RAG_KNOWLEDGE_BASE) {
      if (userQuery.includes(key) || key.includes(userQuery)) {
        botResponse = RAG_KNOWLEDGE_BASE[key];
        break;
      }
    }

    setChatMessages(prev => [...prev, { sender: 'user', text: userInput }, { sender: 'bot', text: botResponse }]);
    setUserInput('');
  };

  // --- Hugging Face Native File Post Binary Handler ---
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
      setInferenceResult(null);
      setClassifierError('');
    }
  };

  const triggerImageClassification = async () => {
    if (!selectedFile) {
      setClassifierError('Please place a valid target image compound inside the intake gate.');
      return;
    }

    setAnalyzing(true);
    setClassifierError('');
    setInferenceResult(null);

    try {
      const formData = new FormData();
      formData.append('data', selectedFile);

      const response = await fetch(`${BACKEND_URL}/api/predict`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error(`Network infrastructure fault: ${response.status}`);

      const json = await response.json();
      const rawData = json.data[0];
      const payload = Array.isArray(rawData) ? rawData[0] : rawData;

      if (payload.error) {
        setClassifierError(payload.error);
      } else {
        setInferenceResult(payload);
        setClassificationLogs(prev => [
          { 
            timestamp: new Date().toLocaleTimeString(), 
            material: payload.detected_material, 
            confidence: `${payload.confidence}%`, 
            status: payload.is_plastic ? 'Approved' : 'Rejected' 
          },
          ...prev
        ]);
      }
    } catch (err) {
      setClassifierError('Failed to establish unified connection to the Hugging Face hardware space cluster.');
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) return;
    setCustomerInquiries(prev => [...prev, { name: contactForm.name, email: contactForm.email, msg: contactForm.message }]);
    setContactSuccess(true);
    setContactForm({ name: '', email: '', message: '' });
    setTimeout(() => setContactSuccess(false), 4000);
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'aastu11') {
      setIsAdminLoggedIn(true);
      setClassifierError('');
    } else {
      alert('Invalid cryptographic security credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 font-sans flex flex-col justify-between selection:bg-teal-500/30">
      
      {/* GLOBAL NAVIGATION LAYER */}
      <nav className="bg-[#0c1222] border-b border-slate-800 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col items-center md:items-start">
            <span className="text-2xl font-black tracking-tighter text-teal-400 italic">ECOSPARK</span>
            <span className="text-[10px] font-mono tracking-widest text-slate-400 mt-0.5">AASTU IETP PROJECT // GROUP 11</span>
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {['home', 'chatbot', 'classifier', 'marketplace', 'dashboard'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-xs font-bold tracking-wide uppercase transition-all ${activeTab === tab ? 'bg-teal-600 text-white shadow-lg shadow-teal-900/30' : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* CORE ROUTER */}
      <main className="flex-grow max-w-7xl w-full mx-auto p-6 md:p-8">
        
        {/* HOMEPAGE */}
        {activeTab === 'home' && (
          <div className="space-y-16">
            <header className="text-center max-w-4xl mx-auto space-y-4 py-8">
              <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-emerald-400 to-blue-500">
                Transforming Secondary Polymers Into Architectural Value
              </h2>
              <p className="text-slate-400 text-lg md:text-xl font-light leading-relaxed">
                Empowering localized circular macro-economies through high-precision computerized micro-extrusion systems designed for distributed community manufacturing applications.
              </p>
              <div className="pt-6 flex flex-wrap justify-center gap-4">
                <button onClick={() => setActiveTab('classifier')} className="px-6 py-3 bg-teal-600 hover:bg-teal-500 text-sm font-bold rounded-xl transition shadow-lg shadow-teal-900/20">
                  Launch Ingestion Scanner
                </button>
                <button onClick={() => setActiveTab('marketplace')} className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-sm font-bold border border-slate-800 rounded-xl transition">
                  Explore Machine Specifications
                </button>
              </div>
            </header>

            {/* UN SDG IMPERATIVE VALUES */}
            <section className="bg-[#0c1222] border border-slate-800 rounded-3xl p-8 shadow-2xl">
              <div className="mb-8">
                <h3 className="text-xs font-mono uppercase tracking-widest text-teal-400">IMPACT METRIC VERIFICATION</h3>
                <h4 className="text-2xl font-bold text-white mt-1">Engineering Values Measured Against UN SDGs</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800/60">
                  <div className="text-3xl font-black text-amber-500 mb-2">SDG 8</div>
                  <div className="text-sm font-bold text-slate-200">Decent Work & Growth</div>
                  <p className="text-xs text-slate-400 mt-2 font-light">Enables community level manufacturing jobs via localized high-yield tooling infrastructure systems.</p>
                </div>
                <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800/60">
                  <div className="text-3xl font-black text-orange-500 mb-2">SDG 9</div>
                  <div className="text-sm font-bold text-slate-200">Industry & Innovation</div>
                  <p className="text-xs text-slate-400 mt-2 font-light">Integrates computer vision networks directly with raw processing mechanical rigs.</p>
                </div>
                <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800/60">
                  <div className="text-3xl font-black text-yellow-500 mb-2">SDG 11</div>
                  <div className="text-sm font-bold text-slate-200">Sustainable Cities</div>
                  <p className="text-xs text-slate-400 mt-2 font-light">Mitigates urban raw municipal density indices by converting solid materials directly within city cores.</p>
                </div>
                <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800/60">
                  <div className="text-3xl font-black text-green-500 mb-2">SDG 12</div>
                  <div className="text-sm font-bold text-slate-200">Responsible Consumption</div>
                  <p className="text-xs text-slate-400 mt-2 font-light">Locks open lifecycle loops by converting waste streams into structural artifacts.</p>
                </div>
              </div>
            </section>

            {/* PROCESS TIMELINE */}
            <section className="space-y-8">
              <div className="text-center">
                <h3 className="text-xs font-mono uppercase tracking-widest text-teal-400">OPERATIONAL FLOW PIPELINE</h3>
                <h4 className="text-3xl font-black text-white mt-1">The Lifecycle Pipeline Process</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
                {[
                  { step: '01', title: 'Source Collection', desc: 'Target compound aggregates are sourced, sanitized, and fed into mechanical size-reduction grinders.' },
                  { step: '02', title: 'Vision Sorting', desc: 'High-speed edge AI classifies composition and dynamically streams correct thermal operating points.' },
                  { step: '03', title: 'Controlled Extrusion', desc: 'Precision PID feedback induction bands safely melt verified resins down the drive barrel.' },
                  { step: '04', title: 'Final Compression Mold', desc: 'The liquefied composition settles into dense heavy-duty engineering modules under structural load.' }
                ].map((p, idx) => (
                  <div key={idx} className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 relative">
                    <span className="text-5xl font-black text-slate-800/50 absolute top-4 right-4 font-mono">{p.step}</span>
                    <h5 className="text-lg font-bold text-teal-400 mt-4">{p.title}</h5>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed font-light">{p.desc}</p>
                  </div>
                ))}
              </div>
              <div className="bg-gradient-to-r from-teal-950/40 to-blue-950/40 border border-teal-900/40 p-8 rounded-3xl flex flex-col sm:flex-row justify-between items-center gap-6">
                <div>
                  <h5 className="text-lg font-bold text-white">System Verification Check Status: Clear</h5>
                  <p className="text-xs text-slate-400 mt-1">Ready to inspect automated output metrics? Advance straight to the active machine cluster catalog display window.</p>
                </div>
                <button onClick={() => setActiveTab('marketplace')} className="px-6 py-3 bg-teal-600 hover:bg-teal-500 text-xs font-bold uppercase tracking-wider rounded-xl transition whitespace-nowrap">
                  Navigate to Machine Showcase
                </button>
              </div>
            </section>

            {/* CONTACT FRAMEWORK */}
            <section id="contact" className="max-w-2xl mx-auto bg-[#0c1222] border border-slate-800 p-8 rounded-3xl shadow-xl">
              <h4 className="text-xl font-bold text-white mb-2 text-center">Contact Technical Command</h4>
              <p className="text-xs text-slate-400 text-center mb-6">Submit queries directly to the engineering team repository pipeline.</p>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={contactForm.name}
                    onChange={e => setContactForm({...contactForm, name: e.target.value})}
                    className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm focus:outline-none focus:border-teal-500 transition"
                  />
                  <input
                    type="email"
                    placeholder="Inquiry Email Address"
                    value={contactForm.email}
                    onChange={e => setContactForm({...contactForm, email: e.target.value})}
                    className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm focus:outline-none focus:border-teal-500 transition"
                  />
                </div>
                <textarea
                  rows="4"
                  placeholder="Specify system inquiry data parameters..."
                  value={contactForm.message}
                  onChange={e => setContactForm({...contactForm, message: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm focus:outline-none focus:border-teal-500 transition"
                ></textarea>
                <button type="submit" className="w-full py-3 bg-teal-600 hover:bg-teal-500 text-sm font-bold rounded-xl transition">
                  Transmit Telemetry Package
                </button>
                {contactSuccess && (
                  <div className="bg-emerald-950/40 border border-emerald-800 text-emerald-400 p-3 rounded-xl text-center text-xs font-mono">
                    ✅ Data packet transmitted successfully to AASTU Block 57.
                  </div>
                )}
              </form>
            </section>
          </div>
        )}

        {/* AI ASSISTANT (RAG SYSTEM) */}
        {activeTab === 'chatbot' && (
          <div className="max-w-4xl mx-auto bg-[#0c1222] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[600px]">
            <div className="bg-slate-900/60 p-6 border-b border-slate-800 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-white">EcoSpark Retrieval-Augmented System</h3>
                <p className="text-xs text-slate-400 font-mono">Knowledge Base Core Node // Verified RAG Pipeline Active</p>
              </div>
              <div className="w-2 h-2 rounded-full bg-teal-400 animate-ping"></div>
            </div>

            <div className="flex-grow p-6 overflow-y-auto space-y-4 bg-slate-950/50">
              {chatMessages.map((m, idx) => (
                <div key={idx} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xl p-4 rounded-2xl text-sm leading-relaxed ${m.sender === 'user' ? 'bg-teal-600 text-white rounded-tr-none' : 'bg-slate-900 border border-slate-800 text-slate-300 rounded-tl-none'}`}>
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            {/* PRESET SUGGESTIONS FOR CONSUMERS */}
            <div className="p-4 bg-slate-900/40 border-t border-slate-800">
              <span className="text-[10px] uppercase tracking-wider font-mono text-slate-400 block mb-2">Select Frequent Ingestion Query Parameters:</span>
              <div className="flex flex-wrap gap-2">
                {[
                  "How does the system contribute to the environment?",
                  "What are the purchase and shipping options?",
                  "Can this machine operate continuously?",
                  "Where is this project engineered?"
                ].map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleFAQClick(q)}
                    className="bg-slate-950 hover:bg-slate-800 border border-slate-800 px-3 py-1.5 rounded-lg text-xs text-teal-400 font-medium transition"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSendMessage} className="p-4 bg-slate-900 border-t border-slate-800 flex gap-2">
              <input
                type="text"
                placeholder="Ask our semantic RAG engine customer service questions..."
                value={userInput}
                onChange={e => setUserInput(e.target.value)}
                className="flex-grow bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-teal-500 text-slate-200"
              />
              <button type="submit" className="px-6 bg-teal-600 hover:bg-teal-500 rounded-xl font-bold text-sm transition">
                Query
              </button>
            </form>
          </div>
        )}

        {/* CLASSIFIER INTAKE STATION */}
        {activeTab === 'classifier' && (
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            <section className="bg-[#0c1222] border border-slate-800 rounded-3xl p-6 flex flex-col justify-between shadow-xl">
              <div>
                <div className="mb-4">
                  <h3 className="text-xs font-mono uppercase tracking-widest text-teal-400">MACHINE VISION PORTAL</h3>
                  <h4 className="text-xl font-bold text-white mt-0.5">Physical Aggregate Target Core Ingestion</h4>
                </div>

                <div className="border-2 border-dashed border-slate-800 bg-slate-950 rounded-2xl h-72 flex flex-col items-center justify-center relative overflow-hidden p-4">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Target component feed" className="w-full h-full object-contain rounded-xl" />
                  ) : (
                    <div className="text-center space-y-2">
                      <span className="text-5xl block">📷</span>
                      <span className="text-xs text-slate-500 font-mono">Mount Active Material Feed Layer</span>
                    </div>
                  )}

                  {analyzing && (
                    <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center space-y-3">
                      <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-xs font-mono tracking-widest text-teal-400 animate-pulse">EXECUTING CLASSIFICATION PASS...</span>
                    </div>
                  )}
                </div>
                
                <div className="mt-4 bg-slate-950/50 p-4 rounded-xl border border-slate-800/60 space-y-2">
                  <span className="text-[10px] font-mono uppercase text-amber-400 block font-bold">⚠️ CRITICAL INGESTION STEPS</span>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-light">
                    Ensure image background elements exhibit minimal artifact noise. The target framework must sit completely within focal parameters. Foreign metallic matrices will trigger physical trip wires and emergency shutdown procedures.
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="file-upload-gate" />
                <label htmlFor="file-upload-gate" className="block w-full text-center bg-slate-950 hover:bg-slate-900 border border-slate-800 py-3 rounded-xl font-bold text-sm cursor-pointer transition text-slate-300">
                  {selectedFile ? 'Swap Ingestion Sample' : 'Select From Media Library'}
                </label>
                <button
                  onClick={triggerImageClassification}
                  disabled={!selectedFile || analyzing}
                  className={`w-full py-3 rounded-xl font-black tracking-wide text-sm transition shadow-lg ${selectedFile && !analyzing ? 'bg-teal-600 hover:bg-teal-500 text-white shadow-teal-900/20' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}
                >
                  Analyze Compound Structure
                </button>
              </div>
            </section>

            <section className="bg-[#0c1222] border border-slate-800 rounded-3xl p-6 flex flex-col justify-center min-h-[400px] shadow-xl">
              <h3 className="text-xs font-mono uppercase tracking-widest text-emerald-400 mb-4">AUTOMATED PROCESS CONFIGURATOR</h3>
              
              {classifierError && <div className="bg-red-950/40 border border-red-800/60 p-4 rounded-xl text-xs font-mono text-red-400">{classifierError}</div>}
              {!inferenceResult && !classifierError && !analyzing && (
                <div className="text-center font-mono text-xs text-slate-500 py-20 border border-slate-950 bg-slate-950/30 rounded-xl">
                  Awaiting ingestion matrix data streaming...
                </div>
              )}

              {inferenceResult && (
                <div className="space-y-6">
                  <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl">
                    <span className="text-[10px] font-mono uppercase text-slate-400 block">Identified Structural Composition</span>
                    <div className={`text-3xl font-black tracking-tight mt-1 ${inferenceResult.is_plastic ? 'text-emerald-400' : 'text-red-400'}`}>
                      {inferenceResult.detected_material}
                    </div>
                    <div className="mt-2 text-xs font-mono text-slate-300">
                      🎯 Statistical Engine Confidence: <span className="text-teal-400 font-bold">{inferenceResult.confidence}%</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-950 border border-slate-800 p-4 text-center rounded-xl">
                      <span className="text-[10px] font-mono text-slate-400 block uppercase">Heating Setpoint</span>
                      <span className={`text-3xl font-black font-mono block mt-1 ${inferenceResult.is_plastic ? 'text-amber-500' : 'text-slate-600'}`}>
                        {inferenceResult.recommendedTemp}°C
                      </span>
                    </div>
                    <div className="bg-slate-950 border border-slate-800 p-4 text-center rounded-xl">
                      <span className="text-[10px] font-mono text-slate-400 block uppercase">Cooling Duty Cycle</span>
                      <span className={`text-3xl font-black font-mono block mt-1 ${inferenceResult.is_plastic ? 'text-cyan-400' : 'text-slate-600'}`}>
                        {inferenceResult.recommendedCooling}s
                      </span>
                    </div>
                  </div>

                  <div className={`p-4 rounded-xl border font-mono text-xs leading-relaxed ${inferenceResult.is_plastic ? 'bg-emerald-950/30 border-emerald-800/50 text-emerald-400' : 'bg-red-950/30 border-red-800/50 text-red-400'}`}>
                    {inferenceResult.action_status}
                  </div>
                </div>
              )}
            </section>
          </div>
        )}

        {/* MARKETPLACE SECTION */}
        {activeTab === 'marketplace' && (
          <div className="space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h3 className="text-xs font-mono uppercase tracking-widest text-teal-400">ECOSPARK HARDWARE DISTRIBUTION</h3>
              <h4 className="text-3xl font-black text-white">Commercial Hardware & Product Catalog</h4>
              <p className="text-xs text-slate-400">Acquire enterprise grade automated recycling units or source structural hardware components generated directly by our systems.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* COMPONENT 1: INDEPENDENT MACHINERY RIG */}
              <div className="bg-[#0c1222] border border-slate-800 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between">
                <div className="h-64 bg-slate-900 relative">
                  <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80" alt="EcoSpark Extruder Unit" className="w-full h-full object-cover opacity-80" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c1222] to-transparent"></div>
                  <span className="absolute bottom-4 left-4 bg-teal-600 px-3 py-1 rounded text-[10px] font-mono font-bold uppercase tracking-wider">Industrial Equipment</span>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <h5 className="text-xl font-bold text-white">EcoSpark Automated Processing Cell v2.5</h5>
                    <span className="text-lg font-mono font-black text-teal-400">Inquire for Pricing</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed font-light">
                    A fully self-contained manufacturing cell featuring integrated multi-stage optical categorization, adaptive heating controllers, heavy duty high torque extrusion barrels, and interlocked compression molding presses.
                  </p>
                  <ul className="text-xs font-mono text-slate-300 space-y-1.5 border-t border-slate-800 pt-3">
                    <li>📍 Core Architecture: Dual-Core Processing Units</li>
                    <li>📍 Heat Limit Capability: 350°C Max Continuous</li>
                    <li>📍 Assembly Node Point: AASTU Block 57 Grid</li>
                  </ul>
                  <button onClick={() => { setActiveTab('home'); setTimeout(() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="w-full py-3 bg-teal-600 hover:bg-teal-500 text-xs font-bold uppercase tracking-wider rounded-xl transition">
                    Request Integration Specifications
                  </button>
                </div>
              </div>

              {/* COMPONENT 2: INTERLOCKING BLOCKS */}
              <div className="bg-[#0c1222] border border-slate-800 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between">
                <div className="h-64 bg-slate-900 relative">
                  <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80" alt="Recycled Materials Components" className="w-full h-full object-cover opacity-70" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c1222] to-transparent"></div>
                  <span className="absolute bottom-4 left-4 bg-emerald-600 px-3 py-1 rounded text-[10px] font-mono font-bold uppercase tracking-wider">Output Product</span>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <h5 className="text-xl font-bold text-white">High-Density Structural Modules</h5>
                    <span className="text-lg font-mono font-black text-emerald-400">ETB 450.00 / Unit</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed font-light">
                    Heavy duty structural interlocking modules fabricated entirely from verified circular matrices. Excellent tensile performance profiles designed specifically for urban construction grid installations and retaining walls.
                  </p>
                  <ul className="text-xs font-mono text-slate-300 space-y-1.5 border-t border-slate-800 pt-3">
                    <li>📍 Density Rating: High Viscosity Load Compression</li>
                    <li>📍 Dimensions: 400mm x 200mm Interlocking Grid</li>
                    <li>📍 Composition: 100% Recycled Technical Polymer</li>
                  </ul>
                  <button onClick={() => { setActiveTab('home'); setTimeout(() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="w-full py-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold uppercase tracking-wider rounded-xl transition text-slate-200">
                    Submit Batch Order Application
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PROTECTED CONTROL CENTER */}
        {activeTab === 'dashboard' && (
          <div className="max-w-6xl mx-auto">
            {!isAdminLoggedIn ? (
              <div className="max-w-md mx-auto bg-[#0c1222] border border-slate-800 p-8 rounded-3xl shadow-xl text-center">
                <span className="text-4xl block mb-2">🔒</span>
                <h4 className="text-xl font-bold text-white mb-1">Secure Core Administration Portal</h4>
                <p className="text-xs text-slate-400 mb-6">Restricted utility. Provide specific technical authorization to check active logs.</p>
                <form onSubmit={handleAdminLogin} className="space-y-4 text-left">
                  <div>
                    <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Root Operator ID</label>
                    <input
                      type="text"
                      placeholder="e.g. admin"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm focus:outline-none focus:border-teal-500 text-slate-200"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Cryptographic Security Token</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm focus:outline-none focus:border-teal-500 text-slate-200"
                    />
                    <span className="text-[10px] text-slate-500 font-mono mt-1 block">Hint for review: admin / aastu11</span>
                  </div>
                  <button type="submit" className="w-full py-3 bg-teal-600 hover:bg-teal-500 text-sm font-bold rounded-xl transition mt-2">
                    Verify Administrative Access
                  </button>
                </form>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/40 border border-slate-800 p-6 rounded-2xl">
                  <div>
                    <h4 className="text-2xl font-black text-white tracking-tight">EcoSpark Master Control Matrix</h4>
                    <p className="text-xs text-slate-400 font-mono">Live Ingestion Feeds & Active Customer Communications Monitoring Console</p>
                  </div>
                  <button onClick={() => { setIsAdminLoggedIn(false); setPassword(''); }} className="px-4 py-2 bg-red-950/40 border border-red-900 text-red-400 rounded-lg text-xs font-bold transition">
                    Terminate Session Authorization
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* CENTRAL STREAM LOGGER */}
                  <div className="lg:col-span-2 bg-[#0c1222] border border-slate-800 rounded-3xl p-6 shadow-md space-y-4">
                    <h5 className="text-sm font-mono text-teal-400 uppercase tracking-widest">REAL-TIME CLASSIFICATION STREAM LOGS</h5>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs font-mono">
                        <thead>
                          <tr className="border-b border-slate-800 text-slate-400">
                            <th className="pb-3">Timestamp</th>
                            <th className="pb-3">Target Profile</th>
                            <th className="pb-3">Confidence Rating</th>
                            <th className="pb-3 text-right">Interlock Matrix</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-900 text-slate-300">
                          {classificationLogs.map((log, index) => (
                            <tr key={index}>
                              <td className="py-3.5">{log.timestamp}</td>
                              <td className="py-3.5 font-bold text-white">{log.material}</td>
                              <td className="py-3.5">{log.confidence}</td>
                              <td className="py-3.5 text-right">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${log.status === 'Approved' || log.status === 'Live Input Link' ? 'bg-emerald-950 text-emerald-400 border border-emerald-900' : 'bg-red-950 text-red-400 border border-red-900'}`}>
                                  {log.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* ACTIVE CUSTOMER COMMUNICATIONS LOG */}
                  <div className="bg-[#0c1222] border border-slate-800 rounded-3xl p-6 shadow-md space-y-4">
                    <h5 className="text-sm font-mono text-emerald-400 uppercase tracking-widest">CUSTOMER INTERFACE PIPELINE</h5>
                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                      {customerInquiries.map((inq, index) => (
                        <div key={index} className="bg-slate-950 border border-slate-900 p-4 rounded-xl space-y-2">
                          <div className="flex justify-between items-start">
                            <div className="font-bold text-slate-200 text-sm">{inq.name}</div>
                            <span className="text-[9px] font-mono bg-slate-900 text-slate-400 border border-slate-800 px-1.5 py-0.5 rounded">Inquiry Node</span>
                          </div>
                          <div className="text-[10px] text-teal-400 font-mono break-all">{inq.email}</div>
                          <p className="text-xs text-slate-400 leading-relaxed font-light italic bg-slate-900/40 p-2.5 rounded-lg border border-slate-800/30">
                            "{inq.msg}"
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* FOOTER LAYER */}
      <footer className="bg-[#0c1222] border-t border-slate-800 px-6 py-6 text-center text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>© {new Date().getFullYear()} EcoSpark Manufacturing Systems Inc. All Rights Reserved.</div>
          <div className="text-[11px] text-slate-400 tracking-wider">Addis Ababa Science & Technology University (AASTU) // Integrated Engineering Team Project</div>
        </div>
      </footer>

    </div>
  );
}
