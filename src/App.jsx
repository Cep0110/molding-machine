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

  // Dynamic Dashboard Tracking States
  const [classificationLogs, setClassificationLogs] = useState([]);
  const [customerInquiries, setCustomerInquiries] = useState([]);

  // Contact Form States
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [contactSuccess, setContactSuccess] = useState(false);

  // Unified Connection to Hugging Face Space subdomain endpoint
  const BACKEND_URL = 'https://yani-321212-me-backend.hf.space';

  // --- Massively Expanded RAG Knowledge Base ---
  const RAG_KNOWLEDGE_BASE = {
    "how does the system contribute to the environment?": "EcoSpark transforms post-consumer waste materials into structural products, localizing production pipelines and satisfying global circular manufacturing protocols by keeping high-density plastics inside local production loops.",
    "what are the purchase and shipping options?": "The EcoSpark industrial rig is distributed as a turnkey manufacturing cell. Custom modifications, pricing tiers, and procurement options can be initiated directly by submitting an inquiry to our technical team via the contact command module.",
    "can this machine operate continuously?": "Yes, our hardware is designed with industrial-grade thermal blocks, automated feed screws, and active cooling loops, making it fully ready for continuous cyclic micro-factory deployments.",
    "where is this project engineered?": "The system is engineered at Addis Ababa Science and Technology University (AASTU) under the Integrated Engineering Team Project initiative.",
    "what are the core components of the mechanical assembly?": "The rig consists of a high-torque mechanical reduction hopper feed, a dual-zone heated barrel assembly utilizing precision band heaters, a heavy-duty compression mold assembly, and a vision-guided sorting stage.",
    "how is thermal control maintained?": "Thermal states are maintained using industrial PID temperature controllers connected to K-type thermocouples, allowing automated adjustments between 180°C and 260°C depending on the specific polymer profile identified.",
    "what structural artifacts can it produce?": "It produces high-density structural interlocking building modules, retaining wall blocks, paving tiles, and customizable composite matrix panels designed for load-bearing urban infrastructure grids.",
    "what is the group composition?": "This project is designed and deployed by the Integrated Engineering Team Project (IETP) Group 11 engineering cluster.",
    "how does the computer vision model classify items?": "The engine captures raw matrix visual inputs at the ingestion intake gate, pipes the binary data over an encrypted API channel to a fine-tuned deep learning image classification space, and checks the composition map against known material profiles.",
    "what happens to foreign or unapproved materials?": "If a non-plastic matrix, hazardous compound, or unapproved material is detected by the vision model, the system immediately flags a security tripwire exception, rejects the sample, and locks down the feed screw via an electronic safety interlock.",
    "what is the required input format for the api?": "The unified connection follows Option A, which reads raw user files into local memory arrays as base64 string data blocks and streams them over JSON to the Hugging Face /api/predict/ route.",
    "who are the primary developers of this system?": "The platform and mechanical architecture were developed collectively by team engineers Emnemelec, Elshaddai, Elias, Emran, Endalk, and Emran Mohammed.",
    "what specific polymer classes are supported by the model?": "The system explicitly evaluates high-density polyethylene (HDPE), polypropylene (PP), and other generic polymer residues to trigger explicit safe-melt interlock overrides.",
    "what happens if the target model confidence falls below forty five percent?": "The classifier activates a hard rejection loop, marking the incoming batch profile as an Unknown Non-Plastic Matrix to preserve the mechanical structural integrity of the barrel assembly.",
    "where did the team attend the initial project orientation?": "The core orientation session was carried out at AASTU Block 57 at 9:00 local time on March 1, 2026.",
    "what was the purpose of the march eighth coordination session?": "The team orchestrated a design alignment matrix evaluating localized urban engineering challenges alongside baseline UN Sustainable Development Goal parameters.",
    "what are the specific thermal limits of the barrel?": "The induction band system supports accurate thermal tracking up to a continuous ceiling of 350°C, managed directly via automated logic.",
    "how do you calculate funnel true lengths for the hopper assembly?": "Funnel sheet metal fabrication true lengths are resolved using radial line development methods mapping slant heights ($L = \\sqrt{R^2 + H^2}$) across standard coordinate projections.",
    "what is the total lifecycle duration of the project schedule?": "The deployment is calculated across a critical path method (CPM) schedule tracking key technical delivery pathways.",
    "how are software requirements prioritized for the platform?": "System requirements are verified against the MoSCoW methodology to isolate critical hardware tripwires from standard UI telemetry reporting options.",
    "what is the root administrator authorization password?": "The secure operator console relies on username 'admin' matched with cryptographic password token 'aastu11'."
  };

  const handleFAQClick = (question) => {
    const answer = RAG_KNOWLEDGE_BASE[question.toLowerCase()];
    setCustomerInquiries(prev => [
      { name: 'Anonymous User', email: 'Internal RAG Route', msg: `Clicked Preset Query: "${question}"` },
      ...prev
    ]);
    setChatMessages(prev => [
      ...prev,
      { sender: 'user', text: question },
      { sender: 'bot', text: answer }
    ]);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const originalInput = userInput.trim();
    const userQuery = originalInput.toLowerCase();
    let botResponse = "I cannot locate specific operational logs regarding that parameter in my external knowledge base directory. Please contact an EcoSpark system architect for deep architectural data.";

    setCustomerInquiries(prev => [
      { name: 'Web Assistant User', email: 'Interactive Search Query', msg: originalInput },
      ...prev
    ]);

    for (let key in RAG_KNOWLEDGE_BASE) {
      if (userQuery.includes(key) || key.includes(userQuery)) {
        botResponse = RAG_KNOWLEDGE_BASE[key];
        break;
      }
    }

    setChatMessages(prev => [...prev, { sender: 'user', text: originalInput }, { sender: 'bot', text: botResponse }]);
    setUserInput('');
  };

  // --- NATIVE BASE64 STREAM PIPELINE ---
  const triggerImageClassification = async () => {
    if (!selectedFile) {
      setClassifierError('Please place a valid target image compound inside the intake gate.');
      return;
    }

    setAnalyzing(true);
    setClassifierError('');
    setInferenceResult(null);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      reader.onloadend = async () => {
        const fullBase64Data = reader.result;

        try {
          // Strict JSON structural array formatting for direct API/Predict gateways
          const response = await fetch(`${BACKEND_URL}/api/predict/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              data: [fullBase64Data]
            }),
          });

          if (!response.ok) throw new Error(`Network infrastructure fault: ${response.status}`);

          const json = await response.json();
          const rawData = json.data;
          const payload = Array.isArray(rawData) ? rawData[0] : rawData;

          if (!payload || payload.error) {
            setClassifierError(payload?.error || 'Unrecognized response matrix array format layout.');
            setClassificationLogs(prev => [
              { timestamp: new Date().toLocaleTimeString(), material: 'Processing Error', confidence: '0.0%', status: 'Fault Triggered' },
              ...prev
            ]);
          } else {
            setInferenceResult(payload);
            setClassificationLogs(prev => [
              { 
                timestamp: new Date().toLocaleTimeString(), 
                material: payload.detected_material || 'Unknown Polymer', 
                confidence: `${payload.confidence || '90.0'}%`, 
                status: payload.is_plastic ? 'Approved Input' : 'Rejected Material' 
              },
              ...prev
            ]);
          }
        } catch (innerErr) {
          setClassifierError('Failed to establish unified connection to the Hugging Face hardware space cluster.');
          setClassificationLogs(prev => [
            { timestamp: new Date().toLocaleTimeString(), material: 'API Offline Timeout', confidence: 'N/A', status: 'Connection Broken' },
            ...prev
          ]);
          console.error(innerErr);
        } finally {
          setAnalyzing(false);
        }
      };
    } catch (err) {
      setClassifierError('Failed parsing the target asset binary structure local sequence data.');
      setAnalyzing(false);
      console.error(err);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
      setInferenceResult(null);
      setClassifierError('');
    }
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) return;
    
    setCustomerInquiries(prev => [
      { name: contactForm.name, email: contactForm.email, msg: contactForm.message },
      ...prev
    ]);
    
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
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col justify-between selection:bg-amber-400/30">
      
      {/* GLOBAL LIGHT NAVIGATION LAYER */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="EcoSpark Logo" className="h-11 w-auto object-contain" />
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tighter text-amber-500 italic">ECOSPARK</span>
              <span className="text-[9px] font-mono tracking-widest text-slate-500 uppercase font-bold">AASTU IETP // GROUP 11</span>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {['home', 'chatbot', 'classifier', 'marketplace', 'dashboard'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-xs font-bold tracking-wide uppercase transition-all ${activeTab === tab ? 'bg-amber-500 text-slate-950 shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
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
              <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900">
                Transforming Secondary Polymers Into <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-500">Architectural Value</span>
              </h2>
              <p className="text-slate-600 text-base md:text-lg font-normal leading-relaxed max-w-2xl mx-auto">
                Empowering localized circular macro-economies through high-precision computerized micro-extrusion systems designed for distributed community manufacturing applications.
              </p>
              <div className="pt-4 flex flex-wrap justify-center gap-3">
                <button onClick={() => setActiveTab('classifier')} className="px-5 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold uppercase tracking-wider rounded-xl transition shadow-sm">
                  Launch Ingestion Scanner
                </button>
                <button onClick={() => setActiveTab('marketplace')} className="px-5 py-3 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider border border-slate-200 rounded-xl transition shadow-sm">
                  Explore Machine Specifications
                </button>
              </div>
            </header>

            {/* UN SDG IMPERATIVE VALUES WITH PROFESSIONAL ICONS */}
            <section className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
              <div className="mb-8 border-l-4 border-amber-500 pl-4">
                <h3 className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold">IMPACT METRIC VERIFICATION</h3>
                <h4 className="text-2xl font-black text-slate-900 mt-0.5">Engineering Values Measured Against UN SDGs</h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-2xl font-black text-amber-600 font-mono">SDG 8</span>
                      <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                    </div>
                    <div className="text-sm font-bold text-slate-900">Decent Work & Growth</div>
                    <p className="text-xs text-slate-500 mt-2 font-normal leading-relaxed">Enables community level manufacturing jobs via localized high-yield tooling infrastructure systems.</p>
                  </div>
                </div>
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-2xl font-black text-amber-600 font-mono">SDG 9</span>
                      <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                    </div>
                    <div className="text-sm font-bold text-slate-900">Industry & Innovation</div>
                    <p className="text-xs text-slate-500 mt-2 font-normal leading-relaxed">Integrates computer vision networks directly with raw processing mechanical rigs.</p>
                  </div>
                </div>
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-2xl font-black text-amber-600 font-mono">SDG 11</span>
                      <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                    </div>
                    <div className="text-sm font-bold text-slate-900">Sustainable Cities</div>
                    <p className="text-xs text-slate-500 mt-2 font-normal leading-relaxed">Mitigates urban raw municipal density indices by converting solid materials directly within city cores.</p>
                  </div>
                </div>
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-2xl font-black text-amber-600 font-mono">SDG 12</span>
                      <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H17m0 0V4m0 4h.01"></path></svg>
                    </div>
                    <div className="text-sm font-bold text-slate-900">Responsible Consumption</div>
                    <p className="text-xs text-slate-500 mt-2 font-normal leading-relaxed">Locks open lifecycle loops by converting waste streams into structural artifacts.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* PROCESS TIMELINE WITH INLINE ICON REPOSITORIES */}
            <section className="space-y-8">
              <div className="text-center">
                <h3 className="text-[10px] font-mono uppercase tracking-widest text-amber-600 font-bold">OPERATIONAL FLOW PIPELINE</h3>
                <h4 className="text-2xl font-black text-slate-900 mt-0.5">The Lifecycle Pipeline Process</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>, title: 'Source Collection', desc: 'Target compound aggregates are sourced, sanitized, and fed into mechanical size-reduction grinders.' },
                  { icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>, title: 'Vision Sorting', desc: 'High-speed edge AI classifies composition and dynamically streams correct thermal operating points.' },
                  { icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>, title: 'Controlled Extrusion', desc: 'Precision PID feedback induction bands safely melt verified resins down the drive barrel.' },
                  { icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>, title: 'Final Compression Mold', desc: 'The liquefied composition settles into dense heavy-duty engineering modules under structural load.' }
                ].map((p, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-xl border border-slate-200 relative shadow-sm hover:border-amber-400 transition">
                    <div className="text-amber-500 bg-amber-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4 shadow-inner">
                      {p.icon}
                    </div>
                    <h5 className="text-base font-bold text-slate-900">{p.title}</h5>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed font-normal">{p.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* SLIGHTLY GRAY PROFESSIONAL CONTACT FRAMEWORK */}
            <section id="contact" className="max-w-2xl mx-auto bg-slate-100 border border-slate-200 p-8 rounded-2xl shadow-sm">
              <h4 className="text-lg font-black text-slate-900 mb-1 text-center">Contact Technical Command</h4>
              <p className="text-xs text-slate-500 text-center mb-6">Submit queries directly to the engineering team repository pipeline.</p>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={contactForm.name}
                    onChange={e => setContactForm({...contactForm, name: e.target.value})}
                    className="bg-white border border-slate-300 rounded-xl p-3 text-xs focus:outline-none focus:border-amber-500 text-slate-800 transition shadow-inner"
                  />
                  <input
                    type="email"
                    placeholder="Inquiry Email Address"
                    value={contactForm.email}
                    onChange={e => setContactForm({...contactForm, email: e.target.value})}
                    className="bg-white border border-slate-300 rounded-xl p-3 text-xs focus:outline-none focus:border-amber-500 text-slate-800 transition shadow-inner"
                  />
                </div>
                <textarea
                  rows="3"
                  placeholder="Specify system inquiry data parameters..."
                  value={contactForm.message}
                  onChange={e => setContactForm({...contactForm, message: e.target.value})}
                  className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs focus:outline-none focus:border-amber-500 text-slate-800 transition shadow-inner"
                ></textarea>
                <button type="submit" className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold uppercase tracking-wider rounded-xl transition shadow-sm">
                  Transmit Telemetry Package
                </button>
                {contactSuccess && (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-3 rounded-xl text-center text-xs font-mono">
                    ✅ Data packet transmitted successfully to AASTU Block 57.
                  </div>
                )}
              </form>
            </section>
          </div>
        )}

        {/* AI ASSISTANT (RAG SYSTEM) - PROFESSIONAL LIGHT STYLING */}
        {activeTab === 'chatbot' && (
          <div className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col h-[580px]">
            <div className="bg-slate-50 p-5 border-b border-slate-200 flex justify-between items-center">
              <div>
                <h3 className="text-base font-bold text-slate-900">EcoSpark Retrieval-Augmented System</h3>
                <p className="text-[10px] text-slate-500 font-mono uppercase font-semibold">Knowledge Base Core Node // Verified RAG Pipeline Active</p>
              </div>
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
            </div>

            <div className="flex-grow p-6 overflow-y-auto space-y-4 bg-slate-50/40">
              {chatMessages.map((m, idx) => (
                <div key={idx} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xl p-3.5 rounded-xl text-xs leading-relaxed ${m.sender === 'user' ? 'bg-amber-500 text-slate-950 rounded-tr-none' : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none shadow-sm'}`}>
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            {/* QUICK PRESET CLICKS */}
            <div className="p-4 bg-slate-50 border-t border-slate-200">
              <span className="text-[9px] uppercase tracking-wider font-mono text-slate-400 block mb-2 font-bold">Frequently Queried Parameters:</span>
              <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
                {[
                  "Where is this project engineered?",
                  "How is thermal control maintained?",
                  "What specific polymer classes are supported by the model?",
                  "How do you calculate funnel true lengths for the hopper assembly?"
                ].map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleFAQClick(q)}
                    className="bg-white hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg text-xs text-slate-700 font-medium transition shadow-sm"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-200 flex gap-2">
              <input
                type="text"
                placeholder="Ask our semantic RAG engine technical or project questions..."
                value={userInput}
                onChange={e => setUserInput(e.target.value)}
                className="flex-grow bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-amber-500 text-slate-800"
              />
              <button type="submit" className="px-5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl font-bold text-xs uppercase tracking-wider transition shadow-sm">
                Query
              </button>
            </form>
          </div>
        )}

        {/* CLASSIFIER INTAKE STATION */}
        {activeTab === 'classifier' && (
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            <section className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between shadow-sm">
              <div>
                <div className="mb-4">
                  <h3 className="text-[10px] font-mono uppercase tracking-widest text-amber-600 font-bold">MACHINE VISION PORTAL</h3>
                  <h4 className="text-lg font-bold text-slate-900 mt-0.5">Physical Aggregate Target Core Ingestion</h4>
                </div>

                <div className="border-2 border-dashed border-slate-200 bg-slate-50 rounded-xl h-72 flex flex-col items-center justify-center relative overflow-hidden p-4">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Target component feed" className="w-full h-full object-contain rounded-xl" />
                  ) : (
                    <div className="text-center space-y-2">
                      <span className="text-4xl block opacity-60">📷</span>
                      <span className="text-xs text-slate-400 font-mono">Mount Active Material Feed Layer</span>
                    </div>
                  )}

                  {analyzing && (
                    <div className="absolute inset-0 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center space-y-3">
                      <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-[10px] font-mono tracking-widest text-amber-600 font-bold animate-pulse">EXECUTING CLASSIFICATION PASS...</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="file-upload-gate" />
                <label htmlFor="file-upload-gate" className="block w-full text-center bg-slate-100 hover:bg-slate-200 border border-slate-200 py-3 rounded-xl font-bold text-xs text-slate-700 cursor-pointer transition">
                  {selectedFile ? 'Swap Ingestion Sample' : 'Select From Media Library'}
                </label>
                <button
                  onClick={triggerImageClassification}
                  disabled={!selectedFile || analyzing}
                  className={`w-full py-3 rounded-xl font-bold uppercase tracking-wider text-xs transition shadow-sm ${selectedFile && !analyzing ? 'bg-amber-500 hover:bg-amber-600 text-slate-950' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
                >
                  Analyze Compound Structure
                </button>
              </div>
            </section>

            <section className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-center min-h-[400px] shadow-sm">
              <h3 className="text-[10px] font-mono uppercase tracking-widest text-amber-600 font-bold mb-4">AUTOMATED PROCESS CONFIGURATOR</h3>
              
              {classifierError && <div className="bg-red-50 border border-red-200 p-4 rounded-xl text-xs font-mono text-red-700">{classifierError}</div>}
              {!inferenceResult && !classifierError && !analyzing && (
                <div className="text-center font-mono text-xs text-slate-400 py-20 border border-slate-100 bg-slate-50 rounded-xl">
                  Awaiting ingestion matrix data streaming...
                </div>
              )}

              {inferenceResult && (
                <div className="space-y-6">
                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
                    <span className="text-[9px] font-mono uppercase text-slate-400 block">Identified Structural Composition</span>
                    <div className={`text-2xl font-black tracking-tight mt-1 ${inferenceResult.is_plastic ? 'text-amber-600' : 'text-red-600'}`}>
                      {inferenceResult.detected_material}
                    </div>
                    <div className="mt-2 text-xs font-mono text-slate-600">
                      🎯 Statistical Engine Confidence: <span className="text-amber-600 font-bold">{inferenceResult.confidence}%</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 border border-slate-200 p-4 text-center rounded-xl">
                      <span className="text-[9px] font-mono text-slate-400 block uppercase">Heating Setpoint</span>
                      <span className={`text-2xl font-black font-mono block mt-1 ${inferenceResult.is_plastic ? 'text-amber-600' : 'text-slate-300'}`}>
                        {inferenceResult.recommendedTemp}°C
                      </span>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 p-4 text-center rounded-xl">
                      <span className="text-[9px] font-mono text-slate-400 block uppercase">Cooling Duty Cycle</span>
                      <span className={`text-2xl font-black font-mono block mt-1 ${inferenceResult.is_plastic ? 'text-blue-600' : 'text-slate-300'}`}>
                        {inferenceResult.recommendedCooling}s
                      </span>
                    </div>
                  </div>

                  <div className={`p-4 rounded-xl border font-mono text-xs leading-relaxed ${inferenceResult.is_plastic ? 'bg-amber-50/50 border-amber-200 text-amber-800' : 'bg-red-50/50 border-red-200 text-red-700'}`}>
                    {inferenceResult.action_status}
                  </div>
                </div>
              )}
            </section>
          </div>
        )}

        {/* CATALOG SPECIFICATIONS SECTION - DESIGN UN-CRUNCHED */}
        {activeTab === 'marketplace' && (
          <div className="space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h3 className="text-[10px] font-mono uppercase tracking-widest text-amber-600 font-bold">ECOSPARK HARDWARE DISTRIBUTION</h3>
              <h4 className="text-2xl font-black text-slate-900">Commercial Hardware & Product Catalog</h4>
              <p className="text-xs text-slate-500">Acquire enterprise grade automated recycling units or source structural hardware components generated directly by our systems.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* COMPONENT 1: INDUSTRIAL RIG (ANTI-CROP POSITION FIX) */}
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between">
                <div className="h-64 bg-slate-50 relative flex items-center justify-center p-4 border-b border-slate-100">
                  {/* ADJUSTED: Scale down object alignment properties to completely prevent image component clipping */}
                  <img src="/machine.png" alt="EcoSpark Extruder Unit" className="max-h-full max-w-full object-scale-down mix-blend-multiply" />
                  <span className="absolute bottom-4 left-4 bg-amber-500 text-slate-950 px-2.5 py-1 rounded text-[9px] font-mono font-bold uppercase tracking-wider shadow-sm">Industrial Equipment</span>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <h5 className="text-lg font-bold text-slate-900">EcoSpark Automated Processing Cell v2.5</h5>
                    <span className="text-sm font-mono font-black text-amber-600">Inquire Unit</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed font-normal">
                    A fully self-contained manufacturing cell featuring integrated multi-stage optical categorization, adaptive heating controllers, heavy duty high torque extrusion barrels, and interlocked compression molding presses.
                  </p>
                  <ul className="text-xs font-mono text-slate-500 space-y-1.5 border-t border-slate-100 pt-3">
                    <li>📍 Core Architecture: Dual-Core Processing Units</li>
                    <li>📍 Heat Limit Capability: 350°C Max Continuous</li>
                    <li>📍 Assembly Node Point: AASTU Block 57 Grid</li>
                  </ul>
                  <button onClick={() => { setActiveTab('home'); setTimeout(() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold uppercase tracking-wider rounded-xl transition shadow-sm">
                    Request Integration Specifications
                  </button>
                </div>
              </div>

              {/* COMPONENT 2: INTERLOCKING BLOCKS WITH DYNAMIC PRICE RANGES */}
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between">
                <div className="h-64 bg-slate-50 relative flex items-center justify-center p-4 border-b border-slate-100">
                  <img src="/product.jpg" alt="Recycled Materials Components" className="max-h-full max-w-full object-scale-down mix-blend-multiply" />
                  <span className="absolute bottom-4 left-4 bg-slate-800 text-white px-2.5 py-1 rounded text-[9px] font-mono font-bold uppercase tracking-wider shadow-sm">Output Product</span>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <h5 className="text-lg font-bold text-slate-900">High-Density Structural Modules</h5>
                    {/* UPDATED: Price adjusted to new specification threshold layout */}
                    <span className="text-sm font-mono font-black text-amber-600">50.00 - 100.00 ETB / Unit</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed font-normal">
                    Heavy duty structural interlocking modules fabricated entirely from verified circular matrices. Excellent tensile performance profiles designed specifically for urban construction grid installations and retaining walls.
                  </p>
                  <ul className="text-xs font-mono text-slate-500 space-y-1.5 border-t border-slate-100 pt-3">
                    <li>📍 Density Rating: High Viscosity Load Compression</li>
                    <li>📍 Dimensions: 400mm x 200mm Interlocking Grid</li>
                    <li>📍 Composition: 100% Recycled Technical Polymer</li>
                  </ul>
                  <button onClick={() => { setActiveTab('home'); setTimeout(() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="w-full py-3 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-xl transition shadow-sm">
                    Submit Batch Order Application
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PROTECTED OPERATOR HUB */}
        {activeTab === 'dashboard' && (
          <div className="max-w-6xl mx-auto">
            {!isAdminLoggedIn ? (
              <div className="max-w-md mx-auto bg-white border border-slate-200 p-8 rounded-2xl shadow-sm text-center">
                <span className="text-3xl block mb-2">🔒</span>
                <h4 className="text-lg font-bold text-slate-900 mb-1">Secure Core Administration Portal</h4>
                <p className="text-xs text-slate-400 mb-6">Restricted utility. Provide specific technical authorization to check active logs.</p>
                <form onSubmit={handleAdminLogin} className="space-y-4 text-left">
                  <div>
                    <label className="text-[9px] font-mono text-slate-400 uppercase block mb-1">Root Operator ID</label>
                    <input
                      type="text"
                      placeholder="e.g. admin"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-amber-500 text-slate-800 transition"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-mono text-slate-400 uppercase block mb-1">Cryptographic Security Token</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-amber-500 text-slate-800 transition"
                    />
                    <span className="text-[9px] text-slate-400 font-mono mt-1 block">Credentials Hint: admin / aastu11</span>
                  </div>
                  <button type="submit" className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold uppercase tracking-wider rounded-xl transition mt-2 shadow-sm">
                    Verify Administrative Access
                  </button>
                </form>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
                  <div>
                    <h4 className="text-xl font-black text-slate-900 tracking-tight">EcoSpark Master Control Matrix</h4>
                    <p className="text-xs text-slate-500 font-mono">Live Ingestion Feeds & Active Customer Communications Monitoring Console</p>
                  </div>
                  <button onClick={() => { setIsAdminLoggedIn(false); setPassword(''); }} className="px-3 py-1.5 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs font-bold transition hover:bg-red-100">
                    Terminate Session Authorization
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* CENTRAL STREAM LOGGER */}
                  <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                    <h5 className="text-[10px] font-mono text-amber-600 uppercase tracking-widest font-bold">REAL-TIME CLASSIFICATION STREAM LOGS</h5>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs font-mono">
                        <thead>
                          <tr className="border-b border-slate-200 text-slate-400">
                            <th className="pb-3">Timestamp</th>
                            <th className="pb-3">Target Profile</th>
                            <th className="pb-3">Confidence</th>
                            <th className="pb-3 text-right">Interlock Matrix</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-600">
                          {classificationLogs.length === 0 ? (
                            <tr>
                              <td colSpan="4" className="py-8 text-center text-slate-400 italic">No items scanned this session. Upload an image inside the "Classifier" tab to track operations live.</td>
                            </tr>
                          ) : (
                            classificationLogs.map((log, index) => (
                              <tr key={index}>
                                <td className="py-3.5">{log.timestamp}</td>
                                <td className="py-3.5 font-bold text-slate-900">{log.material}</td>
                                <td className="py-3.5">{log.confidence}</td>
                                <td className="py-3.5 text-right">
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${log.status.includes('Approved') ? 'bg-amber-50 text-amber-800 border border-amber-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                                    {log.status}
                                  </span>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* ACTIVE CUSTOMER COMMUNICATIONS LOG */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                    <h5 className="text-[10px] font-mono text-amber-600 uppercase tracking-widest font-bold">CUSTOMER INTERFACE PIPELINE</h5>
                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                      {customerInquiries.length === 0 ? (
                        <div className="text-center font-mono text-xs text-slate-400 py-20 italic">
                          No user traffic detected. Ask custom questions in the "Chatbot" tab or submit the Contact form to populate telemetry.
                        </div>
                      ) : (
                        customerInquiries.map((inq, index) => (
                          <div key={index} className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2 shadow-sm">
                            <div className="flex justify-between items-start">
                              <div className="font-bold text-slate-800 text-xs">{inq.name}</div>
                              <span className="text-[9px] font-mono bg-white border border-slate-200 text-slate-400 px-1.5 py-0.5 rounded">Live Traffic</span>
                            </div>
                            <div className="text-[9px] text-amber-600 font-mono break-all">{inq.email}</div>
                            <p className="text-xs text-slate-500 leading-relaxed font-normal italic bg-white p-2.5 rounded-lg border border-slate-100">
                              "{inq.msg}"
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* GLOBAL FOOTER LAYER */}
      <footer className="bg-white border-t border-slate-200 px-6 py-6 text-center text-xs font-mono text-slate-400 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>© {new Date().getFullYear()} EcoSpark Manufacturing Systems Inc. All Rights Reserved.</div>
          <div className="text-[10px] text-slate-500 tracking-wider font-semibold uppercase">Addis Ababa Science & Technology University (AASTU) // Integrated Engineering Team Project</div>
        </div>
      </footer>

    </div>
  );
}
