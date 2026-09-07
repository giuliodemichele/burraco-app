import Link from "next/link";
import { Play, Trophy, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4 text-center">
      <div className="space-y-6 max-w-md w-full">
        <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent drop-shadow-sm pb-2">
          Burraco Score
        </h1>
        <p className="text-muted-foreground text-lg mb-8">
          Gestisci le tue partite di Burraco in tempo reale, tieni traccia dei punteggi e scala la classifica!
        </p>

        <div className="flex flex-col space-y-4 w-full">
          <Link href="/matches/new">
            <Button size="lg" className="w-full text-lg h-14 bg-red-600 hover:bg-red-700 text-white shadow-lg transition-transform hover:scale-105 active:scale-95">
              <Play className="mr-2 h-6 w-6" />
              Nuova Partita
            </Button>
          </Link>

          <Link href="/leaderboard">
            <Button size="lg" variant="outline" className="w-full text-lg h-14 shadow-sm transition-transform hover:scale-105 active:scale-95 border-2 border-orange-200 hover:border-orange-500 hover:text-orange-600 hover:bg-orange-50/50">
              <Trophy className="mr-2 h-6 w-6" />
              Classifica
            </Button>
          </Link>

          <Link href="/players">
            <Button size="lg" variant="secondary" className="w-full text-lg h-14 shadow-sm transition-transform hover:scale-105 active:scale-95 bg-secondary hover:bg-secondary/80">
              <Users className="mr-2 h-6 w-6" />
              Gestione Giocatori
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
