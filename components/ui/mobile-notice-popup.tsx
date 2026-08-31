"use client";

import { useEffect, useState } from "react";
import { Monitor, X, Smartphone } from "lucide-react";

export function MobileNoticePopup() {
  const [show, setShow] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    // Check if we already showed it
    const hasSeen = localStorage.getItem("mobile-notice-seen");
    if (hasSeen) return;

    // Detect mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

    if (isMobile) {
      const timer = setTimeout(() => setShow(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    localStorage.setItem("mobile-notice-seen", "true");
    setTimeout(() => setShow(false), 400);
  };

  if (!show) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 9999999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(10, 14, 23, 0.25)", /* Lighter backdrop */
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        opacity: isClosing ? 0 : 1,
        transition: "opacity 0.4s ease",
      }}
    >
      <div
        style={{
          background: "rgba(255, 255, 255, 0.95)", /* Glass light */
          backdropFilter: "blur(32px)",
          WebkitBackdropFilter: "blur(32px)",
          color: "#141519",
          width: "90%",
          maxWidth: "600px",
          borderRadius: "20px",
          padding: "3.5rem",
          position: "relative",
          boxShadow: "0 40px 100px rgba(22, 79, 196, 0.15), inset 0 1px 0 rgba(255,255,255,1)",
          transform: isClosing ? "translateY(30px) scale(0.95)" : "translateY(0) scale(1)",
          transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          border: "1px solid rgba(22, 79, 196, 0.12)",
        }}
      >
        <button
          onClick={handleClose}
          style={{
            position: "absolute",
            top: "1.5rem",
            right: "1.5rem",
            background: "rgba(22, 79, 196, 0.05)",
            border: "1px solid rgba(22, 79, 196, 0.1)",
            borderRadius: "50%",
            cursor: "pointer",
            color: "#64748b",
            padding: "0.6rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(22, 79, 196, 0.1)";
            e.currentTarget.style.color = "#164fc4";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(22, 79, 196, 0.05)";
            e.currentTarget.style.color = "#64748b";
          }}
        >
          <X size={24} />
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
          <Monitor size={42} strokeWidth={1.5} color="#164fc4" />
          <span style={{ color: "#cbd5e1", fontSize: "2rem" }}>/</span>
          <Smartphone size={32} strokeWidth={1.5} color="#94a3b8" />
        </div>

        <h3
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: "2.5rem",
            fontWeight: 800,
            margin: "0 0 1.2rem 0",
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
            color: "#0f172a"
          }}
        >
          Optimasi <span style={{ color: "#164fc4" }}>Layar Lebar.</span>
        </h3>

        <p
          style={{
            fontSize: "1.2rem",
            lineHeight: 1.7,
            color: "#475569",
            margin: "0 0 3rem 0",
            fontFamily: "Inter, sans-serif",
          }}
        >
          Anda sedang mengakses melalui perangkat *mobile*. Untuk pengalaman editorial visual yang utuh dan interaksi yang lebih imersif, kami merekomendasikan Anda untuk membukanya melalui <strong>Desktop atau Laptop</strong>.
        </p>

        <button
          onClick={handleClose}
          style={{
            background: "#164fc4",
            color: "white",
            border: "1px solid transparent",
            padding: "1rem 2.5rem",
            fontSize: "1.1rem",
            fontWeight: 600,
            borderRadius: "12px", /* Modern rounded rect, not pill */
            cursor: "pointer",
            transition: "all 0.3s ease",
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            boxShadow: "0 8px 20px rgba(22, 79, 196, 0.25)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 12px 25px rgba(22, 79, 196, 0.35)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 8px 20px rgba(22, 79, 196, 0.25)";
          }}
        >
          Tetap Lanjutkan
        </button>
      </div>
    </div>
  );
}
