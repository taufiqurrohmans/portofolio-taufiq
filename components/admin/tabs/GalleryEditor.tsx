"use client";

import { useState } from "react";
import { Plus, Trash2, Save, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MediaUploader } from "@/components/admin/ui/MediaUploader";
import type { PortfolioContent } from "@/lib/default-content";

type GalleryItem = NonNullable<PortfolioContent["gallery"]>[number];

type Props = {
  gallery: GalleryItem[];
  onSave: (gallery: GalleryItem[]) => Promise<void>;
  saving: boolean;
};

function Field({ label, wide, children }: { label: string; wide?: boolean; children: React.ReactNode }) {
  return (
    <label className={wide ? "md:col-span-2 space-y-2" : "space-y-2"}>
      <Label>{label}</Label>
      {children}
    </label>
  );
}

export function GalleryEditor({ gallery: initialGallery, onSave, saving }: Props) {
  const [draft, setDraft] = useState<GalleryItem[]>(initialGallery);

  const addItem = () => {
    setDraft([
      ...draft,
      {
        id: crypto.randomUUID(),
        title: "Lokasi Baru",
        subtitle: "Click to learn more",
        imageUrl: "",
        flag: "📍",
      },
    ]);
  };

  const update = (index: number, field: keyof GalleryItem, value: string) => {
    const newDraft = [...draft];
    newDraft[index] = { ...newDraft[index], [field]: value };
    setDraft(newDraft);
  };

  const removeGalleryItem = (idToRemove: string) => {
    setDraft(draft.filter((item) => item.id !== idToRemove));
  };

  const handleSave = async () => {
    await onSave(draft);
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
          <Button onClick={addItem}><Plus className="size-4 mr-2" /> Tambah Foto</Button>
        </div>

        {draft.length === 0 ? (
          <div className="p-12 border border-dashed rounded-xl flex flex-col items-center justify-center text-center text-muted-foreground bg-muted/20">
            <ImageIcon className="size-8 mb-2 opacity-50" />
            <p className="text-sm">Belum ada foto dalam galeri 3D. Klik 'Tambah Foto' untuk menambahkan.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {draft.map((item, index) => (
              <article key={item.id} className="p-6 border rounded-xl bg-card space-y-6 relative group transition-all hover:border-border/80">
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-medium text-sm">
                      {index + 1}
                    </span>
                    <h4 className="font-semibold">{item.title || "Foto Baru"}</h4>
                  </div>
                  <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => removeGalleryItem(item.id)}>
                    <Trash2 className="size-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 admin-form-grid">
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
                    
                    <div className="mt-4 md:col-span-2 p-4 border rounded-xl bg-muted/20 flex flex-col items-center justify-center">
                      <Label className="mb-2 text-xs">Preview Tampilan Kartu</Label>
                      <div className="w-40 h-56 rounded-2xl overflow-hidden shadow-md border relative group bg-black">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground/30"><ImageIcon className="size-8" /></div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-2 text-white">
                          <span className="text-xs font-bold flex items-center gap-1">
                            {item.flag} {item.title}
                          </span>
                          <small className="text-[10px] opacity-70">{item.subtitle}</small>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-1 space-y-4">
                    <MediaUploader
                      label="Foto Galeri"
                      value={item.imageUrl}
                      onChange={(url) => update(index, "imageUrl", url)}
                    />
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <div className="flex justify-end pt-4">
        <Button onClick={handleSave} disabled={saving} size="lg">
          <Save className="size-4 mr-2" /> {saving ? "Menyimpan..." : "Simpan Galeri"}
        </Button>
      </div>
    </div>
  );
}
