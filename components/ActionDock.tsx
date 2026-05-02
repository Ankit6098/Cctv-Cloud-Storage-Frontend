"use client";

import { Activity, Play, History, Loader2 } from "lucide-react";
import { VideoMode } from "@/lib/types";

interface ActionDockProps {
  mode: VideoMode;
  isDarkTheme: boolean;
  isLoadingTimeline: boolean;
  onModeChange: (mode: VideoMode) => void;
}

export function ActionDock({
  mode,
  isDarkTheme,
  isLoadingTimeline,
  onModeChange,
}: ActionDockProps) {
  return (
    <div className="mt-4 flex justify-center">
      <div
        className={`border p-1.5 rounded-2xl flex gap-1 backdrop-blur-xl ${
          isDarkTheme
            ? "bg-white/5 border-white/10"
            : "bg-slate-300/30 border-slate-400"
        }`}
      >
        <button
          onClick={() => onModeChange("live")}
          className={`cursor-pointer flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all ${
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
          onClick={() => onModeChange("timeline")}
          disabled={isLoadingTimeline}
          className={`cursor-pointer flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all ${
            mode === "timeline"
              ? isDarkTheme
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                : "bg-blue-500 text-white shadow-lg shadow-blue-500/20"
              : isDarkTheme
                ? "hover:bg-white/5 text-slate-400"
                : "hover:bg-slate-300 text-slate-700"
          } ${isLoadingTimeline && "opacity-50 cursor-wait"}`}
        >
          {isLoadingTimeline ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Play size={18} />
          )}
          {isLoadingTimeline ? "Loading..." : "Recent (Timeline)"}
        </button>

        <button
          onClick={() => onModeChange("archive")}
          className={`cursor-pointer flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all ${
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
