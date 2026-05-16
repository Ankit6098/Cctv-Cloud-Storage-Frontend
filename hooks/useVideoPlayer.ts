import { useState, useEffect, useRef } from "react";
import Hls from "hls.js";
import { VideoMode, TimelineRecording } from "@/lib/types";

interface UseVideoPlayerOptions {
  mode: VideoMode;
  previewUrl: string | null;
  timelineRecordings: TimelineRecording[];
  currentRecordingIndex: number;
  selectedFileId: string | null;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export function useVideoPlayer({
  mode,
  previewUrl,
  timelineRecordings,
  currentRecordingIndex,
  selectedFileId,
  containerRef,
}: UseVideoPlayerOptions) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isLoadingVideo, setIsLoadingVideo] = useState(false);
  const [videoDuration, setVideoDuration] = useState(0);
  const [videoCurrentTime, setVideoCurrentTime] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);

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
      setIsLoadingVideo(true);
      video.src = previewUrl;

      const handleCanPlay = () => {
        setIsLoadingVideo(false);
        video.play().catch(() => {});
      };

      video.addEventListener("canplay", handleCanPlay);
      return () => video.removeEventListener("canplay", handleCanPlay);
    } else if (mode === "timeline" && timelineRecordings.length > 0) {
      setIsLoadingVideo(true);
      const currentRecording = timelineRecordings[currentRecordingIndex];

      if (currentRecording) {
        let videoUrl = currentRecording.url;
        if (currentRecording.source === "drive" && currentRecording.fileId) {
          videoUrl = `http://localhost:5000/api/stream-archive/${currentRecording.fileId}`;
        } else if (currentRecording.source === "local") {
          videoUrl = `http://localhost:5000${currentRecording.url}`;
        }

        video.src = videoUrl;

        const handleCanPlay = () => {
          setIsLoadingVideo(false);
          video.play().catch(() => {});
        };

        video.addEventListener("canplay", handleCanPlay);
        return () => video.removeEventListener("canplay", handleCanPlay);
      }
    } else if (mode === "archive" && selectedFileId) {
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
  }, [
    mode,
    previewUrl,
    selectedFileId,
    timelineRecordings,
    currentRecordingIndex,
  ]);

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

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setVideoCurrentTime(newTime);
    }
  };

  return {
    videoRef,
    isLoadingVideo,
    isMuted,
    setIsMuted,
    videoDuration,
    videoCurrentTime,
    handleSeek,
    setIsSeeking,
    toggleFullscreen,
    isFullscreen,
  };
}
