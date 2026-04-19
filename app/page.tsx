"use client";
import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

interface Status {
  status: string;
  rtspUrl: string;
  recordingSize: number;
  m3u8Exists: boolean;
  streamUrl: string;
  message: string;
}

export default function Home() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamUrl = "http://localhost:5000/stream/index.m3u8";

  console.log("🚀 Page component rendered, initializing stream...");

  const [status, setStatus] = useState<Status | null>(null);
  const [loading, setLoading] = useState(true);
  const [testPassword, setTestPassword] = useState("");
  const [testResult, setTestResult] = useState<any>(null);
  const [testing, setTesting] = useState(false);

  // Fetch backend status
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/status");
        const data = await res.json();
        setStatus(data);
        setLoading(false);
        console.log("Backend status:", data);
      } catch (err) {
        console.error("Failed to fetch status:", err);
        setLoading(false);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  // Setup HLS stream
  useEffect(() => {
    console.log("🎬 HLS useEffect started");

    let hls: Hls | null = null;
    let retryAttempts = 0;
    const maxRetries = 5;

    const attachStream = () => {
      const video = videoRef.current;
      console.log("📺 Video element on attempt", retryAttempts + 1, ":", video);

      if (!video) {
        if (retryAttempts < maxRetries) {
          retryAttempts++;
          console.log(
            `⏱️ Video not ready, retrying in 200ms (attempt ${retryAttempts}/${maxRetries})...`,
          );
          setTimeout(attachStream, 200);
        } else {
          console.error("❌ Video element still not found after retries!");
        }
        return;
      }

      console.log("✅ Video element found!");
      console.log("📍 Stream URL:", "http://localhost:5000/stream/index.m3u8");

      if (!Hls.isSupported()) {
        console.log("🍎 HLS.js not supported, checking native support...");
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          console.log("🍎 Using native HLS (Safari/iOS)");
          video.src = "http://localhost:5000/stream/index.m3u8";
          video.play().catch((e) => console.error("Play error:", e));
        } else {
          console.error("❌ HLS not supported in this browser");
        }
        return;
      }

      console.log("✅ HLS.js supported, initializing...");
      try {
        hls = new Hls({
          maxBufferLength: 10,
          maxMaxBufferLength: 30,
          startLevel: -1,
          enableWorker: true,
          lowLatencyMode: true,
          manifestLoadingTimeOut: 10000,
          fragLoadingTimeOut: 20000,
        });

        hls.attachMedia(video);
        console.log("✅ HLS attached to video");

        hls.on(Hls.Events.MEDIA_ATTACHED, () => {
          console.log("📡 Media attached, loading source...");
          hls?.loadSource("http://localhost:5000/stream/index.m3u8");
        });

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          console.log("✅ Manifest parsed! Starting playback...");
          video.play().catch((e) => console.error("Play error:", e));
        });

        hls.on(Hls.Events.ERROR, (event, data) => {
          console.error("❌ HLS Error:", data.type, data.details);
          if (data.fatal) {
            console.error("💥 Fatal error occurred");
          }
        });
      } catch (e) {
        console.error("❌ HLS initialization error:", e);
      }
    };

    // Start attaching stream with initial delay
    console.log("⏱️ Starting stream attachment in 100ms...");
    const timer = setTimeout(attachStream, 100);

    return () => {
      clearTimeout(timer);
      if (hls) {
        console.log("🧹 Destroying HLS");
        hls.destroy();
      }
    };
  }, []);

  // Test RTSP connection
  const handleTestPassword = async () => {
    if (!testPassword) {
      alert("Please enter a password");
      return;
    }

    setTesting(true);
    try {
      const res = await fetch("http://localhost:5000/api/test-rtsp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: testPassword }),
      });
      const result = await res.json();
      setTestResult(result);

      if (result.success) {
        // Update backend with successful password
        const updateRes = await fetch("http://localhost:5000/api/update-rtsp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password: testPassword }),
        });
        const updateData = await updateRes.json();
        alert(
          "Password works! " +
            updateData.message +
            "\nPlease refresh the page after restarting the backend.",
        );
      }
    } catch (err) {
      console.error("Test failed:", err);
      setTestResult({ success: false, message: "Request failed" });
    } finally {
      setTesting(false);
    }
  };

  const quickPasswordTest = (password: string) => {
    setTestPassword(password);
    setTimeout(() => {
      const btn = document.getElementById("test-btn") as HTMLButtonElement;
      if (btn) btn.click();
    }, 100);
  };

  if (loading) {
    return <div style={{ padding: 20 }}>Loading...</div>;
  }

  return (
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h1>📹 CCTV Live Stream (1080p)</h1>

      {/* Status Panel */}
      <div
        style={{
          background: status?.recordingSize === 0 ? "#fff3cd" : "#d4edda",
          padding: 15,
          borderRadius: 8,
          marginBottom: 20,
          border: "1px solid #ddd",
        }}
      >
        <h2>Backend Status</h2>
        <p>
          <strong>Status:</strong> {status?.status || "Unknown"}
        </p>
        <p>
          <strong>RTSP URL:</strong> <code>{status?.rtspUrl}</code>
        </p>
        <p>
          <strong>Recording Size:</strong> {status?.recordingSize} bytes
        </p>
        <p>
          <strong>Stream File Exists:</strong>{" "}
          {status?.m3u8Exists ? "✅ Yes" : "❌ No"}
        </p>
        <p style={{ color: status?.recordingSize === 0 ? "red" : "green" }}>
          <strong>Message:</strong> {status?.message}
        </p>
      </div>

      {/* Video Player */}
      <div
        style={{
          background: "#000",
          borderRadius: 8,
          overflow: "hidden",
          marginBottom: 20,
        }}
      >
        <video
          ref={videoRef}
          controls
          autoPlay
          playsInline
          muted
          style={{ width: "100%", maxWidth: "900px", display: "block" }}
        />
      </div>

      <div
        style={{
          background: "#e7f3ff",
          padding: 10,
          borderRadius: 8,
          marginBottom: 20,
        }}
      >
        <p>
          <strong>📊 Stream URL:</strong> {streamUrl}
        </p>
        <p>
          <strong>🔗 Status:</strong>{" "}
          {status?.recordingSize > 1000
            ? "✅ Streaming Active"
            : "⚠️ Buffering..."}
        </p>
        <p style={{ fontSize: "12px", color: "#666" }}>
          Open browser DevTools (F12) → Console tab to see detailed HLS
          debugging info
        </p>
      </div>

      {/* If not working, show password tester */}
      {status?.recordingSize === 0 && (
        <div
          style={{
            background: "#ffebee",
            padding: 15,
            borderRadius: 8,
            marginBottom: 20,
            border: "1px solid #f5c6cb",
          }}
        >
          <h2>⚠️ Camera Not Connected</h2>
          <p>
            The backend is not receiving data from the camera. This usually
            means the RTSP password is incorrect.
          </p>

          <h3>Try these passwords:</h3>
          <div style={{ marginBottom: 15 }}>
            {["cctv@123", "cctv123", "Cctv@123", "Cctv123"].map((pwd) => (
              <button
                key={pwd}
                onClick={() => quickPasswordTest(pwd)}
                style={{
                  padding: "10px 15px",
                  margin: "5px",
                  cursor: "pointer",
                  background: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: 4,
                }}
              >
                Test: {pwd}
              </button>
            ))}
          </div>

          <div style={{ marginTop: 15 }}>
            <h3>Or enter custom password:</h3>
            <div>
              <input
                type="password"
                value={testPassword}
                onChange={(e) => setTestPassword(e.target.value)}
                placeholder="Enter RTSP password"
                style={{
                  padding: "10px",
                  width: "300px",
                  fontSize: "16px",
                  marginRight: "10px",
                }}
              />
              <button
                id="test-btn"
                onClick={handleTestPassword}
                disabled={testing}
                style={{
                  padding: "10px 20px",
                  cursor: "pointer",
                  background: testing ? "#ccc" : "#28a745",
                  color: "white",
                  border: "none",
                  borderRadius: 4,
                }}
              >
                {testing ? "Testing..." : "Test Password"}
              </button>
            </div>

            {testResult && (
              <div
                style={{
                  marginTop: 10,
                  padding: 10,
                  background: testResult.success ? "#d4edda" : "#f8d7da",
                  borderRadius: 4,
                  color: testResult.success ? "green" : "red",
                }}
              >
                <strong>
                  {testResult.success ? "✅ Success!" : "❌ Failed"}
                </strong>
                <p>{testResult.message}</p>
                {testResult.hint && <p>{testResult.hint}</p>}
              </div>
            )}
          </div>
        </div>
      )}

      <div style={{ fontSize: "12px", color: "#666", marginTop: 20 }}>
        <p>
          <strong>Troubleshooting:</strong>
        </p>
        <ul>
          <li>Make sure backend is running: npm start</li>
          <li>Check camera IP: 192.168.0.100:5543</li>
          <li>Default username: admin</li>
          <li>If nothing works, restart the camera and backend</li>
        </ul>
      </div>
    </div>
  );
}
