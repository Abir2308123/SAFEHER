"use client";

import React from "react";
import { useCloak } from "@/context/CloakContext";
import { Eye, EyeOff, ShieldAlert } from "lucide-react";

export function Topbar() {
  const { isCloaked, toggleCloak } = useCloak();

  if (isCloaked) return null; // If cloaked, stealth UI handles the header

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-brand-purple/20 backdrop-blur-md border-b border-brand-purple/30 z-50 px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <ShieldAlert className="w-6 h-6 text-brand-blue" />
        <h1 className="font-bold text-xl tracking-wider text-brand-blue">
          SAFETY BAROMETER
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-xs uppercase tracking-widest text-[#ededed]/60 font-mono">
          System: Active
        </span>
        <button
          onClick={toggleCloak}
          className="p-2 rounded-full hover:bg-[#ededed]/10 transition-colors text-[#ededed]"
          title="Enable Cloak (Stealth Mode)"
        >
          {isCloaked ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
        </button>
      </div>
    </header>
  );
}
