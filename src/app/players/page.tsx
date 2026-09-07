import Link from "next/link";
import { UserPlus, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { deletePlayer } from "@/actions/player";
import DeletePlayerButton from "@/components/burraco/DeletePlayerButton";

export default async function PlayersPage() {
  const players = await prisma.player.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] p-6">
      <div className="flex items-center mb-8">
        <Link href="/">
          <Button variant="ghost" size="icon" className="mr-2">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Giocatori</h1>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 mb-6">
        {players.length === 0 ? (
          <p className="text-center text-muted-foreground mt-10">Nessun giocatore registrato.</p>
        ) : (
          players.map(player => (
            <div key={player.id} className="flex items-center justify-between p-4 bg-card border rounded-2xl shadow-sm">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-slate-200 bg-red-100 flex items-center justify-center text-xl font-bold text-red-600 flex-shrink-0">
                  {player.avatarUrl ? (
                    <img src={player.avatarUrl} alt={player.name} className="object-cover w-full h-full" />
                  ) : (
                    player.name.charAt(0).toUpperCase()
                  )}
                </div>
                <span className="text-lg font-medium">{player.name}</span>
              </div>
              <DeletePlayerButton playerId={player.id} playerName={player.name} deleteAction={deletePlayer} />
            </div>
          ))
        )}
      </div>

      <Link href="/players/new">
        <Button size="lg" className="w-full text-lg h-14 bg-red-600 hover:bg-red-700 text-white shadow-lg transition-transform hover:scale-105 active:scale-95">
          <UserPlus className="mr-2 h-6 w-6" />
          Nuovo Giocatore
        </Button>
      </Link>
    </div>
  );
}
