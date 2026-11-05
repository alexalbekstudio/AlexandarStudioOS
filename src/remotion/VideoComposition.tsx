import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  Video,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export interface WordTiming {
  word: string;
  start: number;
  end: number;
}

export interface VideoCompositionProps {
  imageSrc: string | null;
  videoSrc?: string | null;
  avatarVideoSrc?: string | null;
  avatarPosition?: "circle-bottom-right" | "half-screen" | "center-floating";
  audioSrc: string | null;
  bgmSrc?: string | null;
  bgmVolume?: number;
  words: WordTiming[];
  filterStyle?: string;
  transitionType?: "zoomIn" | "zoomOut" | "panLeft" | "panRight" | "drift" | "static";
  subtitleStyle?: "hormozi" | "neon" | "clean" | "classic";
  subtitlePosition?: "bottom" | "center" | "top";
  subtitleFontSize?: "sm" | "md" | "lg";
}

export const VideoComposition: React.FC<VideoCompositionProps> = ({
  imageSrc,
  videoSrc,
  avatarVideoSrc,
  avatarPosition = "circle-bottom-right",
  audioSrc,
  bgmSrc,
  bgmVolume = 0.15,
  words = [],
  filterStyle = "none",
  transitionType = "zoomIn",
  subtitleStyle = "hormozi",
  subtitlePosition = "bottom",
  subtitleFontSize = "md",
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const currentTime = frame / fps;

  // 1. Pokreti kamere (Ken Burns efekat)
  let transformCSS = "scale(1)";
  if (transitionType === "zoomIn") {
    const scale = interpolate(frame, [0, durationInFrames], [1, 1.15], {
      extrapolateRight: "clamp",
    });
    transformCSS = `scale(${scale})`;
  } else if (transitionType === "zoomOut") {
    const scale = interpolate(frame, [0, durationInFrames], [1.15, 1], {
      extrapolateRight: "clamp",
    });
    transformCSS = `scale(${scale})`;
  } else if (transitionType === "panLeft") {
    const moveX = interpolate(frame, [0, durationInFrames], [25, -25], {
      extrapolateRight: "clamp",
    });
    transformCSS = `scale(1.1) translateX(${moveX}px)`;
  } else if (transitionType === "panRight") {
    const moveX = interpolate(frame, [0, durationInFrames], [-25, 25], {
      extrapolateRight: "clamp",
    });
    transformCSS = `scale(1.1) translateX(${moveX}px)`;
  } else if (transitionType === "drift") {
    const scale = interpolate(frame, [0, durationInFrames], [1.05, 1.12], {
      extrapolateRight: "clamp",
    });
    const moveY = interpolate(frame, [0, durationInFrames], [-12, 12], {
      extrapolateRight: "clamp",
    });
    transformCSS = `scale(${scale}) translateY(${moveY}px)`;
  }

  // 2. CSS Color Grade filteri
  const getFilterCSS = (type: string) => {
    switch (type) {
      case "cinematic":
        return "contrast(115%) saturate(125%) brightness(95%)";
      case "moody":
        return "contrast(135%) brightness(80%) saturate(80%)";
      case "cyberpunk":
        return "contrast(135%) saturate(170%) hue-rotate(-20deg)";
      case "warm":
        return "sepia(30%) saturate(135%) brightness(105%)";
      case "bw":
        return "grayscale(100%) contrast(125%)";
      case "vhs":
        return "contrast(120%) saturate(140%) hue-rotate(15deg) brightness(105%)";
      case "emerald":
        return "contrast(110%) saturate(90%) hue-rotate(60deg) brightness(95%)";
      case "sunset":
        return "sepia(45%) saturate(160%) brightness(100%) contrast(110%)";
      default:
        return "none";
    }
  };

  // 3. Pozicioniranje digitalnog avatara
  const getAvatarStyles = (): React.CSSProperties => {
    switch (avatarPosition) {
      case "circle-bottom-right":
        return {
          position: "absolute",
          bottom: 240,
          right: 40,
          width: 320,
          height: 320,
          borderRadius: "50%",
          overflow: "hidden",
          border: "4px solid #3B82F6",
          boxShadow: "0 10px 35px rgba(0,0,0,0.85)",
          zIndex: 40,
        };
      case "half-screen":
        return {
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "50%",
          objectFit: "cover",
          zIndex: 30,
        };
      case "center-floating":
      default:
        return {
          position: "absolute",
          top: "22%",
          left: "10%",
          width: "80%",
          height: "45%",
          borderRadius: "24px",
          overflow: "hidden",
          border: "3px solid rgba(255,255,255,0.25)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.8)",
          zIndex: 35,
        };
    }
  };

  // 4. Sinhronizacija reči za prikaz (karaoke prozor od 3 reči)
  const activeWordIndex = words.findIndex(
    (w) => currentTime >= w.start && currentTime <= w.end
  );

  const visibleWords = React.useMemo(() => {
    if (words.length === 0) return [];
    if (activeWordIndex === -1) {
      const nextIdx = words.findIndex((w) => w.start > currentTime);
      const center = nextIdx === -1 ? words.length - 1 : Math.max(0, nextIdx - 1);
      const start = Math.max(0, center - 1);
      return words.slice(start, start + 3);
    }
    const start = Math.max(0, activeWordIndex - 1);
    return words.slice(start, start + 3);
  }, [words, activeWordIndex, currentTime]);

  // 5. Pozicioniranje kontejnera titlova
  const positionStyles: React.CSSProperties = {
    top:
      subtitlePosition === "top"
        ? { justifyContent: "flex-start", paddingTop: 180 }
        : undefined,
    center: subtitlePosition === "center" ? { justifyContent: "center" } : undefined,
    bottom:
      subtitlePosition === "bottom"
        ? { justifyContent: "flex-end", paddingBottom: 220 }
        : undefined,
  }[subtitlePosition] || { justifyContent: "flex-end", paddingBottom: 220 };

  // 6. Veličina fonta
  const baseFontSize =
    subtitleFontSize === "sm" ? 38 : subtitleFontSize === "lg" ? 58 : 46;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      {/* 1. SLOJ: Pozadinski video ili generisana slika */}
      {videoSrc ? (
        <AbsoluteFill style={{ overflow: "hidden" }}>
          <Video
            src={videoSrc}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: getFilterCSS(filterStyle),
            }}
          />
        </AbsoluteFill>
      ) : imageSrc ? (
        <AbsoluteFill style={{ overflow: "hidden" }}>
          <Img
            src={imageSrc}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: transformCSS,
              filter: getFilterCSS(filterStyle),
            }}
          />
          <AbsoluteFill
            style={{
              background:
                "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.4) 100%)",
            }}
          />
        </AbsoluteFill>
      ) : null}

      {/* 2. SLOJ: Govoreći digitalni avatar (Lip-sync video) */}
      {avatarVideoSrc && (
        <div style={getAvatarStyles()}>
          <Video
            src={avatarVideoSrc}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      )}

      {/* 3. SLOJ: Audio izvori (Naracija + Pozadinska BGM muzika) */}
      {audioSrc && <Audio src={audioSrc} volume={1} />}
      {bgmSrc && <Audio src={bgmSrc} volume={bgmVolume} loop />}

      {/* 4. SLOJ: Reč-po-reč animirani karaoke titlovi */}
      <AbsoluteFill
        style={{
          ...positionStyles,
          alignItems: "center",
          paddingLeft: 40,
          paddingRight: 40,
          zIndex: 50,
        }}
      >
        {visibleWords.length > 0 && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "14px",
              textAlign: "center",
              maxWidth: "90%",
            }}
          >
            {visibleWords.map((item, idx) => {
              const isActive = currentTime >= item.start && currentTime <= item.end;

              // STIL 1: HORMOZI / MRBEAST (Žuto + masivni crni stroke)
              if (subtitleStyle === "hormozi") {
                return (
                  <span
                    key={`${item.word}-${idx}`}
                    style={{
                      fontSize: isActive ? `${baseFontSize + 10}px` : `${baseFontSize}px`,
                      fontWeight: 900,
                      textTransform: "uppercase",
                      color: isActive ? "#FACC15" : "#FFFFFF",
                      transform: isActive ? "scale(1.12) rotate(-2deg)" : "scale(1)",
                      transition: "all 0.08s ease-out",
                      WebkitTextStroke: "14px #000000",
                      paintOrder: "stroke fill",
                      fontFamily: "Impact, Montserrat, sans-serif",
                      letterSpacing: "1px",
                    }}
                  >
                    {item.word}
                  </span>
                );
              }

              // STIL 2: CYBER NEON (Plavi neonski glow)
              if (subtitleStyle === "neon") {
                return (
                  <span
                    key={`${item.word}-${idx}`}
                    style={{
                      fontSize: isActive ? `${baseFontSize + 8}px` : `${baseFontSize}px`,
                      fontWeight: 800,
                      textTransform: "uppercase",
                      color: isActive ? "#38BDF8" : "#E2E8F0",
                      textShadow: isActive
                        ? "0 0 20px #0284c7, 0 0 35px #0284c7, 0 2px 10px rgba(0,0,0,0.9)"
                        : "0 2px 10px rgba(0,0,0,0.8)",
                      transform: isActive ? "scale(1.08)" : "scale(1)",
                      transition: "all 0.08s ease-out",
                      fontFamily: "sans-serif",
                    }}
                  >
                    {item.word}
                  </span>
                );
              }

              // STIL 3: MINIMAL BOX (Crno-beli moderni bedž)
              if (subtitleStyle === "clean") {
                return (
                  <span
                    key={`${item.word}-${idx}`}
                    style={{
                      fontSize: `${baseFontSize - 4}px`,
                      fontWeight: 700,
                      color: isActive ? "#000000" : "#FFFFFF",
                      backgroundColor: isActive ? "#FFFFFF" : "rgba(0,0,0,0.65)",
                      padding: "6px 14px",
                      borderRadius: "10px",
                      backdropFilter: "blur(6px)",
                      transform: isActive ? "scale(1.05)" : "scale(1)",
                      transition: "all 0.1s ease-out",
                    }}
                  >
                    {item.word}
                  </span>
                );
              }

              // STIL 4: CLASSIC (Beli tekst sa prirodnom senkom)
              return (
                <span
                  key={`${item.word}-${idx}`}
                  style={{
                    fontSize: `${baseFontSize}px`,
                    fontWeight: 700,
                    color: isActive ? "#60A5FA" : "#FFFFFF",
                    textShadow: "0 4px 14px rgba(0,0,0,0.9)",
                    transform: isActive ? "scale(1.06)" : "scale(1)",
                    transition: "all 0.1s ease-out",
                  }}
                >
                  {item.word}
                </span>
              );
            })}
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};