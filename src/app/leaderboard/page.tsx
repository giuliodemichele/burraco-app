import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, Trophy, Medal } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function LeaderboardPage() {
  const players = await prisma.player.findMany({
    include: {
      teams: {
        include: {
          team: {
            include: {
              match: true
            }
          }
        }
      }
    }
  });

  // Calculate wins
  const leaderboard = players.map(player => {
    const wins = player.teams.filter(t => 
      t.team.match.status === "COMPLETED" && t.team.match.winningTeamId === t.teamId
    ).length;
    return { ...player, wins };
  }).sort((a, b) => b.wins - a.wins);

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] p-6 bg-slate-50">
      <div className="flex items-center mb-8">
        <Link href="/">
          <Button variant="ghost" size="icon" className="mr-2">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold flex items-center text-slate-800">
          <Trophy className="mr-2 h-8 w-8 text-yellow-500" /> 
          Classifica
        </h1>
      </div>

      <div className="flex-1 space-y-4 mb-6">
        {leaderboard.length === 0 ? (
          <p className="text-center text-muted-foreground mt-10">Nessun giocatore registrato.</p>
        ) : (
          leaderboard.map((player, index) => (
            <div 
              key={player.id} 
              className={`flex items-center p-4 bg-white border rounded-2xl shadow-sm transition-transform hover:scale-102 ${index === 0 ? 'border-yellow-400 shadow-md ring-2 ring-yellow-200' : ''}`}
            >
              <div className="w-10 font-bold text-slate-400 text-lg">
                {index === 0 ? <Medal className="text-yellow-500 w-8 h-8" /> : 
                 index === 1 ? <Medal className="text-slate-400 w-7 h-7" /> : 
                 index === 2 ? <Medal className="text-amber-700 w-6 h-6" /> : 
                 `#${index + 1}`}
              </div>
              <div className="flex-1 ml-2">
                <span className={`text-lg font-bold ${index === 0 ? 'text-slate-900' : 'text-slate-700'}`}>
                  {player.name}
                </span>
              </div>
              <div className="text-right">
                <div className="text-2xl font-black text-slate-900">{player.wins}</div>
                <div className="text-xs font-semibold text-slate-400 uppercase">Vittorie</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
