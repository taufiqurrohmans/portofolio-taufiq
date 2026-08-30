import { Award, ArrowUpRight } from "lucide-react";
import type { PortfolioContent } from "@/lib/default-content";
import "./certificates.css";

export function Certificates({ certificates }: { certificates: PortfolioContent["certificates"] }) {
  if (!certificates || certificates.length === 0) return null;

  return (
    <section id="certificates" className="section-block certificate-section" data-reveal>
      <div className="section-heading">
        <div>
          <h2>
            Certificates <span className="animated-ampersand">&amp;</span> achievements
          </h2>
        </div>
        <p>Sertifikat yang mendukung kompetensi AI, data, dan pengembangan perangkat lunak.</p>
      </div>
      <div className="certificate-grid">
        {certificates.map((certificate, index) => (
          <article className="cert-card" key={certificate.id}>
            <div className="cert-header">
              <span className="cert-number">{String(index + 1).padStart(2, "0")}</span>
            </div>
            
            <div className="cert-visual">
              {certificate.imageUrl ? (
                <div 
                  className="cert-img-div" 
                  style={{ backgroundImage: `url('${certificate.imageUrl}')` }} 
                  aria-label={`Sertifikat ${certificate.title}`} 
                  role="img" 
                  onContextMenu={(e) => e.preventDefault()} 
                />
              ) : (
                <div className="cert-icon-wrapper">
                  <Award className="cert-icon" />
                </div>
              )}
            </div>
            
            <div className="cert-info">
              <p className="cert-meta">
                {certificate.issuer} <span>•</span> {certificate.year}
              </p>
              <h3 className="cert-title">{certificate.title}</h3>
              {certificate.credentialUrl && (
                <a href={certificate.credentialUrl} className="cert-link" target="_blank" rel="noreferrer">
                  View credential <ArrowUpRight className="cert-link-icon" />
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
