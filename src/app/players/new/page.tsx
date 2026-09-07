"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import AvatarPicker from "@/components/burraco/AvatarPicker";
import { createPlayer } from "@/actions/player";

export default function NewPlayerPage() {
  const [name, setName] = useState("");

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] p-6">
      <div className="flex items-center mb-8">
        <Link href="/players">
          <Button variant="ghost" size="icon" className="mr-2">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Nuovo Giocatore</h1>
      </div>

      <form action={createPlayer} className="flex-1 flex flex-col">
        <div className="flex-1 space-y-8">
          {/* Avatar Picker */}
          <div className="flex justify-center pt-4">
            <AvatarPicker name={name} />
          </div>

          {/* Name Input */}
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-slate-700">
              Nome Giocatore
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex h-14 w-full rounded-2xl border border-input bg-background px-4 py-2 text-lg placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-shadow shadow-sm focus:shadow-md"
              placeholder="Es. Mario Rossi"
            />
          </div>
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full text-lg h-14 bg-red-600 hover:bg-red-700 text-white shadow-lg transition-transform hover:scale-105 active:scale-95 mb-4"
        >
          <Save className="mr-2 h-6 w-6" />
          Salva Giocatore
        </Button>
      </form>
    </div>
  );
}
