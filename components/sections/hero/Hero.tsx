"use client";
import { useState } from "react";
import type { PortfolioContent } from "@/lib/default-content";
import "./hero.css";

export function Hero({ profile }: { profile: PortfolioContent["profile"] }) {
  const [rollKey, setRollKey] = useState(0);

  function triggerYearRoll() {
    setRollKey((prev) => prev + 1);
  }

  return (
    <section id="top" className="hero-editorial-showcase" aria-label="Editorial Portfolio Showcase">
      <div className="hero-poster-canvas">
        {/* Animated Main Title */}
        <div className="editorial-title-wrap">
          <h1 className="editorial-title" id="main-content">
            <span className="title-letter">Portf</span>
            <span className="title-animated-o" aria-hidden="true" title="Huruf o melebar">
              <span className="o-pill-shape" />
            </span>
            <span className="title-letter">lio</span>
          </h1>
        </div>

        {/* Direct Hero Image - No outer frame */}
        <div className="hero-direct-artwork" data-reveal>
          <div 
            className="hero-direct-image" 
            aria-label="Informatics 3D Illustration" 
            role="img" 
            onContextMenu={(e) => e.preventDefault()}
          />
        </div>

        {/* Bottom Row: Profile Pill & Vertical Rolling Year Counter */}
        <div className="hero-direct-footer" data-reveal>
          {/* Profile info pill */}
          <div className="profile-pill-card">
            <strong>{profile.name}</strong>
            <span>{profile.headline || "Graphic Designer & Illustrator"}</span>
          </div>

          {/* Rolling Year Widget & Smiley */}
          <div 
            className="year-counter-widget" 
            onClick={triggerYearRoll}
            title="Klik untuk memutar animasi tahun"
          >
            <div className="year-number-display">
              <span className="year-prefix">202</span>
              <span className="year-digit-viewport">
                <span className="year-digit-roller" key={rollKey}>
                  <span className="digit-item">3</span>
                  <span className="digit-item">4</span>
                  <span className="digit-item">5</span>
                  <span className="digit-item digit-target">6</span>
                </span>
              </span>
            </div>
            <div className="smiley-face-badge" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M8 14s1.5 2.2 4 2.2 4-2.2 4-2.2" />
                <circle cx="9" cy="9.5" r="1" fill="currentColor" />
                <circle cx="15" cy="9.5" r="1" fill="currentColor" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
