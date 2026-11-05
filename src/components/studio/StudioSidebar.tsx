"use client";

import React, { useState } from "react";
import { VoiceRecorder } from "../audio/VoiceRecorder";
import { VisualsPicker } from "../visuals/VisualsPicker";
import {
  Mic,
  Volume2,
  UploadCloud,
  Sparkles,
  Loader2,
  CheckCircle2,
  FileAudio,
  ChevronRight,
  ChevronDown,
  Music2,
  Music,
  SlidersHorizontal,
  Image as ImageIcon,
  Subtitles,
  Film,
  Volume1,
  Key,
  User,
  ExternalLink,
  Video,
} from "lucide-react";

interface StudioSidebarProps {
  selectedImage: string | null;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  openModules: { [key: string]: boolean };
  toggleModule: (key: string) => void;
  audioSubTab: "ai" | "record" | "upload" | "bgm";
  setAudioSubTab: (tab: "ai" | "record" | "upload" | "bgm") => void;
  ttsText: string;
  setTtsText: (txt: string) => void;
  voice: string;
  setVoice: (v: string) => void;
  ttsProvider: "edge" | "google" | "elevenlabs";
  setTtsProvider: (p: "edge" | "google" | "elevenlabs") => void;
  elevenKey: string;
  setElevenKey: (k: string) => void;
  voicesList: Array<{ id: string; name: string }>;
  loading: boolean;
  handleGenerateTTS: () => void;
  handleAudioRecorded: (url: string, blob: Blob) => void;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleImageSelected: (url: string) => void;
  videoSrc: string | null;
  setVideoSrc: (url: string | null) => void;
  avatarVideoSrc: string | null;
  setAvatarVideoSrc: (url: string | null) => void;
  avatarPosition: "circle-bottom-right" | "half-screen" | "center-floating";
  setAvatarPosition: (pos: "circle-bottom-right" | "half-screen" | "center-floating") => void;
  gradioUrl: string;
  setGradioUrl: (url: string) => void;
  bgmSrc: string | null;
  setBgmSrc: (url: string | null) => void;
  bgmVolume: number;
  setBgmVolume: (vol: number) => void;
  filterStyle: string;
  setFilterStyle: (f: string) => void;
  transitionType: "zoomIn" | "zoomOut" | "panLeft" | "panRight" | "drift" | "static";
  setTransitionType: (t: any) => void;
  subtitleStyle: "hormozi" | "neon" | "clean" | "classic";
  setSubtitleStyle: (s: "hormozi" | "neon" | "clean" | "classic") => void;
  subtitlePosition: "bottom" | "center" | "top";
  setSubtitlePosition: (p: "bottom" | "center" | "top") => void;
  subtitleFontSize: "sm" | "md" | "lg";
  setSubtitleFontSize: (f: "sm" | "md" | "lg") => void;
  audioUrl: string | null;
  rendering: boolean;
  renderedVideoUrl: string | null;
  handleRenderVideo: () => void;
  statusMessage: string;
  uiLang: "sr" | "en";
  t: any;
}

