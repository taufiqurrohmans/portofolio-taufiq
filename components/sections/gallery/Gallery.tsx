"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import type { GalleryItem } from "@/lib/default-content";
import "./gallery.css";

export function Gallery({ items }: { items: GalleryItem[] }) {
  const [activeIndex, setActiveIndex] = useState(Math.floor(items.length / 2));
  const [fullscreenItem, setFullscreenItem] = useState<GalleryItem | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mounted, setMounted] = useState(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const prevSlide = useCallback(() => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : items.length - 1));
  }, [items.length]);

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev < items.length - 1 ? prev + 1 : 0));
  }, [items.length]);

  // Autoplay functionality (every 3.5 seconds, pauses when hovered or modal is open)
  useEffect(() => {
    if (isHovered || fullscreenItem || items.length <= 1) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 2800);
    return () => clearInterval(timer);
  }, [isHovered, fullscreenItem, items.length, nextSlide]);

  // Keyboard navigation
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "ArrowRight") nextSlide();
      if (e.key === "Escape") setFullscreenItem(null);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [prevSlide, nextSlide]);

  // Touch Swipe Handlers
  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) nextSlide();
      else prevSlide();
    }
    touchStartX.current = null;
  }

  // Complete unbreakable page scroll lock when lightbox is active
  useEffect(() => {
    if (!fullscreenItem) {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    function preventScroll(e: Event) {
      e.preventDefault();
    }

    window.addEventListener("wheel", preventScroll, { passive: false });
    window.addEventListener("touchmove", preventScroll, { passive: false });

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      window.removeEventListener("wheel", preventScroll);
      window.removeEventListener("touchmove", preventScroll);
    };
  }, [fullscreenItem]);

  return (
    <section 
      id="gallery" 
      className="gallery-section" 
      data-reveal
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="gallery-container">
        <div className="section-heading" style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div>
            <p className="kicker">Visual Explorations</p>
            <h2 style={{ fontSize: "clamp(2.5rem, 5vw, 4.2rem)", margin: "0.5rem 0" }}>
              Moments &amp; Captures
            </h2>
          </div>
          <p style={{ maxWidth: "600px", color: "var(--muted)" }}>
            Koleksi dokumentasi visual, aktivitas, perjalanan, dan arsip momen berharga.
          </p>
        </div>

        <div
          className="gallery-viewport"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Previous Button */}
          <button
            className="gallery-nav-btn prev"
            onClick={prevSlide}
            aria-label="Previous Slide"
          >
            <ChevronLeft size={26} />
          </button>

          {/* 3D Coverflow Track */}
          <div className="coverflow-track">
            {items.map((item, index) => {
              let offset = index - activeIndex;
              if (items.length > 2) {
                const half = items.length / 2;
                if (offset > half) {
                  offset -= items.length;
                } else if (offset < -half) {
                  offset += items.length;
                }
              }
              const absOffset = Math.abs(offset);

              // Calculate 3D transformation values
              let transform = "";
              let zIndex = 10 - absOffset;
              let opacity = 1;
              let filter = "none";

              if (offset === 0) {
                // Center active card
                transform = "translateX(0px) translateZ(80px) rotateY(0deg) scale(1.06)";
                zIndex = 30;
                opacity = 1;
                filter = "none";
              } else if (offset > 0) {
                // Cards to the right
                const spacing = Math.min(offset * 160 + 90, 480);
                const rotate = -35;
                const scale = Math.max(0.75, 1 - absOffset * 0.09);
                transform = `translateX(${spacing}px) translateZ(-${absOffset * 120}px) rotateY(${rotate}deg) scale(${scale})`;
                opacity = Math.max(0.2, 1 - absOffset * 0.28);
                filter = `brightness(${Math.max(0.4, 1 - absOffset * 0.22)})`;
              } else {
                // Cards to the left
                const spacing = Math.max(offset * 160 - 90, -480);
                const rotate = 35;
                const scale = Math.max(0.75, 1 - absOffset * 0.09);
                transform = `translateX(${spacing}px) translateZ(-${absOffset * 120}px) rotateY(${rotate}deg) scale(${scale})`;
                opacity = Math.max(0.2, 1 - absOffset * 0.28);
                filter = `brightness(${Math.max(0.4, 1 - absOffset * 0.22)})`;
              }

              // Hide far away cards
              const display = absOffset > 3 ? "none" : "block";

              return (
                <div
                  key={item.id}
                  className={`coverflow-card ${offset === 0 ? "active" : ""}`}
                  style={{
                    transform,
                    zIndex,
                    opacity,
                    filter,
                    display,
                  }}
                  onClick={() => {
                    if (offset === 0) {
                      setFullscreenItem(item);
                    } else {
                      setActiveIndex(index);
                    }
                  }}
                >
                  <div 
                    className="gallery-cover-img"
                    style={{ backgroundImage: `url('${item.imageUrl}')` }}
                    aria-label={item.title}
                    role="img"
                    onContextMenu={(e) => e.preventDefault()}
                  />
                  <div className="coverflow-overlay">
                    <div className="coverflow-info">
                      <div className="coverflow-title-row">
                        {item.flag && <span className="coverflow-flag">{item.flag}</span>}
                        <h3 className="coverflow-title">{item.title}</h3>
                      </div>
                      <p className="coverflow-subtitle">
                        {item.subtitle || "Click to view full image"}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Next Button */}
          <button
            className="gallery-nav-btn next"
            onClick={nextSlide}
            aria-label="Next Slide"
          >
            <ChevronRight size={26} />
          </button>

          {/* Fullscreen Trigger Button */}
          <button
            className="gallery-expand-btn"
            onClick={() => setFullscreenItem(items[activeIndex])}
            title="Perbesar foto"
          >
            <Maximize2 size={20} />
          </button>
        </div>

        {/* Dots Pagination */}
        <div className="gallery-dots">
          {items.map((_, i) => (
            <button
              key={i}
              className={`gallery-dot ${i === activeIndex ? "active" : ""}`}
              onClick={() => setActiveIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Fullscreen Lightbox Modal via React Portal */}
      {mounted && fullscreenItem && createPortal(
        <div
          className="gallery-lightbox-overlay"
          role="dialog"
          aria-modal="true"
          onClick={() => setFullscreenItem(null)}
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          <div
            className="gallery-lightbox-card"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="gallery-lightbox-header">
              <div className="gallery-lightbox-title-group">
                {fullscreenItem.flag && <span className="gallery-lightbox-flag">{fullscreenItem.flag}</span>}
                <div>
                  <h3 className="gallery-lightbox-title">{fullscreenItem.title}</h3>
                  {fullscreenItem.subtitle && (
                    <p className="gallery-lightbox-subtitle">{fullscreenItem.subtitle}</p>
                  )}
                </div>
              </div>
              <button
                className="gallery-lightbox-close-btn"
                onClick={() => setFullscreenItem(null)}
                aria-label="Tutup foto"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Image Display */}
            <div className="gallery-lightbox-img-wrap">
              <div
                style={{ backgroundImage: `url('${fullscreenItem.imageUrl}')` }}
                aria-label={fullscreenItem.title}
                role="img"
                className="gallery-lightbox-image"
                onContextMenu={(e) => e.preventDefault()}
              />
            </div>
          </div>
        </div>,
        document.body
      )}
    </section>
  );
}
