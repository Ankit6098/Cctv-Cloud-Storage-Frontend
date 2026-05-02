# Frontend Component Architecture

## Overview

Refactored the monolithic `page.tsx` into a modular, component-based architecture for better debugging, maintainability, and feature implementation.

## Directory Structure

```
components/
├── Navbar.tsx                 # Top navigation with theme toggle & clock
├── VideoPlayer.tsx            # Main video player (HLS/MP4 support)
├── VideoControls.tsx          # Play/Pause, Mute, Fullscreen buttons
├── ProgressBar.tsx            # Video timeline/progress bar
├── StatusBadge.tsx            # Live/Archive status indicator
├── ActionDock.tsx             # Mode selection (Live, Timeline, Archives)
├── TimelineScrubber.tsx       # Timeline navigation with segments
├── ArchiveBrowser.tsx         # Archive file browser sidebar
├── LoadingOverlay.tsx         # Loading animation overlay
└── index.ts                   # Barrel export

hooks/
├── useHLSStream.ts            # HLS/MP4 streaming logic
├── useArchiveData.ts          # Archive data fetching
├── useTimelineData.ts         # Timeline data fetching
└── index.ts                   # Barrel export

lib/types/
└── index.ts                   # TypeScript interfaces

app/
└── page.tsx                   # Main page (clean, 160 lines)
```

## Components

### Navbar

- Clock display with 12/24 hour toggle
- Theme switcher (Dark/Light)
- Branding and status info

### VideoPlayer

- Central video element
- HLS.js integration for live streams
- MP4 playback for archives
- Loading overlay
- Status badge
- Controls overlay (on hover)

### VideoControls

- Play/Pause button
- Mute/Unmute button
- Fullscreen button
- Camera name display

### ProgressBar

- Timeline scrubbing
- Smooth seeking with glow effect
- Duration display

### ActionDock

- Mode toggle buttons (Live, Timeline, Archives)
- Active state styling
- Loading state for timeline

### TimelineScrubber

- Visual timeline segments
- Current segment info
- Navigation buttons
- Source indicator (Local/Google Drive)

### ArchiveBrowser

- Calendar-based archive organization
- File list by date
- File size and creation time
- Play button with file selection

### Hooks

#### useHLSStream

Manages video streaming based on mode:

- Live HLS streaming
- Archive MP4 playback
- Timeline segment switching
- Auto-play handling

#### useArchiveData

Fetches and manages archive files from backend

#### useTimelineData

Fetches and manages timeline recordings

## State Management

Kept in main `page.tsx` for simplicity (can be moved to Context API if needed later)

### UI State

- mode, isFullscreen, isMuted, currentTime, isDarkTheme, is24HourFormat

### Video State

- isLoadingVideo, videoDuration, videoCurrentTime, isSeeking

### Data State

- archives, selectedFileId, timelineRecordings, currentRecordingIndex

## Benefits

✅ **Easier Debugging**: Each component has a single responsibility
✅ **Reusable Components**: Can be used in other pages/features
✅ **Better Testing**: Small, focused components are easier to test
✅ **Maintainability**: Clear separation of concerns
✅ **Scalability**: Easy to add new features without touching existing code
✅ **Type Safety**: All components have proper TypeScript types
