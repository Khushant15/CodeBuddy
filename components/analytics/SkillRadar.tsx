import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from "recharts";

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

export function SkillRadar({ data }: { data: any[] }) {
  if (!data || data.length === 0) return null;
  return (
    <ResponsiveContainer width="100%" height={300}>
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
        <PolarGrid stroke="rgba(255,255,255,0.05)" />
        <PolarAngleAxis 
          dataKey="concept" 
          stroke="rgba(255,255,255,0.4)" 
          tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'Fira Code' }} 
        />
        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
        <Tooltip {...tooltipStyle} />
        <Radar 
          name="Mastery" 
          dataKey="score" 
          stroke="var(--neon-violet)" 
          fill="var(--neon-violet)" 
          fillOpacity={0.3} 
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
