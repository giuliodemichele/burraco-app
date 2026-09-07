"use client";

import { useState } from "react";
import { Camera, Trash2 } from "lucide-react";

interface AvatarPickerProps {
  name: string;
}

export default function AvatarPicker({ name }: AvatarPickerProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const inputId = "avatar-file-input";

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX = 256;
        let w = img.width;
        let h = img.height;
        if (w > h) { h = (h / w) * MAX; w = MAX; }
        else { w = (w / h) * MAX; h = MAX; }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, w, h);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.75);
        setPreview(dataUrl);
      };
      img.src = ev.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  const initial = name?.trim().charAt(0).toUpperCase() || "?";

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Hidden input carries base64 to the form */}
      <input type="hidden" name="avatarUrl" value={preview ?? ""} />

      {/* File input — associated via htmlFor, NOT triggered via ref.click() */}
      <input
        id={inputId}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={handleFileChange}
      />

      {/* Label acts as the tap target — works on all mobile browsers */}
      <label
        htmlFor={inputId}
        className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-dashed border-slate-300 bg-slate-100 flex items-center justify-center group hover:border-red-400 active:border-red-500 transition-colors cursor-pointer"
      >
        {preview ? (
          <img src={preview} alt="Avatar" className="object-cover w-full h-full" />
        ) : (
          <span className="text-4xl font-black text-slate-400 group-hover:text-red-400 transition-colors select-none">
            {initial}
          </span>
        )}
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 active:opacity-100 transition-opacity flex items-center justify-center">
          <Camera className="text-white h-8 w-8" />
        </div>
      </label>

      <div className="flex gap-3 text-xs text-slate-500">
        <label
          htmlFor={inputId}
          className="flex items-center gap-1 text-red-600 font-semibold cursor-pointer"
        >
          <Camera className="h-3 w-3" />
          {preview ? "Cambia foto" : "Aggiungi foto"}
        </label>
        {preview && (
          <>
            <span>·</span>
            <button
              type="button"
              onClick={() => setPreview(null)}
              className="flex items-center gap-1 text-slate-400 hover:text-slate-600"
            >
              <Trash2 className="h-3 w-3" />
              Rimuovi
            </button>
          </>
        )}
      </div>
    </div>
  );
}
