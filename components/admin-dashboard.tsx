"use client";
/* eslint-disable @next/next/no-img-element -- media URLs are supplied by the CMS at runtime */

import {
  Activity,
  ArrowUpRight,
  BookOpen,
  BriefcaseBusiness,
  Check,
  ChevronRight,
  Code2,
  Eye,
  FileText,
  FolderKanban,
  Image as ImageIcon,
  Inbox,
  LayoutDashboard,
  LogOut,
  MonitorSmartphone,
  Pencil,
  Plus,
  Save,
  Settings,
  Sparkles,
  Trash2,
  Upload,
  UserRound,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { toast } from "sonner";
import type { AuthUser } from "@/app/auth";
import { defaultPortfolio, type PortfolioContent, type PortfolioProject } from "@/lib/default-content";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Toaster } from "@/components/ui/sonner";
import { Skeleton } from "@/components/ui/skeleton";

type Section = "dashboard" | "profile" | "projects" | "skills" | "experience" | "certificates" | "gallery" | "messages" | "media" | "settings" | "guide";
type EditableContent = Omit<PortfolioContent, "projects">;
type Message = { id: number; name: string; email: string; message: string; status: string; createdAt: string };
type MediaAsset = { id: number; filename: string; contentType: string; size: number; altText: string; url: string; createdAt: string };
type ActivityLog = { id: number; action: string; entity: string; actorEmail: string; createdAt: string };
type DashboardData = { counts: { projects: number; published: number; unread: number; media: number }; recent: ActivityLog[] };

const blankProject: PortfolioProject & { sortOrder: number } = {
  id: "",
  slug: "",
  title: "",
  category: "AI / ML",
  year: new Date().getFullYear().toString(),
  summary: "",
  role: "",
  stack: [],
  metric: "",
  problem: "",
  solution: "",
  dataset: "",
  method: "",
  evaluation: "",
  galleryUrls: [],
  accent: "blue",
  featured: false,
  status: "draft",
  coverUrl: "",
  liveUrl: "",
  githubUrl: "",
  sortOrder: 0,
};

const defaultContent: EditableContent = {
  profile: defaultPortfolio.profile,
  stats: defaultPortfolio.stats,
  skills: defaultPortfolio.skills,
  experience: defaultPortfolio.experience,
  certificates: defaultPortfolio.certificates,
  gallery: defaultPortfolio.gallery || [],
  seo: defaultPortfolio.seo,
  socialLinks: defaultPortfolio.socialLinks,
};

const navItems: Array<{ id: Section; label: string; icon: typeof LayoutDashboard }> = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "profile", label: "Beranda & Profil", icon: UserRound },
  { id: "projects", label: "Proyek", icon: FolderKanban },
  { id: "skills", label: "Teknologi", icon: Code2 },
  { id: "experience", label: "Pengalaman", icon: BriefcaseBusiness },
  { id: "certificates", label: "Sertifikat", icon: FileText },
  { id: "gallery", label: "Galeri 3D", icon: ImageIcon },
  { id: "messages", label: "Pesan", icon: Inbox },
  { id: "media", label: "Media", icon: Upload },
  { id: "settings", label: "Statistik & Sosial", icon: Settings },
  { id: "guide", label: "Panduan Aset", icon: BookOpen },
];

