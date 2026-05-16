import { useState } from "react";
import { ArchiveDay, VideoMode } from "@/lib/types";

export function useArchives(setMode: (mode: VideoMode) => void) {
  const [archives, setArchives] = useState<ArchiveDay[]>([]);
  const [loadingArchives, setLoadingArchives] = useState(false);
  const [showArchiveBrowser, setShowArchiveBrowser] = useState(false);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);

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

  return {
    archives,
    loadingArchives,
    showArchiveBrowser,
    setShowArchiveBrowser,
    selectedFileId,
    handleOpenArchiveBrowser,
    handleSelectArchiveFile,
  };
}
