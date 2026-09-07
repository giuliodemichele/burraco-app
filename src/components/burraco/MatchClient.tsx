"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Plus, Trophy } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { addRoundScore } from "@/actions/match";

// Define simpler types based on the schema
type MatchData = any; // we'll rely on any here for speed, or we could type it properly

export default function MatchClient({ match, totalT1, totalT2 }: { match: MatchData, totalT1: number, totalT2: number }) {
  const router = useRouter();
  const [showAddRound, setShowAddRound] = useState(false);

  // Optimistic polling every 3 seconds to keep phones in sync
  useEffect(() => {
    if (match.status === "COMPLETED") return;
    const interval = setInterval(() => {
      router.refresh();
    }, 3000);
    return () => clearInterval(interval);
  }, [match.status, router]);

  const team1 = match.teams.find((t: any) => t.teamIndex === 1);
  const team2 = match.teams.find((t: any) => t.teamIndex === 2);

  const isCompleted = match.status === "COMPLETED";
  const winningTeam = isCompleted ? match.teams.find((t: any) => t.id === match.winningTeamId) : null;

  async function handleAddRound(formData: FormData) {
    const s1 = parseInt(formData.get("t1Score") as string) || 0;
    const s2 = parseInt(formData.get("t2Score") as string) || 0;
    
    await addRoundScore(match.id, s1, s2);
    setShowAddRound(false);
    router.refresh();
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white px-4 pt-12 pb-4 shadow-sm z-10 sticky top-0 flex items-center justify-between">
        <Link href="/">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
        <div className="text-center">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Target: {match.targetScore}</h2>
        </div>
        <div className="w-10" /> {/* Spacer */}
      </div>

      <AnimatePresence>
        {isCompleted && winningTeam && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", bounce: 0.5 }}
              className="bg-white rounded-3xl p-8 text-center max-w-sm w-full shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 to-yellow-600" />
              <Trophy className="h-20 w-20 mx-auto text-yellow-500 mb-6" />
              <h2 className="text-3xl font-extrabold mb-2">Vittoria!</h2>
              <p className="text-xl text-slate-600 mb-6">La {winningTeam.name} ha raggiunto il traguardo!</p>
              
              <Link href="/">
                <Button size="lg" className="w-full text-lg h-14 bg-yellow-500 hover:bg-yellow-600 text-white">
                  Torna alla Home
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scoreboard */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col">
        <div className="grid grid-cols-2 gap-4 mb-8">
          {/* Team 1 Score Card */}
          <div className="bg-gradient-to-b from-blue-500 to-blue-600 text-white p-4 rounded-3xl shadow-lg flex flex-col items-center justify-center relative overflow-hidden">
            <h3 className="font-bold text-blue-100 mb-1 z-10 text-center">{team1?.name}</h3>
            <div className="text-5xl font-black z-10">{totalT1}</div>
            {/* Player names */}
            <div className="mt-3 text-xs text-blue-200 z-10 text-center opacity-80">
              {team1?.players.map((p: any) => p.player.name).join(" & ")}
            </div>
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl" />
          </div>

          {/* Team 2 Score Card */}
          <div className="bg-gradient-to-b from-red-500 to-red-600 text-white p-4 rounded-3xl shadow-lg flex flex-col items-center justify-center relative overflow-hidden">
            <h3 className="font-bold text-red-100 mb-1 z-10 text-center">{team2?.name}</h3>
            <div className="text-5xl font-black z-10">{totalT2}</div>
            {/* Player names */}
            <div className="mt-3 text-xs text-red-200 z-10 text-center opacity-80">
              {team2?.players.map((p: any) => p.player.name).join(" & ")}
            </div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl" />
          </div>
        </div>

        {/* Rounds History */}
        <div className="bg-white rounded-3xl shadow-sm border p-1 flex-1">
          <div className="grid grid-cols-3 text-center text-xs font-bold text-slate-400 p-3 border-b">
            <div>{team1?.name}</div>
            <div>ROUND</div>
            <div>{team2?.name}</div>
          </div>
          
          <div className="divide-y max-h-[40vh] overflow-y-auto">
            {match.rounds.length === 0 ? (
              <div className="p-8 text-center text-slate-400">Nessuna smazzata registrata.</div>
            ) : (
              match.rounds.map((round: any, i: number) => (
                <div key={round.id} className="grid grid-cols-3 text-center p-4 items-center">
                  <div className="text-xl font-bold text-blue-600">{round.team1Score}</div>
                  <div className="text-sm font-medium text-slate-400 bg-slate-100 rounded-full py-1 mx-2">#{round.roundNumber}</div>
                  <div className="text-xl font-bold text-red-600">{round.team2Score}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Add Round Button / Form */}
      <div className="p-4 bg-white border-t pb-8">
        {!showAddRound ? (
          <Button 
            onClick={() => setShowAddRound(true)} 
            disabled={isCompleted}
            size="lg" 
            className="w-full text-lg h-16 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl shadow-xl transition-transform hover:scale-105 active:scale-95"
          >
            <Plus className="mr-2 h-6 w-6" />
            Nuova Smazzata
          </Button>
        ) : (
          <form action={handleAddRound} className="bg-slate-50 p-4 rounded-3xl border shadow-inner">
            <h3 className="font-bold text-center mb-4 text-slate-700">Inserisci i punti della smazzata</h3>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-xs text-blue-600 font-bold mb-1">{team1?.name}</label>
                <input name="t1Score" type="number" required className="w-full text-center text-2xl font-bold p-3 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs text-red-600 font-bold mb-1">{team2?.name}</label>
                <input name="t2Score" type="number" required className="w-full text-center text-2xl font-bold p-3 rounded-xl border focus:ring-2 focus:ring-red-500 outline-none" />
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setShowAddRound(false)} className="flex-1 h-14 rounded-xl">
                Annulla
              </Button>
              <Button type="submit" className="flex-1 h-14 rounded-xl bg-slate-900 hover:bg-slate-800 text-white">
                Salva
              </Button>
            </div>
          </form>
        )}
      </div>

    </div>
  );
}
