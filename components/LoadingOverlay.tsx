"use client";

interface LoadingOverlayProps {
  isLoading: boolean;
}

export function LoadingOverlay({ isLoading }: LoadingOverlayProps) {
  if (!isLoading) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-10">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-16 h-16">
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
        <p className="text-white text-sm font-semibold animate-pulse">
          Loading footage...
        </p>
      </div>
    </div>
  );
}
