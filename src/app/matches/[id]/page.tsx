import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import MatchClient from "@/components/burraco/MatchClient";

export default async function MatchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const match = await prisma.match.findUnique({
    where: { id },
    include: {
      teams: {
        include: {
          players: {
            include: { player: true }
          }
        },
        orderBy: { teamIndex: 'asc' }
      },
      rounds: {
        orderBy: { roundNumber: 'asc' }
      }
    }
  });

  if (!match) return notFound();

  // Calculate totals
  const totalT1 = match.rounds.reduce((acc, r) => acc + r.team1Score, 0);
  const totalT2 = match.rounds.reduce((acc, r) => acc + r.team2Score, 0);

  return (
    <MatchClient 
      match={match} 
      totalT1={totalT1} 
      totalT2={totalT2} 
    />
  );
}
