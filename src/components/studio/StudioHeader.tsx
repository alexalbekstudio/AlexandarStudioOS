"use client";

import React from "react";
import { ChevronLeft } from "lucide-react";

interface StudioHeaderProps {
  uiLang: "sr" | "en";
  setUiLang: (lang: "sr" | "en") => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  t: any;
}

export const StudioHeader: React.FC<StudioHeaderProps> = ({
  uiLang,
  setUiLang,
  sidebarOpen,
  setSidebarOpen,
  t,
}) => {
  return (
    <header className="h-16 border-b border-neutral-800 px-6 flex items-center justify-between shrink-0 bg-neutral-900/40 backdrop-blur">
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-black tracking-tight bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
          {t.appTitle}
        </h1>
        <span className="text-xs text-neutral-500 hidden sm:inline">| {t.appSubtitle}</span>
      </div>

      <div className="flex items-center gap-4">
        {/* Odabir jezika aplikacije */}
        <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-xl p-1">
          <button
            onClick={() => setUiLang("sr")}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition ${
              uiLang === "sr" ? "bg-blue-600 text-white" : "text-neutral-400 hover:text-white"
            }`}
          >
            SR
          </button>
          <button
            onClick={() => setUiLang("en")}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition ${
              uiLang === "en" ? "bg-blue-600 text-white" : "text-neutral-400 hover:text-white"
            }`}
          >
            EN
          </button>
        </div>

        {/* Status sustava */}
        <div className="flex items-center gap-2 px-3 py-1 bg-neutral-900 border border-neutral-800 rounded-full text-xs font-mono text-neutral-300">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="hidden md:inline">{t.engineReady}</span>
        </div>

        {/* Otvaranje skrivenog izbornika */}
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-xl transition text-neutral-300"
            title={t.studioTools}
          >
            <ChevronLeft size={18} />
          </button>
        )}
      </div>
    </header>
  );
};