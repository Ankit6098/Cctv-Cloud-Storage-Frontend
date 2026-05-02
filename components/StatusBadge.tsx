"use client";

import { Circle } from "lucide-react";
import { VideoMode } from "@/lib/types";

interface StatusBadgeProps {
  mode: VideoMode;
  isDarkTheme: boolean;
}

export function StatusBadge({ mode, isDarkTheme }: StatusBadgeProps) {
  const isLive = mode === "live";

  return (
    <div
      className={`flex items-center gap-2 px-3 py-1.5 rounded-md backdrop-blur-md border ${
        isLive
          ? "bg-red-500/10 border-red-500/50 text-red-500"
          : "bg-blue-500/10 border-blue-500/50 text-blue-500"
      }`}
    >
      <Circle
        size={8}
        fill="currentColor"
        className={isLive ? "animate-pulse" : ""}
      />
      <span className="text-xs font-black tracking-widest">
        {isLive ? "LIVE FEED" : "PREVIEW"}
      </span>
    </div>
  );
}
