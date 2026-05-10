"use client";
import React from "react";
import { motion } from "framer-motion";
import { Lock, CheckCircle2, Circle, ChevronRight } from "lucide-react";
import Link from "next/link";

interface Node {
  id: string;
  title: string;
  description: string;
  module: string;
  type: "core" | "project" | "milestone";
  completed?: boolean;
  locked?: boolean;
}

interface SkillTreeProps {
  track: string;
  nodes: Node[];
  color: string;
}

export function SkillTree({ track, nodes, color }: SkillTreeProps) {
  return (
    <div className="relative py-10">
      {/* SVG Connectors */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
        {nodes.map((node, i) => {
          if (i === nodes.length - 1) return null;
          return (
            <line
              key={`line-${i}`}
              x1="50%"
              y1={`${(i * 120) + 60}px`}
              x2="50%"
              y2={`${((i + 1) * 120) + 60}px`}
              stroke={node.completed ? color : "rgba(255,255,255,0.1)"}
              strokeWidth="2"
              strokeDasharray={node.completed ? "0" : "5,5"}
            />
          );
        })}
      </svg>

      <div className="flex flex-col items-center gap-20 relative z-10">
        {nodes.map((node, i) => (
          <motion.div
            key={node.id}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            viewport={{ once: true }}
            className="relative group"
          >
            {/* Node Icon/Circle */}
            <Link 
              href={node.locked ? "#" : `/learn/${track}/${node.module}`}
              className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 border-2
                ${node.completed 
                  ? "bg-white/5 border-current shadow-[0_0_20px_-5px_rgba(0,0,0,0.3)] shadow-current/20" 
                  : node.locked 
                    ? "bg-black border-white/5 text-white/20 grayscale cursor-not-allowed" 
                    : "bg-black border-white/10 text-white/40 hover:border-white/30 hover:text-white"
                }`}
              style={{ color: node.completed ? color : undefined }}
            >
              {node.completed ? (
                <CheckCircle2 className="w-8 h-8" />
              ) : node.locked ? (
                <Lock className="w-6 h-6" />
              ) : (
                <div className="w-3 h-3 rounded-full bg-current" />
              )}
            </Link>

            {/* Content Panel */}
            <div className={`absolute left-20 top-1/2 -translate-y-1/2 w-48 md:w-64 transition-all duration-300
              ${node.locked ? "opacity-40" : "group-hover:translate-x-2"}`}>
              <h4 className={`text-xs font-heading font-800 tracking-wider mb-1 uppercase ${node.completed ? "text-white" : "text-white/60"}`}>
                {node.title}
              </h4>
              <p className="text-[10px] font-mono text-white/30 line-clamp-2 leading-relaxed">
                {node.description}
              </p>
              {!node.locked && !node.completed && (
                <div className="mt-2 flex items-center gap-1 text-[9px] font-mono font-bold uppercase tracking-widest" style={{ color }}>
                  Current Goal <ChevronRight className="w-3 h-3" />
                </div>
              )}
            </div>

            {/* Label for left side (optional) */}
            <div className="absolute right-20 top-1/2 -translate-y-1/2 text-right hidden md:block opacity-20">
               <span className="text-[10px] font-mono uppercase tracking-[0.2em]">Step {i + 1}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
