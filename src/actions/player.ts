"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createPlayer(formData: FormData) {
  const name = formData.get("name") as string;
  if (!name || name.trim().length === 0) return;

  const avatarUrl = (formData.get("avatarUrl") as string) || null;

  await prisma.player.create({
    data: {
      name: name.trim(),
      avatarUrl: avatarUrl && avatarUrl.length > 0 ? avatarUrl : null,
    },
  });

  revalidatePath("/players");
  redirect("/players");
}

export async function deletePlayer(playerId: string) {
  await prisma.player.delete({ where: { id: playerId } });
  revalidatePath("/players");
}

