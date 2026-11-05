"use client";

import React, { useState, useMemo } from "react";
import { StudioHeader } from "../components/studio/StudioHeader";
import { StudioCanvas } from "../components/studio/StudioCanvas";
import { StudioSidebar } from "../components/studio/StudioSidebar";

interface WordTiming {
  word: string;
  start: number;
  end: number;
}

const DICTIONARY = {
  sr: {
    appTitle: "AlexandarStudioOS",
    appSubtitle: "AI Video & Audio Studio za društvene mreže",
    engineReady: "Audio & Remotion Engine Spreman",
    speechLang: "Jezik govora",
    audioModule: "Audio modul",
    visualsModule: "Slike, Video i Efekti",
    avatarModule: "Digitalni Avatar (Lip-Sync)",
    subtitlesModule: "Stilovi titlova",
    exportModule: "Render & Izvoz",
    tabAi: "AI Glas",
    tabRecord: "Snimi glas",
    tabUpload: "Učitaj fajl",
    scriptLabel: "Tekst za čitanje / naracija",
    scriptPlaceholder: "Unesite tekst naracije...",
    voiceSelectLabel: "Izbor glasa",
    btnGenerate: "Generiši AI Zvuk & Titlove",
    uploadPrompt: "Kliknite ili prevucite audio sa računara",
    uploadFormats: "Podržani formati: MP3, WAV, WebM, M4A",
    syncTitle: "Sinhronizacija i Titlovi",
    timestampsLabel: "Reč-po-reč vremenske oznake",
    noWords: "Nema učitanih reči.",
    emptyPreview: "Generišite glas, snimite govor ili prevucite fajl sa diska",
    statusGenerating: "Generišem naraciju i vadim vremenske oznake...",
    statusSuccess: "Audio i titlovi su uspešno sinhronizovani!",
    studioTools: "Alati studija",
    comingSoon: "Uskoro u sledećem koraku",
  },
  en: {
    appTitle: "AlexandarStudioOS",
    appSubtitle: "AI Video & Audio Social Media Studio",
    engineReady: "Audio & Remotion Engine Ready",
    speechLang: "Speech Language",
    audioModule: "Audio Module",
    visualsModule: "Images, Video & Effects",
    avatarModule: "Digital Avatar (Lip-Sync)",
    subtitlesModule: "Subtitle Styles",
    exportModule: "Render & Export",
    tabAi: "AI Voice",
    tabRecord: "Record Voice",
    tabUpload: "Upload Audio",
    scriptLabel: "Narration script / text",
    scriptPlaceholder: "Type your script here...",
    voiceSelectLabel: "Select Voice",
    btnGenerate: "Generate AI Audio & Subtitles",
    uploadPrompt: "Click or drag & drop an audio file from PC",
    uploadFormats: "Supported formats: MP3, WAV, WebM, M4A",
    syncTitle: "Synchronization & Captions",
    timestampsLabel: "Word-by-word timestamps",
    noWords: "No words detected yet.",
    emptyPreview: "Generate voice, record speech or upload audio to begin",
    statusGenerating: "Generating audio and extracting timestamps...",
    statusSuccess: "Audio and captions successfully synchronized!",
    studioTools: "Studio Tools",
    comingSoon: "Coming soon in next step",
  },
};

const EDGE_GLASOVI = [
  { id: "sr-RS-SophieNeural", name: "Srpski - Sophie (Ženski)" },
  { id: "sr-RS-NicholasNeural", name: "Srpski - Nicholas (Muški)" },
  { id: "bs-BA-VesnaNeural", name: "Bosanski - Vesna (Ženski)" },
  { id: "bs-BA-GoranNeural", name: "Bosanski - Goran (Muški)" },
  { id: "hr-HR-GabrijelaNeural", name: "Hrvatski - Gabrijela (Ženski)" },
  { id: "hr-HR-SreckoNeural", name: "Hrvatski - Srećko (Muški)" },
  { id: "en-US-JennyNeural", name: "English (US) - Jenny" },
  { id: "en-US-GuyNeural", name: "English (US) - Guy" },
  { id: "en-US-AriaNeural", name: "English (US) - Aria" },
  { id: "en-GB-SoniaNeural", name: "English (UK) - Sonia" },
  { id: "en-GB-RyanNeural", name: "English (UK) - Ryan" },
];

