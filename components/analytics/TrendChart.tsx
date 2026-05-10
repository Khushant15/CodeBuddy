"use client";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const tooltipStyle = {
  contentStyle: { 
    background: "rgba(8,7,23,0.97)", 
    border: "1px solid rgba(0,255,135,0.15)", 
    borderRadius: 8, 
    color: "#e2e0f5", 
    fontFamily: "Fira Code, monospace", 
    fontSize: 11 
  },
  labelStyle: { color: "rgba(0,255,135,0.7)" },
};

export function TrendChart({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--neon-green)" stopOpacity={0.4}/>
            <stop offset="95%" stopColor="var(--neon-green)" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
        <XAxis dataKey="day" stroke="rgba(255,255,255,0.2)" tick={{ fontSize: 10, fontFamily: "Fira Code" }} />
        <YAxis stroke="rgba(255,255,255,0.2)" tick={{ fontSize: 10, fontFamily: "Fira Code" }} />
        <Tooltip {...tooltipStyle} />
        <Area 
          type="monotone" 
          dataKey="xp" 
          stroke="var(--neon-green)" 
          strokeWidth={2}
          fill="url(#colorXp)" 
          dot={{ fill: "var(--neon-green)", strokeWidth: 0, r: 3 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
