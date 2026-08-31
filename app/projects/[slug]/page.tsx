/* eslint-disable @next/next/no-img-element -- project images are managed by the CMS */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, BrainCircuit, Code2, Database, Gauge, Layers3 } from "lucide-react";
import { getProjectBySlug } from "@/lib/portfolio-data";

type ProjectPageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Project not found" };
  return {
    title: project.title,
    description: project.summary,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project || (project.status && project.status !== "published")) notFound();

  const detailItems = [
    { label: "Problem", value: project.problem, icon: Gauge },
    { label: "Solution", value: project.solution, icon: Layers3 },
    { label: "Dataset", value: project.dataset, icon: Database },
    { label: "Method", value: project.method, icon: BrainCircuit },
    { label: "Evaluation", value: project.evaluation, icon: Code2 },
  ].filter((item) => item.value);

  return (
    <main className={`case-study case-${project.accent}`}>
      <header className="case-nav">
        <Link href="/#projects"><ArrowLeft /> Back to portfolio</Link>
        <span>{project.category} · {project.year}</span>
      </header>
      <section className="case-hero">
        <p>{project.role}</p>
        <h1>{project.title}</h1>
        <div className="tag-list">{project.stack.map((item) => <span key={item}>{item}</span>)}</div>
        <p className="case-summary">{project.summary}</p>
        <div className="case-actions flex flex-wrap gap-3 mt-8">
          {project.liveUrl && <a className="button button-primary" href={project.liveUrl} target="_blank" rel="noreferrer">Live demo <ArrowUpRight /></a>}
          {project.githubUrl && <a className="button button-ghost" href={project.githubUrl} target="_blank" rel="noreferrer">Repository <Code2 /></a>}
          {project.links?.filter(link => link.isActive).map(link => {
            const isPrimary = link.type === "website" || link.type === "demo";
            return (
              <a 
                key={link.id}
                href={link.url} 
                target={link.openInNewTab ? "_blank" : undefined}
                rel={link.openInNewTab ? "noreferrer" : undefined}
                className={`button ${isPrimary ? 'button-primary' : 'button-ghost'}`}
              >
                {link.label} <ArrowUpRight />
              </a>
            );
          })}
        </div>
      </section>
      <section className="case-cover">
        {project.coverUrl ? <div className="case-cover-img" style={{ backgroundImage: `url('${project.coverUrl}')` }} aria-label={`Tampilan utama ${project.title}`} role="img" onContextMenu={(e) => e.preventDefault()} /> : <div><span>PROJECT VISUAL</span><BrainCircuit /><small>Tambahkan screenshot utama melalui Admin</small></div>}
      </section>
      <section className="case-overview">
        <div><span>01</span><p>Project role</p><strong>{project.role}</strong></div>
        <div><span>02</span><p>Category</p><strong>{project.category}</strong></div>
        <div><span>03</span><p>Evaluation</p><strong>{project.metric || "Add project metric"}</strong></div>
      </section>
      <section className="case-details">
        {detailItems.map((item, index) => <article key={item.label}><div className="case-detail-number">{String(index + 1).padStart(2, "0")}</div><item.icon /><div><p>{item.label}</p><h2>{item.label === "Evaluation" ? "What the results show" : item.label}</h2><p>{item.value}</p></div></article>)}
      </section>
      {(project.galleryUrls?.length || 0) > 0 && <section className="case-gallery"><div><p>Visual breakdown</p><h2>Interface &amp; project gallery</h2></div><div>{project.galleryUrls!.map((url, index) => <div className="case-gallery-img" style={{ backgroundImage: `url('${url}')` }} aria-label={`${project.title} gallery ${index + 1}`} role="img" onContextMenu={(e) => e.preventDefault()} key={url} />)}</div></section>}
      <section className="case-footer"><div><p>Explore another idea</p><h2>Return to the complete portfolio.</h2></div><Link className="button button-primary" href="/#projects">All projects <ArrowUpRight /></Link></section>
    </main>
  );
}
