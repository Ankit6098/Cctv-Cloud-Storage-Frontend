"use client";

import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import {
  Circle,
  Play,
  History,
  Maximize,
  Volume2,
  VolumeX,
  ShieldCheck,
  Settings,
  Activity,
} from "lucide-react";
import { TbDeviceCctv } from "react-icons/tb";


export default function Home() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [mode, setMode] = useState<"live" | "preview">("live");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Clock Logic
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // HLS Setup
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls: Hls | null = null;
    const streamUrl =
      mode === "live" ? "http://localhost:5000/stream/index.m3u8" : previewUrl;

    if (!streamUrl) return;

    if (Hls.isSupported()) {
      hls = new Hls({
        lowLatencyMode: mode === "live",
        maxBufferLength: 2,
        backBufferLength: 2,
        enableWorker: true,
      });

      hls.attachMedia(video);
      hls.on(Hls.Events.MEDIA_ATTACHED, () => {
        hls?.loadSource(streamUrl);
      });

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(() => {});
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = streamUrl;
      video.play().catch(() => {});
    }

    return () => hls?.destroy();
  }, [mode, previewUrl]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handlePreview = async () => {
    setLoadingPreview(true);
    try {
      const res = await fetch("http://localhost:5000/api/old-recording");
      const data = await res.json();
      if (data.url) {
        setMode("preview");
        setPreviewUrl(data.url);
      }
    } catch (err) {
      console.error("Failed to load archive");
    } finally {
      setLoadingPreview(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-[#0a0a0c] text-slate-200 font-sans selection:bg-blue-500/30"
    >
      {/* Top Navigation Bar */}
      <nav className="border-b border-white/5 bg-black/20 backdrop-blur-md px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg">
            <TbDeviceCctv size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold uppercase tracking-widest text-white">
              Cctv Monitor
            </h1>
            <p className="text-[10px] text-slate-500 font-mono">
              NODE_TX_042 // SECURE_LINE
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex flex-col items-end font-mono">
            <span className="text-sm font-bold text-slate-300">
              {currentTime.toLocaleTimeString([], { hour12: false })}
            </span>
            <span className="text-[10px] text-slate-500">
              {currentTime.toLocaleDateString(undefined, {
                weekday: "short",
                day: "2-digit",
                month: "short",
              })}
            </span>
          </div>
          <Settings
            size={18}
            className="text-slate-500 hover:text-white cursor-pointer transition"
          />
        </div>
      </nav>

      <main className="max-w-[1600px] mx-auto p-4 md:p-8">
        <div className="relative group">
          {/* Video Container */}
          <div className="relative aspect-video bg-black rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)]">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              autoPlay
              muted={isMuted}
              playsInline
            />

            {/* Scanning Overlay (Aesthetic) */}
            <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]" />

            {/* Top UI Overlays */}
            <div className="absolute top-6 right-6 flex flex-col gap-2">
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md backdrop-blur-md border ${
                  mode === "live"
                    ? "bg-red-500/10 border-red-500/50 text-red-500"
                    : "bg-blue-500/10 border-blue-500/50 text-blue-500"
                }`}
              >
                <Circle
                  size={8}
                  fill="currentColor"
                  className={mode === "live" ? "animate-pulse" : ""}
                />
                <span className="text-xs font-black tracking-widest">
                  {mode === "live" ? "LIVE FEED" : "ARCHIVE"}
                </span>
              </div>
            </div>

            {/* Bottom Controls Overlay */}
            <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="cursor-pointer p-2.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition"
                  >
                    {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                  </button>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold">PRIMARY_CAM_01</span>
                    {/* <span className="text-[10px] text-slate-400 font-mono">
                      192.168.1.104
                    </span> */}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleFullscreen}
                    className="cursor-pointer p-2.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition"
                  >
                    <Maximize size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Action Dock */}
          <div className="mt-8 flex justify-center">
            <div className="bg-white/5 border border-white/10 p-1.5 rounded-2xl flex gap-1 backdrop-blur-xl">
              <button
                onClick={() => setMode("live")}
                className={`cursor-pointer flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all ${
                  mode === "live"
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                    : "hover:bg-white/5 text-slate-400"
                }`}
              >
                <Activity size={18} />
                Live Monitor
              </button>

              <button
                onClick={handlePreview}
                disabled={loadingPreview}
                className={`cursor-pointer flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all ${
                  mode === "preview"
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                    : "hover:bg-white/5 text-slate-400"
                } ${loadingPreview && "opacity-50 cursor-wait"}`}
              >
                <History size={18} />
                {loadingPreview ? "Accessing..." : "View Archive"}
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer className="fixed bottom-2 w-full text-center pointer-events-none">
        <p className="text-[10px] uppercase tracking-[0.1em] text-slate-600 font-bold">
          System Status: <span className="text-emerald-500">Nominal</span>
        </p>
      </footer>
    </div>
  );
}
