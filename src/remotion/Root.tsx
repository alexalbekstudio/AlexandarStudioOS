import React from "react";
import { Composition } from "remotion";
import {
  COMP_NAME,
  defaultMyCompProps,
  DURATION_IN_FRAMES,
  VIDEO_FPS,
  VIDEO_HEIGHT,
  VIDEO_WIDTH,
} from "../../types/constants";
import { Main } from "./MyComp/Main";
import { NextLogo } from "./MyComp/NextLogo";
import { VideoComposition, VideoCompositionProps } from "./VideoComposition";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Glavna kompozicija za AlexandarStudioOS (9:16 TikTok / Reels / Shorts) */}
      <Composition
        id="AlexandarStudioVideo"
        component={VideoComposition as any}
        durationInFrames={150}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          imageSrc: null,
          audioSrc: null,
          bgmSrc: null,
          bgmVolume: 0.15,
          words: [],
          filterStyle: "cinematic",
          transitionType: "zoomIn",
          subtitleStyle: "hormozi",
          subtitlePosition: "bottom",
          subtitleFontSize: "md",
        } as VideoCompositionProps}
      />

      {/* Postojeće početne kompozicije */}
      <Composition
        id={COMP_NAME}
        component={Main}
        durationInFrames={DURATION_IN_FRAMES}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
        defaultProps={defaultMyCompProps}
      />
      <Composition
        id="NextLogo"
        component={NextLogo}
        durationInFrames={300}
        fps={30}
        width={140}
        height={140}
        defaultProps={{
          outProgress: 0,
        }}
      />
    </>
  );
};