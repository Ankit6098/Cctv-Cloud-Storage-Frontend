import { useState, useEffect, RefObject } from "react";

export function useTheme(containerRef: RefObject<HTMLDivElement | null>) {
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [is24HourFormat, setIs24HourFormat] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    if (isDarkTheme) {
      containerRef.current.classList.remove("bg-slate-100", "text-slate-900");
      containerRef.current.classList.add("bg-[#0a0a0c]", "text-slate-200");
    } else {
      containerRef.current.classList.remove("bg-[#0a0a0c]", "text-slate-200");
      containerRef.current.classList.add("bg-slate-100", "text-slate-900");
    }
  }, [isDarkTheme, containerRef]);

  return {
    isDarkTheme,
    setIsDarkTheme,
    is24HourFormat,
    setIs24HourFormat,
  };
}
