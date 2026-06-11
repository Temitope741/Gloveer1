"use client";
import { useEffect, useState } from "react";

export default function PageLoader() {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFadeOut(true), 1800);
    const hideTimer = setTimeout(() => setVisible(false), 2300);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      backgroundColor: "#070f1e",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      opacity: fadeOut ? 0 : 1,
      transition: "opacity 0.5s ease",
      pointerEvents: fadeOut ? "none" : "all",
    }}>
      {/* Logo + name */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 40 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 10,
          background: "#111d30",
          border: "1px solid rgba(123,139,255,0.4)",
          display: "flex", alignItems: "center", justifyContent: "center",
          animation: "pulse 1.5s ease-in-out infinite",
        }}>
          <svg width="22" height="22" viewBox="0 0 16 16" fill="none">
            <path d="M8 2L14 5V11L8 14L2 11V5L8 2Z" stroke="#7B8BFF" strokeWidth="1.3"/>
            <circle cx="8" cy="8" r="2" fill="#7B8BFF" opacity="0.8"/>
          </svg>
        </div>
        <span style={{ color: "white", fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em" }}>
          engi<span style={{ color: "#7B8BFF" }}>tech</span>
        </span>
      </div>

      {/* Loading bar */}
      <div style={{
        width: 200, height: 2,
        background: "rgba(255,255,255,0.08)",
        borderRadius: 2, overflow: "hidden",
      }}>
        <div style={{
          height: "100%",
          background: "linear-gradient(90deg, #4f46e5, #7c3aed)",
          borderRadius: 2,
          animation: "loadbar 1.8s ease forwards",
        }} />
      </div>

      <p style={{ color: "#475569", fontSize: 12, marginTop: 16, letterSpacing: "0.1em" }}>
        LOADING...
      </p>

      <style>{`
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(123,139,255,0.3); }
          50% { box-shadow: 0 0 0 8px rgba(123,139,255,0); }
        }
        @keyframes loadbar {
          0% { width: 0%; }
          30% { width: 40%; }
          70% { width: 75%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
}