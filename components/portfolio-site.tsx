"use client";
/* eslint-disable @next/next/no-img-element -- portfolio images are uploaded dynamically through the CMS */

import { useEffect } from "react";
import type { PortfolioContent } from "@/lib/default-content";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Skills } from "@/components/sections/skills";
import { Projects } from "@/components/sections/projects";
import { Certificates } from "@/components/sections/certificates";
import { Gallery } from "@/components/sections/gallery";
import { Footer } from "@/components/sections/footer";

export function PortfolioSite({ initialData }: { initialData: PortfolioContent }) {
  useEffect(() => {
    const nodes = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.setAttribute("data-visible", "true");
        });
      },
      { threshold: 0.12 },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="portfolio-shell">
      <a className="skip-link" href="#main-content">
        Lewati navigasi
      </a>

      {/* Hero Section */}
      <Hero profile={initialData.profile} />

      {/* About Section */}
      <About
        profile={initialData.profile}
        socialLinks={initialData.socialLinks}
        skills={initialData.skills}
        experience={initialData.experience}
      />

      {/* Dark Stats & Moving Tech Toolkit Section */}
      <Skills skills={initialData.skills} stats={initialData.stats} />

      {/* 3D Coverflow Gallery Section */}
      {initialData.gallery && initialData.gallery.length > 0 && (
        <Gallery items={initialData.gallery} />
      )}

      {/* Projects Section */}
      <Projects projects={initialData.projects} />

      {/* Certificates Section */}
      <Certificates certificates={initialData.certificates} />

      {/* Footer Section */}
      <Footer profile={initialData.profile} socialLinks={initialData.socialLinks} />
    </main>
  );
}
