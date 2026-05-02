"use client";

interface ProgressBarProps {
  currentTime: number;
  duration: number;
  isDarkTheme: boolean;
  onSeek: (value: number) => void;
  onSeekStart: () => void;
  onSeekEnd: () => void;
}

const formatDuration = (seconds: number) => {
  if (!seconds || isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export function ProgressBar({
  currentTime,
  duration,
  isDarkTheme,
  onSeek,
  onSeekStart,
  onSeekEnd,
}: ProgressBarProps) {
  return (
    <div className="px-6 pt-6 pb-3 group/bar">
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={(e) => onSeek(parseFloat(e.target.value))}
            onMouseDown={onSeekStart}
            onMouseUp={onSeekEnd}
            onTouchStart={onSeekStart}
            onTouchEnd={onSeekEnd}
            className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer transition-all duration-150 hover:h-2 group-hover/bar:h-2"
            style={{
              background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${
                duration ? (currentTime / duration) * 100 : 0
              }%, rgba(255,255,255,0.2) ${
                duration ? (currentTime / duration) * 100 : 0
              }%, rgba(255,255,255,0.2) 100%)`,
            }}
          />
          {/* Animated progress glow */}
          <div
            className="absolute top-1/2 h-1 bg-gradient-to-r from-blue-500 via-blue-400 to-transparent rounded-full blur-lg opacity-50 pointer-events-none transition-all duration-150"
            style={{
              left: "0%",
              width: `${duration ? (currentTime / duration) * 100 : 0}%`,
              transform: "translateY(-50%)",
            }}
          ></div>
        </div>
        <span className="text-xs font-mono text-white whitespace-nowrap transition-all duration-200 font-semibold">
          {formatDuration(currentTime)} / {formatDuration(duration)}
        </span>
      </div>
    </div>
  );
}
