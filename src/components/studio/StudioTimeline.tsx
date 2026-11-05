"use client";

import React, { useState } from "react";
import { Layers, Film, User, Type, Music, ChevronDown, ChevronUp } from "lucide-react";

interface StudioTimelineProps {
  durationInSeconds: number;
  hasVideo: boolean;
  hasAvatar: boolean;
  hasCaptions: boolean;
  hasAudio: boolean;
  uiLang?: "sr" | "en";
}

export const StudioTimeline: React.FC<StudioTimelineProps> = ({
  durationInSeconds = 5,
  hasVideo,
  hasAvatar,
  hasCaptions,
  hasAudio,
  uiLang = "sr",
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const fps = 30;
  const totalFrames = Math.round(durationInSeconds * fps);
  const roundedSec = Math.round(durationInSeconds);
  const formattedSec = roundedSec < 10 ? `0${roundedSec}` : `${roundedSec}`;

  return (
    <div
      className={`bg-neutral-950 border-t border-neutral-800 flex flex-col shrink-0 select-none transition-all duration-300 ${
        isExpanded ? "h-44" : "h-11"
      }`}
    >
      {/* Zaglavlje vremenske linije sa dugmetom za kolaps/otvaranje */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="h-11 px-4 flex items-center justify-between border-b border-neutral-800/80 cursor-pointer hover:bg-neutral-900/50 transition text-[11px] font-mono text-neutral-400"
      >
        <div className="flex items-center gap-2">
          <Layers size={14} className="text-blue-400" />
          <span className="font-semibold text-neutral-300">
            {uiLang === "sr"
              ? "Vremenska linija i slojevi (Remotion Studio)"
              : "Timeline & Layers (Remotion Studio)"}
          </span>
          <button className="text-neutral-500 hover:text-white ml-1 p-0.5 rounded">
            {isExpanded ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
          </button>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-neutral-500">
            00:00.00 / 00:{formattedSec}.00
          </span>
          <span className="bg-neutral-900 border border-neutral-800 px-2 py-0.5 rounded text-blue-400 font-bold">
            {totalFrames} frames ({fps} FPS)
          </span>
        </div>
      </div>

      {/* Trake slojeva (prikazuju se samo kada je panel otvoren) */}
      {isExpanded && (
        <div className="flex-1 overflow-y-auto space-y-1.5 p-3">
          {/* Sloj 1: Pozadinski video / slika */}
          <div className="flex items-center gap-2 text-xs">
            <div className="w-28 flex items-center gap-1.5 text-neutral-400 font-mono text-[11px] truncate">
              <Film size={12} className="text-indigo-400" /> Pozadina
            </div>
            <div className="flex-1 bg-neutral-900 h-6 rounded border border-neutral-800 relative overflow-hidden">
              {hasVideo && (
                <div className="absolute inset-y-0 left-0 bg-indigo-600/70 border border-indigo-400 rounded px-2 flex items-center text-[10px] text-white w-full">
                  Vizuelna sekvenca
                </div>
              )}
            </div>
          </div>

          {/* Sloj 2: Digitalni avatar */}
          <div className="flex items-center gap-2 text-xs">
            <div className="w-28 flex items-center gap-1.5 text-neutral-400 font-mono text-[11px] truncate">
              <User size={12} className="text-emerald-400" /> AI Avatar
            </div>
            <div className="flex-1 bg-neutral-900 h-6 rounded border border-neutral-800 relative overflow-hidden">
              {hasAvatar && (
                <div className="absolute inset-y-0 left-0 bg-emerald-600/70 border border-emerald-400 rounded px-2 flex items-center text-[10px] text-white w-full">
                  Lip-sync Avatar sloj
                </div>
              )}
            </div>
          </div>

          {/* Sloj 3: Titlovi */}
          <div className="flex items-center gap-2 text-xs">
            <div className="w-28 flex items-center gap-1.5 text-neutral-400 font-mono text-[11px] truncate">
              <Type size={12} className="text-amber-400" /> Titlovi
            </div>
            <div className="flex-1 bg-neutral-900 h-6 rounded border border-neutral-800 relative overflow-hidden">
              {hasCaptions && (
                <div className="absolute inset-y-0 left-0 bg-amber-600/70 border border-amber-400 rounded px-2 flex items-center text-[10px] text-white w-full">
                  Karaoke sinhronizacija
                </div>
              )}
            </div>
          </div>

          {/* Sloj 4: Audio naracija */}
          <div className="flex items-center gap-2 text-xs">
            <div className="w-28 flex items-center gap-1.5 text-neutral-400 font-mono text-[11px] truncate">
              <Music size={12} className="text-blue-400" /> Govor (TTS)
            </div>
            <div className="flex-1 bg-neutral-900 h-6 rounded border border-neutral-800 relative overflow-hidden">
              {hasAudio && (
                <div className="absolute inset-y-0 left-0 bg-blue-600/70 border border-blue-400 rounded px-2 flex items-center text-[10px] text-white w-full">
                  Audio naracija
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};