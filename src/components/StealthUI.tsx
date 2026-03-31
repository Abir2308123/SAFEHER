"use client";

import React from "react";
import { useCloak } from "@/context/CloakContext";
import { CloudRain, Sun, Search, User } from "lucide-react";

export function StealthUI({ children }: { children: React.ReactNode }) {
  const { isCloaked, toggleCloak } = useCloak();

  if (!isCloaked) {
    return <>{children}</>;
  }

  // Generic Weather Dashboard Fake UI
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      <header className="bg-white shadow-sm h-16 flex items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <Sun className="w-6 h-6 text-yellow-500" />
          <h1 className="font-semibold text-lg text-slate-700">WeatherNow</h1>
        </div>
        
        {/* The hidden toggle button - looks like a generic user icon */}
        <div className="flex items-center gap-4">
          <Search className="w-5 h-5 text-slate-400" />
          <button 
            onClick={toggleCloak}
            className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition text-slate-600"
            title="Profile"
          >
            <User className="w-5 h-5" />
          </button>
        </div>
      </header>
      
      <main className="max-w-4xl mx-auto p-8 mt-10">
        <h2 className="text-3xl font-bold mb-6 text-slate-800">Local Forecast</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center justify-center">
            <CloudRain className="w-12 h-12 text-slate-400 mb-4" />
            <span className="text-4xl font-light">68°F</span>
            <span className="text-slate-500 mt-2">Light Rain</span>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 col-span-2">
            <h3 className="font-medium text-slate-700 mb-4">7-Day Outlook</h3>
            <div className="flex justify-between items-center text-sm font-medium text-slate-500 w-full px-4 h-24 bg-slate-50 rounded-lg">
              <div className="flex flex-col items-center"><span>Mon</span><span className="text-slate-800">72°</span></div>
              <div className="flex flex-col items-center"><span>Tue</span><span className="text-slate-800">65°</span></div>
              <div className="flex flex-col items-center"><span>Wed</span><span className="text-slate-800">68°</span></div>
              <div className="flex flex-col items-center"><span>Thu</span><span className="text-slate-800">75°</span></div>
              <div className="flex flex-col items-center"><span>Fri</span><span className="text-slate-800">78°</span></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
