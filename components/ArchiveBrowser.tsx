"use client";

import { Calendar, Clock, FileVideo, Play } from "lucide-react";
import { ArchiveDay } from "@/lib/types";

interface ArchiveBrowserProps {
  archives: ArchiveDay[];
  isLoading: boolean;
  isDarkTheme: boolean;
  onSelectFile: (fileId: string) => void;
}

const formatTime = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

export function ArchiveBrowser({
  archives,
  isLoading,
  isDarkTheme,
  onSelectFile,
}: ArchiveBrowserProps) {
  return (
    <div
      className={`w-[30%] border rounded-2xl max-h-[80vh] flex flex-col ${
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
          className={`text-sm font-bold flex items-center gap-2 ${
            isDarkTheme ? "text-white" : "text-slate-900"
          }`}
        >
          <Calendar
            size={24}
            className={isDarkTheme ? "text-blue-500" : "text-blue-600"}
          />
          Archive Footage
        </h2>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
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
                    className={isDarkTheme ? "text-blue-500" : "text-blue-600"}
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

                <div className="grid grid-cols-1 gap-3">
                  {day.files.map((file) => (
                    <button
                      key={file.id}
                      onClick={() => onSelectFile(file.id)}
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
                              isDarkTheme ? "text-blue-500" : "text-blue-600"
                            }`}
                          />
                          <div className="flex-1">
                            <p
                              className={`font-semibold text-sm truncate ${
                                isDarkTheme ? "text-white" : "text-slate-900"
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
  );
}
