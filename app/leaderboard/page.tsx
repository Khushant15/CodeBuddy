'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AuthGuard } from '@/components/AuthGuard';
import { Trophy, Users, Flame, ChevronDown, CheckCircle2, Medal, Zap, Star } from 'lucide-react';
import Image from 'next/image';
import { auth } from '@/app/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';

interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  avatar: string;
  xpThisWeek: number;
  level: number;
  streak: number;
  completedChallenges: number;
}

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserUid, setCurrentUserUid] = useState<string | null>(null);
  const [filter, setFilter] = useState<'global' | 'friends'>('global');

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) setCurrentUserUid(u.uid);
    });

    async function fetchLeaderboard() {
      try {
        const res = await fetch('/api/leaderboard');
        const data = await res.json();
        if (Array.isArray(data)) {
          setEntries(data);
        }
      } catch (e) {
         console.error(e);
      } finally {
         setLoading(false);
      }
    }

    fetchLeaderboard();
    return unsub;
  }, []);

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <div className="w-8 h-8 rounded-full bg-yellow-400 text-black flex items-center justify-center font-bold shadow-[0_0_15px_rgba(250,204,21,0.5)]">1</div>;
    if (rank === 2) return <div className="w-8 h-8 rounded-full bg-gray-300 text-black flex items-center justify-center font-bold shadow-[0_0_15px_rgba(209,213,219,0.5)]">2</div>;
    if (rank === 3) return <div className="w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold shadow-[0_0_15px_rgba(217,119,6,0.5)]">3</div>;
    return <div className="w-8 h-8 rounded-full bg-gray-800 text-gray-400 border border-gray-700 flex items-center justify-center font-bold">{rank}</div>;
  };

  const currentRank = entries.find(e => e.userId === currentUserUid)?.rank;

  return (
    <AuthGuard>
      <div className="min-h-screen bg-black text-white px-4 py-8 md:px-10">
        <div className="max-w-4xl mx-auto space-y-8">
          
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
             <div>
               <p className="text-cyan-400 text-xs font-mono uppercase tracking-widest mb-2 flex items-center gap-2"><Medal size={14}/> Hall of Fame</p>
               <h1 className="text-4xl font-bold flex items-center gap-3">
                 Leaderboard <Trophy className="text-yellow-400" />
               </h1>
             </div>
             
             {/* Filter Tabs */}
             <div className="flex items-center gap-2 bg-gray-900 border border-gray-800 rounded-full p-1">
               <button 
                 onClick={() => setFilter('global')}
                 className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-colors ${filter === 'global' ? 'bg-cyan-500 text-black' : 'text-gray-400 hover:text-white'}`}
               >
                 <Trophy size={16} /> Global Rank
               </button>
               <button 
                 onClick={() => setFilter('friends')}
                 className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-colors ${filter === 'friends' ? 'bg-purple-500 text-black' : 'text-gray-400 hover:text-white'}`}
               >
                 <Users size={16} /> Friends
               </button>
             </div>
          </header>

          {/* Current User Snapshot */}
          {!loading && currentRank && filter === 'global' && (
             <div className="bg-gradient-to-r from-gray-900 to-gray-950 border border-cyan-500/30 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center gap-4 shadow-[0_0_30px_rgba(6,182,212,0.1)]">
                <div className="flex items-center gap-4">
                   <div className="text-3xl font-mono text-cyan-400 font-bold">#{currentRank}</div>
                   <div>
                     <p className="font-bold text-lg">Your Current Standing</p>
                     <p className="text-xs text-gray-400 uppercase tracking-widest mt-1 font-mono">Top {Math.ceil((currentRank / entries.length) * 100)}% of Developers</p>
                   </div>
                </div>
                <div className="flex items-center gap-6">
                   <div className="text-center">
                     <p className="text-gray-500 text-xs uppercase font-mono mb-1">Total XP</p>
                     <p className="font-bold text-xl text-yellow-400 flex items-center gap-1 justify-center"><Zap size={16}/> {entries.find(e => e.userId === currentUserUid)?.xpThisWeek}</p>
                   </div>
                   <div className="text-center">
                     <p className="text-gray-500 text-xs uppercase font-mono mb-1">Streak</p>
                     <p className="font-bold text-xl text-orange-400 flex items-center gap-1 justify-center"><Flame size={16}/> {entries.find(e => e.userId === currentUserUid)?.streak}</p>
                   </div>
                </div>
             </div>
          )}

          {/* Leaderboard Table */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
             
             {/* Header */}
             <div className="grid grid-cols-[auto_1fr_auto] md:grid-cols-[60px_1fr_120px_120px_120px] gap-4 p-4 border-b border-gray-800 text-gray-500 text-xs uppercase font-mono tracking-widest">
                <div className="text-center">Rank</div>
                <div>Developer</div>
                <div className="hidden md:block text-right">Challenges</div>
                <div className="hidden md:block text-right">Streak</div>
                <div className="text-right text-cyan-400">Total XP</div>
             </div>

             {/* Rows */}
             {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <div className="w-8 h-8 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
                  <p className="text-gray-400 text-sm font-mono">Loading rankings...</p>
                </div>
             ) : filter === 'friends' ? (
                <div className="flex flex-col items-center justify-center py-20 text-center px-4">
                   <Users className="w-12 h-12 text-gray-700 mb-4" />
                   <p className="text-xl font-bold mb-2">Social Network Coming Soon</p>
                   <p className="text-gray-500 text-sm max-w-sm">
                     The ability to add friends and track specific peer groups is currently in development. Check out the Global Leaderboard in the meantime!
                   </p>
                </div>
             ) : (
                <div className="divide-y divide-gray-800/50">
                  {entries.map((entry) => {
                    const isMe = entry.userId === currentUserUid;
                    return (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={entry.userId}
                        className={`grid grid-cols-[auto_1fr_auto] md:grid-cols-[60px_1fr_120px_120px_120px] gap-4 p-4 items-center transition-colors hover:bg-gray-800/30 ${isMe ? 'bg-cyan-500/5' : ''}`}
                      >
                         {/* Rank */}
                         <div className="flex items-center justify-center shrink-0">
                           {getRankBadge(entry.rank)}
                         </div>

                         {/* User */}
                         <div className="flex items-center gap-3 overflow-hidden">
                            <div className="w-10 h-10 rounded-full bg-gray-800 border border-gray-700 overflow-hidden shrink-0">
                               {/* Normally next/image, using standard img for external blob support here without domains config */}
                               <img src={entry.avatar} alt="Avatar" className="w-full h-full object-cover" />
                            </div>
                            <div className="truncate">
                               <p className="font-bold flex items-center gap-2 truncate">
                                 {entry.username} 
                                 {isMe && <span className="bg-cyan-500/20 text-cyan-400 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">You</span>}
                               </p>
                               <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                                 <Star size={10} className="text-purple-400" /> Level {entry.level}
                               </div>
                            </div>
                         </div>

                         {/* Hidden stats on mobile */}
                         <div className="hidden md:flex items-center justify-end text-sm text-gray-400 font-mono">
                            {entry.completedChallenges}
                         </div>

                         <div className="hidden md:flex items-center justify-end text-sm font-mono gap-1">
                            <span className={entry.streak >= 3 ? 'text-orange-400' : 'text-gray-500'}>{entry.streak}</span>
                            <Flame size={12} className={entry.streak >= 3 ? 'text-orange-400' : 'text-gray-600'} />
                         </div>

                         {/* XP */}
                         <div className="flex items-center justify-end font-bold text-cyan-400 font-mono tracking-wide relative group">
                            {entry.xpThisWeek.toLocaleString()}
                         </div>
                      </motion.div>
                    );
                  })}
                </div>
             )}
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
