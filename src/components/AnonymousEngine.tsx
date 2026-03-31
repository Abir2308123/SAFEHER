"use client";

import React, { useState } from "react";
import { AlertTriangle, ThumbsUp, ShieldCheck } from "lucide-react";

type Incident = {
  id: string;
  report: string;
  time: string;
  location: string;
  initialPlusOnes: number;
};

const MOCK_INCIDENTS: Incident[] = [
  { id: "1", report: "Uncomfortable encounter in the South hallway after 7 PM.", time: "2 hours ago", location: "South Wing", initialPlusOnes: 2 },
  { id: "2", report: "Noticed the emergency exit near the cafeteria is blocked by boxes.", time: "4 hours ago", location: "Cafeteria", initialPlusOnes: 0 },
  { id: "3", report: "Streetlights outside the main entrance are flickering heavily.", time: "1 day ago", location: "Main Entrance", initialPlusOnes: 1 },
];

export function AnonymousEngine() {
  const [incidents, setIncidents] = useState<
    Array<{ base: Incident; plusOnes: number; userClicked: boolean }>
  >(MOCK_INCIDENTS.map((i) => ({ base: i, plusOnes: i.initialPlusOnes, userClicked: false })));

  const handlePlusOne = (id: string) => {
    setIncidents(
      incidents.map((incident) => {
        if (incident.base.id === id) {
          if (incident.userClicked) return incident; // Prevent multiple clicks
          return {
            ...incident,
            plusOnes: incident.plusOnes + 1,
            userClicked: true,
          };
        }
        return incident;
      })
    );
  };

  return (
    <div className="flex flex-col gap-4 h-full pr-2">
      {incidents.map((incident) => {
        const isEscalated = incident.plusOnes >= 3;

        return (
          <div
            key={incident.base.id}
            className={`p-4 rounded-xl border transition-all duration-500 ${
              isEscalated
                ? "bg-red-500/10 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]"
                : "bg-zinc-900/50 border-zinc-800"
            }`}
          >
            {/* Header / Badges */}
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-mono text-zinc-500">{incident.base.time}</span>
              {isEscalated && (
                <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold bg-red-500/20 text-red-400 px-2 py-1 rounded-full border border-red-500/30">
                  <ShieldCheck className="w-3 h-3" />
                  Verified Pattern - Escalated
                </span>
              )}
            </div>

            {/* Report Content */}
            <p className={`text-sm mb-3 ${isEscalated ? 'text-zinc-200' : 'text-zinc-300'}`}>
              &quot;{incident.base.report}&quot;
            </p>
            
            <div className="text-xs text-brand-blue mb-4 flex items-center gap-1 font-mono">
              <AlertTriangle className="w-3 h-3" />
              Location: {incident.base.location}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between border-t border-zinc-800/50 pt-3">
              <div className="text-xs text-zinc-500">
                <span className={incident.plusOnes > 0 ? "text-zinc-300 font-medium font-mono" : ""}>
                   {incident.plusOnes} {incident.plusOnes === 1 ? 'Peer' : 'Peers'}
                </span> validated this
              </div>
              <button
                onClick={() => handlePlusOne(incident.base.id)}
                disabled={incident.userClicked}
                className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                  incident.userClicked
                    ? "bg-brand-purple/20 text-brand-purple border-brand-purple/30 cursor-not-allowed"
                    : "bg-zinc-800 text-zinc-400 border-zinc-700 hover:bg-zinc-700 hover:text-zinc-200"
                }`}
              >
                <ThumbsUp className="w-3 h-3" />
                {incident.userClicked ? "Validated" : "+1 I've felt this too"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
