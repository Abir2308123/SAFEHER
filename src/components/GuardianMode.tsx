"use client";

import React, { useState, useEffect } from "react";
import { Mic, ShieldAlert, TimerReset, CheckCircle2 } from "lucide-react";

export function GuardianMode() {
  const [activeTab, setActiveTab] = useState<"silentWalk" | "whisper">("silentWalk");
  
  // Silent Walk State
  const [timer, setTimer] = useState(15); // 15 seconds for simulation
  const [isWalking, setIsWalking] = useState(false);
  const [alertSent, setAlertSent] = useState(false);

  // Whisper Report State
  const [isRecording, setIsRecording] = useState(false);
  const [isStripping, setIsStripping] = useState(false);
  const [reportResult, setReportResult] = useState<string | null>(null);

  // Timer Effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isWalking && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setAlertSent(true);
            setIsWalking(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isWalking, timer]);

  const handleStartWalk = () => {
    setTimer(15);
    setIsWalking(true);
    setAlertSent(false);
  };

  const handleCheckIn = () => {
    setIsWalking(false);
    setTimer(15);
    setAlertSent(false);
  };

  const handleRecordWhisper = () => {
    setReportResult(null);
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      setIsStripping(true);
      
      // Simulate stripping process
      setTimeout(() => {
        setIsStripping(false);
        setReportResult("Voice stripped. Pattern recognized: Potential safety concern near the south elevator.");
      }, 2000);
    }, 3000);
  };

  return (
    <div className="h-full flex flex-col pt-2 relative z-10">
      {/* Mobile Frame Simulation Container */}
      <div className="flex-1 bg-zinc-950 rounded-[2rem] border-4 border-zinc-800 relative overflow-hidden flex flex-col shadow-2xl">
        {/* Fake Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-zinc-800 rounded-b-xl z-20"></div>

        {/* Header Tabs */}
        <div className="flex pt-8 pb-2 px-4 border-b border-zinc-800/50">
          <button 
            onClick={() => setActiveTab("silentWalk")}
            className={`flex-1 text-center text-sm pb-2 border-b-2 transition-colors ${activeTab === 'silentWalk' ? 'border-brand-blue text-brand-blue font-medium' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
          >
            Silent Walk
          </button>
          <button 
            onClick={() => setActiveTab("whisper")}
            className={`flex-1 text-center text-sm pb-2 border-b-2 transition-colors ${activeTab === 'whisper' ? 'border-brand-purple text-brand-purple font-medium' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
          >
            Whisper
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-4 overflow-y-auto">
          {activeTab === "silentWalk" ? (
            <div className="flex flex-col items-center justify-center h-full gap-6">
              <div className="relative w-32 h-32 flex items-center justify-center">
                {/* Timer Circle */}
                <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                  <circle cx="64" cy="64" r="60" fill="transparent" stroke="#27272a" strokeWidth="8" />
                  <circle 
                    cx="64" cy="64" r="60" 
                    fill="transparent" 
                    stroke={alertSent ? "#ef4444" : "#3B82F6"} 
                    strokeWidth="8" 
                    strokeDasharray="377"
                    strokeDashoffset={377 - (377 * timer) / 15}
                    className="transition-all duration-1000 linear"
                  />
                </svg>
                <div className="text-4xl font-mono text-white z-10">
                  00:{timer.toString().padStart(2, '0')}
                </div>
              </div>

              {alertSent ? (
                <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 text-center animate-pulse">
                  <ShieldAlert className="w-8 h-8 text-red-500 mx-auto mb-2" />
                  <h4 className="text-red-400 font-medium">GUARDIAN ALERT ACTIVATED</h4>
                  <p className="text-red-400/80 text-xs mt-1">Peer network informed. Live tracking enabled.</p>
                </div>
              ) : (
                <div className="text-center">
                  <h3 className="font-medium text-zinc-200">Timer Active</h3>
                  <p className="text-zinc-500 text-xs mt-1 px-4">If time expires without check-in, alert triggers automatically.</p>
                </div>
              )}

              <div className="mt-auto w-full flex flex-col gap-2">
                {!isWalking && !alertSent ? (
                  <button 
                    onClick={handleStartWalk}
                    className="w-full bg-brand-blue hover:bg-brand-blue/80 text-white font-medium py-3 rounded-xl transition"
                  >
                    Start Guardian Timer
                  </button>
                ) : (
                  <>
                    <button 
                      onClick={handleCheckIn}
                      className="w-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 font-medium py-3 rounded-xl transition flex justify-center items-center gap-2"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      I am Safe
                    </button>
                    {alertSent && (
                       <button 
                         onClick={() => { setAlertSent(false); setTimer(15); }}
                         className="w-full bg-zinc-800 text-zinc-300 hover:bg-zinc-700 font-medium py-3 rounded-xl transition mt-2 text-sm flex justify-center items-center gap-2"
                       >
                         <TimerReset className="w-4 h-4" /> Reset Simulation
                       </button>
                    )}
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-6">
              <div className="text-center">
                <h3 className="font-medium text-zinc-200 mb-2">Whisper Report</h3>
                <p className="text-zinc-500 text-xs px-2">Record an anonymous audio log. Voice identifiers are stripped locally.</p>
              </div>

              <div className="relative">
                <button 
                  onMouseDown={handleRecordWhisper} // For simulation, just a click triggers it
                  disabled={isRecording || isStripping}
                  className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${isRecording ? 'bg-red-500 scale-110 shadow-[0_0_30px_rgba(239,68,68,0.5)]' : isStripping ? 'bg-zinc-800 border-2 border-brand-purple border-dashed animate-spin-slow' : 'bg-brand-purple hover:bg-brand-purple/80 hover:scale-105'}`}
                >
                  <Mic className={`w-10 h-10 ${isRecording ? 'text-white animate-pulse' : isStripping ? 'text-brand-purple opacity-50' : 'text-white'}`} />
                </button>
              </div>

              <div className="w-full h-32 flex flex-col justify-end">
                {isRecording && (
                    <div className="flex justify-center items-end gap-1 h-12">
                      {["80%", "40%", "90%", "30%", "60%", "100%", "50%"].map((h, i) => (
                        <div key={i} className="w-2 bg-red-400 rounded-t animate-bounce" style={{ height: h, animationDelay: `${i * 0.1}s` }}></div>
                      ))}
                    </div>
                )}
                {isStripping && (
                  <div className="w-full">
                    <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-brand-purple w-full origin-left animate-pulse" />
                    </div>
                    <p className="text-brand-purple text-xs text-center mt-2 font-mono">STRIPPING BIOMETRICS...</p>
                  </div>
                )}
                 {reportResult && (
                   <div className="bg-zinc-900 border border-brand-purple/30 p-3 rounded-xl">
                      <h4 className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Anonymized Transcript</h4>
                      <p className="text-sm text-zinc-300 italic">&quot;{reportResult}&quot;</p>
                   </div>
                )}
              </div>

              {!isRecording && !isStripping && !reportResult && (
                <div className="text-xs text-zinc-500 mt-auto">Click Mic to simulate report</div>
              )}
            </div>
          )}
        </div>
        
        {/* Fake Home Indicator */}
        <div className="h-1 w-1/3 bg-zinc-700/50 rounded-full mx-auto mb-2 mt-2"></div>
      </div>
    </div>
  );
}
