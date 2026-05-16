"use client";

import { useRef, useState } from "react";
import { Calendar } from "lucide-react";
import { VideoMode } from "@/lib/types";

import { Navbar } from "@/components/Navbar";
import { ActionDock } from "@/components/ActionDock";
import { TimelineScrubber } from "@/components/TimelineScrubber";
import { ArchiveModal } from "@/components/ArchiveModal";
import { VideoPlayer } from "@/components/VideoPlayer";
import { ArchiveList } from "@/components/ArchiveList";

import { useClock } from "@/hooks/useClock";
import { useTheme } from "@/hooks/useTheme";
import { useTimeline } from "@/hooks/useTimeline";
import { useArchives } from "@/hooks/useArchives";
import { useVideoPlayer } from "@/hooks/useVideoPlayer";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Home() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Global app state
  const [mode, setMode] = useState<VideoMode>("live");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Custom Hooks
  const currentTime = useClock();
  const { isDarkTheme, setIsDarkTheme, is24HourFormat, setIs24HourFormat } = useTheme(containerRef);

  const {
    timelineRecordings,
    loadingTimeline,
    currentRecordingIndex,
    setCurrentRecordingIndex,
    loadingPreview,
    handlePreview,
  } = useTimeline(setMode);

  const {
    archives,
    loadingArchives,
    showArchiveBrowser,
    setShowArchiveBrowser,
    selectedFileId,
    handleOpenArchiveBrowser,
    handleSelectArchiveFile,
  } = useArchives(setMode);

  const {
    videoRef,
    isLoadingVideo,
    isMuted,
    setIsMuted,
    videoDuration,
    videoCurrentTime,
    handleSeek,
    setIsSeeking,
    toggleFullscreen,
  } = useVideoPlayer({
    mode,
    previewUrl,
    timelineRecordings,
    currentRecordingIndex,
    selectedFileId,
    containerRef,
  });

  return (
    <div
      ref={containerRef}
      className={`min-h-screen font-sans selection:bg-blue-500/30 transition-colors ${isDarkTheme ? "bg-[#0a0a0c] text-slate-200" : "bg-slate-100 text-slate-900"
        }`}
    >
      <Navbar
        currentTime={currentTime}
        isDarkTheme={isDarkTheme}
        is24HourFormat={is24HourFormat}
        onThemeChange={setIsDarkTheme}
        onTimeFormatChange={setIs24HourFormat}
      />

      {/* Mobile Mode Selector */}
      <div className="md:hidden px-4 pt-4">
        <Select
          value={mode}
          onValueChange={(val: any) => {
            const videoMode = val as VideoMode;

            if (videoMode === "live") {
              setMode("live");
            } else if (videoMode === "timeline") {
              handlePreview();
            } else if (videoMode === "archive") {
              handleOpenArchiveBrowser();
            }
          }}
        >
          <SelectTrigger
            className={`
        w-full h-12
        px-4
        rounded-xl
        text-sm font-semibold
        flex items-center justify-between
        shadow-none
        ring-0 ring-offset-0
        focus:outline-none
        focus:ring-0
        focus-visible:outline-none
        focus-visible:ring-0
        focus-visible:ring-transparent
        data-[state=open]:ring-0
        ${isDarkTheme
                ? "bg-slate-900/50 border border-white/10 text-white"
                : "bg-white border border-slate-300 text-slate-900"
              }
      `}
          >
            <SelectValue placeholder="Select Mode" />
          </SelectTrigger>

          <SelectContent
            className={`
        rounded-xl p-1 shadow-lg
        ${isDarkTheme
                ? "bg-slate-900 border border-white/10 text-white"
                : "bg-white border border-slate-300 text-slate-900"
              }
      `}
          >
            <SelectItem
              value="live"
              className="
          
          rounded-lg
          flex items-center
          text-sm
          pl-3 pr-8
          cursor-pointer
        "
            >
              Live Monitor
            </SelectItem>

            <SelectItem
              value="timeline"
              className="
         
          rounded-lg
          flex items-center
          text-sm
          pl-3 pr-8
          cursor-pointer
        "
            >
              Recent (Timeline)
            </SelectItem>

            <SelectItem
              value="archive"
              className="
          
          rounded-lg
          flex items-center
          text-sm
          pl-3 pr-8
          cursor-pointer
        "
            >
              Archives
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <main className="max-w-[1600px] mx-auto p-4 md:p-8">
        <div className="relative group">
          {mode === "archive" ? (
            <div className="flex flex-col lg:flex-row gap-4 w-full">
              <div className="w-full lg:w-[70%] h-[40vh] md:h-[50vh] lg:h-[60vh]">
                <VideoPlayer
                  videoRef={videoRef}
                  mode={mode}
                  isDarkTheme={isDarkTheme}
                  isLoadingVideo={isLoadingVideo}
                  isMuted={isMuted}
                  setIsMuted={setIsMuted}
                  videoDuration={videoDuration}
                  videoCurrentTime={videoCurrentTime}
                  handleSeek={handleSeek}
                  setIsSeeking={setIsSeeking}
                  toggleFullscreen={toggleFullscreen}
                />
              </div>
              <div
                className={`w-full lg:w-[30%] border rounded-2xl h-[40vh] md:h-[50vh] lg:h-[60vh] flex flex-col ${isDarkTheme ? "bg-slate-950 border-white/10" : "bg-white border-slate-300"
                  }`}
              >
                <div
                  className={`flex justify-between items-center py-4 px-6 border-b ${isDarkTheme ? "border-white/5" : "border-slate-300"
                    }`}
                >
                  <h2
                    className={`text-sm font-bold flex items-center gap-2 ${isDarkTheme ? "text-white" : "text-slate-900"
                      }`}
                  >
                    <Calendar
                      size={24}
                      className={isDarkTheme ? "text-blue-500" : "text-blue-600"}
                    />
                    Archive Footage
                  </h2>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <ArchiveList
                    archives={archives}
                    loadingArchives={loadingArchives}
                    isDarkTheme={isDarkTheme}
                    handleSelectArchiveFile={handleSelectArchiveFile}
                  />
                </div>
              </div>
            </div>
          ) : (
            <VideoPlayer
              videoRef={videoRef}
              mode={mode}
              isDarkTheme={isDarkTheme}
              isLoadingVideo={isLoadingVideo}
              isMuted={isMuted}
              setIsMuted={setIsMuted}
              videoDuration={videoDuration}
              videoCurrentTime={videoCurrentTime}
              handleSeek={handleSeek}
              setIsSeeking={setIsSeeking}
              toggleFullscreen={toggleFullscreen}
            />
          )}

          <ActionDock
            mode={mode}
            setMode={setMode}
            isDarkTheme={isDarkTheme}
            loadingPreview={loadingPreview}
            loadingTimeline={loadingTimeline}
            handlePreview={handlePreview}
            handleOpenArchiveBrowser={handleOpenArchiveBrowser}
          />

          <TimelineScrubber
            mode={mode}
            isDarkTheme={isDarkTheme}
            timelineRecordings={timelineRecordings}
            currentRecordingIndex={currentRecordingIndex}
            setCurrentRecordingIndex={setCurrentRecordingIndex}
          />
        </div>
      </main>

      <ArchiveModal
        showArchiveBrowser={showArchiveBrowser}
        setShowArchiveBrowser={setShowArchiveBrowser}
        archives={archives}
        loadingArchives={loadingArchives}
        isDarkTheme={isDarkTheme}
        handleSelectArchiveFile={handleSelectArchiveFile}
      />

      <footer
        className={`fixed bottom-1 w-full text-center pointer-events-none ${isDarkTheme ? "text-slate-600" : "text-slate-500"
          }`}
      >
        <p
          className={`text-[10px] uppercase tracking-[0.1em] font-bold inline-block px-3 py-1 rounded-full backdrop-blur-md ${isDarkTheme ? "bg-black/20" : "bg-white/20"
            }`}
        >
          System Status: <span className="text-emerald-500">Nominal</span>
        </p>
      </footer>
    </div>
  );
}
