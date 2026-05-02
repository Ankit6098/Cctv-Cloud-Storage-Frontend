"use client";

import { useRef } from "react";
import { LoadingOverlay } from "./LoadingOverlay";
import { StatusBadge } from "./StatusBadge";
import { ProgressBar } from "./ProgressBar";
import { VideoControls } from "./VideoControls";
import { VideoMode } from "@/lib/types";

interface VideoPlayerProps {
  mode: VideoMode;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isLoading: boolean;
  isDarkTheme: boolean;
  isMuted: boolean;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  onMute: () => void;
  onPlayPause: () => void;
  onFullscreen: () => void;
  onSeek: (time: number) => void;
  onSeekStart: () => void;
  onSeekEnd: () => void;
  showControls?: boolean;
}

export function VideoPlayer({
  mode,
  videoRef,
  isLoading,
  isDarkTheme,
  isMuted,
  isPlaying,
  currentTime,
  duration,
  onMute,
  onPlayPause,
  onFullscreen,
  onSeek,
  onSeekStart,
  onSeekEnd,
  showControls = true,
}: VideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className={`relative aspect-video rounded-2xl overflow-hidden border group ${
        isDarkTheme
          ? "bg-black border-white/10"
          : "bg-slate-200 border-slate-300"
      }`}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        autoPlay
        muted={isMuted}
        playsInline
      />

      <LoadingOverlay isLoading={isLoading} />

      {/* Scanning Overlay (Aesthetic) */}
      <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]" />

      {/* Top UI Overlays */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <StatusBadge mode={mode} isDarkTheme={isDarkTheme} />
      </div>

      {/* Custom Controls Overlay */}
      {showControls && (
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {/* Progress Bar - Only show for preview/timeline/archive */}
          {(mode === "preview" ||
            mode === "timeline" ||
            mode === "archive") && (
            <ProgressBar
              currentTime={currentTime}
              duration={duration}
              isDarkTheme={isDarkTheme}
              onSeek={onSeek}
              onSeekStart={onSeekStart}
              onSeekEnd={onSeekEnd}
            />
          )}

          {/* Control Buttons */}
          <VideoControls
            isPlaying={!isPlaying}
            isMuted={isMuted}
            isDarkTheme={isDarkTheme}
            onPlayPause={onPlayPause}
            onToggleMute={onMute}
            onFullscreen={onFullscreen}
          />
        </div>
      )}
    </div>
  );
}
