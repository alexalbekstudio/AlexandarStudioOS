"use client";

import React, { useState, useRef } from "react";
import { Mic, Square, RotateCcw } from "lucide-react";

interface VoiceRecorderProps {
  onAudioRecorded?: (audioUrl: string, audioBlob: Blob) => void;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onAudioRecorded }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        if (onAudioRecorded) {
          onAudioRecorded(url, audioBlob);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Greška mikrofona:", err);
      alert("Nije moguće pristupiti mikrofonu. Proverite dozvole u browseru.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      setIsRecording(false);
    }
  };

  const resetRecording = () => {
    setAudioUrl(null);
    audioChunksRef.current = [];
  };

  return (
    <div className="flex flex-col gap-4 p-5 bg-neutral-900 border border-neutral-800 rounded-xl text-white">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-base">Snimanje mikrofonom</h3>
        {isRecording && (
          <span className="flex items-center gap-2 text-red-500 text-xs font-semibold animate-pulse">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Snimanje u toku...
          </span>
        )}
      </div>

      <div className="flex items-center gap-3">
        {!isRecording && !audioUrl && (
          <button
            onClick={startRecording}
            className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 transition rounded-xl font-medium text-sm shadow-md"
          >
            <Mic size={18} /> Započni snimanje
          </button>
        )}

        {isRecording && (
          <button
            onClick={stopRecording}
            className="flex items-center gap-2 px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 transition rounded-xl font-medium text-sm text-red-400 border border-red-500/30 shadow-md"
          >
            <Square size={18} /> Zaustavi snimanje
          </button>
        )}

        {audioUrl && (
          <>
            <audio src={audioUrl} controls className="h-10 w-full rounded" />
            <button
              onClick={resetRecording}
              className="p-2.5 text-neutral-400 hover:text-white bg-neutral-800 rounded-xl transition"
              title="Obriši i snimi ponovo"
            >
              <RotateCcw size={18} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};