export function AdminDashboard({ user }: { user: AuthUser }) {
  const [section, setSection] = useState<Section>("dashboard");
  const [content, setContent] = useState<EditableContent>(defaultContent);
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [media, setMedia] = useState<MediaAsset[]>([]);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [projectDraft, setProjectDraft] = useState(blankProject);
  const [deleteProject, setDeleteProject] = useState<PortfolioProject | null>(null);
  const [deleteMessage, setDeleteMessage] = useState<Message | null>(null);
  const [deleteMedia, setDeleteMedia] = useState<MediaAsset | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const [contentResponse, projectsResponse, messagesResponse, mediaResponse, dashboardResponse] = await Promise.all([
        fetch("/api/admin/content", { cache: "no-store" }),
        fetch("/api/admin/projects", { cache: "no-store" }),
        fetch("/api/admin/messages", { cache: "no-store" }),
        fetch("/api/admin/media", { cache: "no-store" }),
        fetch("/api/admin/dashboard", { cache: "no-store" }),
      ]);
      if ([contentResponse, projectsResponse, messagesResponse, mediaResponse, dashboardResponse].some((response) => !response.ok)) {
        throw new Error("Beberapa data admin belum dapat dimuat.");
      }
      const [contentData, projectData, messageData, mediaData, dashboardData] = await Promise.all([
        contentResponse.json(), projectsResponse.json(), messagesResponse.json(), mediaResponse.json(), dashboardResponse.json(),
      ]);
      setContent(contentData);
      setProjects(projectData.projects);
      setMessages(messageData.messages);
      setMedia(mediaData.media);
      setDashboard(dashboardData);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Data admin gagal dimuat.";
      setLoadError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const task = window.setTimeout(() => void loadData(), 0);
    return () => window.clearTimeout(task);
  }, [loadData]);

  async function saveContent(nextContent = content) {
    setSaving(true);
    try {
      const response = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(nextContent),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok) throw new Error(getApiError(result, "Periksa kembali data yang belum lengkap."));
      toast.success("Perubahan berhasil disimpan.");
      await refreshDashboard();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Perubahan gagal disimpan.");
    } finally {
      setSaving(false);
    }
  }

  async function refreshDashboard() {
    const response = await fetch("/api/admin/dashboard", { cache: "no-store" });
    if (response.ok) setDashboard(await response.json());
  }

  function openNewProject() {
    setProjectDraft({ ...blankProject, id: crypto.randomUUID(), sortOrder: projects.length });
    setProjectDialogOpen(true);
  }

  function openEditProject(project: PortfolioProject) {
    setProjectDraft({ ...blankProject, ...project, sortOrder: projects.findIndex((item) => item.id === project.id) });
    setProjectDialogOpen(true);
  }

  async function saveProject() {
    setSaving(true);
    const normalized = {
      ...projectDraft,
      id: projectDraft.id || crypto.randomUUID(),
      slug: projectDraft.slug || slugify(projectDraft.title),
      stack: projectDraft.stack.filter(Boolean),
    };
    try {
      const response = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(normalized),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(getApiError(result, "Proyek gagal disimpan."));
      setProjects((current) => {
        const exists = current.some((item) => item.id === result.project.id);
        return exists ? current.map((item) => item.id === result.project.id ? result.project : item) : [...current, result.project];
      });
      setProjectDialogOpen(false);
      toast.success("Proyek berhasil disimpan.");
      await refreshDashboard();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Proyek gagal disimpan.");
    } finally {
      setSaving(false);
    }
  }

  async function removeProject() {
    if (!deleteProject) return;
    try {
      const response = await fetch(`/api/admin/projects?id=${encodeURIComponent(deleteProject.id)}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Proyek gagal dihapus.");
      setProjects((current) => current.filter((item) => item.id !== deleteProject.id));
      toast.success("Proyek dihapus.");
      await refreshDashboard();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Proyek gagal dihapus.");
    } finally {
      setDeleteProject(null);
    }
  }

  async function updateMessage(id: number, status: string) {
    try {
      const response = await fetch("/api/admin/messages", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!response.ok) throw new Error("Status pesan gagal diperbarui.");
      setMessages((current) => current.map((message) => message.id === id ? { ...message, status } : message));
      toast.success("Status pesan diperbarui.");
      await refreshDashboard();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Status pesan gagal diperbarui.");
    }
  }

  async function removeMessage() {
    if (!deleteMessage) return;
    try {
      const response = await fetch(`/api/admin/messages?id=${deleteMessage.id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Pesan gagal dihapus.");
      setMessages((current) => current.filter((message) => message.id !== deleteMessage.id));
      toast.success("Pesan dihapus.");
      await refreshDashboard();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Pesan gagal dihapus.");
    } finally {
      setDeleteMessage(null);
    }
  }

  async function uploadMedia(formData: FormData) {
    setSaving(true);
    try {
      const response = await fetch("/api/admin/media", { method: "POST", body: formData });
      const result = await response.json().catch(() => null);
      if (!response.ok) throw new Error(getApiError(result, "Media gagal diunggah."));
      setMedia((current) => [result.asset, ...current]);
      toast.success("Media berhasil diunggah.");
      await refreshDashboard();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Media gagal diunggah.");
      throw error;
    } finally {
      setSaving(false);
    }
  }

  async function removeMedia() {
    if (!deleteMedia) return;
    try {
      const response = await fetch(`/api/admin/media?id=${deleteMedia.id}`, { method: "DELETE" });
      const result = await response.json().catch(() => null);
      if (!response.ok) throw new Error(getApiError(result, "Media gagal dihapus."));
      setMedia((current) => current.filter((asset) => asset.id !== deleteMedia.id));
      toast.success("Media dihapus.");
      await refreshDashboard();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Media gagal dihapus.");
    } finally {
      setDeleteMedia(null);
    }
  }

  const activeLabel = navItems.find((item) => item.id === section)?.label || "Dashboard";

  return (
    <SidebarProvider>
      <Sidebar variant="inset" collapsible="icon" className="admin-sidebar">
        <SidebarHeader className="p-3 group-data-[collapsible=icon]:p-1.5">
          <a href="/admin" className="flex items-center gap-3 rounded-xl border border-sidebar-border bg-white p-2.5 group-data-[collapsible=icon]:p-1.5 group-data-[collapsible=icon]:justify-center shadow-xs">
            <img src="/images/icon.png" alt="TRS Logo" className="size-8 rounded-lg object-contain shrink-0 shadow-xs" />
            <span className="grid text-sm leading-tight group-data-[collapsible=icon]:hidden"><strong>Portfolio CMS</strong><small className="text-muted-foreground">Admin Studio</small></span>
          </a>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">Workspace</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton isActive={section === item.id} tooltip={item.label} onClick={() => setSection(item.id)}>
                      <item.icon /><span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="p-3 group-data-[collapsible=icon]:p-1.5">
          <div className="rounded-xl border border-sidebar-border bg-white p-3 text-xs group-data-[collapsible=icon]:hidden shadow-xs">
            <strong className="block truncate">{user.displayName}</strong>
            <span className="block truncate text-muted-foreground">{user.email}</span>
          </div>
          <a href="/signout?return_to=/" className="flex items-center gap-2 rounded-lg px-2 py-2 text-xs text-muted-foreground hover:bg-sidebar-accent group-data-[collapsible=icon]:justify-center" title="Keluar">
            <LogOut className="size-4" /><span className="group-data-[collapsible=icon]:hidden">Keluar</span>
          </a>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset className="admin-inset">
        <header className="admin-topbar">
          <div className="flex items-center gap-3"><SidebarTrigger /><div><p className="admin-breadcrumb">Portfolio / {activeLabel}</p><h1>{activeLabel}</h1></div></div>
          <div className="flex items-center gap-2">
            <Button variant="outline" asChild><a href="/" target="_blank">Lihat website <ArrowUpRight /></a></Button>
            {section !== "dashboard" && section !== "projects" && section !== "messages" && section !== "media" && section !== "guide" && (
              <Button onClick={() => void saveContent()} disabled={saving}><Save /> {saving ? "Menyimpan" : "Simpan"}</Button>
            )}
          </div>
        </header>
        <div className="admin-content">
          {loading ? <LoadingState /> : loadError ? <AdminErrorState message={loadError} retry={loadData} /> : (
            <>
              {section === "dashboard" && <DashboardOverview data={dashboard} setSection={setSection} />}
              {section === "profile" && <ProfileEditor content={content} setContent={setContent} media={media} />}
              {section === "projects" && <ProjectsEditor projects={projects} openNew={openNewProject} openEdit={openEditProject} requestDelete={setDeleteProject} />}
              {section === "skills" && <SkillsEditor content={content} setContent={setContent} />}
              {section === "experience" && <ExperienceEditor content={content} setContent={setContent} />}
              {section === "certificates" && <CertificatesEditor content={content} setContent={setContent} />}
              {section === "gallery" && <GalleryEditor content={content} setContent={setContent} media={media} />}
              {section === "messages" && <MessagesEditor messages={messages} updateMessage={updateMessage} requestDelete={setDeleteMessage} />}
              {section === "media" && <MediaEditor media={media} uploadMedia={uploadMedia} requestDelete={setDeleteMedia} saving={saving} />}
              {section === "settings" && <SettingsEditor content={content} setContent={setContent} />}
              {section === "guide" && <AssetGuide />}
            </>
          )}
        </div>
      </SidebarInset>

      <ProjectDialog open={projectDialogOpen} onOpenChange={setProjectDialogOpen} project={projectDraft} setProject={setProjectDraft} save={saveProject} saving={saving} />
      <AlertDialog open={Boolean(deleteProject)} onOpenChange={(open) => { if (!open) setDeleteProject(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Hapus proyek?</AlertDialogTitle><AlertDialogDescription>Proyek “{deleteProject?.title}” akan dihapus dari website. Tindakan ini tidak menghapus file media yang pernah digunakan.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Batal</AlertDialogCancel><AlertDialogAction variant="destructive" onClick={() => void removeProject()}>Hapus</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={Boolean(deleteMessage)} onOpenChange={(open) => { if (!open) setDeleteMessage(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Hapus pesan?</AlertDialogTitle><AlertDialogDescription>Pesan dari “{deleteMessage?.name}” akan dihapus permanen dari inbox.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Batal</AlertDialogCancel><AlertDialogAction variant="destructive" onClick={() => void removeMessage()}>Hapus</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={Boolean(deleteMedia)} onOpenChange={(open) => { if (!open) setDeleteMedia(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Hapus media?</AlertDialogTitle><AlertDialogDescription>File “{deleteMedia?.filename}” akan dihapus dari penyimpanan. Pastikan URL file tidak lagi dipakai pada profil atau proyek.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Batal</AlertDialogCancel><AlertDialogAction variant="destructive" onClick={() => void removeMedia()}>Hapus</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Toaster position="top-right" richColors />
    </SidebarProvider>
  );
}

function DashboardOverview({ data, setSection }: { data: DashboardData | null; setSection: (section: Section) => void }) {
  const cards = [
    { label: "Semua proyek", value: data?.counts.projects || 0, icon: FolderKanban, section: "projects" as Section },
    { label: "Dipublikasikan", value: data?.counts.published || 0, icon: Eye, section: "projects" as Section },
    { label: "Pesan baru", value: data?.counts.unread || 0, icon: Inbox, section: "messages" as Section },
    { label: "Media", value: data?.counts.media || 0, icon: ImageIcon, section: "media" as Section },
  ];
  return <div className="admin-stack">
    <section className="admin-welcome"><div><Badge variant="outline">Portfolio control center</Badge><h2>Kelola portofolio dari satu tempat.</h2><p>Perbarui profil, proyek AI, screenshot, pengalaman, dan pesan tanpa menyentuh kode.</p></div><div className="admin-orbit"><BrainDecoration /></div></section>
    <section className="admin-metric-grid">{cards.map((card) => <button key={card.label} onClick={() => setSection(card.section)}><card.icon /><span>{card.label}</span><strong>{card.value}</strong><ChevronRight /></button>)}</section>
    <section className="admin-panel"><div className="admin-panel-heading"><div><p className="admin-eyebrow">Recent activity</p><h3>Aktivitas terbaru</h3></div><Activity /></div><div className="activity-list">{data?.recent.length ? data.recent.map((item) => <div key={item.id}><span className="activity-dot" /><div><strong>{item.action} {item.entity}</strong><p>{item.actorEmail}</p></div><time>{formatDate(item.createdAt)}</time></div>) : <EmptyText text="Belum ada aktivitas. Mulai dengan memperbarui profil atau proyek." />}</div></section>
  </div>;
}

function ProfileEditor({ content, setContent, media }: { content: EditableContent; setContent: (value: EditableContent) => void; media: MediaAsset[] }) {
  const profile = content.profile;
  const update = (key: keyof typeof profile, value: string) => setContent({ ...content, profile: { ...profile, [key]: value } });
  return <div className="admin-grid-two">
    <section className="admin-panel"><div className="admin-panel-heading"><div><p className="admin-eyebrow">Hero content</p><h3>Identitas utama</h3></div><UserRound /></div><div className="admin-form-grid">
      <Field label="Nama lengkap"><Input value={profile.name} onChange={(event) => update("name", event.target.value)} /></Field>
      <Field label="Inisial"><Input value={profile.initials} maxLength={4} onChange={(event) => update("initials", event.target.value.toUpperCase())} /></Field>
      <Field label="Headline"><Input value={profile.headline} onChange={(event) => update("headline", event.target.value)} /></Field>
      <Field label="Subheadline"><Input value={profile.subheadline} onChange={(event) => update("subheadline", event.target.value)} /></Field>
      <Field label="Email"><Input type="email" value={profile.email} onChange={(event) => update("email", event.target.value)} /></Field>
      <Field label="Lokasi"><Input value={profile.location} onChange={(event) => update("location", event.target.value)} /></Field>
      <Field label="Universitas"><Input value={profile.university} onChange={(event) => update("university", event.target.value)} /></Field>
      <Field label="Program dan peminatan"><Input value={profile.program} onChange={(event) => update("program", event.target.value)} /></Field>
      <Field label="Status ketersediaan" wide><Input value={profile.availability} onChange={(event) => update("availability", event.target.value)} /></Field>
      <Field label="Bio" wide><Textarea rows={6} value={profile.bio} onChange={(event) => update("bio", event.target.value)} /></Field>
    </div></section>
    <section className="admin-panel"><div className="admin-panel-heading"><div><p className="admin-eyebrow">Visual identity</p><h3>Foto dan dokumen</h3></div><ImageIcon /></div><div className="profile-preview"><div className="profile-preview-photo">{profile.photoUrl ? <img src={profile.photoUrl} alt="Preview profil" /> : profile.initials}</div><div><strong>{profile.name}</strong><span>{profile.subheadline}</span></div></div><div className="admin-form-stack"><Field label="URL foto profil"><Input value={profile.photoUrl || ""} placeholder="Pilih dari Media atau masukkan URL" onChange={(event) => update("photoUrl", event.target.value)} /></Field><Field label="URL CV PDF"><Input value={profile.cvUrl || ""} placeholder="/media/portfolio/...pdf" onChange={(event) => update("cvUrl", event.target.value)} /></Field>{media.length > 0 && <div><Label>Media terbaru</Label><div className="media-quick-list">{media.slice(0, 6).map((asset) => <button key={asset.id} onClick={() => update(asset.contentType === "application/pdf" ? "cvUrl" : "photoUrl", asset.url)}>{asset.contentType.startsWith("image/") ? <img src={asset.url} alt={asset.altText || asset.filename} /> : <FileText />}</button>)}</div></div>}</div></section>
  </div>;
}

function ProjectsEditor({ projects, openNew, openEdit, requestDelete }: { projects: PortfolioProject[]; openNew: () => void; openEdit: (project: PortfolioProject) => void; requestDelete: (project: PortfolioProject) => void }) {
  if (projects.length === 0) {
    return <section className="admin-panel"><div className="admin-panel-heading"><div><p className="admin-eyebrow">Case studies</p><h3>Daftar proyek</h3><p>Kelola proyek AI, machine learning, dan website.</p></div><Button onClick={openNew}><Plus /> Tambah proyek</Button></div><EmptyText text="Belum ada proyek. Tambahkan proyek pertama Anda." /></section>;
  }
  return <section className="admin-panel"><div className="admin-panel-heading"><div><p className="admin-eyebrow">Case studies</p><h3>Daftar proyek</h3><p>Kelola proyek AI, machine learning, dan website.</p></div><Button onClick={openNew}><Plus /> Tambah proyek</Button></div><div className="admin-table-wrap"><Table><TableHeader><TableRow><TableHead>Proyek</TableHead><TableHead>Kategori</TableHead><TableHead>Status</TableHead><TableHead>Tahun</TableHead><TableHead className="text-right">Aksi</TableHead></TableRow></TableHeader><TableBody>{projects.map((project) => <TableRow key={project.id}><TableCell><div className="project-table-title"><span className={`project-swatch ${project.accent}`} /> <div><strong>{project.title}</strong><small>{project.role}</small></div></div></TableCell><TableCell>{project.category}</TableCell><TableCell><Badge variant={project.status === "published" ? "default" : "secondary"}>{project.status}</Badge></TableCell><TableCell>{project.year}</TableCell><TableCell><div className="flex justify-end gap-1"><Button variant="ghost" size="icon" onClick={() => openEdit(project)} aria-label="Edit proyek"><Pencil /></Button><Button variant="ghost" size="icon" onClick={() => requestDelete(project)} aria-label="Hapus proyek"><Trash2 /></Button></div></TableCell></TableRow>)}</TableBody></Table></div></section>;
}

function SkillsEditor({ content, setContent }: { content: EditableContent; setContent: (value: EditableContent) => void }) {
  const update = (index: number, field: "name" | "group" | "level", value: string) => setContent({ ...content, skills: content.skills.map((skill, skillIndex) => skillIndex === index ? { ...skill, [field]: value } : skill) });
  return <section className="admin-panel"><div className="admin-panel-heading"><div><p className="admin-eyebrow">Technical toolkit</p><h3>Teknologi dan kemampuan</h3></div><Button variant="outline" onClick={() => setContent({ ...content, skills: [...content.skills, { name: "", group: "", level: "Currently Learning" }] })}><Plus /> Tambah</Button></div><div className="repeat-editor">{content.skills.map((skill, index) => <div key={index} className="repeat-row"><span className="repeat-index">{String(index + 1).padStart(2, "0")}</span><Input aria-label="Nama teknologi" placeholder="Python" value={skill.name} onChange={(event) => update(index, "name", event.target.value)} /><Input aria-label="Kategori" placeholder="Programming" value={skill.group} onChange={(event) => update(index, "group", event.target.value)} /><Input aria-label="Tingkat penggunaan" placeholder="Comfortable" value={skill.level} onChange={(event) => update(index, "level", event.target.value)} /><Button variant="ghost" size="icon" onClick={() => setContent({ ...content, skills: content.skills.filter((_, skillIndex) => skillIndex !== index) })}><Trash2 /></Button></div>)}</div></section>;
}

function ExperienceEditor({ content, setContent }: { content: EditableContent; setContent: (value: EditableContent) => void }) {
  const update = (index: number, field: keyof EditableContent["experience"][number], value: string) => setContent({ ...content, experience: content.experience.map((item, itemIndex) => itemIndex === index ? { ...item, [field]: value } : item) });
  return <section className="admin-panel"><div className="admin-panel-heading"><div><p className="admin-eyebrow">Timeline</p><h3>Pendidikan dan pengalaman</h3></div><Button variant="outline" onClick={() => setContent({ ...content, experience: [...content.experience, { period: "", title: "", organization: "", description: "" }] })}><Plus /> Tambah</Button></div><div className="experience-editor">{content.experience.map((item, index) => <article key={index}><div className="experience-editor-head"><span>{String(index + 1).padStart(2, "0")}</span><Button variant="ghost" size="icon" onClick={() => setContent({ ...content, experience: content.experience.filter((_, itemIndex) => itemIndex !== index) })}><Trash2 /></Button></div><div className="admin-form-grid"><Field label="Periode"><Input value={item.period} onChange={(event) => update(index, "period", event.target.value)} /></Field><Field label="Organisasi"><Input value={item.organization} onChange={(event) => update(index, "organization", event.target.value)} /></Field><Field label="Posisi" wide><Input value={item.title} onChange={(event) => update(index, "title", event.target.value)} /></Field><Field label="Deskripsi" wide><Textarea rows={4} value={item.description} onChange={(event) => update(index, "description", event.target.value)} /></Field></div></article>)}</div></section>;
}

function CertificatesEditor({ content, setContent }: { content: EditableContent; setContent: (value: EditableContent) => void }) {
  const update = (index: number, field: keyof EditableContent["certificates"][number], value: string) => setContent({
    ...content,
    certificates: content.certificates.map((item, itemIndex) => itemIndex === index ? { ...item, [field]: value } : item),
  });
  return <section className="admin-panel"><div className="admin-panel-heading"><div><p className="admin-eyebrow">Credentials</p><h3>Sertifikat dan pencapaian</h3></div><Button variant="outline" onClick={() => setContent({ ...content, certificates: [...content.certificates, { id: crypto.randomUUID(), title: "", issuer: "", year: new Date().getFullYear().toString(), credentialUrl: "", imageUrl: "" }] })}><Plus /> Tambah</Button></div><div className="experience-editor">{content.certificates.map((item, index) => <article key={item.id}><div className="experience-editor-head"><span>{String(index + 1).padStart(2, "0")}</span><Button variant="ghost" size="icon" onClick={() => setContent({ ...content, certificates: content.certificates.filter((certificate) => certificate.id !== item.id) })}><Trash2 /></Button></div><div className="admin-form-grid"><Field label="Nama sertifikat"><Input value={item.title} onChange={(event) => update(index, "title", event.target.value)} /></Field><Field label="Penerbit"><Input value={item.issuer} onChange={(event) => update(index, "issuer", event.target.value)} /></Field><Field label="Tahun"><Input value={item.year} onChange={(event) => update(index, "year", event.target.value)} /></Field><Field label="Credential URL"><Input value={item.credentialUrl || ""} placeholder="https://" onChange={(event) => update(index, "credentialUrl", event.target.value)} /></Field><Field label="URL gambar" wide><Input value={item.imageUrl || ""} placeholder="/media/portfolio/...webp" onChange={(event) => update(index, "imageUrl", event.target.value)} /></Field></div></article>)}{!content.certificates.length && <EmptyText text="Belum ada sertifikat. Tambahkan sertifikat yang relevan dengan AI dan software development." />}</div></section>;
}

function GalleryEditor({ content, setContent, media }: { content: EditableContent; setContent: (value: EditableContent) => void; media: MediaAsset[] }) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const gallery = content.gallery || [];
  
  const update = (index: number, field: keyof NonNullable<EditableContent["gallery"]>[number], value: string) => {
    setContent({
      ...content,
      gallery: gallery.map((item, itemIndex) => (itemIndex === index ? { ...item, [field]: value } : item)),
    });
  };

  const addItem = () => {
    setContent({
      ...content,
      gallery: [
        ...gallery,
        {
          id: crypto.randomUUID(),
          title: "Lokasi Baru",
          subtitle: "Click to learn more",
          imageUrl: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80",
          flag: "📍",
        },
      ],
    });
  };

  const confirmRemove = () => {
    if (!deleteId) return;
    setContent({
      ...content,
      gallery: gallery.filter((item) => item.id !== deleteId),
    });
    setDeleteId(null);
  };

  return (
    <div className="admin-stack">
      <section className="admin-panel">
        <div className="admin-panel-heading">
          <div>
            <p className="admin-eyebrow">Visual 3D Showcase</p>
            <h3>Galeri Foto 3D Coverflow</h3>
            <p>Kelola koleksi foto yang akan ditampilkan dalam animasi 3D interaktif di beranda.</p>
          </div>
          <Button onClick={addItem}><Plus /> Tambah Foto Galeri</Button>
        </div>

        <div className="experience-editor">
          {gallery.map((item, index) => (
            <article key={item.id}>
              <div className="experience-editor-head">
                <div className="flex items-center gap-3">
                  <span className="repeat-index">{String(index + 1).padStart(2, "0")}</span>
                  <strong>{item.title}</strong>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setDeleteId(item.id)}>
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </div>

              <div className="admin-grid-two mt-3">
                <div className="admin-form-grid">
                  <Field label="Judul / Nama Tempat">
                    <Input
                      value={item.title}
                      placeholder="e.g. Indonesia, Bali, Kantor"
                      onChange={(e) => update(index, "title", e.target.value)}
                    />
                  </Field>
                  <Field label="Ikon Emoji / Bendera">
                    <Input
                      value={item.flag || ""}
                      placeholder="🇮🇩 / 📍 / 📸"
                      onChange={(e) => update(index, "flag", e.target.value)}
                    />
                  </Field>
                  <Field label="Subjudul / Deskripsi Singkat" wide>
                    <Input
                      value={item.subtitle || ""}
                      placeholder="Click to learn more / Dokumentasi KKN 2024"
                      onChange={(e) => update(index, "subtitle", e.target.value)}
                    />
                  </Field>
                  <Field label="URL Foto Gambar" wide>
                    <Input
                      value={item.imageUrl}
                      placeholder="https://... atau pilih dari daftar media di samping"
                      onChange={(e) => update(index, "imageUrl", e.target.value)}
                    />
                  </Field>
                </div>

                <div className="flex flex-col items-center justify-center p-3 border rounded-xl bg-muted/20">
                  <Label className="mb-2 text-xs">Preview Tampilan</Label>
                  <div className="w-40 h-56 rounded-2xl overflow-hidden shadow-md border relative group bg-black">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-2 text-white">
                      <span className="text-xs font-bold flex items-center gap-1">
                        {item.flag} {item.title}
                      </span>
                      <small className="text-[10px] opacity-70">{item.subtitle}</small>
                    </div>
                  </div>

                  {media.length > 0 && (
                    <div className="mt-3 w-full">
                      <Label className="text-[11px] text-muted-foreground">Pilih dari Media:</Label>
                      <div className="media-quick-list mt-1">
                        {media.slice(0, 6).map((asset) => (
                          <button
                            type="button"
                            key={asset.id}
                            title={asset.filename}
                            onClick={() => update(index, "imageUrl", asset.url)}
                          >
                            {asset.contentType.startsWith("image/") ? (
                              <img src={asset.url} alt={asset.altText || asset.filename} />
                            ) : (
                              <FileText className="size-4" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))}

          {!gallery.length && (
            <EmptyText text="Belum ada foto dalam galeri 3D. Klik 'Tambah Foto Galeri' untuk menambahkan." />
          )}
        </div>
      </section>

      <AlertDialog open={Boolean(deleteId)} onOpenChange={(open) => { if (!open) setDeleteId(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus foto ini?</AlertDialogTitle>
            <AlertDialogDescription>Foto ini akan dihapus dari daftar Galeri 3D. Perubahan baru akan tersimpan di website setelah Anda menekan tombol Simpan di atas.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={confirmRemove}>Hapus</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function MessagesEditor({ messages, updateMessage, requestDelete }: { messages: Message[]; updateMessage: (id: number, status: string) => Promise<void>; requestDelete: (message: Message) => void }) {
  return <div className="message-list">{messages.length ? messages.map((message) => <article className={message.status === "unread" ? "admin-panel message-card unread" : "admin-panel message-card"} key={message.id}><div className="message-avatar">{message.name.slice(0, 2).toUpperCase()}</div><div><div className="message-meta"><div><h3>{message.name}</h3><a href={`mailto:${message.email}`}>{message.email}</a></div><Badge variant={message.status === "unread" ? "default" : "secondary"}>{message.status}</Badge></div><p>{message.message}</p><div className="message-actions"><Button size="sm" variant="outline" asChild><a href={`mailto:${message.email}`}>Balas <ArrowUpRight /></a></Button>{message.status === "unread" && <Button size="sm" variant="ghost" onClick={() => void updateMessage(message.id, "read")}><Check /> Tandai dibaca</Button>}<Button size="sm" variant="ghost" onClick={() => void updateMessage(message.id, "archived")}>Arsipkan</Button><Button size="sm" variant="ghost" onClick={() => requestDelete(message)}><Trash2 /> Hapus</Button><time>{formatDate(message.createdAt)}</time></div></div></article>) : <section className="admin-panel"><EmptyText text="Belum ada pesan masuk." /></section>}</div>;
}

function MediaEditor({ media, uploadMedia, requestDelete, saving }: { media: MediaAsset[]; uploadMedia: (form: FormData) => Promise<void>; requestDelete: (asset: MediaAsset) => void; saving: boolean }) {
  const [file, setFile] = useState<File | null>(null);
  const [altText, setAltText] = useState("");
  return <div className="admin-stack"><section className="admin-panel upload-panel"><Upload /><div><h3>Unggah media</h3><p>JPG, PNG, WebP, AVIF, atau PDF. Maksimal 8 MB per file.</p></div><Input type="file" accept="image/jpeg,image/png,image/webp,image/avif,application/pdf" onChange={(event) => setFile(event.target.files?.[0] || null)} /><Input value={altText} placeholder="Alt text untuk aksesibilitas" onChange={(event) => setAltText(event.target.value)} /><Button disabled={!file || saving} onClick={() => { if (!file) return; if (file.type.startsWith("image/") && !altText.trim()) { toast.error("Isi alt text sebelum mengunggah gambar."); return; } const form = new FormData(); form.set("file", file); form.set("altText", altText); void uploadMedia(form).then(() => { setFile(null); setAltText(""); }).catch(() => undefined); }}><Upload /> {saving ? "Mengunggah" : "Upload"}</Button></section><section className="media-grid">{media.map((asset) => <article className="admin-panel media-card" key={asset.id}>{asset.contentType.startsWith("image/") ? <img src={asset.url} alt={asset.altText || asset.filename} /> : <div className="media-pdf"><FileText /></div>}<div><strong title={asset.filename}>{asset.filename}</strong><span>{formatBytes(asset.size)}</span><div className="media-card-actions"><button onClick={() => navigator.clipboard.writeText(asset.url).then(() => toast.success("URL disalin.")).catch(() => toast.error("URL gagal disalin."))}>Salin URL</button><button className="danger" onClick={() => requestDelete(asset)}>Hapus</button></div></div></article>)}{!media.length && <div className="admin-panel"><EmptyText text="Belum ada media. Unggah foto profil atau screenshot pertama Anda." /></div>}</section></div>;
}

function SettingsEditor({ content, setContent }: { content: EditableContent; setContent: (value: EditableContent) => void }) {
  const updateStat = (index: number, field: "value" | "label", value: string) => setContent({ ...content, stats: content.stats.map((stat, statIndex) => statIndex === index ? { ...stat, [field]: value } : stat) });
  const updateSocial = (index: number, field: "label" | "href", value: string) => setContent({ ...content, socialLinks: content.socialLinks.map((link, linkIndex) => linkIndex === index ? { ...link, [field]: value } : link) });
  return <div className="admin-stack"><div className="admin-grid-two"><section className="admin-panel"><div className="admin-panel-heading"><div><p className="admin-eyebrow">Homepage numbers</p><h3>Statistik</h3></div><MonitorSmartphone /></div><div className="repeat-editor">{content.stats.map((stat, index) => <div className="repeat-row settings-row" key={index}><Input aria-label="Nilai" value={stat.value} onChange={(event) => updateStat(index, "value", event.target.value)} /><Input aria-label="Label" value={stat.label} onChange={(event) => updateStat(index, "label", event.target.value)} /></div>)}</div></section><section className="admin-panel"><div className="admin-panel-heading"><div><p className="admin-eyebrow">Social presence</p><h3>Tautan sosial</h3></div><Button variant="outline" size="sm" onClick={() => setContent({ ...content, socialLinks: [...content.socialLinks, { label: "", href: "https://" }] })}><Plus /> Tambah</Button></div><div className="repeat-editor">{content.socialLinks.map((link, index) => <div className="repeat-row social-row" key={index}><Input aria-label="Nama platform" value={link.label} onChange={(event) => updateSocial(index, "label", event.target.value)} /><Input aria-label="URL" value={link.href} onChange={(event) => updateSocial(index, "href", event.target.value)} /><Button variant="ghost" size="icon" onClick={() => setContent({ ...content, socialLinks: content.socialLinks.filter((_, linkIndex) => linkIndex !== index) })}><Trash2 /></Button></div>)}</div></section></div><section className="admin-panel"><div className="admin-panel-heading"><div><p className="admin-eyebrow">Search appearance</p><h3>SEO website</h3></div><Eye /></div><div className="admin-form-grid"><Field label="Meta title" wide><Input value={content.seo.title} maxLength={70} onChange={(event) => setContent({ ...content, seo: { ...content.seo, title: event.target.value } })} /></Field><Field label="Meta description" wide><Textarea rows={3} value={content.seo.description} maxLength={180} onChange={(event) => setContent({ ...content, seo: { ...content.seo, description: event.target.value } })} /></Field><Field label="Keywords" wide><Input value={content.seo.keywords} placeholder="AI portfolio, machine learning, ..." onChange={(event) => setContent({ ...content, seo: { ...content.seo, keywords: event.target.value } })} /></Field><Field label="Open Graph image URL" wide><Input value={content.seo.ogImageUrl || ""} placeholder="/media/portfolio/...webp" onChange={(event) => setContent({ ...content, seo: { ...content.seo, ogImageUrl: event.target.value } })} /></Field></div></section></div>;
}

function AssetGuide() {
  const items = [
    ["Foto hero", "portrait-hero.webp", "1600 × 2000 px", "WebP, maksimal 1.5 MB", "Foto setengah badan, background sederhana, pencahayaan rata, ruang kosong di sisi bahu."],
    ["Foto ID card", "portrait-id.webp", "1000 × 1000 px", "WebP, maksimal 700 KB", "Wajah menghadap kamera. Gunakan foto tanpa background atau background polos. Sistem akan menampilkan versi grayscale."],
    ["Screenshot website", "project-slug-desktop.webp", "1600 × 1000 px", "WebP, maksimal 900 KB", "Tangkap tampilan desktop tanpa tab browser. Gunakan ukuran yang sama untuk semua proyek."],
    ["Screenshot mobile", "project-slug-mobile.webp", "750 × 1624 px", "WebP, maksimal 600 KB", "Gunakan screenshot penuh atau mockup layar HP dengan margin konsisten."],
    ["Confusion matrix", "project-slug-matrix.webp", "1200 × 900 px", "WebP atau PNG", "Pastikan label kelas dan angka terbaca. Hindari screenshot notebook yang terlalu kecil."],
    ["CV", "cv-your-name.pdf", "A4", "PDF, maksimal 3 MB", "Satu sampai dua halaman. Aktifkan tautan dan gunakan nama file profesional."],
  ];
  return <div className="admin-stack"><section className="admin-welcome asset-guide-hero"><div><Badge variant="outline">Asset preparation</Badge><h2>Panduan visual yang konsisten.</h2><p>Ikuti ukuran, format, penamaan, dan komposisi ini sebelum mengunggah aset.</p></div><ImageIcon /></section><section className="asset-guide-grid">{items.map(([title, filename, dimensions, format, instruction], index) => <article className="admin-panel" key={title}><span className="asset-guide-index">{String(index + 1).padStart(2, "0")}</span><h3>{title}</h3><dl><div><dt>Nama file</dt><dd>{filename}</dd></div><div><dt>Ukuran</dt><dd>{dimensions}</dd></div><div><dt>Format</dt><dd>{format}</dd></div></dl><p>{instruction}</p></article>)}</section><section className="admin-panel"><div className="admin-panel-heading"><div><p className="admin-eyebrow">Icon guidance</p><h3>Ikon bergerak</h3></div><Sparkles /></div><div className="guide-copy"><p>Website sudah memakai ikon vektor dari Lucide. Ikon Brain, CPU, Network, Code, Database, dan Braces bergerak otomatis dengan CSS. Anda tidak perlu mengunggah ikon tersebut.</p><p>Jika ingin menambah logo teknologi resmi seperti Python atau TensorFlow, gunakan SVG resmi dengan kanvas persegi, viewBox yang rapi, dan warna asli merek. Simpan di folder <code>public/icons</code> atau unggah melalui Media setelah memastikan izin penggunaannya.</p><p>Jangan memakai screenshot logo. Jangan mencampur ikon outline dan ikon penuh dalam satu kelompok.</p></div></section></div>;
}

function ProjectDialog({ open, onOpenChange, project, setProject, save, saving }: { open: boolean; onOpenChange: (open: boolean) => void; project: typeof blankProject; setProject: (project: typeof blankProject) => void; save: () => Promise<void>; saving: boolean }) {
  const update = <K extends keyof typeof project>(key: K, value: typeof project[K]) => setProject({ ...project, [key]: value });
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-3xl"><DialogHeader><DialogTitle>{project.title ? "Edit proyek" : "Tambah proyek"}</DialogTitle><DialogDescription>Isi data inti, hasil model, teknologi, screenshot, dan tautan proyek.</DialogDescription></DialogHeader><div className="admin-form-grid dialog-form"><Field label="Judul proyek"><Input value={project.title} onChange={(event) => { update("title", event.target.value); if (!project.slug) update("slug", slugify(event.target.value)); }} /></Field><Field label="Slug URL"><Input value={project.slug} onChange={(event) => update("slug", slugify(event.target.value))} /></Field><Field label="Kategori"><Select value={project.category} onValueChange={(value) => update("category", value as PortfolioProject["category"])}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="AI / ML">AI / ML</SelectItem><SelectItem value="Computer Vision">Computer Vision</SelectItem><SelectItem value="NLP">NLP</SelectItem><SelectItem value="Web Development">Web Development</SelectItem></SelectContent></Select></Field><Field label="Tahun"><Input value={project.year} onChange={(event) => update("year", event.target.value)} /></Field><Field label="Peran"><Input value={project.role} onChange={(event) => update("role", event.target.value)} /></Field><Field label="Hasil singkat"><Input value={project.metric || ""} placeholder="Accuracy 94.2% / F1-score 0.91" onChange={(event) => update("metric", event.target.value)} /></Field><Field label="Ringkasan" wide><Textarea rows={4} value={project.summary} onChange={(event) => update("summary", event.target.value)} /></Field><Field label="Masalah" wide><Textarea rows={3} value={project.problem || ""} onChange={(event) => update("problem", event.target.value)} /></Field><Field label="Solusi" wide><Textarea rows={3} value={project.solution || ""} onChange={(event) => update("solution", event.target.value)} /></Field><Field label="Dataset" wide><Textarea rows={3} value={project.dataset || ""} placeholder="Nama, sumber, jumlah, kelas, dan pembagian data" onChange={(event) => update("dataset", event.target.value)} /></Field><Field label="Metode" wide><Textarea rows={3} value={project.method || ""} placeholder="Preprocessing, algoritma, arsitektur, dan parameter" onChange={(event) => update("method", event.target.value)} /></Field><Field label="Evaluasi" wide><Textarea rows={3} value={project.evaluation || ""} placeholder="Metrik, hasil eksperimen, dan keterbatasan" onChange={(event) => update("evaluation", event.target.value)} /></Field><Field label="Teknologi, pisahkan koma" wide><Input value={project.stack.join(", ")} onChange={(event) => update("stack", event.target.value.split(",").map((item) => item.trim()).filter(Boolean))} /></Field><Field label="URL screenshot utama" wide><Input value={project.coverUrl || ""} placeholder="/media/portfolio/...webp" onChange={(event) => update("coverUrl", event.target.value)} /></Field><Field label="URL galeri, satu URL per baris" wide><Textarea rows={4} value={(project.galleryUrls || []).join("\n")} onChange={(event) => update("galleryUrls", event.target.value.split("\n").map((item) => item.trim()).filter(Boolean))} /></Field><Field label="Live demo"><Input value={project.liveUrl || ""} placeholder="https://" onChange={(event) => update("liveUrl", event.target.value)} /></Field><Field label="GitHub"><Input value={project.githubUrl || ""} placeholder="https://github.com/..." onChange={(event) => update("githubUrl", event.target.value)} /></Field><Field label="Warna kartu"><Select value={project.accent} onValueChange={(value) => update("accent", value)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="blue">Blue</SelectItem><SelectItem value="violet">Violet</SelectItem><SelectItem value="lime">Lime</SelectItem></SelectContent></Select></Field><div className="switch-field"><div><Label>Featured project</Label><p>Tampilkan sebagai proyek unggulan.</p></div><Switch checked={project.featured} onCheckedChange={(checked) => update("featured", checked)} /></div><div className="switch-field"><div><Label>Published</Label><p>Draft tidak terlihat di website.</p></div><Switch checked={project.status === "published"} onCheckedChange={(checked) => update("status", checked ? "published" : "draft")} /></div></div><DialogFooter><Button variant="outline" onClick={() => onOpenChange(false)}>Batal</Button><Button onClick={() => void save()} disabled={saving}><Save /> {saving ? "Menyimpan" : "Simpan proyek"}</Button></DialogFooter></DialogContent></Dialog>;
}

function Field({ label, wide, children }: { label: string; wide?: boolean; children: ReactNode }) { return <label className={wide ? "field-wide" : ""}><Label>{label}</Label>{children}</label>; }
function EmptyText({ text }: { text: string }) { return <div className="admin-empty"><Inbox /><strong>{text}</strong></div>; }
function LoadingState() { return <div className="admin-stack"><Skeleton className="h-56 rounded-3xl" /><div className="grid gap-4 md:grid-cols-4">{Array.from({ length: 4 }, (_, index) => <Skeleton className="h-32 rounded-2xl" key={index} />)}</div><Skeleton className="h-80 rounded-3xl" /></div>; }
function AdminErrorState({ message, retry }: { message: string; retry: () => Promise<void> }) { return <section className="admin-panel"><div className="admin-empty"><Inbox /><strong>Data admin belum dapat dimuat.</strong><p>{message}</p><Button onClick={() => void retry()}>Coba lagi</Button></div></section>; }
function BrainDecoration() { return <div className="brain-decoration flex items-center justify-center"><img src="/images/icon.png" alt="TRS Brand Logo" className="size-20 object-contain drop-shadow-md" /></div>; }
function slugify(value: string) { return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }
function formatDate(value: string) { return new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)); }
function formatBytes(value: number) { return value < 1024 * 1024 ? `${Math.round(value / 1024)} KB` : `${(value / 1024 / 1024).toFixed(1)} MB`; }
function getApiError(payload: unknown, fallback: string) {
  if (!payload || typeof payload !== "object") return fallback;
  const result = payload as { error?: unknown; issues?: { fieldErrors?: Record<string, unknown> } };
  const firstFieldError = Object.values(result.issues?.fieldErrors || {}).flat().find((value): value is string => typeof value === "string");
  return firstFieldError || (typeof result.error === "string" ? result.error : fallback);
}
