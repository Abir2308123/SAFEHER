"use client";

import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Week 1", score: 82 },
  { name: "Week 2", score: 78 },
  { name: "Week 3", score: 85 },
  { name: "Week 4", score: 89 },
];

export function EmployerDashboard() {
  const [pollVoted, setPollVoted] = useState(false);

  const handleVote = () => {
    setPollVoted(true);
  };

  return (
    <div className="h-full flex flex-col pt-2 bg-transparent gap-4">
      {/* Chart Section */}
      <div className="h-44 w-full bg-zinc-950/50 rounded-lg p-2 border border-zinc-800 mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
            <XAxis dataKey="name" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
            <YAxis stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} domain={[60, 100]} hide />
            <Tooltip
              contentStyle={{ backgroundColor: "#18181b", borderColor: "#3f3f46", fontSize: "12px", borderRadius: "8px" }}
              itemStyle={{ color: "#3B82F6" }}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#3B82F6"
              strokeWidth={3}
              dot={{ r: 4, fill: "#2E1065", stroke: "#3B82F6", strokeWidth: 2 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 text-center">
        <h4 className="text-xs text-zinc-400 font-mono tracking-widest uppercase mb-1">Overall Sentiment</h4>
        <div className="text-3xl font-light text-brand-blue font-mono">
          83.5<span className="text-sm font-sans text-zinc-500">%</span>
        </div>
      </div>

      {/* Pulse Poll Section */}
      <div className="mt-auto border-t border-zinc-800/50 pt-4">
        <h4 className="text-sm text-zinc-300 font-medium mb-3">Live Pulse Poll</h4>
        <p className="text-xs text-zinc-500 mb-3">How safe do you feel with the new lighting upgrades in the South Wing?</p>
        
        {!pollVoted ? (
          <div className="flex justify-between gap-2">
            <button
              onClick={handleVote}
              className="flex-1 bg-zinc-800 hover:bg-emerald-500/20 hover:text-emerald-400 text-zinc-400 border border-zinc-700 hover:border-emerald-500/50 py-2 rounded-lg transition-colors flex flex-col items-center gap-1"
            >
              <span className="text-xl">👍</span>
              <span className="text-[10px] font-medium tracking-wide">Safer</span>
            </button>
            <button
              onClick={handleVote}
              className="flex-1 bg-zinc-800 hover:bg-yellow-500/20 hover:text-yellow-400 text-zinc-400 border border-zinc-700 hover:border-yellow-500/50 py-2 rounded-lg transition-colors flex flex-col items-center gap-1"
            >
              <span className="text-xl">😐</span>
              <span className="text-[10px] font-medium tracking-wide">Same</span>
            </button>
            <button
              onClick={handleVote}
              className="flex-1 bg-zinc-800 hover:bg-red-500/20 hover:text-red-400 text-zinc-400 border border-zinc-700 hover:border-red-500/50 py-2 rounded-lg transition-colors flex flex-col items-center gap-1"
            >
              <span className="text-xl">👎</span>
              <span className="text-[10px] font-medium tracking-wide">Worse</span>
            </button>
          </div>
        ) : (
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 text-center">
            <p className="text-emerald-400 text-xs font-medium">Vote Recorded Anonymously</p>
            <div className="w-full bg-zinc-800 h-1.5 rounded-full mt-2 overflow-hidden flex">
              <div className="bg-emerald-500 h-full w-[65%]"></div>
              <div className="bg-yellow-500 h-full w-[25%]"></div>
              <div className="bg-red-500 h-full w-[10%]"></div>
            </div>
            <div className="flex justify-between text-[10px] text-zinc-500 mt-1 px-1">
              <span>65% Safer</span>
              <span>10% Worse</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
