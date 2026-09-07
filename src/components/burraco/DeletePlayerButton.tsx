"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";

interface Props {
  playerId: string;
  playerName: string;
  deleteAction: (id: string) => Promise<void>;
}

export default function DeletePlayerButton({ playerId, playerName, deleteAction }: Props) {
  const [confirm, setConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    await deleteAction(playerId);
    setLoading(false);
    setConfirm(false);
  }

  if (confirm) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={() => setConfirm(false)}
          className="text-sm text-slate-400 hover:text-slate-600 px-2 py-1"
        >
          No
        </button>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="flex items-center gap-1 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 active:bg-red-700 px-3 py-1.5 rounded-xl transition-colors"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Trash2 className="h-4 w-4" />
              Sì, elimina
            </>
          )}
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirm(true)}
      className="p-2 text-slate-300 hover:text-red-400 active:text-red-600 rounded-xl transition-colors"
      aria-label={`Elimina ${playerName}`}
    >
      <Trash2 className="h-5 w-5" />
    </button>
  );
}
