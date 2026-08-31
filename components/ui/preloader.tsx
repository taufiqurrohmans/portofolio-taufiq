"use client";

import { useEffect, useState } from "react";
import "./preloader.css";

export function Preloader() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  useEffect(() => {
    // Prevent scrolling while loading
    document.body.style.overflow = "hidden";

    // Simulate loading time
    const timer = setTimeout(() => {
      setIsAnimatingOut(true);
      
      // Wait for the exit animation to finish before removing from DOM
      setTimeout(() => {
        setIsLoading(false);
        document.body.style.overflow = "auto";
      }, 1000); 
      
    }, 2200);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "auto";
    };
  }, []);

  if (!isLoading) return null;

  return (
    <div className={`preloader-overlay ${isAnimatingOut ? "slide-out" : ""}`}>
      <div className="preloader-content">
        <div className="preloader-text-container">
          <div className="preloader-text-wrapper">
            <span className="preloader-text">
              <span className="title-letter">Portf</span>
              <span className="title-animated-o" aria-hidden="true">
                <span className="o-pill-shape" />
              </span>
              <span className="title-letter">lio</span>
            </span>
          </div>
          <div className="preloader-subtext-wrapper">
            <span className="preloader-subtext">Taufiqur Rohman S.</span>
          </div>
        </div>
        <div className="preloader-progress-bar">
          <div className="preloader-progress-fill"></div>
        </div>
      </div>
    </div>
  );
}
