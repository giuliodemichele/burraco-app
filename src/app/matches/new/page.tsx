import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, Swords } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createMatch } from "@/actions/match";

export default async function NewMatchPage() {
  const players = await prisma.player.findMany({ orderBy: { name: 'asc' } });

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] p-6 overflow-y-auto">
      <div className="flex items-center mb-6">
        <Link href="/">
          <Button variant="ghost" size="icon" className="mr-2">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Nuova Partita</h1>
      </div>

      {players.length < 4 ? (
        <div className="text-center p-6 bg-red-50 text-red-600 rounded-2xl">
          <p className="mb-4 text-lg">Hai bisogno di almeno 4 giocatori registrati per iniziare una partita.</p>
          <Link href="/players/new">
            <Button>Registra Giocatori</Button>
          </Link>
        </div>
      ) : (
        <form action={createMatch} className="space-y-8 flex-1 flex flex-col">
          
          <div className="space-y-4">
            <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
              <input name="team1Name" defaultValue="Squadra 1" className="bg-transparent text-xl font-bold text-blue-800 w-full outline-none mb-4" />
              <div className="space-y-3">
                <select name="t1p1" required className="w-full p-3 rounded-xl border bg-white shadow-sm text-lg">
                  <option value="">Seleziona Giocatore 1</option>
                  {players.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
                <select name="t1p2" required className="w-full p-3 rounded-xl border bg-white shadow-sm text-lg">
                  <option value="">Seleziona Giocatore 2</option>
                  {players.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
            </div>

            <div className="flex justify-center -my-2 relative z-10">
              <div className="bg-white p-2 rounded-full shadow-md border">
                <Swords className="h-6 w-6 text-red-500" />
              </div>
            </div>

            <div className="bg-red-50/50 p-4 rounded-2xl border border-red-100">
              <input name="team2Name" defaultValue="Squadra 2" className="bg-transparent text-xl font-bold text-red-800 w-full outline-none mb-4" />
              <div className="space-y-3">
                <select name="t2p1" required className="w-full p-3 rounded-xl border bg-white shadow-sm text-lg">
                  <option value="">Seleziona Giocatore 3</option>
                  {players.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
                <select name="t2p2" required className="w-full p-3 rounded-xl border bg-white shadow-sm text-lg">
                  <option value="">Seleziona Giocatore 4</option>
                  {players.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="bg-card p-4 rounded-2xl border">
            <label className="block text-sm font-medium mb-2">Punteggio Vittoria</label>
            <input name="targetScore" type="number" defaultValue="2005" required className="w-full p-3 rounded-xl border bg-background text-xl text-center font-bold" />
          </div>

          <div className="flex-1" />

          <Button type="submit" size="lg" className="w-full text-lg h-14 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white shadow-lg transition-transform hover:scale-105 active:scale-95 mb-4">
            Inizia Partita
          </Button>

        </form>
      )}
    </div>
  );
}
