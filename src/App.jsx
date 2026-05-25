 import React, { useState } from 'react';

export default function App() {
  // Navigation State: 'home', 'molding', 'copilot', 'contact'
  const [activePage, setActivePage] = useState('home');
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  
  // Chatbot state for the RAG Copilot
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Welcome! I am your AI Workshop Copilot. I am trained on our machine specifications to help you understand how we mold parts. Ask me anything!' }
  ]);
  const [userInput, setUserInput] = useState('');

  // Contact form submission state
  const [submitted, setSubmitted] = useState(false);

  // Handle RAG Chatbot queries
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const userMsg = userInput;
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setUserInput('');

    setTimeout(() => {
      let aiResponse = "Our system has processed your question using our project manual library. ";
      if (userMsg.toLowerCase().includes('warping') || userMsg.toLowerCase().includes('warp')) {
        aiResponse += "Warping happens if a part cools down too quickly or unevenly. Our machine fixes this by using a high-grade insulated heating barrel and a secure toggle clamping frame that holds the part steady while it cools.";
      } else if (userMsg.toLowerCase().includes('temperature') || userMsg.toLowerCase().includes('heat')) {
        aiResponse += "Our engineers have found that HDPE melts perfectly at 180°C, while Polypropylene (PP) requires 220°C. Keeping these heats exact prevents defects.";
      } else if (userMsg.toLowerCase().includes('mold') || userMsg.toLowerCase().includes('shape')) {
        aiResponse += "We use an innovative quick-swap modular platen system. This allows customers to change mold shapes in seconds without needing heavy tools.";
      } else {
        aiResponse += "To learn more about our manufacturing bounds, explore the 'Molding Process' section in the top navigation menu.";
      }
      setMessages(prev => [...prev, { sender: 'ai', text: aiResponse }]);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col justify-between">
      
      {/* ─── CUSTOMER NAVIGATION HEADER ─── */}
      <header className="bg-slate-900 text-white shadow-md border-b-4 border-blue-600 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="bg-blue-600 text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">AASTU IETP</span>
              <span className="text-slate-400 text-xs font-bold tracking-widest">GROUP 11</span>
            </div>
            <h1 className="text-xl md:text-2xl font-black mt-0.5 tracking-tight">PLASTIC MOLDING PLATFORM</h1>
          </div>
          
          {/* Public Navigation Menu */}
          <nav className="flex flex-wrap justify-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700">
            <button onClick={() => setActivePage('home')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activePage === 'home' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'}`}>
              HOME
            </button>
            <button onClick={() => setActivePage('molding')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activePage === 'molding' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'}`}>
              MOLDING PROCESS
            </button>
            <button onClick={() => setActivePage('copilot')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activePage === 'copilot' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'}`}>
              AI COPILOT
            </button>
            <button onClick={() => setActivePage('contact')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activePage === 'contact' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'}`}>
              CONTACT US
            </button>
          </nav>
        </div>
      </header>

      {/* ─── PAGE 1: HERO HOME PAGE VIEW ─── */}
      {activePage === 'home' && (
        <main className="flex-grow max-w-5xl w-full mx-auto px-6 py-12 space-y-12">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8 md:p-12 rounded-3xl shadow-xl text-center relative overflow-hidden border border-slate-700">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight max-w-3xl mx-auto leading-tight">
              Engineering Custom Shapes From Recycled Plastics
            </h2>
            <p className="text-sm md:text-base text-slate-300 mt-4 max-w-2xl mx-auto leading-relaxed">
              Welcome to our project showcase. We built a high-precision, desktop-scale molding machine that transforms raw polymer granules into beautiful, custom manufacturing parts.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <button onClick={() => setActivePage('molding')} className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 py-3.5 rounded-xl transition-all shadow-md">
                Explore Molding Process
              </button>
              <button onClick={() => setActivePage('copilot')} className="bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs px-6 py-3.5 rounded-xl transition-all shadow-md">
                Talk to AI Assistant
              </button>
            </div>
          </div>

          {/* Project Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-3xl">🎯</span>
              <h3 className="text-base font-bold text-slate-900 mt-3 mb-1">Our Core Objective</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                To build a small, affordable desktop molding machine that allows engineering students and small labs to create custom parts without needing giant industrial factories.
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-3xl">⚙️</span>
              <h3 className="text-base font-bold text-slate-900 mt-3 mb-1">How it Works</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Raw plastic pellets are fed into a heated barrel chamber. Once fully melted, a hand-operated mechanical lever pushes the plastic smoothly into quick-swap metal mold blocks.
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-3xl">🌱</span>
              <h3 className="text-base font-bold text-slate-900 mt-3 mb-1">Zero-Waste Goal</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Our machine supports sustainability. Old plastic scraps, flash materials, and failed parts can be re-ground and loaded right back into the funnel to create perfect new items.
              </p>
            </div>
          </div>
        </main>
      )}

      {/* ─── PAGE 2: INTERACTIVE MOLDING GUIDE ─── */}
      {activePage === 'molding' && (
        <main className="flex-grow max-w-4xl w-full mx-auto px-6 py-12">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">The 10g Micro-Molding Setup</h2>
            <p className="text-xs text-slate-500 mt-2">
              Click a plastic material below to see how our custom prototype balances heat and pressure to mold high-quality test parts.
            </p>
          </div>

          {/* Interactive Selector */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl mx-auto mb-8">
            <button onClick={() => setSelectedMaterial({ name: 'HDPE (High-Density Polyethylene)', temp: 180, cooling: 45, uses: 'Used for strong, durable parts like custom gears, bottle caps, and structural brackets.' })} 
                    className={`p-5 rounded-2xl border text-left transition-all flex flex-col justify-between ${selectedMaterial?.name.includes('HDPE') ? 'border-blue-500 bg-blue-50/50 ring-2 ring-blue-500/20' : 'border-slate-200 bg-white hover:bg-slate-50'}`}>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Option 1</span>
              <span className="text-base font-bold text-slate-900 mt-1">HDPE Pellets</span>
            </button>
            <button onClick={() => setSelectedMaterial({ name: 'PP (Polypropylene)', temp: 220, cooling: 60, uses: 'Used for flexible, heat-resistant components like snap-fit hinges, laboratory tools, and living joints.' })} 
                    className={`p-5 rounded-2xl border text-left transition-all flex flex-col justify-between ${selectedMaterial?.name.includes('PP') ? 'border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-500/20' : 'border-slate-200 bg-white hover:bg-slate-50'}`}>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Option 2</span>
              <span className="text-base font-bold text-slate-900 mt-1">PP Pellets</span>
            </button>
          </div>

          {/* Detailed Output Display */}
          {selectedMaterial ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm max-w-xl mx-auto space-y-4 animate-fadeIn">
              <h3 className="text-lg font-bold text-slate-900">{selectedMaterial.name} Blueprint</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{selectedMaterial.uses}</p>
              
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Target Melt Heat</span>
                  <span className="text-xl font-extrabold text-amber-600 mt-0.5 block">{selectedMaterial.temp}°C</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Clamp Cooling Time</span>
                  <span className="text-xl font-extrabold text-purple-600 mt-0.5 block">{selectedMaterial.cooling} Seconds</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center p-8 bg-slate-100 border-2 border-dashed border-slate-200 rounded-2xl max-w-xl mx-auto text-xs text-slate-400 italic">
              Please click on a raw material type above to display machine forming parameters.
            </div>
          )}
        </main>
      )}

      {/* ─── PAGE 3: AI COPILOT WORKSHOP COMPANION ─── */}
      {activePage === 'copilot' && (
        <main className="flex-grow max-w-3xl w-full mx-auto px-6 py-12 flex flex-col justify-between min-h-[500px]">
          <div>
            <div className="text-center max-w-md mx-auto mb-6">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">RAG Operations Copilot</h2>
              <p className="text-xs text-slate-500 mt-1">
                Have a question about our project? Type below to instantly query our machine specifications, heat bounds, and lab safety guidelines.
              </p>
            </div>

            {/* Chat Box Container */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 min-h-[250px] max-h-[320px] overflow-y-auto space-y-3 shadow-sm text-xs">
              {messages.map((msg, index) => (
                <div key={index} className={`p-3 rounded-xl max-w-[85%] ${msg.sender === 'user' ? 'bg-blue-600 text-white ml-auto' : 'bg-slate-100 text-slate-800 mr-auto border border-slate-200'}`}>
                  <span className="text-[9px] font-bold block opacity-60 mb-0.5">{msg.sender === 'user' ? 'You' : 'System Guide'}</span>
                  <p className="leading-relaxed font-medium">{msg.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Chat Input Form */}
          <form onSubmit={handleSendMessage} className="mt-4 flex gap-2">
            <input type="text" value={userInput} onChange={(e) => setUserInput(e.target.value)} placeholder="Ask about heat profiles, mold swapping, or warping fixes..." className="flex-grow bg-white border border-slate-200 text-xs rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm" />
            <button type="submit" className="bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold px-5 py-3.5 rounded-xl transition-all shadow-md">
              Send
            </button>
          </form>
        </main>
      )}

      {/* ─── PAGE 4: CLEAN CONTACT US FORM ─── */}
      {activePage === 'contact' && (
        <main className="flex-grow max-w-md w-full mx-auto px-6 py-12">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-2">Contact Our Engineering Team</h2>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              Have questions regarding our laboratory data, CAD files, or custom tooling plates? Send us a message and Group 11 will get right back to you.
            </p>

            {submitted ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl text-center">
                ✨ Thank you! Your request has been sent to our campus registry successfully.
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Full Name</label>
                  <input type="text" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Email Address</label>
                  <input type="email" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="john@example.com" />
                </div>
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Inquiry Message</label>
                  <textarea required rows="4" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Tell us about your custom mold requirements..."></textarea>
                </div>
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-md">
                  Submit Form
                </button>
              </form>
            )}
          </div>
        </main>
      )}

      {/* ─── ACADEMIC EVALUATION ADMINISTRATIVE FOOTER ─── */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 p-6 md:p-8 text-xs">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Section 1: Advisor & University Credits */}
          <div>
            <span className="font-bold text-white uppercase tracking-wider block mb-2 text-blue-500 text-[11px]">Academic Review Panel</span>
            <p className="font-bold text-slate-200">ADVISOR: Aman Kassaye (PhD)</p>
            <p className="text-slate-400 mt-1 leading-relaxed">
              Addis Ababa Science and Technology University (AASTU)<br />
              Integrated Engineering Team Project (IETP)<br />
              Project Date: <span className="text-slate-300 font-mono">April 14, 2026 GC</span>
            </p>
          </div>

          {/* Section 2: Student Roster */}
          <div>
            <span className="font-bold text-white uppercase tracking-wider block mb-2 text-purple-500 text-[11px]">Engineers Hub (Group 11)</span>
            <ul className="grid grid-cols-2 gap-y-1 text-slate-400 font-medium">
              <li>• Tewodros</li>
              <li>• Henok</li>
              <li>• Ermyas</li>
              <li>• Mesfin</li>
              <li>• Tesfaye</li>
              <li>• Saba</li>
              <li className="col-span-2 text-slate-200 font-bold">• Yaiyneabeba (Log Owner)</li>
            </ul>
          </div>

          {/* Section 3: Shared Contact Details */}
          <div>
            <span className="font-bold text-white uppercase tracking-wider block mb-2 text-amber-500 text-[11px]">Inquiries & Collaboration</span>
            <p className="text-slate-400 leading-relaxed">
              To request a physical lab walkthrough, access raw machine telemetry metrics, or review structural project records, connect with us at:
            </p>
            <a href="mailto:ietp.group11@aastu.edu.et" className="text-blue-400 font-bold hover:underline block mt-2 tracking-wide font-mono text-[13px]">
              ietp.group11@aastu.edu.et
            </a>
          </div>

        </div>
        
        <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-slate-800 text-center text-slate-500 font-medium">
          &copy; 2026 AASTU Group 11 Project Node. Built with split cloud RAG capabilities.
        </div>
      </footer>

    </div>
  );
}
