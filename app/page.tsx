"use client";

import { useEffect, useRef, useState } from "react";
import {
  Navbar,
  VideoPlayer,
  ActionDock,
  ArchiveBrowser,
  TimelineScrubber,
} from "@/components";
import { useHLSStream, useArchiveData, useTimelineData } from "@/hooks";
import { VideoMode } from "@/lib/types";

export default function Home() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // UI State
  const [mode, setMode] = useState<VideoMode>("live");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [is24HourFormat, setIs24HourFormat] = useState(false);

  // Video State
  const [isLoadingVideo, setIsLoadingVideo] = useState(false);
  const [videoDuration, setVideoDuration] = useState(0);
  const [videoCurrentTime, setVideoCurrentTime] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);

  // Archive State
  const {
    archives,
    loadingArchives,
    loadArchives: loadArchiveData,
  } = useArchiveData();
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);

  // Timeline State
  const {
    timelineRecordings,
    loadingTimeline,
    loadTimeline: loadTimelineData,
  } = useTimelineData();
  const [currentRecordingIndex, setCurrentRecordingIndex] = useState(0);

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

  // HLS Stream Management Hook
  useHLSStream({
    videoRef,
    mode,
    selectedFileId,
    timelineRecordings,
    currentRecordingIndex,
    onLoadingStart: () => setIsLoadingVideo(true),
    onLoadingEnd: () => setIsLoadingVideo(false),
  });

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

  // Handlers
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleModeChange = async (newMode: VideoMode) => {
    if (newMode === "timeline") {
      await loadTimelineData();
      setMode("timeline");
      setCurrentRecordingIndex(0);
    } else if (newMode === "archive") {
      await loadArchiveData();
      setMode("archive");
    } else {
      setMode(newMode);
    }
  };

  const handleSelectArchiveFile = (fileId: string) => {
    setSelectedFileId(fileId);
    setMode("archive");
  };

  const handleSeek = (value: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = value;
      setVideoCurrentTime(value);
    }
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  };

  const isPlaying = videoRef.current?.paused ?? true;

  return (
    <div
      ref={containerRef}
      className={`min-h-screen font-sans selection:bg-blue-500/30 transition-colors ${
        isDarkTheme
          ? "bg-[#0a0a0c] text-slate-200"
          : "bg-slate-100 text-slate-900"
      }`}
    >
      {/* Navigation Bar */}
      <Navbar
        currentTime={currentTime}
        isDarkTheme={isDarkTheme}
        is24HourFormat={is24HourFormat}
        onThemeChange={setIsDarkTheme}
        onTimeFormatChange={setIs24HourFormat}
      />

      <main className="max-w-[1600px] mx-auto p-4 md:p-8">
        <div className="relative group">
          {/* Video Container - Archive view with sidebar */}
          {mode === "archive" && selectedFileId ? (
            <div className="flex gap-4 w-full">
              <div className="w-[70%]">
                <VideoPlayer
                  mode={mode}
                  videoRef={videoRef}
                  isLoading={isLoadingVideo}
                  isDarkTheme={isDarkTheme}
                  isMuted={isMuted}
                  isPlaying={isPlaying}
                  currentTime={videoCurrentTime}
                  duration={videoDuration}
                  onMute={() => setIsMuted(!isMuted)}
                  onPlayPause={handlePlayPause}
                  onFullscreen={toggleFullscreen}
                  onSeek={handleSeek}
                  onSeekStart={() => setIsSeeking(true)}
                  onSeekEnd={() => setIsSeeking(false)}
                  showControls={true}
                />
              </div>

              {/* Archive Browser Sidebar */}
              <ArchiveBrowser
                archives={archives}
                isLoading={loadingArchives}
                isDarkTheme={isDarkTheme}
                onSelectFile={handleSelectArchiveFile}
              />
            </div>
          ) : (
            // Regular video player (Live, Timeline, Preview modes)
            <VideoPlayer
              mode={mode}
              videoRef={videoRef}
              isLoading={isLoadingVideo}
              isDarkTheme={isDarkTheme}
              isMuted={isMuted}
              isPlaying={isPlaying}
              currentTime={videoCurrentTime}
              duration={videoDuration}
              onMute={() => setIsMuted(!isMuted)}
              onPlayPause={handlePlayPause}
              onFullscreen={toggleFullscreen}
              onSeek={handleSeek}
              onSeekStart={() => setIsSeeking(true)}
              onSeekEnd={() => setIsSeeking(false)}
              showControls={mode !== "live"}
            />
          )}

          {/* Action Dock - Mode Selection */}
          <ActionDock
            mode={mode}
            isDarkTheme={isDarkTheme}
            isLoadingTimeline={loadingTimeline}
            onModeChange={handleModeChange}
          />

          {/* Timeline Scrubber - Only show in timeline mode */}
          {mode === "timeline" && timelineRecordings.length > 0 && (
            <TimelineScrubber
              recordings={timelineRecordings}
              currentIndex={currentRecordingIndex}
              isDarkTheme={isDarkTheme}
              onIndexChange={setCurrentRecordingIndex}
            />
          )}
        </div>
      </main>
    </div>
  );
}
