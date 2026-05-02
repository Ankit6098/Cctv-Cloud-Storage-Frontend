import { useState } from "react";
import { TimelineRecording } from "@/lib/types";

export function useTimelineData() {
  const [timelineRecordings, setTimelineRecordings] = useState<
    TimelineRecording[]
  >([]);
  const [loadingTimeline, setLoadingTimeline] = useState(false);
  const [timelineStartTime, setTimelineStartTime] = useState<number>(0);
  const [timelineEndTime, setTimelineEndTime] = useState<number>(0);

  const loadTimeline = async () => {
    setLoadingTimeline(true);
    try {
      const res = await fetch(`${process.env.BACKENDURL}/api/timeline/recordings`);
      const data = await res.json();
      if (data.success && data.recordings && data.recordings.length > 0) {
        setTimelineRecordings(data.recordings);

        const firstRecording = data.recordings[0];
        const lastRecording = data.recordings[data.recordings.length - 1];

        setTimelineStartTime(firstRecording.createdAtTime);
        setTimelineEndTime(lastRecording.createdAtTime + 3600000);

        return true;
      }
    } catch (err) {
      console.error("Failed to load timeline:", err);
    } finally {
      setLoadingTimeline(false);
    }
    return false;
  };

  return {
    timelineRecordings,
    loadingTimeline,
    timelineStartTime,
    timelineEndTime,
    loadTimeline,
  };
}
