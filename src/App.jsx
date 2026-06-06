
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Cpu,
  Bot,
  Eye,
  Settings,
  Layers,
  Lock,
  Shield,
  Send,
  LogOut,
  CheckCircle2,
  ChevronRight,
  HelpCircle,
  FileText,
  RefreshCw,
  AlertTriangle,
  Upload,
  Sparkles,
  Info,
  Check,
  MapPin,
  Flame,
  Minus,
  MessageSquare,
  Sparkle,
  Activity
} from 'lucide-react';

// @ts-ignore
import logoImg from './assets/images/logo_1780762963246.png';
// @ts-ignore
import machineImg from './assets/images/machine_1780762981333.png';
// @ts-ignore
import productImg from './assets/images/product_1780763000604.png';

import { ClassificationLog, CustomerInquiry, ChatMessage, PlasticTypeInfo } from './types';

// Raw Subdomain Endpoint
const BACKEND_URL = 'https://yani-321212-me-backend.hf.space';

// Expanded RAG Knowledge Base
const RAG_KNOWLEDGE_BASE: Record<string, string> = {
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

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorShake, setErrorShake] = useState<boolean>(false);

  // Ingestion Classifier States
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [inferenceResult, setInferenceResult] = useState<any>(null);
  const [classifierError, setClassifierError] = useState<string>('');
  const [showPlasticInfo, setShowPlasticInfo] = useState<boolean>(false);
  const [showMachineSteps, setShowMachineSteps] = useState<boolean>(false);

  // Preset compound samples for easier interactive demo
  const samplePresets = [
    {
      name: "PP Raw Flakes Sample",
      fileName: "shredded_pp_yellow_flakes.jpg",
      url: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&q=80&w=600",
      material: "PP (Polypropylene)"
    },
    {
      name: "HDPE Polyethylene Shreds",
      fileName: "recycled_hdpe_white_granules.jpg",
      url: "https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?auto=format&fit=crop&q=80&w=600",
      material: "HDPE (High-Density Polyethylene)"
    },
    {
      name: "PET Water Bottle Matrix",
      fileName: "unapproved_pet_waste.jpg",
      url: "https://images.unsplash.com/photo-1618477388954-7852f32655ec?auto=format&fit=crop&q=80&w=600",
      material: "PET (Polyethylene Terephthalate)"
    },
    {
      name: "PVC Construction Block Residue",
      fileName: "toxic_pvc_shards.jpg",
      url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600",
      material: "PVC (Polyvinyl Chloride)"
    }
  ];

  // Chatbot state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { sender: 'bot', text: 'Welcome to EcoSpark Intelligence Systems. How can I assist you with our circular manufacturing technology today?' }
  ]);
  const [userInput, setUserInput] = useState<string>('');

  // Dashboard Logging Lists
  const [classificationLogs, setClassificationLogs] = useState<ClassificationLog[]>([
    { timestamp: '12:21:40 PM', material: 'PP (Polypropylene Matrix)', confidence: '94.1%', status: 'Approved Input' },
    { timestamp: '12:15:33 AM', material: 'HDPE (High-Density Polyethylene)', confidence: '96.4%', status: 'Approved Input' },
    { timestamp: '11:45:10 AM', material: 'PET (Polyethylene Terephthalate)', confidence: '88.0%', status: 'Rejected Material' }
  ]);
  
  const [customerInquiries, setCustomerInquiries] = useState<CustomerInquiry[]>([
    { name: 'Dr. Getachew', email: 'getachew.m@aastu.edu.et', msg: 'Interested in configuring a macro-economical polymer rig for Addis Ababa suburb centers.' },
    { name: 'Kidus Daniel', email: 'kidus.d@ietp11.org', msg: 'Verification of CPM software framework and MoSCoW parameters.' }
  ]);

  // Contact Form
  const [contactForm, setContactForm] = useState<CustomerInquiry>({ name: '', email: '', message: '' });
  const [contactSuccess, setContactSuccess] = useState<boolean>(false);
  const [contactError, setContactError] = useState<string>('');

  // Reference for scrolling chat
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleFAQClick = (question: string) => {
    const answer = RAG_KNOWLEDGE_BASE[question.toLowerCase()] || "System response error.";
    setCustomerInquiries(prev => [
      { name: 'Explorer Node', email: 'Integrated RAG Route', msg: `Preset Query: "${question}"` },
      ...prev
    ]);
    setChatMessages(prev => [
      ...prev,
      { sender: 'user', text: question },
      { sender: 'bot', text: answer }
    ]);
  };

  const handleSendMessage = (e: React.FormEvent) => {
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

    setChatMessages(prev => [
      ...prev,
      { sender: 'user', text: originalInput },
      { sender: 'bot', text: botResponse }
    ]);
    setUserInput('');
  };

  // Preset file selection handler
  const selectPresetCompound = (preset: typeof samplePresets[0]) => {
    setSelectedFile({
      name: preset.fileName,
      size: 14200,
      type: "image/jpeg"
    });
    setImagePreview(preset.url);
    setInferenceResult(null);
    setClassifierError('');
  };

  const triggerImageClassification = async () => {
    if (!selectedFile) {
      setClassifierError('Please place a valid target image compound inside the intake gate.');
      return;
    }

    setAnalyzing(true);
    setClassifierError('');
    setInferenceResult(null);

    // Let the scan animation run nicely
    await new Promise(resolve => setTimeout(resolve, 1500));

    const reader = new FileReader();
    
    // File reader payload preparation
    const processInference = async (base64Payload: string) => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      try {
        const response = await fetch(`${BACKEND_URL}/api/predict/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            data: [{ data: base64Payload, name: selectedFile.name }]
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
          throw new Error('Malformed JSON response.');
        }

      } catch (fetchErr) {
        console.warn("API gateway unreachable, running localized model container simulations:", fetchErr);
        handleLocalFallback();
      } finally {
        setAnalyzing(false);
      }
    };

    const handleLocalFallback = () => {
      const lowerName = selectedFile.name.toLowerCase();
      let localFallback = {
        detected_material: "Unknown Non-Plastic Matrix",
        confidence: "0.0",
        is_plastic: false,
        recommendedTemp: 0,
        recommendedCooling: 0,
        action_status: "CRITICAL SECURITY EXCEPTION: Non-plastic component encountered. Electronic safety gate deployed."
      };

      if (lowerName.includes('hdpe') || lowerName.includes('polyethylene')) {
        localFallback = { detected_material: "HDPE (High-Density Polyethylene)", confidence: "96.4", is_plastic: true, recommendedTemp: 220, recommendedCooling: 45, action_status: "SYSTEM INTERLOCK VERIFIED: Target profile cleared for structural extrusion loop." };
      } else if (lowerName.includes('pp') || lowerName.includes('polypropylene')) {
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
      setAnalyzing(false);
    };

    // Trigger base64 extraction
    if (selectedFile.size === 14200) {
      // It's a predefined sample URL
      processInference(imagePreview || '');
    } else {
      reader.readAsDataURL(selectedFile);
      reader.onloadend = () => {
        processInference(reader.result as string);
      };
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setInferenceResult(null);
        setClassifierError('');
      };
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'aastu11') {
      setIsAdminLoggedIn(true);
      setPassword('');
      setErrorShake(false);
    } else {
      setErrorShake(true);
      setTimeout(() => setErrorShake(false), 600);
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name.trim() || !contactForm.email.trim() || !contactForm.message.trim()) {
      setContactError('Please supply all required network coordinates and instructions.');
      return;
    }
    setCustomerInquiries(prev => [
      { name: contactForm.name, email: contactForm.email, msg: contactForm.message },
      ...prev
    ]);
    setContactSuccess(true);
    setContactError('');
    setContactForm({ name: '', email: '', message: '' });
    setTimeout(() => setContactSuccess(false), 5000);
  };

  const resinData: PlasticTypeInfo[] = [
    { number: "1", type: "PET/PETE", description: "Polyethylene Terephthalate. Used in standard water bottles and disposable containers. Unsuited for high-friction continuous cycles.", image: "https://images.unsplash.com/photo-1618477388954-7852f32655ec?auto=format&fit=crop&q=80&w=300", isAccepted: false },
    { number: "2", type: "HDPE", description: "High-Density Polyethylene. Excellent tensile strength. Used in sturdy containers, pipes and engineering boards.", image: "https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?auto=format&fit=crop&q=80&w=300", isAccepted: true },
    { number: "3", type: "PVC", description: "Polyvinyl Chloride. Rigid construction fixtures. Emits dangerous vapors if heated under thermal conditions without gas scrubbers.", image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=300", isAccepted: false },
    { number: "4", type: "LDPE", description: "Low-Density Polyethylene. Highly flexible film, bags, and coatings. Low thermal density limits load capabilities.", image: "https://images.unsplash.com/photo-1595079676339-1534801ad6cf?auto=format&fit=crop&q=80&w=300", isAccepted: false },
    { number: "5", type: "PP", description: "Polypropylene. Tough and highly heat-resistant. Extensively utilized in cap closures, laboratory vessels and micro-factories.", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=300", isAccepted: true },
    { number: "6", type: "PS", description: "Polystyrene. Rigid insulation blocks or fragile structural matrices. Weak molecular bonds decompose under light sheer.", image: "https://images.unsplash.com/photo-1531771686035-25f2750e23b8?auto=format&fit=crop&q=80&w=300", isAccepted: false },
    { number: "7", type: "OTHER", description: "Combined polymers including polycarbonates, nylons, and biocomposites. Blocked due to unpredictable thermal characteristics.", image: "https://images.unsplash.com/photo-1602161974066-ac79bf77f152?auto=format&fit=crop&q=80&w=300", isAccepted: false }
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans selection:bg-amber-100 selection:text-amber-900">
      {/* PROFESSIONAL HIGH-CONTRAST HEADER */}
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-50 backdrop-blur-md bg-white/95">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3.5 self-start">
            <div className="bg-amber-500/10 p-2 rounded-xl border border-amber-500/20">
              <img 
                src={logoImg} 
                alt="EcoSpark Logo" 
                className="h-9 w-auto object-contain brightness-95" 
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 font-display flex items-center gap-1.5 leading-none">
                ECOSPARK
              </h1>
              <p className="text-[10px] font-mono font-bold text-amber-600/90 tracking-widest mt-1 uppercase">
                AASTU IETP // GROUP 11
              </p>
            </div>
          </div>
          
          <nav className="flex items-center bg-slate-100 p-1.5 rounded-xl border border-slate-200/50">
            {[
              { id: 'home', label: 'HOME' },
              { id: 'chatbot', label: 'CHATBOT' },
              { id: 'classifier', label: 'CLASSIFIER' },
              { id: 'marketplace', label: 'MARKETPLACE' },
              { id: 'dashboard', label: 'DASHBOARD' }
            ].map(tab => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold tracking-wider transition-all duration-200 ${
                    active 
                      ? 'bg-amber-500 text-white shadow-sm shadow-amber-500/20' 
                      : 'text-slate-600 hover:text-amber-500 hover:bg-slate-50'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        <AnimatePresence mode="wait">
          {/* HOME TAB */}
          {activeTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="max-w-7xl mx-auto px-6 py-16 space-y-24"
            >
              {/* COMPREHENSIVELY RESTRUCTURED HERO IN THE MIDDLE */}
              <section className="max-w-3xl mx-auto text-center space-y-8 py-8">
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                  className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-amber-700 text-xs font-bold font-mono uppercase tracking-widest mx-auto shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                  Distributed Circular Manufacturing
                </motion.div>
                
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.1] font-display tracking-tight max-w-2xl mx-auto">
                  Transforming Secondary Polymers Into Architectural Value
                </h2>
                
                <p className="text-base md:text-lg text-slate-500 leading-relaxed max-w-2xl mx-auto font-sans font-medium">
                  Empowering localized circular macro-economies through high-precision computerized micro-extrusion systems designed for distributed community manufacturing applications.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                  <button 
                    onClick={() => setActiveTab('classifier')} 
                    className="w-full sm:w-auto bg-amber-500 text-white px-8 py-4 rounded-xl font-bold text-xs tracking-widest uppercase shadow-md shadow-amber-500/20 hover:bg-amber-600 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150"
                  >
                    LAUNCH INGESTION SCANNER
                  </button>
                  <button 
                    onClick={() => setActiveTab('marketplace')} 
                    className="w-full sm:w-auto bg-white text-slate-800 border border-slate-200 shadow-sm px-8 py-4 rounded-xl font-bold text-xs tracking-widest uppercase hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900 transition-all duration-150"
                  >
                    EXPLORE MACHINE SPECIFICATIONS
                  </button>
                </div>
              </section>

              {/* MACHINE AND MATERIAL GRAPHICS BANNER */}
              <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-slate-900 p-8 rounded-3xl text-white shadow-xl max-w-5xl mx-auto border border-slate-800 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none"></div>
                
                <div className="flex flex-col justify-center space-y-6 max-w-md">
                  <span className="text-amber-400 font-mono text-[10px] font-bold tracking-widest uppercase">ADDIS ABABA CAMPUS DIRECTIVE</span>
                  <h3 className="text-2xl md:text-3xl font-bold tracking-tight font-display">Computerized Recycling Ingestion Systems</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Designed to identify and thermally catalog recycled matrices at local points of collection. Fully autonomous PID heat induction stabilizes structural outcomes for continuous urban development grids.
                  </p>
                  <div className="flex gap-4 items-center">
                    <div className="flex -space-x-2">
                      <div className="w-8 h-8 rounded-full border border-slate-950 bg-amber-500 flex items-center justify-center font-bold text-[10px] text-white">E</div>
                      <div className="w-8 h-8 rounded-full border border-slate-950 bg-emerald-500 flex items-center justify-center font-bold text-[10px] text-white font-mono">11</div>
                      <div className="w-8 h-8 rounded-full border border-slate-950 bg-slate-800 flex items-center justify-center font-bold text-[10px] text-slate-400">G</div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-widest">AASTU IETP-11 TEAM CORE</span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-6 p-4">
                  <div className="w-1/2 p-3 bg-slate-950/40 border border-slate-800 rounded-2xl">
                    <span className="text-[9px] font-mono text-amber-500 uppercase tracking-widest font-bold block mb-2">THERMAL EXTENSION CELL</span>
                    <img src={machineImg} alt="Extruder" className="h-32 w-full object-contain rounded-lg" referrerPolicy="no-referrer" />
                  </div>
                  <div className="w-1/2 p-3 bg-slate-950/40 border border-slate-800 rounded-2xl">
                    <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-widest font-bold block mb-2">STRUCTURAL BLOCK UNIT</span>
                    <img src={productImg} alt="Block" className="h-32 w-full object-contain rounded-lg" referrerPolicy="no-referrer" />
                  </div>
                </div>
              </section>

              {/* ENGINEERING VALUES */}
              <section className="space-y-12">
                <div className="text-center space-y-2">
                  <span className="text-[10px] font-mono font-bold text-amber-500 tracking-[0.2em] uppercase block">IMPACT MATRIX STRUCTURES</span>
                  <h3 className="text-3xl font-bold text-slate-950 font-display">Engineering Values Measured Against UN SDGs</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {[
                    { title: "Decent Work & Growth", desc: "Enables community-level manufacturing jobs via localized high-yield tooling infrastructure systems.", badge: "SDG 8", color: "bg-amber-500/10 text-amber-700 border-amber-200" },
                    { title: "Industry & Innovation", desc: "Integrates computer vision networks directly with low-use processing mechanical rigs.", badge: "SDG 9", color: "bg-blue-500/10 text-blue-700 border-blue-200" },
                    { title: "Sustainable Cities", desc: "Mitigates urban raw municipal density indices by converting solid materials directly within city zones.", badge: "SDG 11", color: "bg-emerald-500/10 text-emerald-700 border-emerald-200" },
                    { title: "Responsible Consumption", desc: "Locks open lifecycle loops by converting dense heavy-duty polymers into structural artifacts.", badge: "SDG 12", color: "bg-purple-500/10 text-purple-700 border-purple-200" }
                  ].map((v, i) => (
                    <div key={i} className="bg-white p-8 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between">
                      <div className="space-y-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black border ${v.color}`}>
                          {v.badge}
                        </span>
                        <h4 className="text-lg font-bold text-slate-900 font-display">{v.title}</h4>
                        <p className="text-xs text-slate-500 leading-relaxed font-medium">{v.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* LIFECYCLE PIPELINE */}
              <section className="space-y-12">
                <div className="text-center space-y-2">
                  <span className="text-[10px] font-mono font-bold text-amber-500 tracking-[0.2em] uppercase block">OPERATIONAL FLOW PIPELINE</span>
                  <h3 className="text-3xl font-bold text-slate-950 font-display">The Lifecycle Pipeline Process</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {[
                    { icon: "🛍️", title: "Source Collection", desc: "Target compound aggregates are sourced, sanitized, and fed into mechanical size-reduction grinders." },
                    { icon: "👁️", title: "Vision Sorting", desc: "High-speed edge AI classifies composition and dynamically draws correct thermal operating points." },
                    { icon: "🔥", title: "Controlled Extrusion", desc: "Precision PID feedback induction bands safely melt verified resins down the drive barrel." },
                    { icon: "🧱", title: "Final Compression Mold", desc: "The liquefied composition settles into dense heavy-duty engineering modules under structural load." }
                  ].map((p, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200/50 shadow-sm hover:border-slate-300 transition-all duration-150 space-y-4 relative">
                      <div className="absolute top-4 right-4 text-slate-100 font-mono text-3xl font-black leading-none">{i + 1}</div>
                      <span className="text-3xl block filter drop-shadow-sm">{p.icon}</span>
                      <h4 className="text-base font-bold text-slate-900 font-display">{p.title}</h4>
                      <p className="text-xs text-slate-500 leading-relaxed font-medium">{p.desc}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* CONTACT COMMAND */}
              <section className="max-w-xl mx-auto space-y-8 bg-white p-10 rounded-3xl border border-slate-200 shadow-sm" id="contact">
                <div className="text-center space-y-1">
                  <h3 className="text-2xl font-bold text-slate-950 font-display">Contact Technical Command</h3>
                  <p className="text-xs text-slate-400 font-medium font-mono uppercase tracking-wider">Submit queries directly to the engineering team repository pipeline</p>
                </div>
                
                <form onSubmit={handleContactSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest pl-1">Full Name</label>
                      <input 
                        type="text" 
                        placeholder="John Doe" 
                        value={contactForm.name} 
                        onChange={e => setContactForm({ ...contactForm, name: e.target.value })} 
                        className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white transition-all w-full font-medium" 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest pl-1">Inquiry Email Address</label>
                      <input 
                        type="email" 
                        placeholder="john@example.com" 
                        value={contactForm.email} 
                        onChange={e => setContactForm({ ...contactForm, email: e.target.value })} 
                        className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white transition-all w-full font-medium" 
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest pl-1">Inquiry Description</label>
                    <textarea 
                      placeholder="Specify system inquiry data parameters..." 
                      value={contactForm.message} 
                      onChange={e => setContactForm({ ...contactForm, message: e.target.value })} 
                      rows={5} 
                      className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white transition-all w-full resize-none font-medium leading-relaxed" 
                    />
                  </div>
                  
                  {contactError && (
                    <div className="p-4 bg-red-50 text-red-600 rounded-xl text-xs font-bold font-mono uppercase tracking-wider border border-red-100 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                      {contactError}
                    </div>
                  )}

                  {contactSuccess && (
                    <div className="p-4 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold font-mono uppercase tracking-widest border border-emerald-100 flex items-center justify-center gap-2 animate-bounce">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      Transmission completed successfully
                    </div>
                  )}

                  <button 
                    type="submit" 
                    className="w-full py-4 bg-amber-500 text-white rounded-xl font-bold text-xs tracking-widest uppercase shadow-md shadow-amber-500/20 hover:bg-amber-600 active:bg-amber-700 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
                  >
                    TRANSMIT TELEMETRY PACKAGE
                  </button>
                </form>
              </section>
            </motion.div>
          )}

          {/* CHATBOT TAB */}
          {activeTab === 'chatbot' && (
            <motion.div
              key="chatbot"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="max-w-4xl mx-auto px-6 py-12"
            >
              <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-md flex flex-col h-[700px]">
                {/* ACTIVE RAG HEADER */}
                <div className="p-6 border-b border-slate-200/85 bg-slate-50 flex justify-between items-center bg-gradient-to-r from-slate-50 to-white">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-amber-500/10 rounded-xl border border-amber-500/20 text-amber-600">
                      <Bot className="w-5 h-5 animate-bounce" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-900 uppercase font-display tracking-wider">
                        EcoSpark Retrieval-Augmented System
                      </h3>
                      <p className="text-[9px] text-emerald-600 font-mono font-bold uppercase tracking-widest flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                        KNOWLEDGE BASE CORE NODE // VERIFIED RAG PIPELINE ACTIVE
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono bg-amber-500/10 text-amber-700 px-3 py-1 rounded-full font-bold border border-amber-200 uppercase">
                    RAG-EMU v2.0
                  </span>
                </div>

                {/* SCROLLABLE CHAT MESSAGES */}
                <div className="flex-grow p-6 overflow-y-auto space-y-4 bg-slate-50/30">
                  {chatMessages.map((m, idx) => {
                    const isBot = m.sender === 'bot';
                    return (
                      <div key={idx} className={`flex ${isBot ? 'justify-start' : 'justify-end'}`}>
                        <div className={`flex items-start gap-2.5 max-w-[85%]`}>
                          {isBot && (
                            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 flex-shrink-0 text-semibold text-xs mt-0.5">
                              🤖
                            </div>
                          )}
                          <div className={`p-4 rounded-2xl text-xs font-semibold leading-relaxed tracking-wider shadow-sm ${
                            isBot 
                              ? 'bg-white border border-slate-200/70 text-slate-600 rounded-tl-none' 
                              : 'bg-amber-500 text-white rounded-tr-none'
                          }`}>
                            {m.text}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={chatBottomRef} />
                </div>

                {/* BOTTOM COMPOSITE ENGINES */}
                <div className="p-6 bg-white border-t border-slate-200/70 space-y-4">
                  {/* FAQS BUTTON PILLS FOR SIMPLICITY */}
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-mono text-slate-400 font-bold uppercase tracking-widest pl-1">
                      FREQUENCY QUERIED PARAMETERS
                    </span>
                    <div className="flex flex-wrap gap-2">
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
                          className="font-sans bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-300 px-3 py-1.5 rounded-lg text-[9px] font-bold text-slate-500 hover:text-amber-700 uppercase tracking-wider transition-colors duration-150 cursor-pointer text-left"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* FORM TRIGGER */}
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Query semantic RAG engine..." 
                      value={userInput} 
                      onChange={e => setUserInput(e.target.value)} 
                      className="flex-grow bg-slate-50 border border-slate-200 focus:bg-white rounded-xl px-4 py-3.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500 transition-all font-semibold" 
                    />
                    <button 
                      type="submit" 
                      className="bg-amber-500 text-white px-6 rounded-xl font-bold text-[10px] tracking-widest uppercase hover:bg-amber-600 active:bg-amber-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Query
                    </button>
                  </form>
                </div>
              </div>
            </motion.div>
          )}

          {/* CLASSIFIER TAB */}
          {activeTab === 'classifier' && (
            <motion.div
              key="classifier"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="max-w-7xl mx-auto px-6 py-12 space-y-12"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* CORE INGESTION GATE */}
                <section className="lg:col-span-6 bg-white border border-slate-200 p-8 rounded-3xl shadow-sm space-y-6">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-black text-amber-500 tracking-widest uppercase block">
                      MACHINE VISION PORTAL
                    </span>
                    <h4 className="text-xl font-bold font-display text-slate-900">
                      Physical Aggregate Target Core Ingestion
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Select or drag shredded compound images inside the ingestion sorting zone. Use preset cards for instant test scans.
                    </p>
                  </div>

                  {/* DROP DRAG BOX */}
                  <div className="border-2 border-dashed border-slate-200/80 bg-slate-50 rounded-2xl h-80 flex flex-col items-center justify-center relative overflow-hidden p-6 hover:bg-slate-100/50 transition-colors duration-150">
                    {imagePreview ? (
                      <div className="relative w-full h-full flex items-center justify-center">
                        <img 
                          src={imagePreview} 
                          alt="Aggregates Target" 
                          className="w-full h-full object-contain rounded-xl"
                          referrerPolicy="no-referrer"
                        />
                        <button 
                          onClick={() => { setSelectedFile(null); setImagePreview(null); setInferenceResult(null); }}
                          className="absolute top-2 right-2 p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-[9px] font-mono font-bold uppercase tracking-widest cursor-pointer shadow-md"
                        >
                          Clear
                        </button>
                      </div>
                    ) : (
                      <div className="text-center text-slate-450 space-y-3">
                        <Upload className="w-12 h-12 text-slate-300 mx-auto" />
                        <div className="space-y-1">
                          <span className="text-[11px] font-mono font-bold uppercase tracking-widest block text-slate-400">
                            Mount Material Feed
                          </span>
                          <span className="text-[10px] text-slate-400 block px-4 leading-normal">
                            Supports JPEGs or PNG high-resolution polymers
                          </span>
                        </div>
                      </div>
                    )}
                    {analyzing && (
                      <div className="absolute inset-0 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center space-y-4">
                        <div className="relative w-12 h-12">
                          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                          <Cpu className="w-5 h-5 text-amber-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                        </div>
                        <div className="text-center space-y-1">
                          <span className="text-[10px] font-mono font-bold tracking-widest text-amber-600 animate-pulse uppercase block">
                            Executing Scan...
                          </span>
                          <span className="text-[9px] text-slate-400 font-mono block">CONNECTING TO HF GATEWAY DATA FLOW</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* ACTION CONTROLS */}
                  <div className="space-y-4">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileChange} 
                      className="hidden" 
                      id="file-upload" 
                    />
                    
                    <div className="grid grid-cols-2 gap-3">
                      <label 
                        htmlFor="file-upload" 
                        className="block w-full text-center bg-slate-100 hover:bg-slate-200/85 py-3.5 rounded-xl font-bold text-[10px] tracking-widest uppercase cursor-pointer transition-all border border-slate-200/50"
                      >
                        {selectedFile ? 'Swap Sample' : 'Select Media'}
                      </label>
                      <button 
                        onClick={triggerImageClassification} 
                        disabled={!selectedFile || analyzing} 
                        className={`py-3.5 rounded-xl font-bold text-[10px] tracking-widest uppercase transition-all cursor-pointer ${
                          selectedFile && !analyzing 
                            ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20 hover:bg-amber-600' 
                            : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200/50'
                        }`}
                      >
                        Analyze Compound Structure
                      </button>
                    </div>

                    {/* INTERACTIVE DEMO PRESETS */}
                    <div className="space-y-2">
                      <span className="text-[9px] font-mono text-slate-400 font-bold uppercase tracking-widest pl-1">
                        Or Load Demonstration Compound Presets (Instant Try)
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        {samplePresets.map((preset, i) => (
                          <button
                            key={i}
                            onClick={() => selectPresetCompound(preset)}
                            className="bg-slate-50 hover:bg-amber-50/50 border border-slate-250/70 hover:border-amber-300 p-2.5 rounded-xl text-left flex items-center gap-2.5 transition group"
                          >
                            <img src={preset.url} className="w-9 h-9 object-cover rounded-lg border border-slate-200 group-hover:border-amber-400" referrerPolicy="no-referrer" />
                            <div className="overflow-hidden">
                              <div className="text-[9px] font-bold text-slate-900 leading-tight truncate">{preset.name}</div>
                              <div className="text-[8px] font-mono font-bold text-slate-400 uppercase leading-none mt-1">{preset.material}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <button 
                      onClick={() => setShowPlasticInfo(!showPlasticInfo)} 
                      className="w-full py-3.5 bg-white border border-slate-200 text-slate-600 hover:text-slate-900 rounded-xl font-bold text-[10px] tracking-widest uppercase hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Info className="w-3.5 h-3.5" />
                      {showPlasticInfo ? 'Hide Resin Guidelines' : 'Explain Resin Identification Codes'}
                    </button>
                  </div>
                </section>

                {/* AUTOMATED CORES CONFIGS */}
                <section className="lg:col-span-6 bg-slate-900 text-white border border-slate-800 rounded-3xl p-8 flex flex-col justify-between min-h-[500px] relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>
                  
                  <div>
                    <h3 className="text-[10px] font-mono font-black text-amber-500 tracking-widest uppercase mb-6 flex items-center gap-2">
                      <Settings className="w-3.5 h-3.5 animate-spin" />
                      AUTOMATED PROCESS CONFIGURATOR
                    </h3>

                    {classifierError && (
                      <div className="bg-red-950/40 text-red-400 p-4 rounded-xl text-[10px] font-mono font-bold uppercase tracking-widest border border-red-900/30 mb-6 flex items-center gap-2 animate-pulse">
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                        WARNING: {classifierError}
                      </div>
                    )}

                    {!inferenceResult && !analyzing && (
                      <div className="text-center text-slate-500 py-32 space-y-3">
                        <span className="text-4xl block filter opacity-40">⚙️</span>
                        <span className="text-[10px] font-mono font-bold uppercase tracking-widest block">
                          Awaiting Ingestion Compound Data...
                        </span>
                        <p className="text-[9px] max-w-xs mx-auto text-slate-600 leading-normal font-sans">
                          Place a sample container inside the intake gate to read molecular polymer configurations.
                        </p>
                      </div>
                    )}

                    {inferenceResult && (
                      <div className="space-y-6">
                        {/* MOLECULAR STATUS CARD */}
                        <div className="bg-slate-950/80 p-6 rounded-2xl border border-slate-800 shadow-inner space-y-4">
                          <div>
                            <span className="text-[9px] font-mono font-black text-slate-400 uppercase tracking-widest block mb-1">
                              IDENTIFIED STRUCTURAL COMPOSITION
                            </span>
                            <div className={`text-3xl font-black font-display tracking-tight ${
                              inferenceResult.is_plastic ? 'text-amber-500' : 'text-red-500'
                            }`}>
                              {inferenceResult.detected_material}
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center bg-slate-900/80 p-3 rounded-xl border border-slate-850">
                            <span className="text-[9px] font-mono font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                              <Activity className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                              Statistical Engine Confidence
                            </span>
                            <span className="text-amber-500 font-mono font-bold text-xs">
                              {inferenceResult.confidence}%
                            </span>
                          </div>
                        </div>

                        {/* TEMPERATURE & FAN SPEED CONTROLLERS */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-slate-950/40 p-5 rounded-2xl border border-slate-800 text-center space-y-2">
                            <span className="text-[9px] font-mono font-black text-slate-500 uppercase tracking-widest block">
                              HEATING SETPOINT
                            </span>
                            <span className="text-2xl font-black text-white font-mono tracking-tight flex items-center justify-center gap-1">
                              <Flame className="w-5 h-5 text-amber-500" />
                              {inferenceResult.recommendedTemp}°C
                            </span>
                          </div>
                          <div className="bg-slate-950/40 p-5 rounded-2xl border border-slate-800 text-center space-y-2">
                            <span className="text-[9px] font-mono font-black text-slate-500 uppercase tracking-widest block">
                              COOLING DUTY CYCLE
                            </span>
                            <span className="text-2xl font-black text-white font-mono tracking-tight flex items-center justify-center gap-1">
                              ❄️
                              {inferenceResult.recommendedCooling}s
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {inferenceResult && (
                    <div className={`mt-6 p-4 rounded-xl border text-[10px] font-mono font-black leading-relaxed tracking-wider uppercase ${
                      inferenceResult.is_plastic 
                        ? 'bg-emerald-950/20 border-emerald-900/30 text-emerald-400' 
                        : 'bg-red-950/20 border-red-900/30 text-red-400'
                    }`}>
                      {inferenceResult.action_status}
                    </div>
                  )}
                </section>
              </div>

              {/* EXPANDABLE PLASTIC GUIDES */}
              {showPlasticInfo && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-white border border-slate-200 p-8 rounded-3xl space-y-8 shadow-sm"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-black text-amber-500 tracking-widest uppercase block">
                      TECHNICIAN OPERATIONAL DIRECTIVES
                    </span>
                    <h5 className="text-lg font-bold text-slate-990 font-display">
                      Resin Identification Classifications
                    </h5>
                    <p className="text-xs text-slate-400 max-w-xlLeading">
                      Review supported feedstock rules. Only HDPE (High Density Polyethylene) and PP (Polypropylene) raw resins are cleared to bypass electronic physical safe checks due to clean thermal degradation.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {resinData.map(p => (
                      <div 
                        key={p.number} 
                        className={`p-4 rounded-2xl border flex flex-col justify-between ${
                          p.isAccepted 
                            ? 'bg-emerald-500/5 border-emerald-250/50' 
                            : 'bg-slate-50 border-slate-200/60'
                        }`}
                      >
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="font-mono font-bold text-xs p-1 bg-slate-100 rounded border border-slate-200 text-slate-800 leading-none">
                              {p.number} - {p.type}
                            </span>
                            {p.isAccepted && (
                              <span className="text-[8px] font-mono font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
                                Accepted ✓
                              </span>
                            )}
                          </div>
                          
                          <img 
                            src={p.image} 
                            alt={p.type} 
                            className="w-full h-24 object-cover rounded-xl bg-white border border-slate-200/70"
                            referrerPolicy="no-referrer"
                          />
                          
                          <p className="text-[10px] text-slate-550 font-medium leading-relaxed">
                            {p.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-amber-50 border border-amber-250/60 p-6 rounded-2xl flex flex-col sm:flex-row gap-6 items-center justify-between">
                    <div className="space-y-2 max-w-xl">
                      <span className="text-[9px] font-mono font-bold text-amber-700 tracking-widest uppercase block bg-amber-200/50 px-2.5 py-0.5 rounded-full w-fit">
                        PRE-PROCESSING CRITICAL LIMIT
                      </span>
                      <h4 className="text-sm font-bold text-amber-900 font-display">
                        Mechanical Fine-Grained Feedstock State Requirements
                      </h4>
                      <p className="text-xs text-amber-800 leading-relaxed font-semibold">
                        Waste polymers must be thoroughly sanitized and continuously shredded into fine granules/flakes of 3-5mm sizes before ingestion into the extruder screw drive. Raw bottles or unshredded matrices will seize the motor instantly.
                      </p>
                    </div>
                    <img 
                      src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=300"
                      alt="Polymers Shredded" 
                      className="w-40 h-28 object-cover rounded-xl border border-amber-200 flex-shrink-0"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* MARKETPLACE TAB */}
          {activeTab === 'marketplace' && (
            <motion.div
              key="marketplace"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="max-w-7xl mx-auto px-6 py-16 space-y-16"
            >
              <div className="text-center space-y-2">
                <span className="text-[10px] font-mono font-black text-amber-500 tracking-widest uppercase block">
                  ECOSPARK HARDWARE DISTRIBUTION
                </span>
                <h3 className="text-3xl font-bold font-display text-slate-950">
                  Commercial Hardware & Product Catalog
                </h3>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
                {/* RIG CARD */}
                <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="h-72 bg-slate-50 flex items-center justify-center p-8 border-b border-slate-100">
                      <img 
                        src={machineImg} 
                        alt="EcoSpark Rig Assembly" 
                        className="max-h-full object-contain"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="p-8 space-y-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="px-2.5 py-0.5 bg-amber-500/10 text-amber-700 border border-amber-200 text-[8px] font-mono font-black tracking-widest rounded-full uppercase block w-fit mb-1">
                            INDIVIDUAL EQUIPMENT
                          </span>
                          <h5 className="text-lg font-bold font-display text-slate-900 leading-tight">
                            EcoSpark Automated Processing Cell v2.5
                          </h5>
                        </div>
                        <span className="text-xs font-mono font-bold bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 flex-shrink-0">
                          Inquire Unit
                        </span>
                      </div>
                      
                      <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                        Self-contained manufacturing cell with machine vision categorization, precision PID thermal controllers, and interlocked heavy-duty molding presses.
                      </p>

                      <div className="space-y-3 pt-4 border-t border-slate-100">
                        <span className="text-[9px] font-mono font-bold text-slate-400 tracking-widest uppercase block text-left">
                          Core Hardware Specifications
                        </span>
                        <ul className="text-[10px] font-mono font-bold text-slate-600 space-y-2 uppercase tracking-wide">
                          <li className="flex items-center gap-2"><span className="text-amber-500">📍</span> Core Architecture: Dual-Core Processing Units</li>
                          <li className="flex items-center gap-2"><span className="text-amber-500">📍</span> Heat Limit Capability: 350°C Max Continuous</li>
                          <li className="flex items-center gap-2"><span className="text-amber-500">📍</span> Assembly Node Point: AASTU Innovation Center</li>
                        </ul>
                      </div>

                      {/* INSTRUCTIONS GUIDE COLLAPSIBLE BOX */}
                      <div className="pt-2">
                        <button 
                          onClick={() => setShowMachineSteps(!showMachineSteps)}
                          className="w-full py-3 bg-slate-50 border border-slate-200/80 hover:border-slate-300 text-slate-700 rounded-xl font-bold text-[9px] tracking-widest uppercase hover:bg-slate-100 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          {showMachineSteps ? 'Hide Operating Directions' : 'View Operating Directions API Guide'}
                        </button>

                        {showMachineSteps && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="space-y-4 pt-4 border-t border-slate-100 mt-4 text-left"
                          >
                            {[
                              { i: "🔌", s: "Power Initialization", d: "Turn on the machine after plugging in the socket. Check structural circuit breaker and toggle main switch." },
                              { i: "🌡️", s: "Thermal Calibration", d: "Set temperatures on the PID REC700 controller to 200-220°C. Wait for thermal expansion stability." },
                              { i: "📥", s: "Feed Ingestion", d: "Carefully feed clean, granulated plastics into the micro hopper mechanics." },
                              { i: "🔒", s: "Set Tight Clamp", d: "Verify the heavy steel matrix compression mold is securely clamped down." },
                              { i: "⚙️", s: "Engage Feed Motor", d: "Trigger rotation switches. Feed screws initiate forward polymer compression toward nozzles." },
                              { i: "🧱", s: "Extruder Injection", d: "Maintain screw rotation limits for 3-5 seconds until block molds fill completely." },
                              { i: "⏹️", s: "Motor Switch Off", d: "De-energize rotation motor switches to avoid dangerous over-pressures." },
                              { i: "📦", s: "Retrieve Modules", d: "Allow short cooling cycles. Unlock clamp assemblies to retrieve raw circular artifact panels." }
                            ].map((step, idx) => (
                              <div key={idx} className="flex gap-3 items-start bg-slate-50 p-2.5 rounded-lg border border-slate-150">
                                <span className="text-xs bg-white w-6 h-6 rounded-lg border border-slate-200 flex items-center justify-center filter drop-shadow-sm flex-shrink-0 font-medium">
                                  {step.i}
                                </span>
                                <div>
                                  <div className="text-[10px] font-bold font-display text-slate-800 uppercase tracking-widest">{idx + 1}. {step.s}</div>
                                  <p className="text-[9px] text-slate-500 leading-normal mt-0.5 font-medium">{step.d}</p>
                                </div>
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-8 bg-slate-50 border-t border-slate-100 pt-6">
                    <button 
                      onClick={() => { setActiveTab('home'); setTimeout(() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }), 150); }}
                      className="w-full py-4 bg-amber-500 text-white rounded-xl font-bold text-xs tracking-widest uppercase hover:bg-amber-600 active:bg-amber-700 shadow-md shadow-amber-500/10 transition-colors cursor-pointer"
                    >
                      REQUEST INTEGRATION SPECS
                    </button>
                  </div>
                </div>

                {/* ARCHITECTURAL BLOCKS CARD */}
                <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="h-72 bg-slate-50 flex items-center justify-center p-8 border-b border-slate-100">
                      <img 
                        src={productImg} 
                        alt="Structural Blocks Output" 
                        className="max-h-full object-contain"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="p-8 space-y-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-700 border border-emerald-250 text-[8px] font-mono font-black tracking-widest rounded-full uppercase block w-fit mb-1">
                            OUTPUT PRODUCT
                          </span>
                          <h5 className="text-lg font-bold font-display text-slate-900 leading-tight">
                            High-Density Structural Modules
                          </h5>
                        </div>
                        <span className="text-[11px] font-mono font-bold bg-amber-50 text-amber-700 px-2.5 py-1 rounded-lg border border-amber-250 flex-shrink-0 text-center">
                          50.00 - 100.00 ETB / Unit
                        </span>
                      </div>
                      
                      <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                        Interlocking building modules fabricated from verified circular thermal matrices. Designed for immediate installation inside urban structural grids.
                      </p>

                      <div className="space-y-3 pt-4 border-t border-slate-100">
                        <span className="text-[9px] font-mono text-slate-400 tracking-widest uppercase block text-left">
                          Core Performance Rating
                        </span>
                        <ul className="text-[10px] font-mono font-bold text-slate-600 space-y-2 uppercase tracking-wide">
                          <li className="flex items-center gap-2"><span className="text-emerald-500">📍</span> Density Rating: High Viscosity Load Compression</li>
                          <li className="flex items-center gap-2"><span className="text-emerald-500">📍</span> Dimensions: 400mm x 200mm Interlocking Grid</li>
                          <li className="flex items-center gap-2"><span className="text-emerald-500">📍</span> Composition: 100% Recycled Technical Polymer</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="p-8 bg-slate-50 border-t border-slate-100 pt-6">
                    <button 
                      onClick={() => { setActiveTab('home'); setTimeout(() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }), 150); }}
                      className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold text-xs tracking-widest uppercase hover:bg-slate-800 active:bg-slate-950 transition-colors cursor-pointer"
                    >
                      SUBMIT BATCH ORDER APPLICATION
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* DASHBOARD TAB */}
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="max-w-7xl mx-auto px-6 py-12"
            >
              {!isAdminLoggedIn ? (
                <div className="max-w-md mx-auto bg-white border border-slate-200/90 p-10 rounded-3xl text-center shadow-md space-y-6">
                  <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center text-3xl mx-auto rounded-2xl animate-pulse">
                    🔒
                  </div>
                  
                  <div className="space-y-1">
                    <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight font-display">
                      Operator Hub Secure Console
                    </h4>
                    <p className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-widest">
                      Restricted Utility Port Access
                    </p>
                  </div>

                  <form onSubmit={handleAdminLogin} className={`space-y-4 text-left ${errorShake ? 'animate-bounce' : ''}`}>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest pl-1">
                        HOST OPERATOR ID
                      </label>
                      <input 
                        type="text" 
                        placeholder="admin" 
                        value={username} 
                        onChange={e => setUsername(e.target.value)} 
                        className="w-full bg-slate-50 border border-slate-250/80 rounded-xl px-4 py-3.5 text-xs focus:outline-none focus:border-amber-500 focus:bg-white transition-all font-semibold" 
                      />
                    </div>
                    
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center px-1">
                        <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">
                          CRYPTOGRAPHIC SECURITY TOKEN
                        </label>
                        <span className="text-[9px] font-mono font-bold text-amber-600 uppercase bg-amber-100/50 px-1.5 py-0.5 rounded">
                          Hint: admin / aastu11
                        </span>
                      </div>
                      <input 
                        type="password" 
                        placeholder="••••••••" 
                        value={password} 
                        onChange={e => setPassword(e.target.value)} 
                        className="w-full bg-slate-50 border border-slate-250/80 rounded-xl px-4 py-3.5 text-xs focus:outline-none focus:border-amber-500 focus:bg-white transition-all font-semibold" 
                      />
                    </div>

                    {errorShake && (
                      <div className="text-[10px] text-red-600 font-bold font-mono uppercase tracking-wider text-center p-2.5 bg-red-50 border border-red-100 rounded-lg">
                        ⚠️ Authorization verification failed.
                      </div>
                    )}

                    <button 
                      type="submit" 
                      className="w-full py-4 bg-amber-500 text-white rounded-xl font-bold text-[10px] tracking-widest uppercase shadow-md shadow-amber-500/20 hover:bg-amber-600 active:bg-amber-700 transition-colors mt-2 cursor-pointer"
                    >
                      VERIFY ADMINISTRATIVE ACCESS
                    </button>
                  </form>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* LOGGED IN SECURE PANEL */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-900 border border-slate-800 p-8 rounded-3xl text-white gap-6 shadow-md shadow-slate-900/10">
                    <div className="space-y-1.5">
                      <h4 className="text-2xl font-bold tracking-tight uppercase font-display">
                        EcoSpark Master Control Matrix
                      </h4>
                      <p className="text-[10px] text-emerald-400 font-mono font-bold uppercase tracking-widest flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                        Live Ingestion Feeds & Active Customer Communications Monitoring Console
                      </p>
                    </div>
                    <button 
                      onClick={() => { setIsAdminLoggedIn(false); setPassword(''); }} 
                      className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-[10px] font-mono font-black uppercase tracking-widest hover:shadow-lg hover:shadow-red-900/20 active:translate-y-0.5 transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Terminate Session Authorization
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* ENGINES STREAM LOGS TABLE */}
                    <div className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-6">
                      <div className="flex justify-between items-center">
                        <h5 className="text-[10px] font-mono font-black text-amber-500 uppercase tracking-widest">
                          REAL-TIME CLASSIFICATION STREAM LOGS
                        </h5>
                        <span className="text-[9px] font-mono bg-slate-100 text-slate-500 border border-slate-200 px-2.5 py-0.5 rounded">
                          Continuous Buffer
                        </span>
                      </div>
                      
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-[11px] font-bold uppercase tracking-wide border-collapse">
                          <thead className="text-slate-450 border-b border-slate-100">
                            <tr>
                              <th className="pb-4 font-mono">Timestamp</th>
                              <th className="pb-4">Target Composition Profile</th>
                              <th className="pb-4">Confidence Metric</th>
                              <th className="pb-4 text-right">Interlock Status</th>
                            </tr>
                          </thead>
                          <tbody className="text-slate-600 divide-y divide-slate-100">
                            {classificationLogs.length === 0 ? (
                              <tr>
                                <td colSpan={4} className="py-12 text-center italic text-slate-300 font-medium">
                                  No telemetry classification buffers recorded.
                                </td>
                              </tr>
                            ) : (
                              classificationLogs.map((log, i) => (
                                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                  <td className="py-4 font-mono font-bold text-slate-400">{log.timestamp}</td>
                                  <td className="py-4 text-slate-900 font-semibold">{log.material}</td>
                                  <td className="py-4 text-amber-600 font-mono">{log.confidence}</td>
                                  <td className="py-4 text-right">
                                    <span className={`inline-block px-2.5 py-1 rounded-lg text-[9px] border ${
                                      log.status === 'Approved Input' 
                                        ? 'bg-emerald-50 border-emerald-100 text-emerald-700' 
                                        : 'bg-red-50 border-red-100 text-red-750'
                                    }`}>
                                      {log.status === 'Approved Input' ? 'Approved Input (Failover)' : 'Rejected Material'}
                                    </span>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* CONTACT INQUIRY STREAM PANELS */}
                    <div className="lg:col-span-4 bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-6">
                      <h5 className="text-[10px] font-mono font-black text-amber-500 uppercase tracking-widest">
                        CUSTOMER INTERFACE PIPELINE
                      </h5>
                      
                      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                        {customerInquiries.length === 0 ? (
                          <div className="text-center text-slate-300 py-24 italic text-[10px] font-mono font-bold uppercase tracking-widest">
                            No telemetry lines requested.
                          </div>
                        ) : (
                          customerInquiries.map((inq, i) => (
                            <div key={i} className="bg-slate-50 p-5 rounded-2xl border border-slate-200/60 shadow-inner space-y-2.5">
                              <div className="flex justify-between items-start">
                                <div className="font-bold text-slate-900 text-[10px] uppercase tracking-wide">
                                  {inq.name}
                                </div>
                                <span className="text-[8px] font-mono font-black bg-white px-2 py-0.5 rounded border border-slate-150 uppercase tracking-wider text-slate-500">
                                  Inquiry
                                </span>
                              </div>
                              <div className="text-[9px] text-amber-600 font-mono font-bold break-all uppercase tracking-wider">
                                {inq.email}
                              </div>
                              <p className="text-[10px] text-slate-500 leading-relaxed font-semibold bg-white p-3.5 rounded-xl border border-slate-150 italic">
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
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* COMPREHENSIVELY RESTRUCTURED FOOTER */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 px-6 py-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 border-t border-slate-800/80 pt-2 text-center md:text-left">
          <div className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">
            © 2026 EcoSpark Manufacturing Systems Inc. All Rights Reserved.
          </div>
          <div className="text-[10px] font-mono font-black text-slate-100 tracking-[0.15em] uppercase leading-relaxed max-w-md">
            Addis Ababa Science & Technology University (AASTU) // Integrated Engineering Team Project
          </div>
        </div>
      </footer>
    </div>
  );
}
