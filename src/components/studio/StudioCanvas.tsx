"use client";

import React from "react";
import { Languages, PlaySquare } from "lucide-react";
import { StudioPlayer } from "./StudioPlayer";
import { StudioTimeline } from "./StudioTimeline";

interface WordTiming {
  word: string;
  start: number;
  end: number;
}

interface StudioCanvasProps {
  uiLang: "sr" | "en";
  speechLang: "sr" | "en";
  setSpeechLang: (lang: "sr" | "en") => void;
  selectedImage: string | null;
  videoSrc?: string | null;
  avatarVideoSrc?: string | null;
  avatarPosition?: "circle-bottom-right" | "half-screen" | "center-floating";
  audioUrl: string | null;
  bgmSrc?: string | null;
  bgmVolume?: number;
  filterStyle?: string;
  transitionType?: "zoomIn" | "zoomOut" | "panLeft" | "panRight" | "drift" | "static";
  subtitleStyle?: "hormozi" | "neon" | "clean" | "classic";
  subtitlePosition?: "bottom" | "center" | "top";
  subtitleFontSize?: "sm" | "md" | "lg";
  words: WordTiming[];
  t: any;
}

export const StudioCanvas: React.FC<StudioCanvasProps> = ({
  uiLang,
  speechLang,
  setSpeechLang,
  selectedImage,
  videoSrc,
  avatarVideoSrc,
  avatarPosition,
  audioUrl,
  bgmSrc,
  bgmVolume,
  filterStyle,
  transitionType,
  subtitleStyle = "hormozi",
  subtitlePosition = "bottom",
  subtitleFontSize = "md",
  words,
  t,
}) => {
  const lastWordEnd = words.length > 0 ? words[words.length - 1].end : 5;
  const durationInSeconds = Math.max(lastWordEnd + 1, 5);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-neutral-950">
      {/* Glavni radni prostor (Plejer i lista reči) */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4">
        <div className="bg-neutral-900/40 p-6 rounded-2xl border border-neutral-800 space-y-4">
          <div className="flex justify-between items-center border-b border-neutral-800/80 pb-3">
            <div className="flex items-center gap-2">
              <PlaySquare size={18} className="text-blue-400" />
              <h2 className="text-base font-semibold text-neutral-200">
                {uiLang === "sr"
                  ? "Video Pretpregled (Remotion 9:16)"
                  : "Video Preview (Remotion 9:16)"}
              </h2>
            </div>

            <div className="flex items-center gap-2 text-xs text-neutral-400">
              <Languages size={14} className="text-blue-400" />
              <span>{t.speechLang}:</span>
              <select
                value={speechLang}
                onChange={(e) => setSpeechLang(e.target.value as "sr" | "en")}
                className="bg-neutral-900 border border-neutral-800 rounded px-2 py-1 text-white font-medium focus:outline-none"
              >
                <option value="sr">Srpski</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Plejer */}
            <div className="flex flex-col items-center">
              <StudioPlayer
                imageSrc={selectedImage}
                videoSrc={videoSrc}
                avatarVideoSrc={avatarVideoSrc}
                avatarPosition={avatarPosition}
                audioSrc={audioUrl}
                bgmSrc={bgmSrc}
                bgmVolume={bgmVolume}
                filterStyle={filterStyle}
                transitionType={transitionType}
                subtitleStyle={subtitleStyle}
                subtitlePosition={subtitlePosition}
                subtitleFontSize={subtitleFontSize}
                words={words}
                durationInSeconds={durationInSeconds}
              />
              <span className="text-[11px] font-mono text-neutral-500 mt-2">
                1080 x 1920 (TikTok / Reels / Shorts)
              </span>
            </div>

            {/* Vremenske oznake reči */}
            <div className="flex-1 w-full space-y-4">
              <div className="space-y-2">
                <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
                  {t.timestampsLabel} ({words.length} {uiLang === "sr" ? "reči" : "words"}):
                </span>

                {words.length > 0 ? (
                  <div className="max-h-[500px] overflow-y-auto space-y-1.5 p-3 bg-neutral-950 rounded-xl border border-neutral-800 font-mono text-xs">
                    {words.map((w, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center py-1.5 px-3 hover:bg-neutral-900 rounded-lg transition"
                      >
                        <span className="text-white font-medium">{w.word}</span>
                        <span className="text-neutral-500">
                          {w.start}s – {w.end}s
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-72 border border-dashed border-neutral-800 rounded-xl text-neutral-500 text-sm">
                    {t.emptyPreview}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Donji Remotion Timeline */}
      <StudioTimeline
        durationInSeconds={durationInSeconds}
        hasVideo={Boolean(selectedImage || videoSrc)}
        hasAvatar={Boolean(avatarVideoSrc)}
        hasCaptions={words.length > 0}
        hasAudio={Boolean(audioUrl)}
        uiLang={uiLang}
      />
    </div>
  );
};