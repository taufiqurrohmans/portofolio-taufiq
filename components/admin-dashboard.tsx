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
import { ProfileEditor } from "./admin/tabs/ProfileEditor";
import { ProjectEditor } from "./admin/tabs/ProjectEditor";
import { CertificatesEditor } from "./admin/tabs/CertificatesEditor";
import { ExperienceEditor } from "./admin/tabs/ExperienceEditor";
import { SkillsEditor } from "./admin/tabs/SkillsEditor";
import { GalleryEditor } from "./admin/tabs/GalleryEditor";
import { MediaManager, type MediaAsset } from "./admin/tabs/MediaManager";
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

  function onDeleteProject(project: PortfolioProject) {
    setDeleteProject(project);
  }

  async function saveProject(projectToSave: PortfolioProject) {
    setSaving(true);
    const normalized = {
      ...projectToSave,
      id: projectToSave.id || crypto.randomUUID(),
      slug: projectToSave.slug || slugify(projectToSave.title),
      stack: projectToSave.stack.filter(Boolean),
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
      return result.asset;
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
            {section !== "dashboard" && section !== "projects" && section !== "profile" && section !== "certificates" && section !== "experience" && section !== "skills" && section !== "gallery" && section !== "messages" && section !== "media" && section !== "guide" && (
              <Button onClick={() => void saveContent()} disabled={saving}><Save /> {saving ? "Menyimpan" : "Simpan"}</Button>
            )}
          </div>
        </header>
        <div className="admin-content">
          {loading ? <LoadingState /> : loadError ? <AdminErrorState message={loadError} retry={loadData} /> : (
            <>
              {section === "dashboard" && <DashboardOverview data={dashboard} setSection={setSection} />}
              {section === "profile" && <ProfileEditor profile={content.profile} seo={content.seo} onSave={async (profile, seo) => await saveContent({ ...content, profile, seo })} saving={saving} />}
              {section === "projects" && <ProjectEditor projects={projects} onSave={saveProject} onDeleteRequest={onDeleteProject} saving={saving} />}
              {section === "skills" && <SkillsEditor skills={content.skills} onSave={async (skills) => await saveContent({ ...content, skills })} saving={saving} />}
              {section === "experience" && <ExperienceEditor experience={content.experience} onSave={async (experience) => await saveContent({ ...content, experience })} saving={saving} />}
              {section === "certificates" && <CertificatesEditor certificates={content.certificates} onSave={async (certificates) => await saveContent({ ...content, certificates })} saving={saving} />}
              {section === "gallery" && <GalleryEditor gallery={content.gallery || []} onSave={async (gallery) => await saveContent({ ...content, gallery })} saving={saving} />}
              {section === "messages" && <MessagesEditor messages={messages} updateMessage={updateMessage} requestDelete={setDeleteMessage} />}
              {section === "media" && <MediaManager media={media} uploadMedia={uploadMedia} requestDelete={setDeleteMedia} saving={saving} />}
              {section === "settings" && <SettingsEditor content={content} setContent={setContent} />}
              {section === "guide" && <AssetGuide />}
            </>
          )}
        </div>
      </SidebarInset>

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

// The original ProfileEditor is removed because it's now imported from components/admin/tabs/ProfileEditor

// ProjectsEditor and ProjectDialog are removed because they are now imported from components/admin/tabs/ProjectEditor

// SkillsEditor is removed because it's now imported from components/admin/tabs/SkillsEditor

// ExperienceEditor is removed because it's now imported from components/admin/tabs/ExperienceEditor

// CertificatesEditor is removed because it's now imported from components/admin/tabs/CertificatesEditor

// GalleryEditor is removed because it's now imported from components/admin/tabs/GalleryEditor

function MessagesEditor({ messages, updateMessage, requestDelete }: { messages: Message[]; updateMessage: (id: number, status: string) => Promise<void>; requestDelete: (message: Message) => void }) {
  return <div className="message-list">{messages.length ? messages.map((message) => <article className={message.status === "unread" ? "admin-panel message-card unread" : "admin-panel message-card"} key={message.id}><div className="message-avatar">{message.name.slice(0, 2).toUpperCase()}</div><div><div className="message-meta"><div><h3>{message.name}</h3><a href={`mailto:${message.email}`}>{message.email}</a></div><Badge variant={message.status === "unread" ? "default" : "secondary"}>{message.status}</Badge></div><p>{message.message}</p><div className="message-actions"><Button size="sm" variant="outline" asChild><a href={`mailto:${message.email}`}>Balas <ArrowUpRight /></a></Button>{message.status === "unread" && <Button size="sm" variant="ghost" onClick={() => void updateMessage(message.id, "read")}><Check /> Tandai dibaca</Button>}<Button size="sm" variant="ghost" onClick={() => void updateMessage(message.id, "archived")}>Arsipkan</Button><Button size="sm" variant="ghost" onClick={() => requestDelete(message)}><Trash2 /> Hapus</Button><time>{formatDate(message.createdAt)}</time></div></div></article>) : <section className="admin-panel"><EmptyText text="Belum ada pesan masuk." /></section>}</div>;
}

// MediaEditor is removed because it's now imported from components/admin/tabs/MediaManager

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

function Field({ label, wide, children }: { label: string; wide?: boolean; children: ReactNode }) { return <label className={wide ? "field-wide" : ""}><Label>{label}</Label>{children}</label>; }