export default function StudioDashboard() {
  const [uiLang, setUiLang] = useState<"sr" | "en">("sr");
  const t = DICTIONARY[uiLang];

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openModules, setOpenModules] = useState<{ [key: string]: boolean }>({
    audio: true,
    visuals: true,
    avatar: true,
    subtitles: true,
    export: true,
  });

  const toggleModule = (moduleKey: string) => {
    setOpenModules((prev) => ({
      ...prev,
      [moduleKey]: !prev[moduleKey],
    }));
  };

  // 1. Audio stanja
  const [audioSubTab, setAudioSubTab] = useState<"ai" | "record" | "upload" | "bgm">("ai");
  const [speechLang, setSpeechLang] = useState<"sr" | "en">("sr");
  const [ttsProvider, setTtsProvider] = useState<"edge" | "google" | "elevenlabs">("edge");
  const [voice, setVoice] = useState("sr-RS-SophieNeural");
  const [elevenKey, setElevenKey] = useState("");
  const [ttsText, setTtsText] = useState(
    "Dobrodošli u AlexandarStudioOS. Ovde kreiramo video sadržaje za mreže."
  );
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [words, setWords] = useState<WordTiming[]>([]);
  const [statusMessage, setStatusMessage] = useState("");

  // 2. Vizuali, kamera i muzika
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [bgmSrc, setBgmSrc] = useState<string | null>(null);
  const [bgmVolume, setBgmVolume] = useState<number>(0.15);
  const [filterStyle, setFilterStyle] = useState<string>("cinematic");
  const [transitionType, setTransitionType] = useState<
    "zoomIn" | "zoomOut" | "panLeft" | "panRight" | "drift" | "static"
  >("zoomIn");

  // 3. Digitalni avatar
  const [avatarVideoSrc, setAvatarVideoSrc] = useState<string | null>(null);
  const [avatarPosition, setAvatarPosition] = useState<
    "circle-bottom-right" | "half-screen" | "center-floating"
  >("circle-bottom-right");
  const [gradioUrl, setGradioUrl] = useState("");

  // 4. Titlovi
  const [subtitleStyle, setSubtitleStyle] = useState<"hormozi" | "neon" | "clean" | "classic">("hormozi");
  const [subtitlePosition, setSubtitlePosition] = useState<"bottom" | "center" | "top">("bottom");
  const [subtitleFontSize, setSubtitleFontSize] = useState<"sm" | "md" | "lg">("md");

  // 5. Render
  const [rendering, setRendering] = useState(false);
  const [renderedVideoUrl, setRenderedVideoUrl] = useState<string | null>(null);

  const currentVoices = useMemo(() => {
    if (ttsProvider === "google") {
      return [
        { id: "sr-RS-Standard-A", name: "Google - sr-RS-Standard-A (Ženski)" },
        { id: "sr-RS-Standard-B", name: "Google - sr-RS-Standard-B (Ženski)" },
        { id: "en-US-Standard-C", name: "Google - en-US-Standard-C (Muški)" },
        { id: "en-US-Standard-E", name: "Google - en-US-Standard-E (Ženski)" },
      ];
    }
    if (ttsProvider === "elevenlabs") {
      return [
        { id: "CwhRBWXzGAHq8TQ4Fs17", name: "Roger - Laid-Back, Casual, Resonant" },
        { id: "EXAVITQu4vr4xnSDxMaL", name: "Sarah - Mature, Reassuring, Confident" },
        { id: "FGY2WhTYpPnrIDTdsKH5", name: "Laura - Enthusiast, Quirky Attitude" },
        { id: "IKne3meq5aSn9XLyUdCD", name: "Charlie - Deep, Confident, Energetic" },
        { id: "JBFqnCBsd6RMkjVDRZzb", name: "George - Warm, Captivating Storyteller" },
        { id: "N2lVS1w4EtoT3dr4eOWO", name: "Callum - Husky Trickster" },
        { id: "SAz9YHcvj6GT2YYXdXww", name: "River - Relaxed, Neutral, Informative" },
        { id: "SOYHLrjzK2X1ezoPC6cr", name: "Harry - Fierce Warrior" },
        { id: "TX3LPaxmHKxFdv7VOQHJ", name: "Liam - Energetic, Social Media Creator" },
        { id: "Xb7hH8MSUJpSbSDYk0k2", name: "Alice - Clear, Engaging Educator" },
        { id: "XrExE9yKIg1WjnnlVkGX", name: "Matilda - Knowledgable, Professional" },
        { id: "bIHbv24MWmeRgasZH58o", name: "Will - Relaxed Optimist" },
        { id: "cgSgspJ2msm6clMCkdW9", name: "Jessica - Playful, Bright, Warm" },
        { id: "cjVigY5qzO86Huf0OWal", name: "Eric - Smooth, Trustworthy" },
        { id: "hpp4J3VqNfWAUOO0d1Us", name: "Bella - Professional, Bright, Warm" },
        { id: "iP95p4xoKVk53GoZ742B", name: "Chris - Charming, Down-to-Earth" },
        { id: "nPczCjzI2devNBz1zQrb", name: "Brian - Deep, Resonant and Comforting" },
        { id: "onwK4e9ZLuTAKqWW03F9", name: "Daniel - Steady Broadcaster" },
        { id: "pFZP5JQG7iQjIQuC4Bku", name: "Lily - Velvety Actress" },
        { id: "pNInz6obpgDQGcFmaJgB", name: "Adam - Dominant, Firm" },
        { id: "pqHfZKP75CvOlQylNhV4", name: "Bill - Wise, Mature, Balanced" },
      ];
    }
    return EDGE_GLASOVI;
  }, [ttsProvider]);

  // Transkripcija pomoću Whisper-a (za snimke i uploadovane fajlove)
  const handleTranscribeBlob = async (blob: Blob, lang: "sr" | "en") => {
    setLoading(true);
    setStatusMessage(t.statusGenerating);

    const formData = new FormData();
    formData.append("file", blob);
    formData.append("lang", lang);

    try {
      const res = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data.success) {
        setWords(data.words || []);
        setStatusMessage(t.statusSuccess);
      } else {
        setStatusMessage("Error: " + (data.error || "Failed"));
      }
    } catch (err) {
      console.error(err);
      setStatusMessage("Greška pri transkripciji.");
    } finally {
      setLoading(false);
    }
  };

  // Generisanje AI glasa
  const handleGenerateTTS = async () => {
    if (!ttsText.trim()) return;
    setLoading(true);
    setStatusMessage(t.statusGenerating);

    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: ttsText,
          voice,
          provider: ttsProvider,
          apiKey: elevenKey,
        }),
      });
      const data = await res.json();

      if (data.success) {
        setAudioUrl(data.audioUrl);
        // Ako je Edge-TTS poslao tačne reči, prikazujemo ih odmah
        if (data.words && data.words.length > 0) {
          setWords(data.words);
          setStatusMessage(t.statusSuccess);
        } else {
          // Za Google i ElevenLabs vadimo reči preko Whisper rute
          const audioBlob = await fetch(data.audioUrl).then((r) => r.blob());
          await handleTranscribeBlob(audioBlob, speechLang);
        }
      } else {
        setStatusMessage("Greška: " + (data.error || "Neuspešno generisanje"));
      }
    } catch (err) {
      console.error(err);
      setStatusMessage("Greška pri generisanju zvuka.");
    } finally {
      setLoading(false);
    }
  };

  // Upload zvuka sa računara
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const localUrl = URL.createObjectURL(file);
    setAudioUrl(localUrl);
    await handleTranscribeBlob(file, speechLang);
  };

  // Finalni render MP4 videa sa svim slojevima
  const handleRenderVideo = async () => {
    if (!audioUrl) return;
    setRendering(true);
    setStatusMessage(uiLang === "sr" ? "Započinjem Remotion renderovanje..." : "Starting Remotion render...");

    try {
      const res = await fetch("/api/render", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageSrc: selectedImage,
          videoSrc,
          avatarVideoSrc,
          avatarPosition,
          audioSrc: audioUrl,
          bgmSrc,
          bgmVolume,
          filterStyle,
          transitionType,
          subtitleStyle,
          subtitlePosition,
          subtitleFontSize,
          words,
        }),
      });

      const data = await res.json();
      if (data.success && data.videoUrl) {
        setRenderedVideoUrl(data.videoUrl);
        setStatusMessage(uiLang === "sr" ? "Video uspešno renderovan!" : "Video successfully rendered!");
      } else {
        alert(data.error || "Greška pri renderovanju videa.");
      }
    } catch (err) {
      console.error(err);
      alert("Došlo je do greške pri komunikaciji sa render serverom.");
    } finally {
      setRendering(false);
    }
  };

  return (
    <div className="flex h-screen bg-neutral-950 text-neutral-100 overflow-hidden font-sans">
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <StudioHeader
          uiLang={uiLang}
          setUiLang={setUiLang}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          t={t}
        />
        <StudioCanvas
          uiLang={uiLang}
          speechLang={speechLang}
          setSpeechLang={setSpeechLang}
          selectedImage={selectedImage}
          videoSrc={videoSrc}
          avatarVideoSrc={avatarVideoSrc}
          avatarPosition={avatarPosition}
          audioUrl={audioUrl}
          bgmSrc={bgmSrc}
          bgmVolume={bgmVolume}
          filterStyle={filterStyle}
          transitionType={transitionType}
          subtitleStyle={subtitleStyle}
          subtitlePosition={subtitlePosition}
          subtitleFontSize={subtitleFontSize}
          words={words}
          t={t}
        />
      </div>

      <StudioSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        openModules={openModules}
        toggleModule={toggleModule}
        audioSubTab={audioSubTab}
        setAudioSubTab={setAudioSubTab}
        ttsText={ttsText}
        setTtsText={setTtsText}
        voice={voice}
        setVoice={setVoice}
        ttsProvider={ttsProvider}
        setTtsProvider={setTtsProvider}
        elevenKey={elevenKey}
        setElevenKey={setElevenKey}
        voicesList={currentVoices}
        loading={loading}
        handleGenerateTTS={handleGenerateTTS}
        handleAudioRecorded={(url, blob) => {
          setAudioUrl(url);
          handleTranscribeBlob(blob, speechLang);
        }}
        handleFileUpload={handleFileUpload}
        selectedImage={selectedImage}
        handleImageSelected={(url) => setSelectedImage(url)}
        videoSrc={videoSrc}
        setVideoSrc={setVideoSrc}
        avatarVideoSrc={avatarVideoSrc}
        setAvatarVideoSrc={setAvatarVideoSrc}
        avatarPosition={avatarPosition}
        setAvatarPosition={setAvatarPosition}
        gradioUrl={gradioUrl}
        setGradioUrl={setGradioUrl}
        bgmSrc={bgmSrc}
        setBgmSrc={setBgmSrc}
        bgmVolume={bgmVolume}
        setBgmVolume={setBgmVolume}
        filterStyle={filterStyle}
        setFilterStyle={setFilterStyle}
        transitionType={transitionType}
        setTransitionType={setTransitionType}
        subtitleStyle={subtitleStyle}
        setSubtitleStyle={setSubtitleStyle}
        subtitlePosition={subtitlePosition}
        setSubtitlePosition={setSubtitlePosition}
        subtitleFontSize={subtitleFontSize}
        setSubtitleFontSize={setSubtitleFontSize}
        audioUrl={audioUrl}
        rendering={rendering}
        renderedVideoUrl={renderedVideoUrl}
        handleRenderVideo={handleRenderVideo}
        statusMessage={statusMessage}
        uiLang={uiLang}
        t={t}
      />
    </div>
  );
}