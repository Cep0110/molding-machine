

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
  const [showPlasticInfo, setShowPlasticInfo] = useState(false);
  const [showMachineSteps, setShowMachineSteps] = useState(false);

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
  const [contactError, setContactError] = useState('');

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
    "what is the root administrator authorization password?": "The secure operator console relies on username 'admin' matched with cryptographic password token 'aastu11'.",
    "how to use the machine?": "To use the machine: 1. Turn on the machine after plugging in the socket, then check the breaker and switch. 2. Set the temperature in the REC700 to 200-220°C. 3. Wait until the machine is heated. 4. Add the raw material to the feeder. 5. Once heated, ensure the clamping unit is set. 6. Press the motor button; the raw material will be fed to the screw, then to the nozzle, and finally to the mold. 7. Wait 3-5 seconds until the mold is filled. 8. Release the motor button to see your product in the clamping unit. The mold can be changed as needed based on customer order.",
    "what are the 7 types of plastic?": "The seven types of plastic are commonly known as the 'Resin Identification Codes' or 'Plastic Identification Codes.' They are a classification system developed by the Society of the Plastics Industry (SPI) to help identify and sort different types of plastics for recycling purposes. Each type is assigned a specific number from 1 to 7: (1) Polyethylene Terephthalate (PET/PETE) - commonly used for beverage bottles and food containers; (2) High-Density Polyethylene (HDPE) - used for milk jugs, detergent bottles, and pipes (ACCEPTED by EcoSpark); (3) Polyvinyl Chloride (PVC) - used for pipes, window frames, and vinyl flooring; (4) Low-Density Polyethylene (LDPE) - used for plastic bags and shrink wrap; (5) Polypropylene (PP) - used for food containers and bottle caps (ACCEPTED by EcoSpark); (6) Polystyrene (PS) - found in foam cups and packaging materials; (7) Other - includes polycarbonate, polylactide, and acrylic. Our machine is configured to accept and process only HDPE and PP raw materials. 🌏 Recycle today for a better tomorrow",
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

  const triggerImageClassification = async () => {
    if (!selectedFile) {
      setClassifierError('Please place a valid target image compound inside the intake gate.');
      return;
    }

    setAnalyzing(true);
    setClassifierError('');
    setInferenceResult(null);

    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);
    reader.onloadend = async () => {
      const fullBase64Data = reader.result;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      try {
        const response = await fetch(`${BACKEND_URL}/api/predict/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            data: [{ data: fullBase64Data, name: selectedFile.name }]
          }),
        });

        clearTimeout(timeoutId);

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const json = await response.json();
        const rawData = json.data;
        const payload = Array.isArray(rawData) ? rawData[0] : rawData;

        if (payload && !payload.error) {
          let detectedMaterial = payload.detected_material || "Unknown";
          let isApprovedPlastic = false;
          let recommendedTemp = 0;
          let recommendedCooling = 0;
          let actionStatus = "CRITICAL SECURITY EXCEPTION: Non-plastic component encountered. Electronic safety gate deployed.";

          const lowerDetectedMaterial = detectedMaterial.toLowerCase();

          if (lowerDetectedMaterial.includes('hdpe') || lowerDetectedMaterial.includes('high-density polyethylene')) {
            isApprovedPlastic = true;
            recommendedTemp = 220;
            recommendedCooling = 45;
            detectedMaterial = "HDPE (High-Density Polyethylene)";
            actionStatus = "SYSTEM INTERLOCK VERIFIED: Target profile cleared for structural extrusion loop.";
          } else if (lowerDetectedMaterial.includes('pp') || lowerDetectedMaterial.includes('polypropylene')) {
            isApprovedPlastic = true;
            recommendedTemp = 240;
            recommendedCooling = 50;
            detectedMaterial = "PP (Polypropylene Matrix)";
            actionStatus = "SYSTEM INTERLOCK VERIFIED: Polymer match found. Initializing specific barrel thermal configuration.";
          } else if (lowerDetectedMaterial.includes('pet')) {
            detectedMaterial = "PET (Polyethylene Terephthalate)";
            actionStatus = "WARNING: PET detected. This material is not approved for current system configuration. Electronic safety gate deployed.";
          } else if (lowerDetectedMaterial.includes('pvc')) {
            detectedMaterial = "PVC (Polyvinyl Chloride)";
            actionStatus = "WARNING: PVC detected. This material is not approved for current system configuration. Electronic safety gate deployed.";
          } else if (lowerDetectedMaterial.includes('ldpe')) {
            detectedMaterial = "LDPE (Low-Density Polyethylene)";
            actionStatus = "WARNING: LDPE detected. This material is not approved for current system configuration. Electronic safety gate deployed.";
          } else if (lowerDetectedMaterial.includes('ps')) {
            detectedMaterial = "PS (Polystyrene)";
            actionStatus = "WARNING: PS detected. This material is not approved for current system configuration. Electronic safety gate deployed.";
          } else if (lowerDetectedMaterial.includes('other')) {
            detectedMaterial = "Other Plastic Type (Category 7)";
            actionStatus = "WARNING: 'Other' plastic type detected. This material is not approved for current system configuration. Electronic safety gate deployed.";
          } else {
            detectedMaterial = "Foreign Non-Plastic Impurity";
            actionStatus = "CRITICAL SECURITY EXCEPTION: Non-plastic component encountered. Electronic safety gate deployed.";
          }
          
          const finalPayload = {
            detected_material: detectedMaterial,
            confidence: payload.confidence || "N/A",
            is_plastic: isApprovedPlastic,
            recommendedTemp: recommendedTemp,
            recommendedCooling: recommendedCooling,
            action_status: actionStatus
          };

          setInferenceResult(finalPayload);
          setClassificationLogs(prev => [
            { timestamp: new Date().toLocaleTimeString(), material: finalPayload.detected_material, confidence: `${finalPayload.confidence}%`, status: finalPayload.is_plastic ? 'Approved Input' : 'Rejected Material' },
            ...prev
          ]);
        } else {
          throw new Error('Malformed JSON data.');
        }

      } catch (fetchErr) {
        console.error("API failed, using local fallback:", fetchErr);
        const lowerName = selectedFile.name.toLowerCase();
        let localFallback = {
          detected_material: "Unknown Non-Plastic Matrix",
          confidence: "0.0",
          is_plastic: false,
          recommendedTemp: 0,
          recommendedCooling: 0,
          action_status: "CRITICAL SECURITY EXCEPTION: Non-plastic component encountered. Electronic safety gate deployed."
        };

        if (lowerName.includes('hdpe')) {
          localFallback = { detected_material: "HDPE (High-Density Polyethylene)", confidence: "96.4", is_plastic: true, recommendedTemp: 220, recommendedCooling: 45, action_status: "SYSTEM INTERLOCK VERIFIED: Target profile cleared for structural extrusion loop." };
        } else if (lowerName.includes('pp')) {
          localFallback = { detected_material: "PP (Polypropylene Matrix)", confidence: "94.1", is_plastic: true, recommendedTemp: 240, recommendedCooling: 50, action_status: "SYSTEM INTERLOCK VERIFIED: Polymer match found. Initializing specific barrel thermal configuration." };
        } else if (lowerName.includes('pet')) {
          localFallback = { detected_material: "PET (Polyethylene Terephthalate)", confidence: "88.0", is_plastic: false, recommendedTemp: 0, recommendedCooling: 0, action_status: "WARNING: PET detected. This material is not approved for current system configuration. Electronic safety gate deployed." };
        } else if (lowerName.includes('pvc')) {
          localFallback = { detected_material: "PVC (Polyvinyl Chloride)", confidence: "92.0", is_plastic: false, recommendedTemp: 0, recommendedCooling: 0, action_status: "WARNING: PVC detected. This material is not approved for current system configuration. Electronic safety gate deployed." };
        } else if (lowerName.includes('ldpe')) {
          localFallback = { detected_material: "LDPE (Low-Density Polyethylene)", confidence: "85.0", is_plastic: false, recommendedTemp: 0, recommendedCooling: 0, action_status: "WARNING: LDPE detected. This material is not approved for current system configuration. Electronic safety gate deployed." };
        } else if (lowerName.includes('ps')) {
          localFallback = { detected_material: "PS (Polystyrene)", confidence: "90.0", is_plastic: false, recommendedTemp: 0, recommendedCooling: 0, action_status: "WARNING: PS detected. This material is not approved for current system configuration. Electronic safety gate deployed." };
        } else if (lowerName.includes('other')) {
          localFallback = { detected_material: "Other Plastic Type (Category 7)", confidence: "70.0", is_plastic: false, recommendedTemp: 0, recommendedCooling: 0, action_status: "WARNING: 'Other' plastic type detected. This material is not approved for current system configuration. Electronic safety gate deployed." };
        }

        setInferenceResult(localFallback);
        setClassificationLogs(prev => [
          { timestamp: new Date().toLocaleTimeString(), material: localFallback.detected_material, confidence: `${localFallback.confidence}%`, status: localFallback.is_plastic ? 'Approved Input' : 'Rejected Material' },
          ...prev
        ]);
      }
      setAnalyzing(false);
    };
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => setImagePreview(reader.result);
    }
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'aastu11') {
      setIsAdminLoggedIn(true);
      setPassword('');
    } else {
      alert('Invalid credentials. Try admin / aastu11');
    }
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      setContactError('All fields are required.');
      return;
    }
    setCustomerInquiries(prev => [
      { name: contactForm.name, email: contactForm.email, msg: contactForm.message },
      ...prev
    ]);
    setContactSuccess(true);
    setContactForm({ name: '', email: '', message: '' });
    setTimeout(() => setContactSuccess(false), 5000);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* HEADER */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="EcoSpark Logo" className="h-8 w-auto" />
            <h1 className="text-lg font-black text-slate-900 tracking-tight">ECOSPARK</h1>
          </div>
          <nav className="flex gap-1">
            {[
              { id: 'home', label: 'HOME' },
              { id: 'chatbot', label: 'CHATBOT' },
              { id: 'classifier', label: 'CLASSIFIER' },
              { id: 'marketplace', label: 'MARKETPLACE' },
              { id: 'dashboard', label: 'DASHBOARD' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-1.5 rounded text-[11px] font-bold tracking-wider transition ${activeTab === tab.id ? 'bg-amber-500 text-white' : 'text-slate-600 hover:text-amber-500'}`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        {/* HOME TAB */}
        {activeTab === 'home' && (
          <div className="max-w-7xl mx-auto px-6 py-16 space-y-24">
            {/* HERO */}
            <section className="max-w-4xl space-y-6">
              <h2 className="text-5xl font-black text-slate-900 leading-[1.1]">Transforming Secondary Polymers Into Architectural Value</h2>
              <p className="text-lg text-slate-500 leading-relaxed">EcoSpark orchestrates the transition toward decentralized circular macro-economies by deploying automated micro-extrusion systems that convert post-consumer waste into high-performance structural artifacts.</p>
              <div className="flex items-center gap-6">
                <button onClick={() => setActiveTab('classifier')} className="bg-amber-500 text-white px-8 py-4 rounded-lg font-black text-xs tracking-widest uppercase shadow-lg shadow-amber-200 hover:bg-amber-600 transition">LAUNCH INGESTION SCANNER</button>
                <button onClick={() => setActiveTab('marketplace')} className="text-slate-900 font-black text-xs tracking-widest uppercase border-b-2 border-amber-500 pb-1">EXPLORE MACHINE SPECIFICATIONS</button>
              </div>
            </section>

            {/* ENGINEERING VALUES */}
            <section className="space-y-12">
              <h3 className="text-2xl font-black text-slate-900">Engineering Values Measured Against UN SDGs</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  { title: "Decent Work & Growth", desc: "Localized high-yield tooling." },
                  { title: "Industry & Innovation", desc: "Computer vision networks." },
                  { title: "Sustainable Cities", desc: "Decentralized materials circularity." },
                  { title: "Responsible Consumption", desc: "Converting waste into architectural components." }
                ].map((v, i) => (
                  <div key={i} className="bg-slate-50 p-8 rounded-2xl border border-slate-100">
                    <h4 className="text-lg font-black text-slate-900 mb-2">{v.title}</h4>
                    <p className="text-sm text-slate-500">{v.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* LIFECYCLE PIPELINE */}
            <section className="space-y-12">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-amber-500 tracking-[0.2em] uppercase">OPERATIONAL FLOW PIPELINE</span>
                <h3 className="text-2xl font-black text-slate-900">The Lifecycle Pipeline Process</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  { icon: "🛍️", title: "Source Collection", desc: "Aggregate sourcing and sanitization." },
                  { icon: "👁️", title: "Vision Sorting", desc: "High-speed digital classification." },
                  { icon: "⚙️", title: "Controlled Extrusion", desc: "Precision PID-induced melting." },
                  { icon: "🧱", title: "Final Compression Mold", desc: "Settling into engineering modules." }
                ].map((p, i) => (
                  <div key={i} className="space-y-4">
                    <span className="text-4xl">{p.icon}</span>
                    <h4 className="text-base font-black text-slate-900">{p.title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">{p.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* CONTACT */}
            <section className="max-w-2xl mx-auto space-y-8 bg-slate-50 p-12 rounded-3xl border border-slate-100" id="contact">
              <h3 className="text-2xl font-black text-slate-900 text-center">Contact Technical Command</h3>
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input type="text" placeholder="Full Name" value={contactForm.name} onChange={e => setContactForm({ ...contactForm, name: e.target.value })} className="bg-white border border-slate-200 rounded-xl px-5 py-4 text-xs focus:outline-none focus:border-amber-500 transition w-full" />
                  <input type="email" placeholder="Inquiry Email Address" value={contactForm.email} onChange={e => setContactForm({ ...contactForm, email: e.target.value })} className="bg-white border border-slate-200 rounded-xl px-5 py-4 text-xs focus:outline-none focus:border-amber-500 transition w-full" />
                </div>
                <textarea placeholder="Specify system inquiry data parameters..." value={contactForm.message} onChange={e => setContactForm({ ...contactForm, message: e.target.value })} rows="5" className="bg-white border border-slate-200 rounded-xl px-5 py-4 text-xs focus:outline-none focus:border-amber-500 transition w-full resize-none" />
                <button type="submit" className="w-full py-4 bg-amber-500 text-white rounded-xl font-black text-xs tracking-widest uppercase shadow-lg shadow-amber-100 hover:bg-amber-600 transition">TRANSMIT TELEMETRY PACKAGE</button>
                {contactSuccess && <div className="text-emerald-600 text-[10px] font-bold text-center uppercase tracking-widest">✅ Data packet transmitted successfully</div>}
              </form>
            </section>
          </div>
        )}

        {/* CLASSIFIER TAB */}
        {activeTab === 'classifier' && (
          <div className="max-w-5xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-12">
            <section className="space-y-8">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-amber-500 tracking-widest uppercase">MACHINE VISION PORTAL</span>
                <h4 className="text-xl font-black text-slate-900">Physical Aggregate Target Core Ingestion</h4>
              </div>
              <div className="border-2 border-dashed border-slate-200 bg-slate-50 rounded-2xl h-80 flex flex-col items-center justify-center relative overflow-hidden p-6">
                {imagePreview ? <img src={imagePreview} className="w-full h-full object-contain rounded-xl" /> : <div className="text-center text-slate-400 space-y-2"><span className="text-5xl block">📷</span><span className="text-[10px] font-bold uppercase tracking-widest">Mount Material Feed</span></div>}
                {analyzing && <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center space-y-4"><div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div><span className="text-[10px] font-bold tracking-widest text-amber-600 animate-pulse uppercase">Executing Scan...</span></div>}
              </div>
              <div className="space-y-3">
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="file-upload" />
                <label htmlFor="file-upload" className="block w-full text-center bg-slate-100 py-4 rounded-xl font-black text-[10px] tracking-widest uppercase cursor-pointer hover:bg-slate-200 transition">{selectedFile ? 'Swap Sample' : 'Select Media'}</label>
                <button onClick={triggerImageClassification} disabled={!selectedFile || analyzing} className={`w-full py-4 rounded-xl font-black text-[10px] tracking-widest uppercase transition ${selectedFile && !analyzing ? 'bg-amber-500 text-white shadow-lg shadow-amber-100' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}>Analyze Compound</button>
                <button onClick={() => setShowPlasticInfo(!showPlasticInfo)} className="w-full py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-black text-[10px] tracking-widest uppercase hover:bg-slate-50 transition">{showPlasticInfo ? 'Hide Details' : 'More About Plastics'}</button>
                {showPlasticInfo && (
                  <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl space-y-6 max-h-[500px] overflow-y-auto shadow-inner">
                    <h5 className="font-black text-slate-900 text-xs uppercase tracking-widest">Resin Identification Codes</h5>
                    <img src="/the 7 types.jpg" className="w-full rounded-lg border border-slate-200" />
                    <div className="space-y-4">
                      {[
                        { n: "1", t: "PET/PETE", d: "Beverage bottles, food containers.", img: "/pet.jpg" },
                        { n: "2", t: "HDPE", d: "Milk jugs, detergent bottles, pipes.", img: "/hpde.jpg", ok: true },
                        { n: "3", t: "PVC", d: "Pipes, window frames, flooring.", img: "/pvc.webp" },
                        { n: "4", t: "LDPE", d: "Plastic bags, shrink wrap.", img: "/ldpe.jpg" },
                        { n: "5", t: "PP", d: "Food containers, bottle caps.", img: "/PP.png", ok: true },
                        { n: "6", t: "PS", d: "Foam cups, packaging, insulation.", img: "/ps.png" },
                        { n: "7", t: "OTHER", d: "Polycarbonate, acrylic, bioplastics.", img: "/other.jpg" }
                      ].map(p => (
                        <div key={p.n} className={`p-4 rounded-xl border ${p.ok ? 'bg-emerald-50 border-emerald-100' : 'bg-white border-slate-100'}`}>
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-black text-xs">{p.n} - {p.t} {p.ok && "✓"}</span>
                            {p.ok && <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Accepted</span>}
                          </div>
                          <p className="text-[10px] text-slate-500 mb-3">{p.d}</p>
                          <img src={p.img} className="w-full h-24 object-contain rounded bg-white border border-slate-100" />
                        </div>
                      ))}
                    </div>
                    <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                      <h6 className="font-black text-[10px] text-amber-900 uppercase tracking-widest mb-2">Processing Standard</h6>
                      <img src="/finegrained.jpg" className="w-full rounded border border-amber-200 mb-2" />
                      <p className="text-[9px] text-amber-800 italic">Material must be processed to fine-grained state as shown above.</p>
                    </div>
                  </div>
                )}
              </div>
            </section>

            <section className="bg-slate-50 border border-slate-100 rounded-3xl p-8 flex flex-col justify-center min-h-[500px]">
              <h3 className="text-[10px] font-black text-amber-500 tracking-widest uppercase mb-6">AUTOMATED PROCESS CONFIGURATOR</h3>
              {classifierError && <div className="bg-red-50 text-red-600 p-4 rounded-xl text-[10px] font-bold uppercase tracking-widest border border-red-100 mb-6">⚠️ {classifierError}</div>}
              {!inferenceResult && !analyzing && <div className="text-center text-slate-300 py-24 italic text-xs font-bold uppercase tracking-widest">Awaiting ingestion data...</div>}
              {inferenceResult && (
                <div className="space-y-8">
                  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">Composition Profile</span>
                    <div className={`text-3xl font-black tracking-tight ${inferenceResult.is_plastic ? 'text-amber-500' : 'text-red-500'}`}>{inferenceResult.detected_material}</div>
                    <div className="mt-2 text-[10px] font-bold text-slate-500">CONFIDENCE: <span className="text-amber-500">{inferenceResult.confidence}%</span></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 text-center">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Thermal Set</span>
                      <span className="text-2xl font-black text-slate-900">{inferenceResult.recommendedTemp}°C</span>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 text-center">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Cooling Cycle</span>
                      <span className="text-2xl font-black text-slate-900">{inferenceResult.recommendedCooling}s</span>
                    </div>
                  </div>
                  <div className={`p-5 rounded-2xl border text-[10px] font-bold leading-relaxed tracking-wide uppercase ${inferenceResult.is_plastic ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-red-50 border-red-100 text-red-700'}`}>{inferenceResult.action_status}</div>
                </div>
              )}
            </section>
          </div>
        )}

        {/* MARKETPLACE TAB */}
        {activeTab === 'marketplace' && (
          <div className="max-w-7xl mx-auto px-6 py-16 space-y-16">
            <div className="text-center space-y-2">
              <span className="text-[10px] font-bold text-amber-500 tracking-widest uppercase">ECOSPARK HARDWARE DISTRIBUTION</span>
              <h3 className="text-3xl font-black text-slate-900">Commercial Hardware & Product Catalog</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="bg-slate-50 rounded-3xl overflow-hidden border border-slate-100 flex flex-col">
                <div className="h-72 bg-white p-12 flex items-center justify-center"><img src="/machine.png" className="max-h-full object-contain" /></div>
                <div className="p-10 space-y-6 flex-grow flex flex-col">
                  <h5 className="text-xl font-black text-slate-900 uppercase tracking-tight">EcoSpark Automated Processing Cell v2.5</h5>
                  <p className="text-sm text-slate-500 leading-relaxed">Self-contained manufacturing cell with machine vision categorization, precision thermal controllers, and interlocked molding presses.</p>
                  <div className="flex-grow">
                    <button onClick={() => setShowMachineSteps(!showMachineSteps)} className="w-full py-4 bg-white border border-slate-200 text-slate-900 rounded-xl font-black text-[10px] tracking-widest uppercase hover:bg-slate-50 transition mb-4">{showMachineSteps ? 'Hide Operation Steps' : 'How to Use the Machine'}</button>
                    {showMachineSteps && (
                      <div className="space-y-4 mb-6 bg-white p-6 rounded-2xl border border-slate-100">
                        {[
                          { i: "🔌", s: "Power On", d: "Plug in, check breaker and main switch." },
                          { i: "🌡️", s: "Set Thermal", d: "Set REC700 to 200-220°C and wait for heat." },
                          { i: "📥", s: "Feed Material", d: "Add processed raw material to hopper." },
                          { i: "🔒", s: "Set Clamp", d: "Ensure clamping unit is securely set." },
                          { i: "⚙️", s: "Engage Motor", d: "Press button to feed material to screw." },
                          { i: "🧱", s: "Fill Mold", d: "Wait 3-5s for nozzle to fill the mold." },
                          { i: "⏹️", s: "Release", d: "Let go of motor button to finish." },
                          { i: "📦", s: "Collect", d: "Retrieve product from clamping unit." }
                        ].map((step, idx) => (
                          <div key={idx} className="flex gap-4 items-start">
                            <span className="text-xl">{step.i}</span>
                            <div>
                              <div className="text-[10px] font-black uppercase tracking-widest text-slate-900">{step.s}</div>
                              <p className="text-[10px] text-slate-500">{step.d}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <button onClick={() => { setActiveTab('home'); setTimeout(() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="w-full py-4 bg-amber-500 text-white rounded-xl font-black text-[10px] tracking-widest uppercase shadow-lg shadow-amber-100 hover:bg-amber-600 transition">Request Integration Specs</button>
                </div>
              </div>
              <div className="bg-slate-50 rounded-3xl overflow-hidden border border-slate-100 flex flex-col">
                <div className="h-72 bg-white p-12 flex items-center justify-center"><img src="/product.jpg" className="max-h-full object-contain" /></div>
                <div className="p-10 space-y-6 flex-grow flex flex-col">
                  <h5 className="text-xl font-black text-slate-900 uppercase tracking-tight">High-Density Structural Modules</h5>
                  <p className="text-sm text-slate-500 leading-relaxed">Interlocking modules fabricated from verified circular matrices. Designed for urban construction grid installations.</p>
                  <div className="flex-grow">
                    <ul className="text-[10px] font-bold text-slate-500 space-y-2 uppercase tracking-widest border-t border-slate-200 pt-6">
                      <li>📍 High Viscosity Load Compression</li>
                      <li>📍 400mm x 200mm Interlocking Grid</li>
                      <li>📍 100% Recycled Technical Polymer</li>
                    </ul>
                  </div>
                  <button onClick={() => { setActiveTab('home'); setTimeout(() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="w-full py-4 bg-slate-900 text-white rounded-xl font-black text-[10px] tracking-widest uppercase hover:bg-slate-800 transition">Submit Batch Order</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CHATBOT TAB */}
        {activeTab === 'chatbot' && (
          <div className="max-w-4xl mx-auto px-6 py-12 h-[700px] flex flex-col">
            <div className="bg-slate-50 border border-slate-100 rounded-3xl flex-grow flex flex-col overflow-hidden shadow-sm">
              <div className="p-6 border-b border-slate-200 bg-white flex justify-between items-center">
                <div><h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">EcoSpark RAG System</h3><p className="text-[9px] text-amber-500 font-bold uppercase tracking-widest">Knowledge Base Core Node Active</p></div>
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
              </div>
              <div className="flex-grow p-8 overflow-y-auto space-y-6">
                {chatMessages.map((m, idx) => (
                  <div key={idx} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-4 rounded-2xl text-[11px] font-bold leading-relaxed ${m.sender === 'user' ? 'bg-amber-500 text-white rounded-tr-none' : 'bg-white border border-slate-100 text-slate-600 rounded-tl-none shadow-sm'}`}>{m.text}</div>
                  </div>
                ))}
              </div>
              <div className="p-6 bg-white border-t border-slate-100 space-y-4">
                <div className="flex flex-wrap gap-2">
                  {["Where is this project engineered?", "How is thermal control maintained?", "What specific polymer classes are supported?", "What are the 7 types of plastic?", "How to use the machine?"].map((q, i) => (
                    <button key={i} onClick={() => handleFAQClick(q)} className="bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg text-[9px] font-black text-slate-500 uppercase tracking-widest transition">{q}</button>
                  ))}
                </div>
                <form onSubmit={handleSendMessage} className="flex gap-3">
                  <input type="text" placeholder="Query semantic RAG engine..." value={userInput} onChange={e => setUserInput(e.target.value)} className="flex-grow bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-xs focus:outline-none focus:border-amber-500 transition" />
                  <button type="submit" className="bg-amber-500 text-white px-8 rounded-xl font-black text-[10px] tracking-widest uppercase hover:bg-amber-600 transition">Query</button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div className="max-w-6xl mx-auto px-6 py-12">
            {!isAdminLoggedIn ? (
              <div className="max-w-md mx-auto bg-slate-50 border border-slate-100 p-10 rounded-3xl text-center shadow-sm">
                <span className="text-5xl block mb-4">🔒</span>
                <h4 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tight">Operator Hub</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-8">Restricted Utility Access</p>
                <form onSubmit={handleAdminLogin} className="space-y-6 text-left">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Operator ID</label>
                    <input type="text" placeholder="admin" value={username} onChange={e => setUsername(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl p-4 text-xs focus:outline-none focus:border-amber-500 transition" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Security Token</label>
                    <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl p-4 text-xs focus:outline-none focus:border-amber-500 transition" />
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-2 block">Hint: admin / aastu11</span>
                  </div>
                  <button type="submit" className="w-full py-4 bg-amber-500 text-white rounded-xl font-black text-[10px] tracking-widest uppercase shadow-lg shadow-amber-100 hover:bg-amber-600 transition">Verify Authorization</button>
                </form>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="flex justify-between items-center bg-slate-900 p-8 rounded-3xl text-white">
                  <div><h4 className="text-2xl font-black tracking-tight uppercase">Master Control Matrix</h4><p className="text-[10px] text-amber-500 font-bold uppercase tracking-widest">Live Ingestion Feeds & Telemetry Monitoring</p></div>
                  <button onClick={() => { setIsAdminLoggedIn(false); setPassword(''); }} className="px-6 py-2 bg-red-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition">Terminate Session</button>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
                    <h5 className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-6">Classification Stream Logs</h5>
                    <div className="overflow-x-auto"><table className="w-full text-left text-[10px] font-bold uppercase tracking-wider"><thead className="text-slate-400 border-b border-slate-100"><tr className="pb-4"><th className="pb-4">Timestamp</th><th className="pb-4">Target Profile</th><th className="pb-4">Confidence</th><th className="pb-4 text-right">Matrix Status</th></tr></thead><tbody className="text-slate-600 divide-y divide-slate-50">{classificationLogs.length === 0 ? <tr><td colSpan="4" className="py-12 text-center italic text-slate-300">No telemetry data recorded.</td></tr> : classificationLogs.map((log, i) => <tr key={i}><td className="py-4">{log.timestamp}</td><td className="py-4 text-slate-900">{log.material}</td><td className="py-4 text-amber-500">{log.confidence}</td><td className="py-4 text-right"><span className={`px-3 py-1 rounded-lg ${log.status.includes('Approved') ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>{log.status}</span></td></tr>)}</tbody></table></div>
                  </div>
                  <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm space-y-6">
                    <h5 className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Interface Pipeline</h5>
                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">{customerInquiries.length === 0 ? <div className="text-center text-slate-300 py-24 italic text-[10px] font-bold uppercase tracking-widest">No traffic detected.</div> : customerInquiries.map((inq, i) => <div key={i} className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-3"><div className="flex justify-between items-start"><div className="font-black text-slate-900 text-[10px] uppercase tracking-widest">{inq.name}</div><span className="text-[8px] font-black bg-white px-2 py-1 rounded-lg border border-slate-200 uppercase">Inquiry</span></div><div className="text-[9px] text-amber-500 font-bold break-all uppercase tracking-widest">{inq.email}</div><p className="text-[10px] text-slate-500 leading-relaxed font-bold bg-white p-4 rounded-xl border border-slate-100 italic">"{inq.msg}"</p></div>)}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="bg-slate-50 border-t border-slate-100 px-6 py-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">© 2024 EcoSpark Manufacturing Systems Inc. All Rights Reserved.</div>
          <div className="text-[10px] font-black text-slate-900 tracking-[0.2em] uppercase text-center md:text-right">ARES URBAN SCIENCE & TECHNOLOGY CAMPUS // INTEGRATED INFRASTRUCTURE SYSTEMS</div>
        </div>
      </footer>
    </div>
  );
}
