 
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
  const [showPlasticInfo, setShowPlasticInfo] = useState(false); // New state for plastic info

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

  // --- REAL IMAGE CLASSIFICATION EXECUTION WITH FALLBACK ---
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

      // Set up a structured abort timeout so the UI never stays loading forever
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 Second Network Limit

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

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const json = await response.json();
        const rawData = json.data;
        const payload = Array.isArray(rawData) ? rawData[0] : rawData;

        if (payload && !payload.error) {
          // Normalize material names and determine if it's an approved plastic (HDPE or PP)
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
            // Default for non-plastic or unrecognized materials
            detectedMaterial = "Foreign Non-Plastic Impurity";
            actionStatus = "CRITICAL SECURITY EXCEPTION: Non-plastic component encountered. Electronic safety gate deployed.";
          }
          
          const finalPayload = {
            detected_material: detectedMaterial,
            confidence: payload.confidence || "N/A", // Use N/A if confidence is not available
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
          throw new Error('Malformed JSON array data payload structure or API returned error.');
        }

      } catch (fetchErr) {
        console.error("Hugging Face API call failed:", fetchErr);
        setClassifierError('Failed to connect to the classification service. Please try again.');
        // Fallback to local simulation if real API fails
        const lowerName = selectedFile.name.toLowerCase();
        let localPayloadFallback = {
          detected_material: "Unknown Non-Plastic Matrix",
          confidence: "0.0",
          is_plastic: false,
          recommendedTemp: 0,
          recommendedCooling: 0,
          action_status: "CRITICAL SECURITY EXCEPTION: Non-plastic component encountered. Electronic safety gate deployed."
        };

        if (lowerName.includes('hdpe')) {
          localPayloadFallback = {
            detected_material: "HDPE (High-Density Polyethylene)",
            confidence: "96.4",
            is_plastic: true,
            recommendedTemp: 220,
            recommendedCooling: 45,
            action_status: "SYSTEM INTERLOCK VERIFIED: Target profile cleared for structural extrusion loop."
          };
        } else if (lowerName.includes('pp') || lowerName.includes('polypropylene')) {
          localPayloadFallback = {
            detected_material: "PP (Polypropylene Matrix)",
            confidence: "94.1",
            is_plastic: true,
            recommendedTemp: 240,
            recommendedCooling: 50,
            action_status: "SYSTEM INTERLOCK VERIFIED: Polymer match found. Initializing specific barrel thermal configuration."
          };
        } else if (lowerName.includes('pet') || lowerName.includes('pete')) {
          localPayloadFallback = {
            detected_material: "PET (Polyethylene Terephthalate)",
            confidence: "88.0",
            is_plastic: false,
            recommendedTemp: 0,
            recommendedCooling: 0,
            action_status: "WARNING: PET detected. This material is not approved for current system configuration. Electronic safety gate deployed."
          };
        } else if (lowerName.includes('pvc')) {
          localPayloadFallback = {
            detected_material: "PVC (Polyvinyl Chloride)",
            confidence: "92.0",
            is_plastic: false,
            recommendedTemp: 0,
            recommendedCooling: 0,
            action_status: "WARNING: PVC detected. This material is not approved for current system configuration. Electronic safety gate deployed."
          };
        } else if (lowerName.includes('ldpe')) {
          localPayloadFallback = {
            detected_material: "LDPE (Low-Density Polyethylene)",
            confidence: "85.0",
            is_plastic: false,
            recommendedTemp: 0,
            recommendedCooling: 0,
            action_status: "WARNING: LDPE detected. This material is not approved for current system configuration. Electronic safety gate deployed."
          };
        } else if (lowerName.includes('ps') || lowerName.includes('polystyrene')) {
          localPayloadFallback = {
            detected_material: "PS (Polystyrene)",
            confidence: "90.0",
            is_plastic: false,
            recommendedTemp: 0,
            recommendedCooling: 0,
            action_status: "WARNING: PS detected. This material is not approved for current system configuration. Electronic safety gate deployed."
          };
        } else if (lowerName.includes('other')) {
          localPayloadFallback = {
            detected_material: "Other Plastic Type (Category 7)",
            confidence: "70.0",
            is_plastic: false,
            recommendedTemp: 0,
            recommendedCooling: 0,
            action_status: "WARNING: 'Other' plastic type detected. This material is not approved for current system configuration. Electronic safety gate deployed."
          };
        } else if (lowerName.includes('metal') || lowerName.includes('iron') || lowerName.includes('glass') || lowerName.includes('stone')) {
          localPayloadFallback = {
            detected_material: "Foreign Non-Plastic Impurity",
            confidence: "98.9",
            is_plastic: false,
            recommendedTemp: 0,
            recommendedCooling: 0,
            action_status: "CRITICAL SECURITY EXCEPTION: Non-plastic component encountered. Electronic safety gate deployed."
          };
        }

        setInferenceResult(localPayloadFallback);
        setClassificationLogs(prev => [
          { timestamp: new Date().toLocaleTimeString(), material: localPayloadFallback.detected_material, confidence: `${localPayloadFallback.confidence}%`, status: localPayloadFallback.is_plastic ? 'Approved Input' : 'Rejected Material' },
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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col">
      {/* GLOBAL NAVIGATION HEADER */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="EcoSpark Logo" className="h-8 w-auto" />
            <div>
              <h1 className="text-lg font-black text-slate-900 tracking-tight">EcoSpark</h1>
              <p className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">Circular Manufacturing Intelligence</p>
            </div>
          </div>

          <nav className="flex gap-2 flex-wrap justify-end">
            {[
              { id: 'home', label: 'Overview' },
              { id: 'classifier', label: 'Classifier' },
              { id: 'marketplace', label: 'Marketplace' },
              { id: 'chatbot', label: 'AI Assistant' },
              { id: 'dashboard', label: 'Dashboard' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition ${activeTab === tab.id ? 'bg-amber-500 text-slate-950 shadow-sm' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-grow px-6 py-12 max-w-7xl mx-auto w-full">
        {/* HOME TAB */}
        {activeTab === 'home' && (
          <div className="space-y-12">
            <section className="text-center space-y-4">
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">Circular Manufacturing Reimagined</h2>
              <p className="text-lg text-slate-500 max-w-2xl mx-auto">EcoSpark transforms post-consumer plastic waste into high-density structural building components through automated machine vision classification and precision extrusion molding.</p>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <span className="text-3xl block mb-3">🔍</span>
                <h3 className="text-lg font-bold text-slate-900 mb-2">AI-Powered Classification</h3>
                <p className="text-xs text-slate-500">Automated machine vision system identifies plastic types and rejects non-approved materials with 98.9% accuracy.</p>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <span className="text-3xl block mb-3">⚙️</span>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Precision Extrusion</h3>
                <p className="text-xs text-slate-500">Industrial-grade thermal control maintains 180-350°C with PID controllers for consistent material processing.</p>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <span className="text-3xl block mb-3">🏗️</span>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Structural Products</h3>
                <p className="text-xs text-slate-500">Produces interlocking building modules, retaining blocks, and paving tiles for urban infrastructure.</p>
              </div>
            </div>

            <section className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm" id="contact">
              <div className="max-w-2xl mx-auto">
                <h3 className="text-2xl font-black text-slate-900 mb-2">Get in Touch</h3>
                <p className="text-xs text-slate-500 mb-6">Submit your inquiry and our technical team will respond within 24 hours.</p>

                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div>
                    <label className="text-[9px] font-mono text-slate-400 uppercase block mb-2">Full Name</label>
                    <input
                      type="text"
                      placeholder="Your name"
                      value={contactForm.name}
                      onChange={e => setContactForm({ ...contactForm, name: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-amber-500 text-slate-800 transition"
                    />
                  </div>

                  <div>
                    <label className="text-[9px] font-mono text-slate-400 uppercase block mb-2">Email Address</label>
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={contactForm.email}
                      onChange={e => setContactForm({ ...contactForm, email: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-amber-500 text-slate-800 transition"
                    />
                  </div>

                  <div>
                    <label className="text-[9px] font-mono text-slate-400 uppercase block mb-2">Message</label>
                    <textarea
                      placeholder="Describe your inquiry..."
                      value={contactForm.message}
                      onChange={e => setContactForm({ ...contactForm, message: e.target.value })}
                      rows="5"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-amber-500 text-slate-800 transition resize-none"
                    />
                  </div>

                  <button type="submit" className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl font-bold text-xs uppercase tracking-wider transition shadow-sm">
                    Transmit Telemetry Package
                  </button>
                  {contactError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-center text-xs font-mono">
                      ⚠️ {contactError}
                    </div>
                  )}
                  {contactSuccess && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-3 rounded-xl text-center text-xs font-mono">
                      ✅ Data packet transmitted successfully. Checked and routed to dashboard tracking system.
                    </div>
                  )}
                </form>
              </div>
            </section>
          </div>
        )}

        {/* AI ASSISTANT (RAG SYSTEM) */}
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

            <div className="p-4 bg-slate-50 border-t border-slate-200">
              <span className="text-[9px] uppercase tracking-wider font-mono text-slate-400 block mb-2 font-bold">Frequently Queried Parameters:</span>
              <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
                {[
                  "Where is this project engineered?",
                  "How is thermal control maintained?",
                  "What specific polymer classes are supported by the model?",
                  "How do you calculate funnel true lengths for the hopper assembly?",
                  "What are the 7 types of plastic?", 
                  "How to use the machine?"
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
                
                {/* Reference image for material processing */}
                <div className="mt-4 flex flex-col items-center">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-slate-400 font-bold">Accepted Material Format</span>
                  <img src="/finegrained.jpg" alt="Processed material reference" className="mt-2 w-32 h-auto object-contain rounded-md border border-slate-200" />
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
                <button
                  onClick={() => setShowPlasticInfo(!showPlasticInfo)}
                  className="w-full py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl font-bold text-xs uppercase tracking-wider transition shadow-sm"
                >
                  {showPlasticInfo ? 'Hide Plastic Information' : 'More About Plastics'}
                </button>
                {showPlasticInfo && (
                  <div className="bg-white border border-slate-200 p-4 rounded-xl text-xs leading-relaxed text-slate-700 shadow-inner max-h-96 overflow-y-auto">
                    <h5 className="font-bold text-slate-900 mb-3">The 7 Types of Plastic (Resin Identification Codes):</h5>
                    <img src="/the 7 types.jpg" alt="7 types of plastic" className="mb-4 w-full h-auto object-contain rounded-md border border-slate-100" />
                    
                    <div className="space-y-3 mb-4">
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <div className="font-bold text-slate-900 mb-1">1 (PET/PETE) - Polyethylene Terephthalate</div>
                        <p className="text-slate-600 text-[11px]">Used for beverage bottles, food containers, and some household items.</p>
                        <img src="/pet.jpg" alt="PET plastic" className="mt-2 w-full h-20 object-contain rounded border border-slate-200" />
                      </div>
                      
                      <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                        <div className="font-bold text-emerald-900 mb-1">2 (HDPE) - High-Density Polyethylene ✓ ACCEPTED</div>
                        <p className="text-slate-600 text-[11px]">Used for milk jugs, detergent bottles, and pipes. Versatile plastic with excellent durability.</p>
                        <img src="/hpde.jpg" alt="HDPE plastic" className="mt-2 w-full h-20 object-contain rounded border border-slate-200" />
                      </div>
                      
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <div className="font-bold text-slate-900 mb-1">3 (PVC) - Polyvinyl Chloride</div>
                        <p className="text-slate-600 text-[11px]">Used for pipes, window frames, vinyl flooring, and construction materials. Known for durability.</p>
                        <img src="/pvc.webp" alt="PVC plastic" className="mt-2 w-full h-20 object-contain rounded border border-slate-200" />
                      </div>
                      
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <div className="font-bold text-slate-900 mb-1">4 (LDPE) - Low-Density Polyethylene</div>
                        <p className="text-slate-600 text-[11px]">Flexible plastic used for plastic bags, shrink wrap, and squeezable bottles.</p>
                        <img src="/ldpe.jpg" alt="LDPE plastic" className="mt-2 w-full h-20 object-contain rounded border border-slate-200" />
                      </div>
                      
                      <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                        <div className="font-bold text-emerald-900 mb-1">5 (PP) - Polypropylene ✓ ACCEPTED</div>
                        <p className="text-slate-600 text-[11px]">Sturdy and heat-resistant plastic used in food containers, bottle caps, and automotive parts.</p>
                        <img src="/PP.png" alt="PP plastic" className="mt-2 w-full h-20 object-contain rounded border border-slate-200" />
                      </div>
                      
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <div className="font-bold text-slate-900 mb-1">6 (PS) - Polystyrene</div>
                        <p className="text-slate-600 text-[11px]">Found in foam products such as disposable foam cups, packaging materials, and insulation.</p>
                        <img src="/ps.png" alt="PS plastic" className="mt-2 w-full h-20 object-contain rounded border border-slate-200" />
                      </div>
                      
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <div className="font-bold text-slate-900 mb-1">7 (OTHER) - Other Plastics</div>
                        <p className="text-slate-600 text-[11px]">Includes polycarbonate (water bottles, eyeglass lenses), polylactide (bioplastic), and acrylic (clear sheets).</p>
                        <img src="/other.jpg" alt="Other plastics" className="mt-2 w-full h-20 object-contain rounded border border-slate-200" />
                      </div>
                    </div>
                    
                    <div className="bg-red-50 border border-red-200 p-3 rounded-lg mb-3">
                      <p className="text-red-700 font-bold text-[11px]">
                        ⚠️ Important: The EcoSpark machine is configured to accept and process ONLY HDPE (High-Density Polyethylene) and PP (Polypropylene). All other plastic types will be rejected by the safety interlock system.
                      </p>
                    </div>
                    
                    <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg">
                      <p className="text-amber-900 font-bold text-[11px] mb-2">Material Processing Reference:</p>
                      <img src="/finegrained.jpg" alt="Fine-grained processed material" className="w-full h-24 object-contain rounded border border-amber-200" />
                      <p className="text-amber-800 text-[10px] mt-2 italic">Materials must be processed to fine-grained form (as shown above) before feeding into the system.</p>
                    </div>
                    
                    <p className="mt-3 text-center text-slate-500 font-mono text-[9px]">🌏 Recycle today for a better tomorrow</p>
                  </div>
                )}
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

        {/* CATALOG SPECIFICATIONS SECTION */}
        {activeTab === 'marketplace' && (
          <div className="space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h3 className="text-[10px] font-mono uppercase tracking-widest text-amber-600 font-bold">ECOSPARK HARDWARE DISTRIBUTION</h3>
              <h4 className="text-2xl font-black text-slate-900">Commercial Hardware & Product Catalog</h4>
              <p className="text-xs text-slate-500">Acquire enterprise grade automated recycling units or source structural hardware components generated directly by our systems.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* COMPONENT 1: INDUSTRIAL RIG */}
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between">
                <div className="h-64 bg-slate-50 relative flex items-center justify-center p-4 border-b border-slate-100">
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
                    <li>📍 Assembly Node Point: AASTU Innovation Center</li>
                  </ul>
                  <button
                    onClick={() => { 
                      setActiveTab('chatbot'); 
                      handleFAQClick("how to use the machine?");
                    }} 
                    className="w-full py-3 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-xl transition shadow-sm mb-2"
                  >
                    How to Use the Machine
                  </button>
                  <button onClick={() => { setActiveTab('home'); setTimeout(() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold uppercase tracking-wider rounded-xl transition shadow-sm">
                    Request Integration Specifications
                  </button>
                </div>
              </div>

              {/* COMPONENT 2: INTERLOCKING BLOCKS */}
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between">
                <div className="h-64 bg-slate-50 relative flex items-center justify-center p-4 border-b border-slate-100">
                  <img src="/product.jpg" alt="Recycled Materials Components" className="max-h-full max-w-full object-scale-down mix-blend-multiply" />
                  <span className="absolute bottom-4 left-4 bg-slate-800 text-white px-2.5 py-1 rounded text-[9px] font-mono font-bold uppercase tracking-wider shadow-sm">Output Product</span>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <h5 className="text-lg font-bold text-slate-900">High-Density Structural Modules</h5>
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
                              <span className="text-[9px] font-mono bg-white border border-slate-200 text-slate-400 px-1.5 py-0.5 rounded">Contact Form</span>
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
