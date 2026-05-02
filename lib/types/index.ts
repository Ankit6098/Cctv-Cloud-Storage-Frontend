export interface ArchiveFile {
  id: string;
  name: string;
  size: number;
  createdTime: string;
}

export interface ArchiveDay {
  date: string;
  fileCount: number;
  files: ArchiveFile[];
}

export interface TimelineRecording {
  id: string;
  name: string;
  size: number;
  sizeFormatted: string;
  createdAt: string;
  createdAtTime: number;
  url: string;
  source: "local" | "drive";
  fileId?: string;
}

export type VideoMode = "live" | "preview" | "archive" | "timeline";
