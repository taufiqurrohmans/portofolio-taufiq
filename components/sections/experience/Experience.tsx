import type { PortfolioContent } from "@/lib/default-content";
import "./experience.css";

export function Experience({ experience }: { experience: PortfolioContent["experience"] }) {
  return (
    <section id="experience" className="section-block experience-section" data-reveal>
      <div className="section-heading">
        <div>
          <p className="kicker">Learning journey</p>
          <h2>Experience &amp; education</h2>
        </div>
        <p>Perjalanan belajar, pengalaman proyek, organisasi, pelatihan, dan aktivitas profesional.</p>
      </div>
      <div className="timeline">
        {experience.map((item, index) => (
          <article key={`${item.period}-${item.title}`}>
            <span>{item.period}</span>
            <div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
            <strong>{item.organization}</strong>
            <span className="timeline-index">{String(index + 1).padStart(2, "0")}</span>
          </article>
        ))}
      </div>
    </section>
  );
}