export const StudioSidebar: React.FC<StudioSidebarProps> = ({
  sidebarOpen,
  setSidebarOpen,
  openModules,
  toggleModule,
  audioSubTab,
  setAudioSubTab,
  ttsText,
  setTtsText,
  voice,
  setVoice,
  ttsProvider,
  setTtsProvider,
  elevenKey,
  setElevenKey,
  voicesList,
  loading,
  handleGenerateTTS,
  handleAudioRecorded,
  handleFileUpload,
  handleImageSelected,
  videoSrc,
  setVideoSrc,
  avatarVideoSrc,
  setAvatarVideoSrc,
  avatarPosition,
  setAvatarPosition,
  gradioUrl,
  setGradioUrl,
  bgmSrc,
  setBgmSrc,
  bgmVolume,
  setBgmVolume,
  filterStyle,
  setFilterStyle,
  transitionType,
  setTransitionType,
  subtitleStyle,
  setSubtitleStyle,
  subtitlePosition,
  setSubtitlePosition,
  subtitleFontSize,
  setSubtitleFontSize,
  audioUrl,
  rendering,
  renderedVideoUrl,
  handleRenderVideo,
  statusMessage,
  uiLang,
  selectedImage,
  t,
}) => {
  const [avatarLoading, setAvatarLoading] = useState(false);

  if (!sidebarOpen) return null;

  return (
    <aside className="border-l border-neutral-800 bg-neutral-900/60 backdrop-blur w-96 flex flex-col shrink-0 overflow-hidden">
      {/* Zaglavlje panela */}
      <div className="h-16 border-b border-neutral-800 px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={18} className="text-blue-400" />
          <h3 className="font-bold text-sm tracking-wide text-neutral-200">{t.studioTools}</h3>
        </div>
        <button
          onClick={() => setSidebarOpen(false)}
          className="p-1.5 hover:bg-neutral-800 text-neutral-400 hover:text-white rounded-lg transition"
          title="Smanji meni"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* MODUL 1: AUDIO */}
        <div className="border border-neutral-800 rounded-xl bg-neutral-900/40 overflow-hidden">
          <button
            onClick={() => toggleModule("audio")}
            className="w-full flex items-center justify-between p-3.5 bg-neutral-900/70 hover:bg-neutral-800/60 transition text-left"
          >
            <span className="text-xs font-bold text-neutral-200 uppercase tracking-wider flex items-center gap-2">
              <Music2 size={15} className="text-blue-400" /> {t.audioModule}
            </span>
            {openModules.audio ? (
              <ChevronDown size={16} className="text-neutral-400" />
            ) : (
              <ChevronRight size={16} className="text-neutral-400" />
            )}
          </button>

          {openModules.audio && (
            <div className="p-4 space-y-4 border-t border-neutral-800/80">
              <div className="grid grid-cols-4 gap-1 bg-neutral-950 p-1 rounded-xl border border-neutral-800">
                <button
                  onClick={() => setAudioSubTab("ai")}
                  className={`py-2 text-[10px] font-semibold rounded-lg flex flex-col items-center gap-1 transition ${
                    audioSubTab === "ai" ? "bg-blue-600 text-white shadow-sm" : "text-neutral-400 hover:text-white"
                  }`}
                >
                  <Volume2 size={13} /> {t.tabAi}
                </button>
                <button
                  onClick={() => setAudioSubTab("record")}
                  className={`py-2 text-[10px] font-semibold rounded-lg flex flex-col items-center gap-1 transition ${
                    audioSubTab === "record" ? "bg-blue-600 text-white shadow-sm" : "text-neutral-400 hover:text-white"
                  }`}
                >
                  <Mic size={13} /> {t.tabRecord}
                </button>
                <button
                  onClick={() => setAudioSubTab("upload")}
                  className={`py-2 text-[10px] font-semibold rounded-lg flex flex-col items-center gap-1 transition ${
                    audioSubTab === "upload" ? "bg-blue-600 text-white shadow-sm" : "text-neutral-400 hover:text-white"
                  }`}
                >
                  <UploadCloud size={13} /> {t.tabUpload}
                </button>
                <button
                  onClick={() => setAudioSubTab("bgm")}
                  className={`py-2 text-[10px] font-semibold rounded-lg flex flex-col items-center gap-1 transition ${
                    audioSubTab === "bgm" ? "bg-blue-600 text-white shadow-sm" : "text-neutral-400 hover:text-white"
                  }`}
                >
                  <Music size={13} /> BGM
                </button>
              </div>

              {audioSubTab === "ai" && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] text-neutral-400 mb-1">
                      {uiLang === "sr" ? "AI Glasovni Servis" : "Voice Provider"}
                    </label>
                    <div className="grid grid-cols-3 gap-1 bg-neutral-950 p-1 rounded-lg border border-neutral-800 text-[10px] font-medium">
                      <button
                        onClick={() => {
                          setTtsProvider("edge");
                          setVoice("sr-RS-SophieNeural");
                        }}
                        className={`py-1 rounded ${
                          ttsProvider === "edge" ? "bg-blue-600 text-white font-bold" : "text-neutral-400"
                        }`}
                      >
                        Edge-TTS
                      </button>
                      <button
                        onClick={() => {
                          setTtsProvider("google");
                          setVoice("sr-RS-Standard-A");
                        }}
                        className={`py-1 rounded ${
                          ttsProvider === "google" ? "bg-blue-600 text-white font-bold" : "text-neutral-400"
                        }`}
                      >
                        Google
                      </button>
                      <button
                        onClick={() => {
                          setTtsProvider("elevenlabs");
                          setVoice("pNInz6obpgDQGcFmaJgB");
                        }}
                        className={`py-1 rounded ${
                          ttsProvider === "elevenlabs" ? "bg-blue-600 text-white font-bold" : "text-neutral-400"
                        }`}
                      >
                        ElevenLabs
                      </button>
                    </div>
                  </div>

                  {ttsProvider === "elevenlabs" && (
                    <div className="space-y-1 bg-neutral-950 p-2.5 rounded-lg border border-neutral-800">
                      <label className="text-[10px] text-neutral-400 flex items-center gap-1">
                        <Key size={11} className="text-amber-400" /> ElevenLabs API Key
                      </label>
                      <input
                        type="password"
                        value={elevenKey}
                        onChange={(e) => setElevenKey(e.target.value)}
                        placeholder="Učitano iz .env.local"
                        className="w-full bg-neutral-900 border border-neutral-700 rounded p-1.5 text-xs text-white focus:outline-none"
                      />
                    </div>
                  )}

                  <label className="block text-xs font-medium text-neutral-300">{t.scriptLabel}</label>
                  <textarea
                    value={ttsText}
                    onChange={(e) => setTtsText(e.target.value)}
                    rows={3}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder={t.scriptPlaceholder}
                  />

                  <div>
                    <label className="block text-[11px] text-neutral-400 mb-1">{t.voiceSelectLabel}</label>
                    <select
                      value={voice}
                      onChange={(e) => setVoice(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2 text-xs text-white focus:outline-none"
                    >
                      {voicesList.map((g) => (
                        <option key={g.id} value={g.id}>
                          {g.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={handleGenerateTTS}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition p-2.5 rounded-lg font-semibold text-xs text-white shadow"
                  >
                    {loading ? <Loader2 className="animate-spin" size={14} /> : <Sparkles size={14} />}
                    {t.btnGenerate}
                  </button>
                </div>
              )}

              {audioSubTab === "record" && (
                <VoiceRecorder onAudioRecorded={handleAudioRecorded} />
              )}

              {audioSubTab === "upload" && (
                <div className="border-2 border-dashed border-neutral-800 hover:border-neutral-700 transition rounded-xl p-5 flex flex-col items-center justify-center text-center cursor-pointer relative bg-neutral-900/30">
                  <FileAudio className="w-8 h-8 text-blue-500 mb-2" />
                  <p className="text-xs font-medium text-neutral-300">{t.uploadPrompt}</p>
                  <p className="text-[10px] text-neutral-500 mt-1">{t.uploadFormats}</p>
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={handleFileUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
              )}

              {audioSubTab === "bgm" && (
                <div className="space-y-4 bg-neutral-950 p-3.5 rounded-xl border border-neutral-800">
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-neutral-300 flex items-center gap-1.5">
                        <Volume1 size={14} className="text-blue-400" />
                        {uiLang === "sr" ? "Jačina muzike:" : "Music volume:"}
                      </span>
                      <span className="text-xs font-mono font-bold text-blue-400">
                        {Math.round(bgmVolume * 100)}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={bgmVolume}
                      onChange={(e) => setBgmVolume(parseFloat(e.target.value))}
                      className="w-full accent-blue-500 cursor-pointer"
                    />
                  </div>

                  <div className="relative border border-dashed border-neutral-800 hover:border-neutral-700 rounded-lg p-3 text-center cursor-pointer bg-neutral-900/40">
                    <Music size={16} className="mx-auto text-blue-400 mb-1" />
                    <span className="text-[11px] text-neutral-300 block font-medium">
                      {uiLang === "sr" ? "Učitaj pozadinsku muziku sa diska" : "Upload background track"}
                    </span>
                    <span className="text-[10px] text-neutral-500 block">MP3, WAV, OGG</span>
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setBgmSrc(URL.createObjectURL(file));
                      }}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>

                  {bgmSrc && (
                    <div className="flex items-center justify-between text-[11px] bg-blue-950/40 border border-blue-900/60 p-2 rounded-lg text-blue-300">
                      <span>{uiLang === "sr" ? "Muzika je aktivna" : "Track loaded"}</span>
                      <button
                        onClick={() => setBgmSrc(null)}
                        className="text-red-400 hover:text-red-300 text-[10px] font-bold uppercase"
                      >
                        {uiLang === "sr" ? "Ukloni" : "Remove"}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {statusMessage && (
                <div className="flex items-center gap-2 text-[11px] text-neutral-300 bg-neutral-950 p-2.5 rounded-lg border border-neutral-800">
                  <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                  <span>{statusMessage}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* MODUL 2: SLIKE, VIDEO, FILTERI I TRANZICIJE */}
        <div className="border border-neutral-800 rounded-xl bg-neutral-900/40 overflow-hidden">
          <button
            onClick={() => toggleModule("visuals")}
            className="w-full flex items-center justify-between p-3.5 bg-neutral-900/70 hover:bg-neutral-800/60 transition text-left"
          >
            <span className="text-xs font-bold text-neutral-200 uppercase tracking-wider flex items-center gap-2">
              <ImageIcon size={15} className="text-indigo-400" /> {t.visualsModule}
            </span>
            {openModules.visuals ? (
              <ChevronDown size={16} className="text-neutral-400" />
            ) : (
              <ChevronRight size={16} className="text-neutral-400" />
            )}
          </button>

          {openModules.visuals && (
            <div className="p-4 border-t border-neutral-800/80 space-y-4">
              <VisualsPicker
                lang={uiLang}
                onImageSelected={handleImageSelected}
                filterStyle={filterStyle}
                setFilterStyle={setFilterStyle}
                transitionType={transitionType}
                setTransitionType={setTransitionType}
              />

              {/* Učitavanje pozadinskog MP4 videa sa diska */}
              <div className="pt-2 border-t border-neutral-800/60 space-y-2">
                <label className="block text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                  {uiLang === "sr" ? "Pozadinski Video Klip (Opciono)" : "Background Video (Optional)"}
                </label>
                <div className="relative border border-dashed border-neutral-800 hover:border-neutral-700 rounded-xl p-3 text-center cursor-pointer bg-neutral-950">
                  <Video size={16} className="mx-auto text-indigo-400 mb-1" />
                  <span className="text-xs text-neutral-300 block font-medium">
                    {videoSrc
                      ? (uiLang === "sr" ? "Video učitan" : "Video loaded")
                      : (uiLang === "sr" ? "Učitaj MP4 pozadinu" : "Upload MP4 background")}
                  </span>
                  <input
                    type="file"
                    accept="video/mp4,video/webm"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setVideoSrc(URL.createObjectURL(file));
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
                {videoSrc && (
                  <button
                    onClick={() => setVideoSrc(null)}
                    className="text-[10px] text-red-400 hover:text-red-300 font-bold uppercase block w-full text-right"
                  >
                    {uiLang === "sr" ? "Ukloni video" : "Remove video"}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* MODUL: DIGITALNI AVATAR (LIP-SYNC) */}
        <div className="border border-neutral-800 rounded-xl bg-neutral-900/40 overflow-hidden">
          <button
            onClick={() => toggleModule("avatar")}
            className="w-full flex items-center justify-between p-3.5 bg-neutral-900/70 hover:bg-neutral-800/60 transition text-left"
          >
            <span className="text-xs font-bold text-neutral-200 uppercase tracking-wider flex items-center gap-2">
              <User size={15} className="text-emerald-400" /> {t.avatarModule}
            </span>
            {openModules.avatar ? (
              <ChevronDown size={16} className="text-neutral-400" />
            ) : (
              <ChevronRight size={16} className="text-neutral-400" />
            )}
          </button>

          {openModules.avatar && (
            <div className="p-4 border-t border-neutral-800/80 space-y-4">
              {/* Pozicija avatara */}
              <div>
                <label className="block text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-2">
                  {uiLang === "sr" ? "Položaj na ekranu" : "Avatar Layout"}
                </label>
                <div className="grid grid-cols-3 gap-1.5 bg-neutral-950 p-1 rounded-xl border border-neutral-800 text-[11px] font-medium">
                  <button
                    onClick={() => setAvatarPosition("circle-bottom-right")}
                    className={`py-1.5 rounded-lg transition ${
                      avatarPosition === "circle-bottom-right"
                        ? "bg-emerald-600 text-white font-bold"
                        : "text-neutral-400 hover:text-white"
                    }`}
                  >
                    Krug dole
                  </button>
                  <button
                    onClick={() => setAvatarPosition("half-screen")}
                    className={`py-1.5 rounded-lg transition ${
                      avatarPosition === "half-screen"
                        ? "bg-emerald-600 text-white font-bold"
                        : "text-neutral-400 hover:text-white"
                    }`}
                  >
                    Pola ekrana
                  </button>
                  <button
                    onClick={() => setAvatarPosition("center-floating")}
                    className={`py-1.5 rounded-lg transition ${
                      avatarPosition === "center-floating"
                        ? "bg-emerald-600 text-white font-bold"
                        : "text-neutral-400 hover:text-white"
                    }`}
                  >
                    Centar
                  </button>
                </div>
              </div>

              {/* Colab / Gradio URL */}
              <div className="space-y-1.5 bg-neutral-950 p-3 rounded-xl border border-neutral-800">
                <div className="flex items-center justify-between text-[11px] text-neutral-400">
                  <span className="flex items-center gap-1">
                    <ExternalLink size={12} className="text-emerald-400" /> Colab Gradio Worker
                  </span>
                  <span className="text-[10px] text-neutral-500">SadTalker / LivePortrait</span>
                </div>
                <input
                  type="text"
                  value={gradioUrl}
                  onChange={(e) => setGradioUrl(e.target.value)}
                  placeholder="https://xxxx.gradio.live"
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2 text-xs text-white focus:outline-none"
                />
              </div>

              {/* Dugme za slanje na Google Colab */}
              <button
                onClick={async () => {
                  if (!gradioUrl) {
                    alert("Unesite Colab Gradio link.");
                    return;
                  }
                  if (!selectedImage) {
                    alert("Izaberite ili generišite sliku lica pre pokretanja.");
                    return;
                  }
                  if (!audioUrl) {
                    alert("Generišite ili učitajte audio pre pokretanja avatara.");
                    return;
                  }

                  setAvatarLoading(true);

                  // Pomoćna funkcija: konvertuje blob URL u Base64 unutar browsera
                  const resolveToDataUri = async (url: string): Promise<string> => {
                    if (url.startsWith("blob:")) {
                      const res = await fetch(url);
                      const blob = await res.blob();
                      return new Promise((resolve) => {
                        const reader = new FileReader();
                        reader.onloadend = () => resolve(reader.result as string);
                        reader.readAsDataURL(blob);
                      });
                    }
                    return url;
                  };

                  try {
                    const finalImagePayload = await resolveToDataUri(selectedImage);
                    const finalAudioPayload = await resolveToDataUri(audioUrl);

                    const res = await fetch("/api/avatar", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        imageSrc: finalImagePayload,
                        audioSrc: finalAudioPayload,
                        gradioUrl,
                      }),
                    });

                    const data = await res.json();
                    if (data.success && data.videoUrl) {
                      setAvatarVideoSrc(data.videoUrl);
                    } else {
                      alert(data.error || "Greška pri kreiranju avatara na Colabu.");
                    }
                  } catch (err) {
                    console.error(err);
                    alert("Greška u komunikaciji sa Colab workerom.");
                  } finally {
                    setAvatarLoading(false);
                  }
                }}
                disabled={avatarLoading || !audioUrl || !selectedImage}
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 p-2.5 rounded-xl text-xs font-bold text-white transition shadow-lg cursor-pointer"
              >
                {avatarLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={15} />
                    <span>Colab generiše pokrete usana...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={15} />
                    <span>Pokreni AI Avatara (Colab GPU)</span>
                  </>
                )}
              </button>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-neutral-800"></div>
                <span className="flex-shrink mx-2 text-[10px] text-neutral-500 uppercase">ili</span>
                <div className="flex-grow border-t border-neutral-800"></div>
              </div>

              {/* Učitavanje gotovog Lip-sync videa sa diska */}
              <div className="relative border border-dashed border-neutral-800 hover:border-neutral-700 rounded-xl p-3 text-center cursor-pointer bg-neutral-950">
                <User size={16} className="mx-auto text-emerald-400 mb-1" />
                <span className="text-xs text-neutral-300 block font-medium">
                  {avatarVideoSrc
                    ? (uiLang === "sr" ? "Avatar video učitan" : "Avatar video loaded")
                    : (uiLang === "sr" ? "Učitaj MP4 avatara sa diska" : "Upload avatar MP4")}
                </span>
                <input
                  type="file"
                  accept="video/mp4,video/webm"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setAvatarVideoSrc(URL.createObjectURL(file));
                  }}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>

              {avatarVideoSrc && (
                <div className="flex items-center justify-between text-xs bg-emerald-950/40 border border-emerald-900/60 p-2.5 rounded-xl text-emerald-300">
                  <span>{uiLang === "sr" ? "Avatar sloj je aktivan" : "Avatar layer active"}</span>
                  <button
                    onClick={() => setAvatarVideoSrc(null)}
                    className="text-red-400 hover:text-red-300 text-[10px] font-bold uppercase"
                  >
                    {uiLang === "sr" ? "Ukloni" : "Remove"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* MODUL 3: TITLOVI */}
        <div className="border border-neutral-800 rounded-xl bg-neutral-900/40 overflow-hidden">
          <button
            onClick={() => toggleModule("subtitles")}
            className="w-full flex items-center justify-between p-3.5 bg-neutral-900/70 hover:bg-neutral-800/60 transition text-left"
          >
            <span className="text-xs font-bold text-neutral-200 uppercase tracking-wider flex items-center gap-2">
              <Subtitles size={15} className="text-amber-400" /> {t.subtitlesModule}
            </span>
            {openModules.subtitles ? (
              <ChevronDown size={16} className="text-neutral-400" />
            ) : (
              <ChevronRight size={16} className="text-neutral-400" />
            )}
          </button>

          {openModules.subtitles && (
            <div className="p-4 border-t border-neutral-800/80 space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-2">
                  {uiLang === "sr" ? "Stil animacije titla" : "Caption Animation Style"}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "hormozi", name: "Hormozi / Beast", desc: "Bold crni obris & žuto" },
                    { id: "neon", name: "Cyber Neon", desc: "Plavi neonski sjaj" },
                    { id: "clean", name: "Minimal Box", desc: "Crno-beli moderni bedž" },
                    { id: "classic", name: "Classic Soft", desc: "Standardni čisti titl" },
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSubtitleStyle(s.id as any)}
                      className={`p-2 rounded-xl border text-left transition ${
                        subtitleStyle === s.id
                          ? "bg-amber-500/15 border-amber-500 text-white"
                          : "bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white"
                      }`}
                    >
                      <div className="text-xs font-bold">{s.name}</div>
                      <div className="text-[10px] text-neutral-500 mt-0.5">{s.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-2">
                  {uiLang === "sr" ? "Pozicija titlova" : "Screen Position"}
                </label>
                <div className="grid grid-cols-3 gap-1.5 bg-neutral-950 p-1 rounded-xl border border-neutral-800">
                  {[
                    { id: "top", label: uiLang === "sr" ? "Vrh" : "Top" },
                    { id: "center", label: uiLang === "sr" ? "Sredina" : "Center" },
                    { id: "bottom", label: uiLang === "sr" ? "Dno" : "Bottom" },
                  ].map((pos) => (
                    <button
                      key={pos.id}
                      onClick={() => setSubtitlePosition(pos.id as any)}
                      className={`py-1.5 text-xs font-semibold rounded-lg transition ${
                        subtitlePosition === pos.id
                          ? "bg-amber-600 text-white"
                          : "text-neutral-400 hover:text-white"
                      }`}
                    >
                      {pos.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-2">
                  {uiLang === "sr" ? "Veličina fonta" : "Font Size"}
                </label>
                <div className="grid grid-cols-3 gap-1.5 bg-neutral-950 p-1 rounded-xl border border-neutral-800">
                  {[
                    { id: "sm", label: "Mala" },
                    { id: "md", label: "Srednja" },
                    { id: "lg", label: "Velika" },
                  ].map((size) => (
                    <button
                      key={size.id}
                      onClick={() => setSubtitleFontSize(size.id as any)}
                      className={`py-1.5 text-xs font-semibold rounded-lg transition ${
                        subtitleFontSize === size.id
                          ? "bg-amber-600 text-white"
                          : "text-neutral-400 hover:text-white"
                      }`}
                    >
                      {size.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* MODUL 4: EXPORT / RENDER */}
        <div className="border border-neutral-800 rounded-xl bg-neutral-900/40 overflow-hidden">
          <button
            onClick={() => toggleModule("export")}
            className="w-full flex items-center justify-between p-3.5 bg-neutral-900/70 hover:bg-neutral-800/60 transition text-left"
          >
            <span className="text-xs font-bold text-neutral-200 uppercase tracking-wider flex items-center gap-2">
              <Film size={15} className="text-emerald-400" /> {t.exportModule}
            </span>
            {openModules.export ? (
              <ChevronDown size={16} className="text-neutral-400" />
            ) : (
              <ChevronRight size={16} className="text-neutral-400" />
            )}
          </button>

          {openModules.export && (
            <div className="p-4 border-t border-neutral-800/80 space-y-4">
              <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 space-y-2 text-xs">
                <div className="flex justify-between text-neutral-400">
                  <span>{uiLang === "sr" ? "Rezolucija:" : "Resolution:"}</span>
                  <span className="text-white font-mono font-bold">1080 × 1920 (9:16)</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>{uiLang === "sr" ? "Format:" : "Codec:"}</span>
                  <span className="text-white font-mono font-bold">MP4 / H.264 (30 FPS)</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>{uiLang === "sr" ? "Optimizacija:" : "Preset:"}</span>
                  <span className="text-emerald-400 font-bold">TikTok / Reels / Shorts</span>
                </div>
              </div>

              <button
                onClick={handleRenderVideo}
                disabled={rendering || !audioUrl}
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 transition p-3 rounded-xl font-bold text-xs text-white shadow-lg"
              >
                {rendering ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    <span>{uiLang === "sr" ? "Renderovanje u toku..." : "Rendering video..."}</span>
                  </>
                ) : (
                  <>
                    <Film size={16} />
                    <span>{uiLang === "sr" ? "Renderuj MP4 Video" : "Export MP4 Video"}</span>
                  </>
                )}
              </button>

              {!audioUrl && (
                <p className="text-[11px] text-neutral-500 text-center">
                  {uiLang === "sr"
                    ? "Generišite zvuk ili učitajte audio pre renderovanja."
                    : "Generate or upload audio before exporting."}
                </p>
              )}

              {renderedVideoUrl && (
                <div className="p-3 bg-emerald-950/30 border border-emerald-900/60 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
                    <CheckCircle2 size={15} />
                    <span>{uiLang === "sr" ? "Video je spreman!" : "Video is ready!"}</span>
                  </div>
                  <a
                    href={renderedVideoUrl}
                    download="studio_short.mp4"
                    className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-black py-2 rounded-lg font-bold text-xs transition"
                  >
                    {uiLang === "sr" ? "Preuzmi MP4 fajl" : "Download MP4"}
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};