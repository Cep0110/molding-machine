import React, { useState } from 'react';

export default function App() {
  const [material, setMaterial] = useState('None');
  const [temp, setTemp] = useState(0);
  const [cooling, setCooling] = useState(0);

  const handleSelection = (type) => {
    if (type === 'HDPE') {
      setMaterial('High-Density Polyethylene (HDPE)');
      setTemp(180);
      setCooling(45);
    } else if (type === 'PP') {
      setMaterial('Polypropylene (PP)');
      setTemp(220);
      setCooling(60);
    }
  };

  return (
    <div class="min-h-screen bg-slate-100 p-6 flex flex-col justify-between">
      {/* Header Banner */}
      <header class="bg-blue-600 text-white p-6 rounded-xl shadow-md text-center">
        <h1 class="text-3xl font-bold tracking-wide">PLASTIC MOLDING MACHINE</h1>
        <p class="text-sm opacity-90 mt-1">Powered by: IETP Group 11</p>
      </header>

      {/* Main Grid Content */}
      <main class="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
        
        {/* Column 1: Problems & Objectives */}
        <section class="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <h2 class="text-xl font-bold text-red-600 mb-3">⚠️ Problems</h2>
          <ul class="list-disc list-inside space-y-2 text-sm text-slate-700">
            <li>Factory molding machines are too big and cost too much.</li>
            <li>They use too much electrical power.</li>
            <li>Parts bend or warp when cooling down unevenly.</li>
          </ul>
          
          <h2 class="text-xl font-bold text-green-600 mt-6 mb-3">🎯 Objectives</h2>
          <ul class="list-disc list-inside space-y-2 text-sm text-slate-700">
            <li>Build a small molding machine that fits on a desk.</li>
            <li>Keep heat steady so the plastic melts perfectly.</li>
            <li>Make a base that lets us swap molds easily.</li>
          </ul>
        </section>

        {/* Column 2: Solutions & Goals */}
        <section class="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <h2 class="text-xl font-bold text-blue-600 mb-3">💡 Solutions</h2>
          <ul class="list-disc list-inside space-y-2 text-sm text-slate-700">
            <li>Use a hand-operated lever to push plastic safely.</li>
            <li>Add thick insulation blocks to save energy.</li>
            <li>Use a quick-change system to swap molds.</li>
          </ul>

          <h2 class="text-xl font-bold text-purple-600 mt-6 mb-3">🏁 Goals</h2>
          <ul class="list-disc list-inside space-y-2 text-sm text-slate-700">
            <li>Make smooth, strong parts with correct shapes.</li>
            <li>Write down safe rules for using the machine.</li>
            <li>Stop waste by recycling plastic scraps.</li>
          </ul>
        </section>

        {/* Column 3: Interactive Machine Status Controls */}
        <section class="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between">
          <div>
            <h2 class="text-xl font-bold text-slate-800 mb-4">⚙️ Testing Matrix</h2>
            <div class="flex gap-3 mb-6">
              <button onClick={() => handleSelection('HDPE')} class="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-lg transition shadow-sm">
                Select HDPE
              </button>
              <button onClick={() => handleSelection('PP')} class="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium py-2 rounded-lg transition shadow-sm">
                Select PP
              </button>
            </div>
          </div>

          <div class="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <h3 class="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Machine Status</h3>
            <p class="text-sm font-medium text-slate-800 mb-1">Active Material: <span class="text-blue-600 font-bold">{material}</span></p>
            <p class="text-sm font-medium text-slate-800 mb-1">Target Heat: <span class="text-amber-600 font-bold">{temp}°C</span></p>
            <p class="text-sm font-medium text-slate-800">Cooling Clamp Time: <span class="text-purple-600 font-bold">{cooling} Seconds</span></p>
          </div>
        </section>

      </main>

      {/* Footer Administrative Details */}
      <footer class="bg-slate-800 text-slate-300 p-5 rounded-xl flex flex-col md:flex-row justify-between items-center text-sm gap-4">
        <div>
          <p class="font-bold text-white text-base">ADVISOR: Aman Kassaye (PhD)</p>
          <p class="text-xs opacity-75 mt-1">Date Submitted: April 14, 2026 GC</p>
        </div>
        <div class="text-center md:text-right">
          <p class="font-semibold text-white">TEAM MEMBERS:</p>
          <p class="text-xs mt-1">Tewodros, Henok, Ermyas, Mesfin, Tesfaye, Saba, Yaiyneabeba</p>
        </div>
      </footer>
    </div>
  );
}
