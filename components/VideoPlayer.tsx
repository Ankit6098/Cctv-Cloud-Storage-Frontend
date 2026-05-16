"use client";

import { Circle, Play, Maximize, Volume2, VolumeX } from "lucide-react";
import { VideoMode } from "@/lib/types";

interface VideoPlayerProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  mode: VideoMode;
  isDarkTheme: boolean;
  isLoadingVideo: boolean;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
  videoDuration: number;
  videoCurrentTime: number;
  handleSeek: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setIsSeeking: (seeking: boolean) => void;
  toggleFullscreen: () => void;
}

export function VideoPlayer({
  videoRef,
  mode,
  isDarkTheme,
  isLoadingVideo,
  isMuted,
  setIsMuted,
  videoDuration,
  videoCurrentTime,
  handleSeek,
  setIsSeeking,
  toggleFullscreen,
}: VideoPlayerProps) {
  const formatDuration = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div
      className={`relative w-full h-full aspect-video rounded-2xl overflow-hidden border ${
        isDarkTheme ? "bg-black border-white/10" : "bg-slate-200 border-slate-300"
      }`}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        autoPlay
        muted={isMuted}
        playsInline
      />

      {/* Loading Overlay */}
      {isLoadingVideo && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-10">
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 border-r-blue-400 animate-spin"></div>
              <div
                className="absolute inset-1 rounded-full border-4 border-transparent border-b-blue-400 border-l-blue-500 animate-spin"
                style={{
                  animationDirection: "reverse",
                  animationDuration: "1.5s",
                }}
              ></div>
              <div className="absolute inset-6 rounded-full bg-blue-500 animate-pulse"></div>
            </div>
            <p className="text-white text-sm font-semibold animate-pulse">
              Loading footage...
            </p>
          </div>
        </div>
      )}

      {/* Scanning Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]" />

      {/* Top UI Overlays */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md backdrop-blur-md border ${
            mode === "live"
              ? "bg-red-500/10 border-red-500/50 text-red-500"
              : mode === "archive"
              ? "bg-blue-500/10 border-blue-500/50 text-blue-500"
              : "bg-blue-500/10 border-blue-500/50 text-blue-500"
          }`}
        >
          <Circle
            size={8}
            fill="currentColor"
            className={mode === "live" ? "animate-pulse" : ""}
          />
          <span className="text-xs font-black tracking-widest uppercase">
            {mode === "live"
              ? "LIVE FEED"
              : mode === "archive"
              ? "ARCHIVE"
              : "PREVIEW"}
          </span>
        </div>
      </div>

      {/* Custom Controls Overlay */}
      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {/* Progress Bar (Only for preview, timeline, archive) */}
        {mode !== "live" && (
          <div className="px-6 pt-6 pb-3 group/bar">
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <input
                  type="range"
                  min="0"
                  max={videoDuration || 0}
                  value={videoCurrentTime}
                  onChange={handleSeek}
                  onMouseDown={() => setIsSeeking(true)}
                  onMouseUp={() => setIsSeeking(false)}
                  onTouchStart={() => setIsSeeking(true)}
                  onTouchEnd={() => setIsSeeking(false)}
                  className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer transition-all duration-150 hover:h-2 group-hover/bar:h-2"
                  style={{
                    background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${
                      videoDuration ? (videoCurrentTime / videoDuration) * 100 : 0
                    }%, rgba(255,255,255,0.2) ${
                      videoDuration ? (videoCurrentTime / videoDuration) * 100 : 0
                    }%, rgba(255,255,255,0.2) 100%)`,
                  }}
                />
                {/* Animated progress glow */}
                <div
                  className="absolute top-1/2 h-1 bg-gradient-to-r from-blue-500 via-blue-400 to-transparent rounded-full blur-lg opacity-50 pointer-events-none transition-all duration-150"
                  style={{
                    left: "0%",
                    width: `${
                      videoDuration ? (videoCurrentTime / videoDuration) * 100 : 0
                    }%`,
                    transform: "translateY(-50%)",
                  }}
                ></div>
              </div>
              <span className="text-xs font-mono text-white whitespace-nowrap transition-all duration-200 font-semibold">
                {formatDuration(videoCurrentTime)} / {formatDuration(videoDuration)}
              </span>
            </div>
          </div>
        )}

        {/* Control Buttons */}
        <div className="px-6 pb-6 pt-2 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                if (videoRef.current) {
                  if (videoRef.current.paused) {
                    videoRef.current.play().catch(() => {});
                  } else {
                    videoRef.current.pause();
                  }
                }
              }}
              className="cursor-pointer p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 hover:scale-110 active:scale-95"
              title={videoRef.current?.paused ? "Play" : "Pause"}
            >
              {videoRef.current?.paused ? (
                <Play size={18} fill="white" className="animate-pulse" />
              ) : (
                <Play size={18} />
              )}
            </button>
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="cursor-pointer p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 hover:scale-110 active:scale-95"
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white transition-all duration-200">
                PRIMARY_CAM_01
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleFullscreen}
              className="cursor-pointer p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 hover:scale-110 active:scale-95"
              title="Fullscreen"
            >
              <Maximize size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
