"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Topbar } from "@/components/Topbar";
import { StealthUI } from "@/components/StealthUI";
import { AnonymousEngine } from "@/components/AnonymousEngine";
import { Lock, LogOut } from "lucide-react";

// Dynamic import for Leaflet because it relies on window object directly 
const HeatMap = dynamic(() => import("@/components/HeatMap").then((mod) => mod.HeatMap), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-zinc-900 rounded-lg animate-pulse border border-zinc-800 flex items-center justify-center text-zinc-500 font-mono text-xs">Loading Satellite Map...</div>
});

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  // Map controls
  const [timeOfDay, setTimeOfDay] = useState(14); // 8 to 24
  const [density, setDensity] = useState(70); // 0 to 100

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "admin123") {
      setIsAuthenticated(true);
      setError(false);
    } else {
      setError(true);
      setPassword("");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword("");
  };

  const formatTime = (time: number) => {
    return `${Math.floor(time).toString().padStart(2, '0')}:00 HRS`;
  };

  const getDensityLabel = (den: number) => {
    if (den > 75) return "HIGH";
    if (den > 40) return "MEDIUM";
    return "LOW";
  };

  if (!isAuthenticated) {
    return (
      <StealthUI>
        <div className="min-h-screen bg-black text-white flex items-center justify-center font-sans selection:bg-brand-blue/30">
          <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-2xl backdrop-blur-md w-full max-w-md shadow-[0_0_50px_rgba(46,16,101,0.2)]">
            <div className="flex justify-center mb-6">
              <div className="w-12 h-12 rounded-full bg-brand-purple/20 flex items-center justify-center border border-brand-purple/50">
                <Lock className="w-6 h-6 text-brand-purple" />
              </div>
            </div>
            
            <h2 className="text-2xl font-light tracking-tight text-center mb-2">Admin Access</h2>
            <p className="text-zinc-400 text-center text-sm mb-8">Enter authorization code to review system data.</p>
            
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className={`w-full bg-zinc-950 border ${error ? 'border-red-500/50' : 'border-zinc-800'} rounded-lg p-3 text-zinc-200 focus:outline-none focus:border-brand-blue/50 transition-colors font-mono`}
                  autoFocus
                />
                {error && <p className="text-red-400 text-xs mt-2 ml-1">Invalid authorization code.</p>}
              </div>
              
              <button 
                type="submit"
                className="w-full bg-brand-purple text-white rounded-lg p-3 font-medium hover:bg-brand-purple/80 transition-colors"
              >
                Authenticate
              </button>
            </form>
          </div>
        </div>
      </StealthUI>
    );
  }

  return (
    <StealthUI>
      <div className="min-h-screen bg-black text-white selection:bg-brand-blue/30 font-sans pb-10">
        <Topbar />
        
        <main className="pt-24 px-6 max-w-[1600px] mx-auto">
          {/* Top Level Metrics / Controls */}
          <div className="flex flex-col xl:flex-row justify-between xl:items-end mb-8 gap-6">
            <div>
              <h2 className="text-3xl font-light tracking-tight flex items-center gap-3">
                Admin Overwatch
                <span className="text-xs uppercase tracking-widest font-bold bg-brand-purple/20 text-brand-purple px-2 py-1 rounded border border-brand-purple/30">
                  Classified
                </span>
              </h2>
              <p className="text-zinc-400 mt-1">Review live map conditions and aggregate threads</p>
            </div>
            
            {/* Controls & Logout */}
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              {/* Global Sliders */}
              <div className="bg-zinc-900/50 border border-brand-blue/20 rounded-xl p-5 flex flex-col sm:flex-row gap-8 backdrop-blur-md shadow-[0_0_30px_rgba(59,130,246,0.1)] flex-1">
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

              <button 
                onClick={handleLogout}
                className="bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 rounded-xl p-5 flex items-center justify-center gap-2 transition-colors h-full whitespace-nowrap"
                title="Secure Logout"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>

          {/* Main Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[800px]">
            
            {/* Center Column: Heat Map */}
            <div className="lg:col-span-8 bg-zinc-950 border border-brand-blue/30 rounded-xl relative overflow-hidden flex flex-col shadow-[0_0_50px_rgba(46,16,101,0.2)]">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-purple via-brand-blue to-brand-purple"></div>
              <div className="p-4 border-b border-zinc-800/50 flex justify-between items-center bg-zinc-900/40 backdrop-blur-md z-10">
                <h3 className="text-lg font-medium text-zinc-100 font-mono flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                  LIVE HEAT MAP REVIEW
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

            {/* Right Column: Anonymous Engine feed */}
            <div className="lg:col-span-4 bg-zinc-900/30 border border-zinc-800/50 rounded-xl p-4 flex flex-col gap-4 backdrop-blur-sm">
              <h3 className="text-lg font-medium text-brand-blue font-mono border-b border-zinc-800 pb-2">AGGREGATE THREADS</h3>
              <div className="flex-1 overflow-y-auto">
                 <AnonymousEngine />
              </div>
            </div>

          </div>
        </main>
      </div>
    </StealthUI>
  );
}
