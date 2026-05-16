"use client";

import { Calendar, X } from "lucide-react";
import { ArchiveDay } from "@/lib/types";
import { ArchiveList } from "./ArchiveList";

interface ArchiveModalProps {
  showArchiveBrowser: boolean;
  setShowArchiveBrowser: (show: boolean) => void;
  archives: ArchiveDay[];
  loadingArchives: boolean;
  isDarkTheme: boolean;
  handleSelectArchiveFile: (fileId: string) => void;
}

export function ArchiveModal({
  showArchiveBrowser,
  setShowArchiveBrowser,
  archives,
  loadingArchives,
  isDarkTheme,
  handleSelectArchiveFile,
}: ArchiveModalProps) {
  if (!showArchiveBrowser) return null;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 p-4 ${
        isDarkTheme
          ? "bg-black/80 backdrop-blur-sm"
          : "bg-slate-900/80 backdrop-blur-sm"
      }`}
    >
      <div
        className={`border rounded-2xl max-w-4xl w-full max-h-[80vh] flex flex-col ${
          isDarkTheme ? "bg-slate-950 border-white/10" : "bg-white border-slate-300"
        }`}
      >
        <div
          className={`flex justify-between items-center py-3 px-6 border-b ${
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
            className={`cursor-pointer p-2 rounded-lg transition ${
              isDarkTheme ? "hover:bg-white/10" : "hover:bg-slate-200"
            }`}
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <ArchiveList
            archives={archives}
            loadingArchives={loadingArchives}
            isDarkTheme={isDarkTheme}
            handleSelectArchiveFile={handleSelectArchiveFile}
            gridCols={2}
          />
        </div>
      </div>
    </div>
  );
}
