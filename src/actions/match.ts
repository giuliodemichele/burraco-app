"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function createMatch(formData: FormData) {
  const targetScore = parseInt(formData.get("targetScore") as string) || 2005;
  const team1Name = (formData.get("team1Name") as string) || "Squadra 1";
  const team2Name = (formData.get("team2Name") as string) || "Squadra 2";

  const t1p1 = formData.get("t1p1") as string;
  const t1p2 = formData.get("t1p2") as string;
  const t2p1 = formData.get("t2p1") as string;
  const t2p2 = formData.get("t2p2") as string;

  if (!t1p1 || !t1p2 || !t2p1 || !t2p2) {
    throw new Error("Seleziona tutti i giocatori");
  }

  const match = await prisma.match.create({
    data: {
      targetScore,
      status: "ONGOING",
      teams: {
        create: [
          {
            name: team1Name,
            teamIndex: 1,
            players: {
              create: [
                { player: { connect: { id: t1p1 } } },
                { player: { connect: { id: t1p2 } } }
              ]
            }
          },
          {
            name: team2Name,
            teamIndex: 2,
            players: {
              create: [
                { player: { connect: { id: t2p1 } } },
                { player: { connect: { id: t2p2 } } }
              ]
            }
          }
        ]
      }
    }
  });

  redirect(`/matches/${match.id}`);
}

export async function addRoundScore(matchId: string, team1Score: number, team2Score: number) {
  const match = await prisma.match.findUnique({
    where: { id: matchId },
    include: { rounds: true }
  });

  if (!match || match.status === "COMPLETED") return;

  const roundNumber = match.rounds.length + 1;

  await prisma.round.create({
    data: {
      matchId,
      roundNumber,
      team1Score,
      team2Score
    }
  });

  // Check winning condition
  const totalT1 = match.rounds.reduce((acc, r) => acc + r.team1Score, 0) + team1Score;
  const totalT2 = match.rounds.reduce((acc, r) => acc + r.team2Score, 0) + team2Score;

  if (totalT1 >= match.targetScore || totalT2 >= match.targetScore) {
    // se superano entrambi, vince chi ha più punti
    let winningTeamIndex = null;
    if (totalT1 > totalT2 && totalT1 >= match.targetScore) winningTeamIndex = 1;
    else if (totalT2 > totalT1 && totalT2 >= match.targetScore) winningTeamIndex = 2;

    if (winningTeamIndex !== null) {
      const winningTeam = await prisma.team.findUnique({
        where: { matchId_teamIndex: { matchId, teamIndex: winningTeamIndex } }
      });
      
      if (winningTeam) {
        await prisma.match.update({
          where: { id: matchId },
          data: {
            status: "COMPLETED",
            winningTeamId: winningTeam.id
          }
        });
      }
    }
  }
}
