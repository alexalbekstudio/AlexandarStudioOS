"use client";

import React, { useState } from "react";
import { Sparkles, UploadCloud, Loader2, Wand2, Move3d } from "lucide-react";

interface VisualsPickerProps {
  onImageSelected: (url: string) => void;
  filterStyle: string;
  setFilterStyle: (f: string) => void;
  transitionType: "zoomIn" | "zoomOut" | "panLeft" | "panRight" | "drift" | "static";
  setTransitionType: (t: any) => void;
  lang?: "sr" | "en";
}

export const VisualsPicker: React.FC<VisualsPickerProps> = ({
  onImageSelected,
  filterStyle,
  setFilterStyle,
  transitionType,
  setTransitionType,
  lang = "sr",
}) => {
  const [prompt, setPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState<"9:16" | "16:9">("9:16");
  const [model, setModel] = useState("flux");
  const [loading, setLoading] = useState(false);
  const [gallery, setGallery] = useState<string[]>([]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);

    const dims = aspectRatio === "9:16" ? { width: 1080, height: 1920 } : { width: 1920, height: 1080 };

    try {
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, model, ...dims }),
      });
      const data = await res.json();

      if (data.success && data.imageUrl) {
        setGallery((prev) => [data.imageUrl, ...prev]);
        onImageSelected(data.imageUrl);
      } else {
        alert(data.error || "Greška pri kreiranju slike.");
      }
    } catch (err) {
      console.error(err);
      alert("Greška na mreži.");
    } finally {
      setLoading(false);
    }
  };

  // Učitavanje slike direktno kao Base64 Data-URI umesto nestabilnog blob URL-a
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Url = reader.result as string;
      setGallery((prev) => [base64Url, ...prev]);
      onImageSelected(base64Url);
    };
    reader.readAsDataURL(file);
  };

  const FILTERS = [
    { id: "none", name: lang === "sr" ? "Prirodan" : "Normal" },
    { id: "cinematic", name: "Cinematic" },
    { id: "moody", name: "Moody Dark" },
    { id: "cyberpunk", name: "Cyberpunk" },
    { id: "warm", name: "Warm Glow" },
    { id: "sunset", name: "Sunset" },
    { id: "emerald", name: "Emerald Film" },
    { id: "vhs", name: "Retro VHS" },
    { id: "bw", name: "Vintage B&W" },
  ];

  const MOTIONS = [
    { id: "zoomIn", name: lang === "sr" ? "Zum unutra" : "Zoom In" },
    { id: "zoomOut", name: lang === "sr" ? "Zum spolja" : "Zoom Out" },
    { id: "panLeft", name: lang === "sr" ? "Pan Lijevo" : "Pan Left" },
    { id: "panRight", name: lang === "sr" ? "Pan Desno" : "Pan Right" },
    { id: "drift", name: lang === "sr" ? "Drift Lebdenje" : "Subtle Drift" },
    { id: "static", name: lang === "sr" ? "Statično" : "Static" },
  ];

  return (
    <div className="space-y-4">
      {/* 1. FILTERI */}
      <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 space-y-2">
        <label className="text-[11px] font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
          <Wand2 size={13} className="text-amber-400" />
          {lang === "sr" ? "Vizuelni Filter / Color Grade" : "Visual Filter / Color Grade"}
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilterStyle(f.id)}
              className={`py-1.5 px-1 text-[11px] rounded-lg font-medium border transition truncate ${
                filterStyle === f.id
                  ? "bg-indigo-600 border-indigo-500 text-white shadow-sm"
                  : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white"
              }`}
            >
              {f.name}
            </button>
          ))}
        </div>
      </div>

      {/* 2. POKRETI KAMERE */}
      <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 space-y-2">
        <label className="text-[11px] font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
          <Move3d size={13} className="text-emerald-400" />
          {lang === "sr" ? "Pokret kamere (Ken Burns)" : "Camera Motion"}
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {MOTIONS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTransitionType(t.id as any)}
              className={`py-1.5 px-1 text-[11px] rounded-lg font-medium border transition truncate ${
                transitionType === t.id
                  ? "bg-emerald-600 border-emerald-500 text-white shadow-sm"
                  : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white"
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>
      </div>

      {/* 3. GENERISANJE SLIKE */}
      <div className="space-y-3 pt-1">
        <div>
          <label className="block text-xs font-medium text-neutral-300 mb-1">
            {lang === "sr" ? "Opis slike (Prompt)" : "Image prompt"}
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={2}
            className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder={lang === "sr" ? "npr. futuristic cyberpunk neon city..." : "e.g. futuristic cyberpunk neon city..."}
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading || !prompt.trim()}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition p-2.5 rounded-lg font-semibold text-xs text-white shadow"
        >
          {loading ? <Loader2 className="animate-spin" size={14} /> : <Sparkles size={14} />}
          {lang === "sr" ? "Generiši AI Sliku" : "Generate AI Image"}
        </button>

        <div className="relative border border-dashed border-neutral-800 hover:border-neutral-700 rounded-lg p-2.5 text-center cursor-pointer bg-neutral-950/50">
          <UploadCloud size={15} className="mx-auto text-neutral-400 mb-1" />
          <span className="text-[11px] text-neutral-400">
            {lang === "sr" ? "ili učitaj sliku sa diska" : "or upload image from PC"}
          </span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </div>
      </div>

      {gallery.length > 0 && (
        <div className="space-y-1.5 pt-1">
          <span className="text-[10px] font-mono uppercase text-neutral-500">
            {lang === "sr" ? "Galerija:" : "Gallery:"}
          </span>
          <div className="grid grid-cols-3 gap-2 max-h-32 overflow-y-auto p-1 bg-neutral-950 rounded-lg border border-neutral-800">
            {gallery.map((img, i) => (
              <img
                key={i}
                src={img}
                alt="Selected"
                onClick={() => onImageSelected(img)}
                className="w-full h-14 object-cover rounded cursor-pointer border border-neutral-800 hover:border-blue-500 transition"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};