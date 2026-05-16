"use client";

import { Activity, Play, History } from "lucide-react";
import { VideoMode } from "@/lib/types";

interface ActionDockProps {
  mode: VideoMode;
  setMode: (mode: VideoMode) => void;
  isDarkTheme: boolean;
  loadingPreview: boolean;
  loadingTimeline: boolean;
  handlePreview: () => void;
  handleOpenArchiveBrowser: () => void;
}

export function ActionDock({
  mode,
  setMode,
  isDarkTheme,
  loadingPreview,
  loadingTimeline,
  handlePreview,
  handleOpenArchiveBrowser,
}: ActionDockProps) {
  return (
    <div className="mt-4 hidden md:flex justify-center">
      <div
        className={`border p-1.5 rounded-2xl flex flex-col sm:flex-row gap-1 backdrop-blur-xl ${
          isDarkTheme
            ? "bg-white/5 border-white/10"
            : "bg-slate-300/30 border-slate-400"
        }`}
      >
        <button
          onClick={() => setMode("live")}
          className={`cursor-pointer flex justify-center items-center gap-2 w-full sm:w-auto px-4 sm:px-6 py-3 rounded-xl text-sm font-semibold transition-all ${
            mode === "live"
              ? isDarkTheme
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                : "bg-blue-500 text-white shadow-lg shadow-blue-500/20"
              : isDarkTheme
              ? "hover:bg-white/5 text-slate-400"
              : "hover:bg-slate-300 text-slate-700"
          }`}
        >
          <Activity size={18} />
          Live Monitor
        </button>

        <button
          onClick={handlePreview}
          disabled={loadingPreview || loadingTimeline}
          className={`cursor-pointer flex justify-center items-center gap-2 w-full sm:w-auto px-4 sm:px-6 py-3 rounded-xl text-sm font-semibold transition-all ${
            mode === "timeline"
              ? isDarkTheme
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                : "bg-blue-500 text-white shadow-lg shadow-blue-500/20"
              : isDarkTheme
              ? "hover:bg-white/5 text-slate-400"
              : "hover:bg-slate-300 text-slate-700"
          } ${(loadingPreview || loadingTimeline) && "opacity-50 cursor-wait"}`}
        >
          <Play size={18} />
          {loadingPreview || loadingTimeline
            ? "Loading..."
            : "Recent (Timeline)"}
        </button>

        <button
          onClick={handleOpenArchiveBrowser}
          className={`cursor-pointer flex justify-center items-center gap-2 w-full sm:w-auto px-4 sm:px-6 py-3 rounded-xl text-sm font-semibold transition-all ${
            mode === "archive"
              ? isDarkTheme
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                : "bg-blue-500 text-white shadow-lg shadow-blue-500/20"
              : isDarkTheme
              ? "hover:bg-white/5 text-slate-400"
              : "hover:bg-slate-300 text-slate-700"
          }`}
        >
          <History size={18} />
          Archives
        </button>
      </div>
    </div>
  );
}
