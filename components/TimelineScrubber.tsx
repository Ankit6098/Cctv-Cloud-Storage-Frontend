"use client";

import { Clock, ChevronLeft } from "lucide-react";
import { TimelineRecording, VideoMode } from "@/lib/types";

interface TimelineScrubberProps {
  mode: VideoMode;
  isDarkTheme: boolean;
  timelineRecordings: TimelineRecording[];
  currentRecordingIndex: number;
  setCurrentRecordingIndex: (index: number) => void;
}

export function TimelineScrubber({
  mode,
  isDarkTheme,
  timelineRecordings,
  currentRecordingIndex,
  setCurrentRecordingIndex,
}: TimelineScrubberProps) {
  if (mode !== "timeline" || timelineRecordings.length === 0) return null;

  return (
    <div
      className={`w-full mt-6 p-6 rounded-2xl border ${isDarkTheme
          ? "bg-slate-900/50 border-white/10"
          : "bg-slate-200/50 border-slate-300"
        }`}
    >
      <h3
        className={`text-sm font-bold mb-4 flex items-center gap-2 ${isDarkTheme ? "text-white" : "text-slate-900"
          }`}
      >
        <Clock size={18} />
        Timeline Scrubber - {timelineRecordings.length} segment
        {timelineRecordings.length !== 1 ? "s" : ""}
      </h3>

      <div className="w-full space-y-4">
        {/* Timeline bar with all segments */}
        <div className="w-full flex items-center gap-3">
          <div className="w-[95%] flex-1 ">
            <div
              className={`w-full h-12 overflow-x-scroll pt-2 rounded-lg overflow-hidden border flex ${isDarkTheme
                  ? "bg-slate-800 border-white/10"
                  : "bg-slate-300 border-slate-400"
                }`}
            >
              {timelineRecordings.map((recording, index) => (
                <button
                  key={recording.id}
                  onClick={() => setCurrentRecordingIndex(index)}
                  className={`mx-3 cursor-pointer flex-1 transition-all hover:opacity-100 relative group ${currentRecordingIndex === index
                      ? isDarkTheme
                        ? "bg-blue-600 opacity-100"
                        : "bg-blue-500 opacity-100"
                      : isDarkTheme
                        ? "bg-slate-700 opacity-60 hover:opacity-80"
                        : "bg-slate-400 opacity-60 hover:opacity-80"
                    }`}
                  title={`${new Date(
                    recording.createdAt
                  ).toLocaleString()}\n${recording.sizeFormatted}\nSource: ${recording.source
                    }`}
                >
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span
                      className={`text-xs font-bold ${isDarkTheme ? "text-white" : "text-black"
                        }`}
                    >
                      {index + 1}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
          <div
            className={`text-xs font-mono whitespace-nowrap ${isDarkTheme ? "text-slate-400" : "text-slate-600"
              }`}
          >
            {timelineRecordings.length}
          </div>
        </div>

        {/* Current recording info */}
        {timelineRecordings[currentRecordingIndex] && (
          <div
            className={`p-3 rounded-lg border ${isDarkTheme
                ? "bg-slate-800/50 border-white/5"
                : "bg-slate-300/50 border-slate-400"
              }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={`text-xs font-bold ${isDarkTheme ? "text-blue-400" : "text-blue-600"
                    }`}
                >
                  Now Playing: Segment {currentRecordingIndex + 1} of{" "}
                  {timelineRecordings.length}
                </p>
                <p
                  className={`text-xs mt-1 ${isDarkTheme ? "text-slate-400" : "text-slate-600"
                    }`}
                >
                  {new Date(
                    timelineRecordings[currentRecordingIndex].createdAt
                  ).toLocaleString()}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <p
                    className={`text-xs ${isDarkTheme ? "text-slate-500" : "text-slate-700"
                      }`}
                  >
                    {timelineRecordings[currentRecordingIndex].sizeFormatted}
                  </p>
                  <span
                    className={`inline-block px-2 py-0.5 text-xs font-semibold rounded ${timelineRecordings[currentRecordingIndex].source === "drive"
                        ? isDarkTheme
                          ? "bg-purple-600/30 text-purple-300"
                          : "bg-purple-200 text-purple-800"
                        : isDarkTheme
                          ? "bg-green-600/30 text-green-300"
                          : "bg-green-200 text-green-800"
                      }`}
                  >
                    {timelineRecordings[currentRecordingIndex].source === "drive"
                      ? "📁 Google Drive"
                      : "💾 Local"}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  disabled={currentRecordingIndex === 0}
                  onClick={() => {
                    const newIndex = Math.max(0, currentRecordingIndex - 1);
                    setCurrentRecordingIndex(newIndex);
                  }}
                  className={`p-2 rounded transition ${currentRecordingIndex === 0
                      ? isDarkTheme
                        ? "bg-slate-700 text-slate-500 cursor-not-allowed"
                        : "bg-slate-400 text-slate-600 cursor-not-allowed"
                      : isDarkTheme
                        ? "bg-white/10 hover:bg-white/20 text-white"
                        : "hover:bg-slate-400 text-slate-900"
                    }`}
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  disabled={
                    currentRecordingIndex === timelineRecordings.length - 1
                  }
                  onClick={() => {
                    const newIndex = Math.min(
                      timelineRecordings.length - 1,
                      currentRecordingIndex + 1
                    );
                    setCurrentRecordingIndex(newIndex);
                  }}
                  className={`p-2 rounded transition ${currentRecordingIndex === timelineRecordings.length - 1
                      ? isDarkTheme
                        ? "bg-slate-700 text-slate-500 cursor-not-allowed"
                        : "bg-slate-400 text-slate-600 cursor-not-allowed"
                      : isDarkTheme
                        ? "bg-white/10 hover:bg-white/20 text-white"
                        : "hover:bg-slate-400 text-slate-900"
                    }`}
                >
                  <ChevronLeft size={16} className="rotate-180" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
