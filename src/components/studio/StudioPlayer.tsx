"use client";

import React from "react";
import { Player } from "@remotion/player";
import { VideoComposition, WordTiming } from "../../remotion/VideoComposition";

interface StudioPlayerProps {
  imageSrc: string | null;
  videoSrc?: string | null;
  avatarVideoSrc?: string | null;
  avatarPosition?: "circle-bottom-right" | "half-screen" | "center-floating";
  audioSrc: string | null;
  bgmSrc?: string | null;
  bgmVolume?: number;
  filterStyle?: string;
  transitionType?: "zoomIn" | "zoomOut" | "panLeft" | "panRight" | "drift" | "static";
  subtitleStyle?: "hormozi" | "neon" | "clean" | "classic";
  subtitlePosition?: "bottom" | "center" | "top";
  subtitleFontSize?: "sm" | "md" | "lg";
  words: WordTiming[];
  durationInSeconds?: number;
}

export const StudioPlayer: React.FC<StudioPlayerProps> = ({
  imageSrc,
  videoSrc,
  avatarVideoSrc,
  avatarPosition = "circle-bottom-right",
  audioSrc,
  bgmSrc,
  bgmVolume = 0.15,
  filterStyle = "none",
  transitionType = "zoomIn",
  subtitleStyle = "hormozi",
  subtitlePosition = "bottom",
  subtitleFontSize = "md",
  words,
  durationInSeconds = 5,
}) => {
  const fps = 30;
  const calculatedDuration =
    words.length > 0
      ? Math.max(words[words.length - 1].end + 1, durationInSeconds)
      : durationInSeconds;

  const durationInFrames = Math.max(Math.round(calculatedDuration * fps), 30);

  return (
    <div className="relative w-full max-w-[320px] aspect-[9/16] rounded-2xl overflow-hidden border border-neutral-800 bg-black shadow-2xl shrink-0">
      <Player
        component={VideoComposition}
        inputProps={{
          imageSrc,
          videoSrc,
          avatarVideoSrc,
          avatarPosition,
          audioSrc,
          bgmSrc,
          bgmVolume,
          filterStyle,
          transitionType,
          subtitleStyle,
          subtitlePosition,
          subtitleFontSize,
          words,
        }}
        durationInFrames={durationInFrames}
        fps={fps}
        compositionWidth={1080}
        compositionHeight={1920}
        style={{
          width: "100%",
          height: "100%",
        }}
        controls
        autoPlay={false}
        loop
        acknowledgeRemotionLicense
      />
    </div>
  );
};