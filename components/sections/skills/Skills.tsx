import { 
  BrainCircuit, 
  Database, 
  FileSpreadsheet, 
  Code, 
  Coffee, 
  Layers, 
  Atom, 
  Server, 
  Flame, 
  GitBranch, 
  Cpu, 
  Terminal,
  FileCode2,
  Boxes
} from "lucide-react";
import type { PortfolioContent } from "@/lib/default-content";
import "./skills.css";

// Map tech names to specific icons & accent colors
const techConfig: Record<string, { icon: React.ComponentType<{ className?: string }>; color: string; bg: string }> = {
  "Python": { icon: Terminal, color: "#3776AB", bg: "rgba(55, 118, 171, 0.1)" },
  "SQL": { icon: Database, color: "#00758F", bg: "rgba(0, 117, 143, 0.1)" },
  "Microsoft Excel": { icon: FileSpreadsheet, color: "#107C41", bg: "rgba(16, 124, 65, 0.1)" },
  "JavaScript": { icon: Code, color: "#F7DF1E", bg: "rgba(247, 223, 30, 0.12)" },
  "Java": { icon: Coffee, color: "#E76F00", bg: "rgba(231, 111, 0, 0.1)" },
  "Laravel": { icon: Layers, color: "#FF2D20", bg: "rgba(255, 45, 32, 0.1)" },
  "React.js": { icon: Atom, color: "#087ea4", bg: "rgba(8, 126, 164, 0.1)" },
  "MySQL": { icon: Server, color: "#4479A1", bg: "rgba(68, 121, 161, 0.1)" },
  "Firebase": { icon: Flame, color: "#FFCA28", bg: "rgba(255, 202, 40, 0.15)" },
  "Git / GitHub": { icon: GitBranch, color: "#F05032", bg: "rgba(240, 80, 50, 0.1)" },
};

export function Skills({ 
  skills, 
  stats 
}: { 
  skills: PortfolioContent["skills"]; 
  stats?: PortfolioContent["stats"];
}) {
  // Create a combined list with fallback icons
  const skillList = skills && skills.length > 0 ? skills : [
    { name: "Python", group: "Data & Analisis", level: "Comfortable" },
    { name: "SQL", group: "Data & Analisis", level: "Comfortable" },
    { name: "Microsoft Excel", group: "Data & Analisis", level: "Comfortable" },
    { name: "JavaScript", group: "Bahasa Pemrograman", level: "Comfortable" },
    { name: "Java", group: "Bahasa Pemrograman", level: "Familiar" },
    { name: "Laravel", group: "Pengembangan Web", level: "Comfortable" },
    { name: "React.js", group: "Pengembangan Web", level: "Comfortable" },
    { name: "MySQL", group: "Basis Data", level: "Comfortable" },
    { name: "Firebase", group: "Basis Data", level: "Comfortable" },
    { name: "Git / GitHub", group: "Version Control", level: "Comfortable" },
  ];

  // Default stats fallback
  const statList = stats && stats.length > 0 ? stats : [
    { value: "3.86", label: "GPA / IPK" },
    { value: "04+", label: "Projects Completed" },
    { value: "03+", label: "Organizations" },
    { value: "05+", label: "Certifications & Awards" },
  ];

  // Duplicate list to ensure seamless infinite looping
  const marqueeList = [...skillList, ...skillList, ...skillList, ...skillList];

  return (
    <section id="toolkit" className="skills-dark-section" data-reveal>
      {/* 1. Stats Counter Row */}
      <div className="stats-dark-row">
        {statList.map((stat, i) => (
          <div className="stat-dark-item" key={i}>
            <strong className="stat-dark-value">{stat.value}</strong>
            <span className="stat-dark-label">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Subtle Divider */}
      <div className="skills-dark-divider" />

      {/* 2. Section Header */}
      <div className="skills-header-container">
        <h2 className="skills-dark-title">Tools &amp; Technologies</h2>
      </div>

      {/* 3. Marquee Scroller with Minimal Items moving Right to Left */}
      <div className="marquee-dark-wrapper" aria-label="Infinite Tech Stack Marquee">
        {/* Left and Right edge fade masks into dark */}
        <div className="marquee-dark-fade marquee-dark-fade-left" />
        <div className="marquee-dark-fade marquee-dark-fade-right" />

        <div className="marquee-dark-track marquee-scroll-left">
          {marqueeList.map((skill, index) => {
            const config = techConfig[skill.name] || { icon: BrainCircuit };
            const Icon = config.icon;

            return (
              <div className="marquee-minimal-item" key={`${skill.name}-${index}`}>
                <div className="marquee-clean-icon-box">
                  <Icon className="marquee-icon" />
                </div>
                <strong className="marquee-clean-name">{skill.name}</strong>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
