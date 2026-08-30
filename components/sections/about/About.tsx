import { Mail, MapPin, Code2, Network, GraduationCap, Briefcase, Sparkles, CheckCircle2 } from "lucide-react";
import type { PortfolioContent } from "@/lib/default-content";
import "./about.css";

export function About({ 
  profile, 
  socialLinks, 
  skills,
  experience,
}: { 
  profile: PortfolioContent["profile"];
  socialLinks: PortfolioContent["socialLinks"];
  stats?: PortfolioContent["stats"];
  skills: PortfolioContent["skills"];
  experience: PortfolioContent["experience"];
}) {
  return (
    <>
      <section id="about" className="about-section" data-reveal>
        <div className="about-container">
          {/* Top Row: Bio & ID Card */}
          <div className="about-top-grid">
            <div className="about-content">
              <h2 className="about-editorial-title">My <em>Profile.</em></h2>
              <div className="about-bio">
                {profile.bio.split('\n').map((paragraph, idx) => (
                  <p key={idx} dangerouslySetInnerHTML={{ __html: paragraph }} />
                ))}
              </div>
              
              <div className="about-connect">
                <h3>Let's Connect</h3>
                <div className="connect-grid">
                  <a href={`mailto:${profile.email}`} className="connect-item">
                    <Mail className="connect-icon" /> <span>{profile.email}</span>
                  </a>
                  <div className="connect-item">
                    <MapPin className="connect-icon" /> <span>{profile.location}</span>
                  </div>
                  {socialLinks.map((link) => {
                    const Icon = link.label === "GitHub" ? Code2 : link.label === "LinkedIn" ? Network : Mail;
                    return (
                      <a href={link.href} key={link.label} target="_blank" rel="noreferrer" className="connect-item">
                        <Icon className="connect-icon" /> <span>{link.label}</span>
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="about-visual">
              <div 
                className="idcard-image"
                style={{ backgroundImage: `url('${profile.photoUrl || "/images/idcard.png"}')` }}
                aria-label={`${profile.name} ID Card`} 
                role="img"
                onContextMenu={(e) => e.preventDefault()}
              />
            </div>
          </div>

          {/* Divider */}
          <div className="about-divider" />

          {/* Bottom Row: Education, Career Overview, Toolkit & Capabilities */}
          <div className="about-bottom-grid">
            {/* Left Column: Education & Toolkit */}
            <div className="about-column">
              <div className="about-sub-block">
                <div className="about-sub-header">
                  <GraduationCap className="about-sub-icon" />
                  <h3>Formal Education</h3>
                </div>
                <div className="about-timeline-list">
                  <div className="about-timeline-item">
                    <div className="about-timeline-year">
                      <span>2021</span>
                      <small>Sekarang</small>
                    </div>
                    <div className="about-timeline-line" />
                    <div className="about-timeline-desc">
                      <h4>{profile.university}</h4>
                      <strong>{profile.program}</strong>
                      <p>Mahasiswa Semester 7 (IPK 3.86 / 4.00)</p>
                    </div>
                  </div>
                  <div className="about-timeline-item">
                    <div className="about-timeline-year">
                      <span>2018</span>
                      <small>2021</small>
                    </div>
                    <div className="about-timeline-line" />
                    <div className="about-timeline-desc">
                      <h4>Pendidikan Menengah Atas</h4>
                      <strong>Jurusan IPA / Eksakta</strong>
                      <p>Lulusan Sekolah Menengah Atas</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Technical Toolkit with 3D App Tiles */}
              <div className="about-sub-block">
                <div className="about-sub-header">
                  <Sparkles className="about-sub-icon" />
                  <h3>Creative &amp; Tech Toolkit</h3>
                </div>
                <div className="about-3d-toolkit-graphic">
                  <div 
                    className="tech-toolkit-img"
                    style={{ backgroundImage: `url('/images/tech-toolkit-3d.jpg?v=2')` }}
                    aria-label="Creative & Technical Toolkit: Python, SQL, Laravel, React.js, Excel, Git" 
                    role="img"
                    onContextMenu={(e) => e.preventDefault()}
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Career Overview & Capabilities */}
            <div className="about-column">
              <div className="about-sub-block">
                <div className="about-sub-header">
                  <Briefcase className="about-sub-icon" />
                  <h3>Career Overview</h3>
                </div>
                <div className="about-timeline-list">
                  {experience
                    .filter((exp) => !exp.title.includes("S1 Teknik Informatika"))
                    .map((exp, idx) => (
                      <div key={idx} className="about-timeline-item">
                        <div className="about-timeline-year">
                          <span>{exp.period.split(" - ")[0] || exp.period}</span>
                          <small>{exp.period.split(" - ")[1] || ""}</small>
                        </div>
                        <div className="about-timeline-line" />
                        <div className="about-timeline-desc">
                          <h4>{exp.title}</h4>
                          <strong>{exp.organization}</strong>
                          <p>{exp.description}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Core Capabilities */}
              <div className="about-sub-block">
                <div className="about-sub-header">
                  <CheckCircle2 className="about-sub-icon" />
                  <h3>Capabilities</h3>
                </div>
                <div className="about-capabilities-grid">
                  <div className="about-cap-item">Data Analysis &amp; Visualization</div>
                  <div className="about-cap-item">Machine Learning &amp; Modeling</div>
                  <div className="about-cap-item">Web Development (Full-Stack)</div>
                  <div className="about-cap-item">Database Design (MySQL, Firebase)</div>
                  <div className="about-cap-item">Team Leadership &amp; Management</div>
                  <div className="about-cap-item">Visual Storytelling &amp; Problem Solving</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
