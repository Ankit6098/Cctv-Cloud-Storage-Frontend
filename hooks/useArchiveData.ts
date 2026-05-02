import { useState } from "react";
import { ArchiveDay } from "@/lib/types";

export function useArchiveData() {
  const [archives, setArchives] = useState<ArchiveDay[]>([]);
  const [loadingArchives, setLoadingArchives] = useState(false);

  const loadArchives = async (startDate?: string, endDate?: string) => {
    setLoadingArchives(true);
    try {
      let url = `${process.env.BACKENDURL}/api/archive`;
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

  return { archives, loadingArchives, loadArchives };
}
