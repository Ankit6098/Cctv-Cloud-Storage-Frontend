import { useState } from "react";
import { TimelineRecording, VideoMode } from "@/lib/types";

export function useTimeline(setMode: (mode: VideoMode) => void) {
  const [timelineRecordings, setTimelineRecordings] = useState<TimelineRecording[]>([]);
  const [loadingTimeline, setLoadingTimeline] = useState(false);
  const [currentRecordingIndex, setCurrentRecordingIndex] = useState(0);
  const [timelineStartTime, setTimelineStartTime] = useState<number>(0);
  const [timelineEndTime, setTimelineEndTime] = useState<number>(0);
  const [loadingPreview, setLoadingPreview] = useState(false);

  const loadTimeline = async () => {
    setLoadingTimeline(true);
    try {
      const res = await fetch("http://localhost:5000/api/timeline/recordings");
      const data = await res.json();
      if (data.success && data.recordings && data.recordings.length > 0) {
        setTimelineRecordings(data.recordings);
        setCurrentRecordingIndex(0);

        const firstRecording = data.recordings[0];
        const lastRecording = data.recordings[data.recordings.length - 1];

        setTimelineStartTime(firstRecording.createdAtTime);
        setTimelineEndTime(lastRecording.createdAtTime + 3600000);

        setMode("timeline");
      }
    } catch (err) {
      console.error("Failed to load timeline:", err);
    } finally {
      setLoadingTimeline(false);
    }
  };

  const handlePreview = async () => {
    setLoadingPreview(true);
    try {
      await loadTimeline();
    } catch (err) {
      console.error("Failed to load timeline for preview:", err);
    } finally {
      setLoadingPreview(false);
    }
  };

  return {
    timelineRecordings,
    loadingTimeline,
    currentRecordingIndex,
    setCurrentRecordingIndex,
    timelineStartTime,
    timelineEndTime,
    loadingPreview,
    handlePreview,
  };
}
