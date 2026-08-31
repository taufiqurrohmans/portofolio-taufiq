"use client";
import { useState, useMemo, useEffect } from "react";
import { ArrowUpRight, BrainCircuit, Code2, Folder, X } from "lucide-react";
import type { PortfolioProject } from "@/lib/default-content";
import "./projects.css";

export function Projects({ projects }: { projects: PortfolioProject[] }) {
  const [filter, setFilter] = useState("All");
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(projects.map((project) => project.category)))],
    [projects],
  );

  const visibleProjects = projects.filter(
    (project) => (project.status === "published" || !project.status) && (filter === "All" || project.category === filter),
  );

  useEffect(() => {
    document.body.style.overflow = selectedProject ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedProject]);

  return (
    <>
      <section id="projects" className="section-block project-section" data-reveal>
        <div className="main-folder-wrapper">
          <div className="main-folder-tab">
            <svg viewBox="0 0 24 24" className="main-folder-icon">
              <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/>
            </svg>
            <span>taufiqur - Myproject</span>
          </div>
          <div className="project-container">
          <div className="section-heading">

            <h2>
              From model to <span className="highlight-text">meaningful product.</span>
            </h2>
            <p className="section-description">
              Setiap proyek dapat memuat proses, dataset, evaluasi model, screenshot website, repository, dan demo.
            </p>
          </div>
          <div className="project-grid">
            {visibleProjects.map((project, index) => (
              <article className={`folder-drive-card folder-theme-${project.accent || 'blue'}`} key={project.id}>
                {/* Folder Top Tab Bar */}
                <div className="folder-tab">
                  <svg viewBox="0 0 24 24" className="folder-tab-icon">
                    <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/>
                  </svg>
                  <span className="folder-year">{project.year}</span>
                </div>

                {/* Folder Main White Sheet Body */}
                <div className="folder-body">
                  {/* Interactive Window Mockup (Petinjau Nyata) */}
                  <button
                    className="folder-preview-window"
                    onClick={() => setSelectedProject(project)}
                    aria-label={`Buka detail ${project.title}`}
                  >
                    {/* Clean Minimalist Image Preview (No Fake Browser) */}
                    <div className="preview-action-overlay">
                      <div className="preview-action-circle" title="Lihat detail proyek">
                        <ArrowUpRight className="preview-arrow" />
                      </div>
                    </div>
                    <div className="preview-screen-content">
                      {project.coverUrl ? (
                        <div 
                          className="preview-cover-img" 
                          style={{ backgroundImage: `url('${project.coverUrl}')` }}
                          aria-label={`Tampilan ${project.title}`}
                          role="img"
                          onContextMenu={(e) => e.preventDefault()}
                        />
                      ) : (
                        <ProjectInteractivePreview project={project} index={index} />
                      )}
                    </div>
                  </button>

                  {/* Project Information */}
                  <div className="folder-project-info">
                    <div className="folder-meta-row">
                      <span className="folder-role-info">{project.role || "Full-Stack Developer"}</span>
                    </div>
                    <h3 className="folder-title">{project.title}</h3>
                    <p className="folder-summary">{project.summary}</p>
                    {/* Clean Typography Tech Stack (No Pills) */}
                    {project.stack && project.stack.length > 0 && (
                      <div className="folder-tech-stack">
                        {project.stack.map((tech, i) => (
                          <span key={i} className="tech-item">
                            {tech}
                            {i < project.stack.length - 1 && <span className="tech-separator"> / </span>}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
        </div>
      </section>
      {selectedProject && (
        <div
          className="project-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-modal-title"
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) setSelectedProject(null);
          }}
        >
          <div className="project-modal-card">
            <button
              className="modal-close"
              onClick={() => setSelectedProject(null)}
              aria-label="Tutup detail"
            >
              <X />
            </button>
            <p className="kicker">
              {selectedProject.category} · {selectedProject.year}
            </p>
            <h2 id="project-modal-title">{selectedProject.title}</h2>
            <p>{selectedProject.summary}</p>
            <dl>
              <div>
                <dt>Role</dt>
                <dd>{selectedProject.role}</dd>
              </div>
              <div>
                <dt>Evaluation</dt>
                <dd>{selectedProject.metric || "Tambahkan hasil evaluasi"}</dd>
              </div>
              <div>
                <dt>Stack</dt>
                <dd>{selectedProject.stack.join(", ")}</dd>
              </div>
            </dl>
            <div className="modal-actions">
              <a className="button button-primary" href={`/projects/${selectedProject.slug}`}>
                Full case study <ArrowUpRight />
              </a>
              {selectedProject.liveUrl && (
                <a
                  className="button button-primary"
                  href={selectedProject.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Live demo <ArrowUpRight />
                </a>
              )}
              {selectedProject.githubUrl && (
                <a
                  className="button button-ghost"
                  href={selectedProject.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub <Code2 />
                </a>
              )}
              {selectedProject.links?.filter(link => link.isActive).map(link => {
                const isPrimary = link.type === "website" || link.type === "demo";
                return (
                  <a 
                    key={link.id}
                    className={`button ${isPrimary ? 'button-primary' : 'button-ghost'}`}
                    href={link.url}
                    target={link.openInNewTab ? "_blank" : undefined}
                    rel={link.openInNewTab ? "noreferrer" : undefined}
                  >
                    {link.label} <ArrowUpRight />
                  </a>
                );
              })}
            </div>
            <p className="modal-note">
              Halaman case study lengkap akan menggunakan data yang Anda masukkan melalui admin.
            </p>
          </div>
        </div>
      )}
    </>
  );
}

function ProjectInteractivePreview({ project, index }: { project: PortfolioProject; index: number }) {
  const isKuliahKuy = project.slug.includes("kuliah") || project.title.toLowerCase().includes("kuliah");
  const isSIMKKN = project.slug.includes("kkn") || project.title.toLowerCase().includes("kkn");
  const isHumanika = project.slug.includes("humanika") || project.title.toLowerCase().includes("humanika");

  if (isKuliahKuy) {
    return (
      <div className="preview-ui-canvas ui-academic">
        {/* Dashboard Topbar */}
        <div className="ui-top-stats-row">
          <div className="ui-stat-pill">
            <span className="ui-stat-num">3.86</span>
            <span className="ui-stat-lbl">IPK</span>
          </div>
          <div className="ui-stat-pill">
            <span className="ui-stat-num">88%</span>
            <span className="ui-stat-lbl">Kehadiran</span>
          </div>
          <div className="ui-stat-pill">
            <span className="ui-stat-num">21</span>
            <span className="ui-stat-lbl">SKS</span>
          </div>
        </div>

        {/* Mini Chart & Course List */}
        <div className="ui-main-split">
          <div className="ui-chart-box">
            <div className="ui-chart-header">
              <span>Kehadiran</span>
              <span className="ui-badge-live">Aktif</span>
            </div>
            <div className="ui-bar-graph">
              <div className="ui-bar" style={{ height: "60%" }}><span>M1</span></div>
              <div className="ui-bar" style={{ height: "80%" }}><span>M2</span></div>
              <div className="ui-bar" style={{ height: "95%" }}><span>M3</span></div>
              <div className="ui-bar is-highlight" style={{ height: "100%" }}><span>M4</span></div>
              <div className="ui-bar" style={{ height: "85%" }}><span>M5</span></div>
            </div>
          </div>

          <div className="ui-schedule-box">
            <div className="ui-schedule-item">
              <span className="ui-dot-status blue" />
              <div>
                <strong>Kecerdasan Buatan</strong>
                <small>R.302 • 08:00 WIB</small>
              </div>
            </div>
            <div className="ui-schedule-item">
              <span className="ui-dot-status cyan" />
              <div>
                <strong>Basis Data Lanjut</strong>
                <small>Lab Komp • 10:30 WIB</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isSIMKKN) {
    return (
      <div className="preview-ui-canvas ui-kkn">
        <div className="ui-kkn-header">
          <div className="ui-posko-badge">
            <span className="ui-dot-status green" />
            <span>Posko 04 Wonorejo</span>
          </div>
          <span className="ui-kkn-term">2024</span>
        </div>

        <div className="ui-kkn-progress-card">
          <div className="ui-progress-meta">
            <span>Realisasi Proker</span>
            <strong>92% Selesai</strong>
          </div>
          <div className="ui-progress-bar-track">
            <div className="ui-progress-bar-fill" style={{ width: "92%" }} />
          </div>
        </div>

        <div className="ui-kkn-modules-grid">
          <div className="ui-module-card">
            <span className="ui-mod-icon">📊</span>
            <strong>Manajemen Keuangan</strong>
            <small>Kas &amp; anggaran real-time</small>
          </div>
          <div className="ui-module-card">
            <span className="ui-mod-icon">📍</span>
            <strong>Presensi Harian</strong>
            <small>Geotagging mahasiswa</small>
          </div>
        </div>
      </div>
    );
  }

  if (isHumanika) {
    return (
      <div className="preview-ui-canvas ui-editorial">
        <div className="ui-editorial-hero">
          <span className="ui-mag-tag">Featured Article</span>
          <h4>Digitalisasi Ekosistem &amp; Inovasi Jurnalistik Kampus</h4>
          <p>Portal media publikasi resmi mahasiswa Teknik Informatika...</p>
        </div>
        <div className="ui-editorial-footer-row">
          <span className="ui-read-time">⏱️ 3 min baca</span>
          <span className="ui-view-count">👁️ 1,280 Views</span>
        </div>
      </div>
    );
  }

  // Default / Agriculture / Data Dashboard Preview
  return (
    <div className="preview-ui-canvas ui-analytics">
      <div className="ui-top-stats-row">
        <div className="ui-stat-pill">
          <span className="ui-stat-num">1,420 Kg</span>
          <span className="ui-stat-lbl">Panen</span>
        </div>
        <div className="ui-stat-pill">
          <span className="ui-stat-num">28</span>
          <span className="ui-stat-lbl">Petani</span>
        </div>
        <div className="ui-stat-pill">
          <span className="ui-stat-num">Rp 48M</span>
          <span className="ui-stat-lbl">Valuasi</span>
        </div>
      </div>

      <div className="ui-analytics-graph-box">
        <div className="ui-chart-header">
          <span>Produksi &amp; Distribusi Krisan</span>
          <span className="ui-badge-live">Live</span>
        </div>
        <div className="ui-line-graph-mock">
          <svg viewBox="0 0 300 70" className="ui-svg-chart">
            <defs>
              <linearGradient id={`grad-${index}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#164fc4" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#164fc4" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <path d="M0,55 Q50,15 100,40 T200,20 T300,5 L300,70 L0,70 Z" fill={`url(#grad-${index})`} />
            <path d="M0,55 Q50,15 100,40 T200,20 T300,5" fill="none" stroke="#164fc4" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    </div>
  );
}
