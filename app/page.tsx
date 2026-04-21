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
  ChevronLeft,
  Calendar,
  FileVideo,
  Clock,
  Download,
  X,
  Moon,
  Sun,
} from "lucide-react";
import { TbDeviceCctv } from "react-icons/tb";

interface ArchiveFile {
  id: string;
  name: string;
  size: number;
  createdTime: string;
}

interface ArchiveDay {
  date: string;
  fileCount: number;
  files: ArchiveFile[];
}

export default function Home() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [mode, setMode] = useState<"live" | "preview" | "archive">("live");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showArchiveBrowser, setShowArchiveBrowser] = useState(false);
  const [archives, setArchives] = useState<ArchiveDay[]>([]);
  const [loadingArchives, setLoadingArchives] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [isLoadingVideo, setIsLoadingVideo] = useState(false);
  const [videoDuration, setVideoDuration] = useState(0);
  const [videoCurrentTime, setVideoCurrentTime] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);

  // Clock Logic
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Apply theme
  useEffect(() => {
    if (isDarkTheme) {
      containerRef.current?.classList.remove("bg-slate-100", "text-slate-900");
      containerRef.current?.classList.add("bg-[#0a0a0c]", "text-slate-200");
    } else {
      containerRef.current?.classList.remove("bg-[#0a0a0c]", "text-slate-200");
      containerRef.current?.classList.add("bg-slate-100", "text-slate-900");
    }
  }, [isDarkTheme]);

  // HLS Setup for Live Stream or MP4 for Archive
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls: Hls | null = null;

    if (mode === "live") {
      const streamUrl = "http://localhost:5000/stream/index.m3u8";

      if (Hls.isSupported()) {
        hls = new Hls({
          lowLatencyMode: true,
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
    } else if (mode === "preview" && previewUrl) {
      // Native MP4 playback for preview
      setIsLoadingVideo(true);
      video.src = previewUrl;

      const handleCanPlay = () => {
        setIsLoadingVideo(false);
        video.play().catch(() => {});
      };

      video.addEventListener("canplay", handleCanPlay);
      return () => video.removeEventListener("canplay", handleCanPlay);
    } else if (mode === "archive" && selectedFileId) {
      // Stream archive from Google Drive
      setIsLoadingVideo(true);
      const archiveUrl = `http://localhost:5000/api/stream-archive/${selectedFileId}`;
      video.src = archiveUrl;

      const handleCanPlay = () => {
        setIsLoadingVideo(false);
        video.play().catch(() => {});
      };

      video.addEventListener("canplay", handleCanPlay);
      return () => video.removeEventListener("canplay", handleCanPlay);
    }

    return () => hls?.destroy();
  }, [mode, previewUrl, selectedFileId]);

  // Update video time and duration
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setVideoDuration(video.duration);
    };

    const handleTimeUpdate = () => {
      if (!isSeeking) {
        setVideoCurrentTime(video.currentTime);
      }
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [isSeeking]);

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
      console.error("Failed to load preview");
    } finally {
      setLoadingPreview(false);
    }
  };

  const loadArchives = async (startDate?: string, endDate?: string) => {
    setLoadingArchives(true);
    try {
      let url = "http://localhost:5000/api/archive";
      const params = new URLSearchParams();
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);
      if (params.toString()) url += "?" + params.toString();

      const res = await fetch(url);
      const data = await res.json();
      if (data.archives) {
        setArchives(data.archives);
      }
    } catch (err) {
      console.error("Failed to load archives:", err);
    } finally {
      setLoadingArchives(false);
    }
  };

  const handleOpenArchiveBrowser = () => {
    setShowArchiveBrowser(true);
    loadArchives();
  };

  const handleSelectArchiveFile = (fileId: string) => {
    setSelectedFileId(fileId);
    setMode("archive");
    setShowArchiveBrowser(false);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatDuration = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setVideoCurrentTime(newTime);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`min-h-screen font-sans selection:bg-blue-500/30 transition-colors ${
        isDarkTheme
          ? "bg-[#0a0a0c] text-slate-200"
          : "bg-slate-100 text-slate-900"
      }`}
    >
      {/* Top Navigation Bar */}
      <nav
        className={`border-b px-6 py-4 flex justify-between items-center backdrop-blur-md ${
          isDarkTheme
            ? "border-white/5 bg-black/20"
            : "border-slate-300 bg-white/20"
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-lg ${
              isDarkTheme ? "bg-blue-600" : "bg-blue-500"
            }`}
          >
            <TbDeviceCctv size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold uppercase tracking-widest">
              Cctv Monitor
            </h1>
            <p
              className={`text-[10px] font-mono ${
                isDarkTheme ? "text-slate-500" : "text-slate-600"
              }`}
            >
              NODE_TX_042 // SECURE_LINE
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex flex-col items-end font-mono">
            <span className="text-sm font-bold">
              {currentTime.toLocaleTimeString([], { hour12: false })}
            </span>
            <span
              className={`text-[10px] ${
                isDarkTheme ? "text-slate-500" : "text-slate-600"
              }`}
            >
              {currentTime.toLocaleDateString(undefined, {
                weekday: "short",
                day: "2-digit",
                month: "short",
              })}
            </span>
          </div>

          {/* Settings Menu */}
          <div className="relative">
            <button
              onClick={() => setShowThemeMenu(!showThemeMenu)}
              className={`p-2 rounded-lg transition ${
                isDarkTheme
                  ? "hover:bg-white/10 text-slate-500 hover:text-white"
                  : "hover:bg-slate-300 text-slate-700"
              }`}
            >
              <Settings size={18} />
            </button>

            {showThemeMenu && (
              <div
                className={`absolute w-[150px] right-0 mt-2 rounded-lg border shadow-lg z-40 overflow-hidden ${
                  isDarkTheme
                    ? "bg-slate-900 border-white/10"
                    : "bg-white border-slate-300"
                }`}
              >
                <button
                  onClick={() => {
                    setIsDarkTheme(true);
                    setShowThemeMenu(false);
                  }}
                  className={`w-full text-xs px-4 py-2 flex items-center gap-2 transition ${
                    isDarkTheme
                      ? "bg-blue-600 text-white"
                      : "hover:bg-slate-100 text-slate-900"
                  }`}
                >
                  <Moon size={14} />
                  Dark Theme
                </button>
                <button
                  onClick={() => {
                    setIsDarkTheme(false);
                    setShowThemeMenu(false);
                  }}
                  className={`w-full text-xs px-4 py-2 flex items-center gap-2 transition ${
                    !isDarkTheme
                      ? "bg-blue-500 text-white"
                      : "hover:bg-slate-700 text-slate-300"
                  }`}
                >
                  <Sun size={14} />
                  Light Theme
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-[1600px] mx-auto p-4 md:p-8">
        <div className="relative group">
          {/* Video Container */}
          <div
            className={`relative aspect-video rounded-2xl overflow-hidden border  ${
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

            {/* Loading Overlay (Single) */}
            {isLoadingVideo && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-10">
                <div className="flex flex-col items-center gap-4">
                  {/* Modern Animated Loader */}
                  <div className="relative w-16 h-16">
                    {/* Outer rotating ring */}
                    <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 border-r-blue-400 animate-spin"></div>
                    {/* Middle rotating ring (slower) */}
                    <div
                      className="absolute inset-1 rounded-full border-4 border-transparent border-b-blue-400 border-l-blue-500 animate-spin"
                      style={{
                        animationDirection: "reverse",
                        animationDuration: "1.5s",
                      }}
                    ></div>
                    {/* Center pulsing dot */}
                    <div className="absolute inset-6 rounded-full bg-blue-500 animate-pulse"></div>
                  </div>
                  <p className="text-white text-sm font-semibold animate-pulse">
                    Loading footage...
                  </p>
                </div>
              </div>
            )}

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
              {/* Progress Bar */}
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
                            videoDuration
                              ? (videoCurrentTime / videoDuration) * 100
                              : 0
                          }%, rgba(255,255,255,0.2) ${
                            videoDuration
                              ? (videoCurrentTime / videoDuration) * 100
                              : 0
                          }%, rgba(255,255,255,0.2) 100%)`,
                        }}
                      />
                      {/* Animated progress glow */}
                      <div
                        className="absolute top-1/2 h-1 bg-gradient-to-r from-blue-500 via-blue-400 to-transparent rounded-full blur-lg opacity-50 pointer-events-none transition-all duration-150"
                        style={{
                          left: "0%",
                          width: `${videoDuration ? (videoCurrentTime / videoDuration) * 100 : 0}%`,
                          transform: "translateY(-50%)",
                        }}
                      ></div>
                    </div>
                    <span className="text-xs font-mono text-white whitespace-nowrap transition-all duration-200 font-semibold">
                      {formatDuration(videoCurrentTime)} /{" "}
                      {formatDuration(videoDuration)}
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

          {/* Action Dock */}
          <div className="mt-4 flex justify-center">
            <div
              className={`border p-1.5 rounded-2xl flex gap-1 backdrop-blur-xl ${
                isDarkTheme
                  ? "bg-white/5 border-white/10"
                  : "bg-slate-300/30 border-slate-400"
              }`}
            >
              <button
                onClick={() => setMode("live")}
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
                onClick={handlePreview}
                disabled={loadingPreview}
                className={`cursor-pointer flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all ${
                  mode === "preview"
                    ? isDarkTheme
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                      : "bg-blue-500 text-white shadow-lg shadow-blue-500/20"
                    : isDarkTheme
                      ? "hover:bg-white/5 text-slate-400"
                      : "hover:bg-slate-300 text-slate-700"
                } ${loadingPreview && "opacity-50 cursor-wait"}`}
              >
                <Play size={18} />
                {loadingPreview ? "Accessing..." : "Recent"}
              </button>

              <button
                onClick={handleOpenArchiveBrowser}
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
        </div>
      </main>

      {/* Archive Browser Modal */}
      {showArchiveBrowser && (
        <div
          className={`fixed inset-0 flex items-center justify-center z-50 p-4 ${
            isDarkTheme
              ? "bg-black/80 backdrop-blur-sm"
              : "bg-slate-900/80 backdrop-blur-sm"
          }`}
        >
          <div
            className={`border rounded-2xl max-w-4xl w-full max-h-[80vh] flex flex-col ${
              isDarkTheme
                ? "bg-slate-950 border-white/10"
                : "bg-white border-slate-300"
            }`}
          >
            {/* Header */}
            <div
              className={`flex justify-between items-center py-4 px-6 border-b ${
                isDarkTheme ? "border-white/5" : "border-slate-300"
              }`}
            >
              <h2
                className={`text-lg font-bold flex items-center gap-2 ${
                  isDarkTheme ? "text-white" : "text-slate-900"
                }`}
              >
                <Calendar
                  size={24}
                  className={isDarkTheme ? "text-blue-500" : "text-blue-600"}
                />
                Archive Footage
              </h2>
              <button
                onClick={() => setShowArchiveBrowser(false)}
                className={`p-2 rounded-lg transition ${
                  isDarkTheme ? "hover:bg-white/10" : "hover:bg-slate-200"
                }`}
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {loadingArchives ? (
                <div className="flex items-center justify-center h-64">
                  <div className="relative w-10 h-10">
                    {/* Outer rotating ring */}
                    <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 border-r-blue-400 animate-spin"></div>
                    {/* Middle rotating ring (slower) */}
                    <div
                      className="absolute inset-1 rounded-full border-4 border-transparent border-b-blue-400 border-l-blue-500 animate-spin"
                      style={{
                        animationDirection: "reverse",
                        animationDuration: "1.5s",
                      }}
                    ></div>
                    {/* Center pulsing dot */}
                    <div className="absolute inset-6 rounded-full bg-blue-500 animate-pulse"></div>
                  </div>
                </div>
              ) : archives.length === 0 ? (
                <div
                  className={`flex items-center justify-center h-64 ${
                    isDarkTheme ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  <p>No archive footage available</p>
                </div>
              ) : (
                <div
                  className={`divide-y ${
                    isDarkTheme ? "divide-white/5" : "divide-slate-300"
                  }`}
                >
                  {archives.map((day) => (
                    <div key={day.date} className="p-6">
                      <h3
                        className={`text-sm font-semibold mb-4 flex items-center gap-2 ${
                          isDarkTheme ? "text-white" : "text-slate-900"
                        }`}
                      >
                        <Calendar
                          size={18}
                          className={
                            isDarkTheme ? "text-blue-500" : "text-blue-600"
                          }
                        />
                        {new Date(day.date).toLocaleDateString(undefined, {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                        <span
                          className={`text-sm ml-2 ${
                            isDarkTheme ? "text-slate-400" : "text-slate-600"
                          }`}
                        >
                          ({day.fileCount} files)
                        </span>
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {day.files.map((file) => (
                          <button
                            key={file.id}
                            onClick={() => handleSelectArchiveFile(file.id)}
                            className={`cursor-pointer p-4 border rounded-lg transition text-left group ${
                              isDarkTheme
                                ? "bg-white/5 hover:bg-white/10 border-white/10"
                                : "bg-slate-100 hover:bg-slate-200 border-slate-300"
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-3 flex-1">
                                <FileVideo
                                  size={20}
                                  className={`mt-1 flex-shrink-0 ${
                                    isDarkTheme
                                      ? "text-blue-500"
                                      : "text-blue-600"
                                  }`}
                                />
                                <div className="flex-1">
                                  <p
                                    className={`font-semibold text-sm truncate ${
                                      isDarkTheme
                                        ? "text-white"
                                        : "text-slate-900"
                                    }`}
                                  >
                                    {file.name}
                                  </p>
                                  <div
                                    className={`flex items-center gap-2 text-xs mt-1 ${
                                      isDarkTheme
                                        ? "text-slate-400"
                                        : "text-slate-600"
                                    }`}
                                  >
                                    <Clock size={14} />
                                    {formatTime(file.createdTime)}
                                  </div>
                                  <p
                                    className={`text-xs mt-1 ${
                                      isDarkTheme
                                        ? "text-slate-500"
                                        : "text-slate-700"
                                    }`}
                                  >
                                    {formatFileSize(file.size)}
                                  </p>
                                </div>
                              </div>
                              <Play
                                size={18}
                                className={`flex-shrink-0 mt-1 transition ${
                                  isDarkTheme
                                    ? "text-slate-400 group-hover:text-blue-500"
                                    : "text-slate-600 group-hover:text-blue-600"
                                }`}
                              />
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <footer
        className={`fixed bottom-1 w-full text-center pointer-events-none ${
          isDarkTheme ? "text-slate-600" : "text-slate-500"
        }`}
      >
        <p
          className={`text-[10px] uppercase tracking-[0.1em] font-bold inline-block px-3 py-1 rounded-full backdrop-blur-md ${
            isDarkTheme ? "bg-black/20" : "bg-white/20"
          }`}
        >
          System Status: <span className="text-emerald-500">Nominal</span>
        </p>
      </footer>
    </div>
  );
}
