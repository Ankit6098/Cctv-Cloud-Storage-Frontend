"use client";

import { Play, Volume2, VolumeX, Maximize } from "lucide-react";

interface VideoControlsProps {
  isPlaying: boolean;
  isMuted: boolean;
  isDarkTheme: boolean;
  onPlayPause: () => void;
  onToggleMute: () => void;
  onFullscreen: () => void;
  cameraName?: string;
}

export function VideoControls({
  isPlaying,
  isMuted,
  isDarkTheme,
  onPlayPause,
  onToggleMute,
  onFullscreen,
  cameraName = "PRIMARY_CAM_01",
}: VideoControlsProps) {
  return (
    <div className="px-6 pb-6 pt-2 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={onPlayPause}
          className="cursor-pointer p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 hover:scale-110 active:scale-95"
          title={isPlaying ? "Pause" : "Play"}
        >
          {!isPlaying ? (
            <Play size={18} fill="white" className="animate-pulse" />
          ) : (
            <Play size={18} />
          )}
        </button>
        <button
          onClick={onToggleMute}
          className="cursor-pointer p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 hover:scale-110 active:scale-95"
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
        <div className="flex flex-col">
          <span className="text-xs font-bold text-white transition-all duration-200">
            {cameraName}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onFullscreen}
          className="cursor-pointer p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 hover:scale-110 active:scale-95"
          title="Fullscreen"
        >
          <Maximize size={18} />
        </button>
      </div>
    </div>
  );
}
