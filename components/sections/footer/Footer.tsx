import { Camera, Code2, Mail, Network, Sparkles } from "lucide-react";
import type { PortfolioContent } from "@/lib/default-content";
import "./footer.css";

export function Footer({ 
  profile, 
  socialLinks 
}: { 
  profile: PortfolioContent["profile"];
  socialLinks: PortfolioContent["socialLinks"];
}) {
  return (
    <>
      <section id="personal-quote" className="personal-quote-section" data-reveal>
        <div className="quote-wrapper">
          <p className="kicker">Visi & Dedikasi</p>
          <blockquote>
            "Menerjemahkan kerumitan data menjadi wawasan yang bermakna, dan merangkainya ke dalam solusi digital yang nyata."
          </blockquote>
          <p className="quote-author">— Taufiqur Rohman S.</p>
        </div>
      </section>

      <footer className="creative-footer" data-reveal>
        <div className="creative-footer-text">
          <p className="kicker">Let&apos;s collaborate !</p>
          <h2>
            Thank You
            <span className="smiley-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M8 14s1.5 2 4 2 4-2" />
                <line x1="9" y1="9" x2="9.01" y2="9" />
                <line x1="15" y1="9" x2="15.01" y2="9" />
              </svg>
            </span>
          </h2>
        </div>

        <div className="creative-footer-graphic">
          <div className="floating-pills">
            <a href={`mailto:${profile.email}`} className="pill pill-1">
              <Mail size={18} /> {profile.email}
            </a>
            {socialLinks
              .filter((link) => link.label !== "Email")
              .map((link, i) => {
                const Icon =
                  link.label === "GitHub"
                    ? Code2
                    : link.label === "LinkedIn"
                    ? Network
                    : link.label === "Instagram"
                    ? Camera
                    : Mail;
                return (
                  <a
                    href={link.href}
                    className={`pill pill-${i + 2}`}
                    key={link.label}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Icon size={18} /> {link.label}
                  </a>
                );
              })}
          </div>
          <div 
            className="foot-image" 
            style={{ backgroundImage: `url('/images/foot.png')` }} 
            aria-label="Thank You footer graphic" 
            role="img" 
            onContextMenu={(e) => e.preventDefault()} 
          />
        </div>

        <div className="footer-bottom-bar">
          <p>© 2026 · Built with purpose.</p>
        </div>
      </footer>
    </>
  );
}
