import { useEffect, useRef } from "react";
import Hls from "hls.js";
import { VideoMode, TimelineRecording } from "@/lib/types";

interface UseHLSStreamProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  mode: VideoMode;
  previewUrl?: string | null;
  selectedFileId?: string | null;
  timelineRecordings: TimelineRecording[];
  currentRecordingIndex: number;
  onLoadingStart: () => void;
  onLoadingEnd: () => void;
}

export function useHLSStream({
  videoRef,
  mode,
  previewUrl,
  selectedFileId,
  timelineRecordings,
  currentRecordingIndex,
  onLoadingStart,
  onLoadingEnd,
}: UseHLSStreamProps) {
  const hlsRef = useRef<Hls | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls: Hls | null = null;

    if (mode === "live") {
      const streamUrl = `${process.env.BACKENDURL}/stream/index.m3u8`;

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
      onLoadingStart();
      video.src = previewUrl;

      const handleCanPlay = () => {
        onLoadingEnd();
        video.play().catch(() => {});
      };

      video.addEventListener("canplay", handleCanPlay);
      return () => video.removeEventListener("canplay", handleCanPlay);
    } else if (mode === "timeline" && timelineRecordings.length > 0) {
      onLoadingStart();
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
          onLoadingEnd();
          video.play().catch(() => {});
        };

        video.addEventListener("canplay", handleCanPlay);
        return () => video.removeEventListener("canplay", handleCanPlay);
      }
    } else if (mode === "archive" && selectedFileId) {
      onLoadingStart();
      const archiveUrl = `http://localhost:5000/api/stream-archive/${selectedFileId}`;
      video.src = archiveUrl;

      const handleCanPlay = () => {
        onLoadingEnd();
        video.play().catch(() => {});
      };

      video.addEventListener("canplay", handleCanPlay);
      return () => video.removeEventListener("canplay", handleCanPlay);
    }

    hlsRef.current = hls;
    return () => hls?.destroy();
  }, [
    mode,
    previewUrl,
    selectedFileId,
    timelineRecordings,
    currentRecordingIndex,
    videoRef,
    onLoadingStart,
    onLoadingEnd,
  ]);
}
