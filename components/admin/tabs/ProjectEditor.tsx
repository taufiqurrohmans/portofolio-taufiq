"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Save, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MediaUploader } from "@/components/admin/ui/MediaUploader";
import { MultiLinkEditor } from "@/components/admin/ui/MultiLinkEditor";
import type { PortfolioProject } from "@/lib/default-content";
import type { MultiLinkValues } from "@/lib/validations";

const blankProject: PortfolioProject = {
  id: "",
  title: "",
  slug: "",
  category: "AI / ML",
  year: new Date().getFullYear().toString(),
  summary: "",
  role: "",
  stack: [],
  accent: "blue",
  featured: false,
  status: "draft",
};

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function Field({ label, wide, children }: { label: string; wide?: boolean; children: React.ReactNode }) {
  return (
    <label className={wide ? "md:col-span-2 space-y-2" : "space-y-2"}>
      <Label>{label}</Label>
      {children}
    </label>
  );
}

type Props = {
  projects: PortfolioProject[];
  onSave: (project: PortfolioProject) => Promise<void>;
  onDeleteRequest: (project: PortfolioProject) => void;
  saving: boolean;
};

export function ProjectEditor({ projects, onSave, onDeleteRequest, saving }: Props) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<PortfolioProject>(blankProject);
  // Optional: Convert githubUrl and liveUrl to links array if needed, but for now we keep the schema

  const openNew = () => {
    setDraft({ ...blankProject, id: crypto.randomUUID() });
    setOpen(true);
  };

  const openEdit = (project: PortfolioProject) => {
    setDraft({ ...project });
    setOpen(true);
  };

  const update = <K extends keyof PortfolioProject>(key: K, value: PortfolioProject[K]) => {
    setDraft({ ...draft, [key]: value });
  };

  const handleSave = async () => {
    await onSave(draft);
    setOpen(false);
  };

  return (
    <div className="admin-stack">
      <section className="admin-panel">
        <div className="admin-panel-heading">
          <div>
            <p className="admin-eyebrow">Case studies</p>
            <h3>Daftar proyek</h3>
            <p>Kelola proyek AI, machine learning, dan website.</p>
          </div>
          <Button onClick={openNew}><Plus className="size-4 mr-2" /> Tambah proyek</Button>
        </div>
        
        {projects.length === 0 ? (
          <div className="p-12 border border-dashed rounded-xl flex flex-col items-center justify-center text-center text-muted-foreground bg-muted/20">
            <FileText className="size-8 mb-2 opacity-50" />
            <p className="text-sm">Belum ada proyek. Tambahkan proyek pertama Anda.</p>
          </div>
        ) : (
          <div className="admin-table-wrap border rounded-xl overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>Proyek</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tahun</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <span className={`w-3 h-3 rounded-full flex-shrink-0 bg-${project.accent}-500`} />
                        <div>
                          <strong className="block text-sm">{project.title}</strong>
                          <small className="text-muted-foreground">{project.role}</small>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{project.category}</TableCell>
                    <TableCell>
                      <Badge variant={project.status === "published" ? "default" : "secondary"}>
                        {project.status === "published" ? "Publik" : "Draft"}
                      </Badge>
                    </TableCell>
                    <TableCell>{project.year}</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(project)} aria-label="Edit proyek">
                          <Pencil className="size-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => onDeleteRequest(project)} aria-label="Hapus proyek">
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </section>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-4xl p-0 gap-0">
          <div className="p-6 border-b bg-muted/20 sticky top-0 z-10 backdrop-blur-md">
            <DialogTitle className="text-xl">{draft.title ? "Edit proyek" : "Tambah proyek"}</DialogTitle>
            <DialogDescription className="mt-1">Isi data inti, hasil model, teknologi, screenshot, dan tautan proyek.</DialogDescription>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Kolom Kiri: Data Utama */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-semibold mb-4 border-b pb-2">Informasi Dasar</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="Judul proyek" wide>
                      <Input 
                        value={draft.title} 
                        onChange={(event) => { 
                          update("title", event.target.value); 
                          if (!draft.slug) update("slug", slugify(event.target.value)); 
                        }} 
                      />
                    </Field>
                    <Field label="Slug URL" wide>
                      <Input value={draft.slug} onChange={(event) => update("slug", slugify(event.target.value))} />
                    </Field>
                    <Field label="Kategori">
                      <Select value={draft.category} onValueChange={(value) => update("category", value as PortfolioProject["category"])}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="AI / ML">AI / ML</SelectItem>
                          <SelectItem value="Computer Vision">Computer Vision</SelectItem>
                          <SelectItem value="NLP">NLP</SelectItem>
                          <SelectItem value="Web Development">Web Development</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field label="Tahun">
                      <Input value={draft.year} onChange={(event) => update("year", event.target.value)} />
                    </Field>
                    <Field label="Peran / Role">
                      <Input value={draft.role} onChange={(event) => update("role", event.target.value)} />
                    </Field>
                    <Field label="Warna Aksen">
                      <Select value={draft.accent} onValueChange={(value) => update("accent", value)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="blue">Blue</SelectItem>
                          <SelectItem value="violet">Violet</SelectItem>
                          <SelectItem value="lime">Lime</SelectItem>
                          <SelectItem value="amber">Amber</SelectItem>
                          <SelectItem value="rose">Rose</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold mb-4 border-b pb-2">Konten Penjelasan</h4>
                  <div className="grid grid-cols-1 gap-4">
                    <Field label="Ringkasan / Subheadline" wide>
                      <Textarea rows={3} value={draft.summary} onChange={(event) => update("summary", event.target.value)} />
                    </Field>
                    <Field label="Masalah yang diselesaikan" wide>
                      <Textarea rows={3} value={draft.problem || ""} onChange={(event) => update("problem", event.target.value)} />
                    </Field>
                    <Field label="Solusi" wide>
                      <Textarea rows={3} value={draft.solution || ""} onChange={(event) => update("solution", event.target.value)} />
                    </Field>
                    <Field label="Hasil Akhir / Metrik Singkat" wide>
                      <Input value={draft.metric || ""} placeholder="Accuracy 94.2% / F1-score 0.91" onChange={(event) => update("metric", event.target.value)} />
                    </Field>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold mb-4 border-b pb-2">Pengaturan Visibilitas</h4>
                  <div className="flex flex-col gap-4 p-4 border rounded-xl bg-card">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Proyek Unggulan</Label>
                        <p className="text-xs text-muted-foreground mt-1">Tampilkan di halaman depan beranda.</p>
                      </div>
                      <Switch checked={draft.featured} onCheckedChange={(checked) => update("featured", checked)} />
                    </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-base">Status Publikasi</Label>
                          <p className="text-xs text-muted-foreground mt-1">Hanya proyek &apos;Publik&apos; yang bisa dilihat orang lain.</p>
                        </div>
                      <Switch checked={draft.status === "published"} onCheckedChange={(checked) => update("status", checked ? "published" : "draft")} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Kolom Kanan: Detail AI, Gambar, dan Link */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-semibold mb-4 border-b pb-2">Spesifikasi (AI/Data/Web)</h4>
                  <div className="grid gap-4">
                    <Field label="Teknologi (pisahkan koma)" wide>
                      <Input 
                        value={draft.stack.join(", ")} 
                        onChange={(event) => update("stack", event.target.value.split(",").map((item) => item.trim()).filter(Boolean))} 
                        placeholder="Python, PyTorch, React, Node.js"
                      />
                    </Field>
                    <Field label="Informasi Dataset" wide>
                      <Textarea rows={2} value={draft.dataset || ""} placeholder="Nama, sumber, jumlah baris/gambar..." onChange={(event) => update("dataset", event.target.value)} />
                    </Field>
                    <Field label="Metode / Arsitektur" wide>
                      <Textarea rows={2} value={draft.method || ""} placeholder="ResNet50, YOLOv8, Random Forest..." onChange={(event) => update("method", event.target.value)} />
                    </Field>
                    <Field label="Evaluasi Lanjutan" wide>
                      <Textarea rows={2} value={draft.evaluation || ""} placeholder="Keterbatasan, confusion matrix detail..." onChange={(event) => update("evaluation", event.target.value)} />
                    </Field>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold mb-4 border-b pb-2">Media Visual</h4>
                  <div className="space-y-6">
                    <MediaUploader
                      label="Cover Utama (Thumbnail 16:9)"
                      value={draft.coverUrl || ""}
                      onChange={(url) => update("coverUrl", url)}
                    />
                    
                    <Field label="Galeri Pendukung (Satu URL per baris)" wide>
                      <Textarea 
                        rows={4} 
                        value={(draft.galleryUrls || []).join("\n")} 
                        placeholder="https://...&#10;https://..."
                        onChange={(event) => update("galleryUrls", event.target.value.split("\n").map((item) => item.trim()).filter(Boolean))} 
                      />
                      <p className="text-xs text-muted-foreground">Upload gambar via tab Media Library lalu paste URL di sini.</p>
                    </Field>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold mb-4 border-b pb-2">Tautan Eksternal</h4>
                  <MultiLinkEditor 
                    links={(draft.links as any) || []}
                    onChange={(newLinks) => update("links", newLinks)}
                  />
                  <div className="mt-4 p-4 border rounded-xl bg-orange-500/10 text-orange-600 border-orange-500/20 text-xs">
                    <strong>Catatan:</strong> Jika Anda sebelumnya menggunakan kolom `liveUrl` dan `githubUrl`, kolom tersebut masih tersimpan di database tetapi direkomendasikan untuk memindahkannya ke dalam <strong>Tautan Ekstra</strong> di atas agar ikon otomatis terdeteksi dengan rapi.
                  </div>
                </div>
              </div>

            </div>
          </div>

          <div className="p-4 border-t bg-muted/20 sticky bottom-0 z-10 backdrop-blur-md flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>Batal</Button>
            <Button onClick={handleSave} disabled={saving}>
              <Save className="size-4 mr-2" /> {saving ? "Menyimpan..." : "Simpan proyek"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
