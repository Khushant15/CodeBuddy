'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getLeaderboard, UserProfile, xpToLevel } from '@/lib/userService';
import { Trophy, Medal, Crown, Zap, User, Star, TrendingUp } from 'lucide-react';

export function Leaderboard() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const topUsers = await getLeaderboard(10);
        setUsers(topUsers);
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchLeaderboard();
  }, []);

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0: return <Crown className="text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" size={24} />;
      case 1: return <Medal className="text-slate-300 drop-shadow-[0_0_8px_rgba(203,213,225,0.5)]" size={22} />;
      case 2: return <Medal className="text-amber-600 drop-shadow-[0_0_8px_rgba(180,83,9,0.5)]" size={20} />;
      default: return <span className="text-gray-500 font-mono text-xs">{index + 1}</span>;
    }
  };

  const getRankStyle = (index: number) => {
    switch (index) {
      case 0: return "border-yellow-500/30 bg-yellow-500/5 ring-1 ring-yellow-500/20";
      case 1: return "border-slate-400/30 bg-slate-400/5";
      case 2: return "border-amber-700/30 bg-amber-700/5";
      default: return "border-white/5 bg-white/2 hover:bg-white/5";
    }
  };

  if (loading) {
    return (
      <div className="w-full space-y-4 p-6">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="h-16 w-full rounded-xl bg-gray-900 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header Info */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-orbitron font-extrabold text-white flex items-center gap-3">
            <Trophy className="text-neon-green" /> TOP <span className="text-neon-green">ELITE</span>
          </h2>
          <p className="text-xs text-gray-500 font-mono mt-1 uppercase tracking-widest">Global Rankings by XP</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-gray-400 bg-gray-900/50 px-3 py-1.5 rounded-full border border-white/5">
          <TrendingUp size={12} className="text-neon-cyan" />
          <span>Updates Live</span>
        </div>
      </div>

      {/* Leaderboard List */}
      <div className="space-y-3">
        {users.map((user, index) => (
          <motion.div
            key={user.uid}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 ${getRankStyle(index)}`}
          >
            {/* Rank Number/Icon */}
            <div className="w-10 flex justify-center items-center shrink-0">
              {getRankIcon(index)}
            </div>

            {/* Avatar Placeholder */}
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 ${index === 0 ? 'border-yellow-500/50' : 'border-white/10'} bg-gray-900`}>
              {user.displayName.charAt(0).toUpperCase()}
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className={`font-orbitron text-sm font-bold truncate ${index === 0 ? 'text-yellow-400' : 'text-white'}`}>
                  {user.displayName}
                </h3>
                <div className="flex items-center gap-1 text-[10px] bg-white/5 px-1.5 py-0.5 rounded border border-white/10 text-gray-400">
                  <Star size={8} className="text-neon-cyan" />
                  <span>LVL {xpToLevel(user.xp)}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-1">
                <div className="flex items-center gap-1 text-[10px] text-gray-500 font-mono">
                  <Zap size={10} className="text-neon-green" />
                  <span>{user.xp} XP total balance</span>
                </div>
              </div>
            </div>

            {/* XP Value Right Align */}
            <div className="text-right hidden sm:block">
              <span className="text-lg font-orbitron font-black text-white px-2">
                {user.xp.toLocaleString()}
              </span>
              <p className="text-[8px] font-mono text-gray-600 uppercase tracking-tighter">experience pts</p>
            </div>
          </motion.div>
        ))}

        {users.length === 0 && (
          <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-3xl">
            <User className="mx-auto text-gray-800 mb-4" size={48} />
            <p className="text-gray-600 font-orbitron text-sm uppercase">No pioneers found yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
