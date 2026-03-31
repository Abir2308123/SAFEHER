"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Topbar } from "@/components/Topbar";
import { StealthUI } from "@/components/StealthUI";
import { GuardianMode } from "@/components/GuardianMode";
import { AnonymousEngine } from "@/components/AnonymousEngine";
import { EmployerDashboard } from "@/components/EmployerDashboard";

// Dynamic import for Leaflet because it relies on window object directly 
const HeatMap = dynamic(() => import("@/components/HeatMap").then((mod) => mod.HeatMap), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-zinc-900 rounded-lg animate-pulse border border-zinc-800 flex items-center justify-center text-zinc-500 font-mono text-xs">Loading Satellite Map...</div>
});

export default function Home() {
  const [timeOfDay, setTimeOfDay] = useState(14); // 8 to 24
  const [density, setDensity] = useState(70); // 0 to 100

  const formatTime = (time: number) => {
    return `${Math.floor(time).toString().padStart(2, '0')}:00 HRS`;
  };

  const getDensityLabel = (den: number) => {
    if (den > 75) return "HIGH";
    if (den > 40) return "MEDIUM";
    return "LOW";
  };

  return (
    <StealthUI>
      <div className="min-h-screen bg-black text-white selection:bg-brand-blue/30 font-sans pb-10">
        <Topbar />
        
        <main className="pt-24 px-6 max-w-[1600px] mx-auto">
          {/* Top Level Metrics / Controls */}
          <div className="flex flex-col xl:flex-row justify-between xl:items-end mb-8 gap-6">
            <div>
              <h2 className="text-3xl font-light tracking-tight">System Status: <span className="text-emerald-400 font-mono font-medium">NOMINAL</span></h2>
              <p className="text-zinc-400 mt-1">Live simulation environment</p>
            </div>
            
            {/* Global Sliders */}
            <div className="bg-zinc-900/50 border border-brand-blue/20 rounded-xl p-5 flex flex-col sm:flex-row gap-8 backdrop-blur-md shadow-[0_0_30px_rgba(59,130,246,0.1)]">
              
              {/* Time Slider */}
              <div className="flex flex-col gap-2 min-w-[200px]">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-400">Time of Day</span>
                  <span className="font-mono text-brand-blue font-medium">{formatTime(timeOfDay)}</span>
                </div>
                <input 
                  type="range" 
                  min="8" max="24" step="1"
                  value={timeOfDay} 
                  onChange={(e) => setTimeOfDay(Number(e.target.value))}
                  className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-brand-blue"
                />
              </div>

              {/* Density Slider */}
              <div className="flex flex-col gap-2 min-w-[200px]">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-400">Employee Density</span>
                  <span className="font-mono text-brand-purple font-medium">{getDensityLabel(density)} ({density}%)</span>
                </div>
                <input 
                  type="range" 
                  min="0" max="100" step="5"
                  value={density} 
                  onChange={(e) => setDensity(Number(e.target.value))}
                  className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-brand-purple"
                />
              </div>

            </div>
          </div>

          {/* Main 3-column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[800px]">
            {/* Left Column: Anonymous Engine feed */}
            <div className="lg:col-span-3 bg-zinc-900/30 border border-zinc-800/50 rounded-xl p-4 flex flex-col gap-4 backdrop-blur-sm">
              <h3 className="text-lg font-medium text-zinc-300 font-mono border-b border-zinc-800 pb-2">THE SAFETY PACT</h3>
              <div className="flex-1 overflow-y-auto">
                 <AnonymousEngine />
              </div>
            </div>

            {/* Center Column: Heat Map */}
            <div className="lg:col-span-6 bg-zinc-950 border border-brand-blue/30 rounded-xl relative overflow-hidden flex flex-col shadow-[0_0_50px_rgba(46,16,101,0.2)]">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-purple via-brand-blue to-brand-purple"></div>
              <div className="p-4 border-b border-zinc-800/50 flex justify-between items-center bg-zinc-900/40 backdrop-blur-md z-10">
                <h3 className="text-lg font-medium text-zinc-100 font-mono flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                  LIVE HEAT MAP
                </h3>
                <div className="flex gap-4">
                  <span className="flex items-center gap-2 text-xs text-zinc-400"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Safe</span>
                  <span className="flex items-center gap-2 text-xs text-zinc-400"><div className="w-2 h-2 rounded-full bg-yellow-500"></div> Uneasy</span>
                  <span className="flex items-center gap-2 text-xs text-zinc-400"><div className="w-2 h-2 rounded-full bg-red-500"></div> Danger</span>
                </div>
              </div>
              <div className="flex-1 relative overflow-hidden bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-purple/5 via-zinc-950 to-zinc-950">
                 <HeatMap timeOfDay={timeOfDay} density={density} />
              </div>
            </div>

            {/* Right Column: Dashboards & Guardian Mode */}
            <div className="lg:col-span-3 flex flex-col gap-6">
              {/* Employer Dashboard Graph */}
              <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-xl p-4 flex-1 backdrop-blur-sm">
                <h3 className="text-lg font-medium text-zinc-300 font-mono border-b border-zinc-800 pb-2">SENTIMENT TREND</h3>
                 <EmployerDashboard />
              </div>

              {/* Guardian Mode Mobile Sim */}
              <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-xl p-4 flex-1 backdrop-blur-sm relative overflow-hidden shadow-inner">
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-brand-purple/20 rounded-full blur-3xl"></div>
                <h3 className="text-lg font-medium text-brand-blue font-mono border-b border-zinc-800 pb-2 relative z-10">GUARDIAN MODE</h3>
                <GuardianMode />
              </div>
            </div>
          </div>
        </main>
      </div>
    </StealthUI>
  );
}

