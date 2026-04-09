  "use client";
  import { useEffect, useRef } from "react";
  import Hls from "hls.js";

  export default function Home() {
    const videoRef = useRef(null);

    useEffect(() => {
      if (Hls.isSupported() && videoRef.current) {
        const hls = new Hls({
          maxBufferLength: 10,
        });

        hls.loadSource("http://localhost:5000/stream/index.m3u8");
        hls.attachMedia(videoRef.current);
      }
    }, []);

    return (
      <div style={{ padding: 20 }}>
        <h1>📹 CCTV Live (1080p)</h1>
        <video
          ref={videoRef}
          controls
          autoPlay
          style={{ width: "100%", maxWidth: "900px" }}
        />
      </div>
    );
  }
