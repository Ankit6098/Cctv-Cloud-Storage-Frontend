"use client";

import { Settings, Moon, Sun } from "lucide-react";
import { TbDeviceCctv } from "react-icons/tb";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  currentTime: Date;
  isDarkTheme: boolean;
  is24HourFormat: boolean;
  onThemeChange: (dark: boolean) => void;
  onTimeFormatChange: (is24Hour: boolean) => void;
}

export function Navbar({
  currentTime,
  isDarkTheme,
  is24HourFormat,
  onThemeChange,
  onTimeFormatChange,
}: NavbarProps) {
  return (
    <nav
      className={`border-b px-6 py-4 flex justify-between items-center backdrop-blur-md ${
        isDarkTheme
          ? "border-white/5 bg-black/20"
          : "border-slate-300 bg-white/20"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`p-2 rounded-lg ${
            isDarkTheme ? "bg-blue-600" : "bg-blue-500"
          }`}
        >
          <TbDeviceCctv size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-sm font-bold uppercase tracking-widest">
            Cctv Monitor
          </h1>
          <p
            className={`text-[10px] font-mono ${
              isDarkTheme ? "text-slate-500" : "text-slate-600"
            }`}
          >
            NODE_TX_042 // SECURE_LINE
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex flex-col items-end font-mono">
          <span className="text-sm font-bold uppercase">
            {currentTime.toLocaleTimeString([], {
              hour12: is24HourFormat ? undefined : true,
            })}
          </span>
          <span
            className={`text-[10px] ${
              isDarkTheme ? "text-slate-500" : "text-slate-600"
            }`}
          >
            {currentTime.toLocaleDateString(undefined, {
              weekday: "short",
              day: "2-digit",
              month: "short",
            })}
          </span>
        </div>
        {/* Time Format Toggle */}
        <Button
          className={`cursor-pointer text-xs ${isDarkTheme ? "bg-white/10 hover:bg-white/20 text-slate-500 hover:text-white" : "bg-slate-300 hover:bg-slate-400 text-slate-700 hover:text-slate-900"}`}
          onClick={() => onTimeFormatChange(!is24HourFormat)}
        >
          {is24HourFormat ? "12Hr" : "24Hr"}
        </Button>
        {/* Settings Menu */}
        <div className="relative">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={`cursor-pointer p-2 rounded-lg transition ${
                  isDarkTheme
                    ? "hover:bg-white/10 text-slate-500 hover:text-white"
                    : "hover:bg-slate-300 text-slate-700"
                }`}
              >
                <Settings size={18} />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className={`w-[150px] p-1 ${
                isDarkTheme
                  ? "bg-slate-900 border-white/10 text-white"
                  : "bg-white border-slate-300 text-slate-900"
              }`}
            >
              <DropdownMenuItem
                onClick={() => onThemeChange(true)}
                className={`p-2 mb-1 text-xs flex items-center gap-2 cursor-pointer ${
                  isDarkTheme ? "bg-blue-600 text-white " : "hover:bg-slate-200"
                }`}
              >
                <Moon size={14} />
                Dark Theme
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => onThemeChange(false)}
                className={`p-2 text-xs flex items-center gap-2 cursor-pointer hover:bg-slate-800 ${
                  !isDarkTheme ? "bg-blue-500 text-white hover:bg-blue-500" : ""
                }`}
              >
                <Sun size={14} />
                Light Theme
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
