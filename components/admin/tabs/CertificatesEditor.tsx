"use client";

import { useState } from "react";
import { Plus, Trash2, Save, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MediaUploader } from "@/components/admin/ui/MediaUploader";
import type { PortfolioContent } from "@/lib/default-content";

type Certificate = PortfolioContent["certificates"][number];

type Props = {
  certificates: Certificate[];
  onSave: (certificates: Certificate[]) => Promise<void>;
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

export function CertificatesEditor({ certificates: initialCertificates, onSave, saving }: Props) {
  const [draft, setDraft] = useState<Certificate[]>(initialCertificates);

  const addCertificate = () => {
    setDraft([
      ...draft,
      {
        id: crypto.randomUUID(),
        title: "",
        issuer: "",
        year: new Date().getFullYear().toString(),
        credentialUrl: "",
        imageUrl: "",
      },
    ]);
  };

  const update = (index: number, field: keyof Certificate, value: string) => {
    const newDraft = [...draft];
    newDraft[index] = { ...newDraft[index], [field]: value };
    setDraft(newDraft);
  };

  const removeCertificate = (idToRemove: string) => {
    setDraft(draft.filter((cert) => cert.id !== idToRemove));
  };

  const handleSave = async () => {
    await onSave(draft);
  };

  return (
    <div className="admin-stack">
      <section className="admin-panel">
        <div className="admin-panel-heading">
          <div>
            <p className="admin-eyebrow">Credentials</p>
            <h3>Sertifikat dan pencapaian</h3>
            <p>Kelola sertifikat profesional, kompetensi AI, dan sertifikasi developer.</p>
          </div>
          <Button onClick={addCertificate}><Plus className="size-4 mr-2" /> Tambah Sertifikat</Button>
        </div>

        {draft.length === 0 ? (
          <div className="p-12 border border-dashed rounded-xl flex flex-col items-center justify-center text-center text-muted-foreground bg-muted/20">
            <Award className="size-8 mb-2 opacity-50" />
            <p className="text-sm">Belum ada sertifikat. Tambahkan sertifikat yang relevan dengan AI dan software development.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {draft.map((cert, index) => (
              <article key={cert.id} className="p-6 border rounded-xl bg-card space-y-6 relative group transition-all hover:border-border/80">
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-medium text-sm">
                      {index + 1}
                    </span>
                    <h4 className="font-semibold">{cert.title || "Sertifikat Baru"}</h4>
                  </div>
                  <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => removeCertificate(cert.id)}>
                    <Trash2 className="size-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 admin-form-grid">
                    <Field label="Nama sertifikat / Pencapaian">
                      <Input value={cert.title} placeholder="Contoh: TensorFlow Developer Certificate" onChange={(e) => update(index, "title", e.target.value)} />
                    </Field>
                    <Field label="Penerbit (Issuer)">
                      <Input value={cert.issuer} placeholder="Contoh: Google, Coursera, DeepLearning.AI" onChange={(e) => update(index, "issuer", e.target.value)} />
                    </Field>
                    <Field label="Tahun Diperoleh">
                      <Input value={cert.year} onChange={(e) => update(index, "year", e.target.value)} />
                    </Field>
                    <Field label="Credential URL (Opsional)">
                      <Input value={cert.credentialUrl || ""} type="url" placeholder="https://..." onChange={(e) => update(index, "credentialUrl", e.target.value)} />
                    </Field>
                  </div>
                  
                  <div className="lg:col-span-1">
                    <MediaUploader
                      label="Gambar Sertifikat (Opsional)"
                      value={cert.imageUrl || ""}
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
          <Save className="size-4 mr-2" /> {saving ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>
      </div>
    </div>
  );
}
