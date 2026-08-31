"use client";

import { useState } from "react";
import { Plus, Trash2, Save, BriefcaseBusiness, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { PortfolioContent } from "@/lib/default-content";

type Experience = PortfolioContent["experience"][number];

type Props = {
  experience: Experience[];
  onSave: (experience: Experience[]) => Promise<void>;
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

export function ExperienceEditor({ experience: initialExperience, onSave, saving }: Props) {
  const [draft, setDraft] = useState<Experience[]>(initialExperience);

  const addExperience = () => {
    setDraft([
      {
        period: "",
        title: "",
        organization: "",
        description: "",
      },
      ...draft,
    ]);
  };

  const update = (index: number, field: keyof Experience, value: string) => {
    const newDraft = [...draft];
    newDraft[index] = { ...newDraft[index], [field]: value };
    setDraft(newDraft);
  };

  const removeExperience = (index: number) => {
    const newDraft = [...draft];
    newDraft.splice(index, 1);
    setDraft(newDraft);
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newDraft = [...draft];
    [newDraft[index - 1], newDraft[index]] = [newDraft[index], newDraft[index - 1]];
    setDraft(newDraft);
  };

  const moveDown = (index: number) => {
    if (index === draft.length - 1) return;
    const newDraft = [...draft];
    [newDraft[index + 1], newDraft[index]] = [newDraft[index], newDraft[index + 1]];
    setDraft(newDraft);
  };

  const handleSave = async () => {
    await onSave(draft);
  };

  return (
    <div className="admin-stack">
      <section className="admin-panel">
        <div className="admin-panel-heading">
          <div>
            <p className="admin-eyebrow">Timeline</p>
            <h3>Pendidikan dan pengalaman</h3>
            <p>Kelola riwayat pendidikan, pengalaman kerja, dan aktivitas organisasi.</p>
          </div>
          <Button onClick={addExperience}><Plus className="size-4 mr-2" /> Tambah Pengalaman</Button>
        </div>

        {draft.length === 0 ? (
          <div className="p-12 border border-dashed rounded-xl flex flex-col items-center justify-center text-center text-muted-foreground bg-muted/20">
            <BriefcaseBusiness className="size-8 mb-2 opacity-50" />
            <p className="text-sm">Belum ada pengalaman atau pendidikan yang ditambahkan.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {draft.map((item, index) => (
              <article key={index} className="p-6 border rounded-xl bg-card space-y-6 relative group transition-all hover:border-border/80">
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-medium text-sm">
                      {index + 1}
                    </span>
                    <h4 className="font-semibold">{item.title || "Pengalaman Baru"}</h4>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => moveUp(index)} disabled={index === 0}>
                      <ArrowUp className="size-4" />
                    </Button>
                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => moveDown(index)} disabled={index === draft.length - 1}>
                      <ArrowDown className="size-4" />
                    </Button>
                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => removeExperience(index)}>
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>

                <div className="admin-form-grid">
                  <Field label="Periode (Contoh: 2022 - Sekarang)">
                    <Input value={item.period} onChange={(e) => update(index, "period", e.target.value)} />
                  </Field>
                  <Field label="Organisasi / Perusahaan / Kampus">
                    <Input value={item.organization} onChange={(e) => update(index, "organization", e.target.value)} />
                  </Field>
                  <Field label="Posisi / Jurusan" wide>
                    <Input value={item.title} onChange={(e) => update(index, "title", e.target.value)} />
                  </Field>
                  <Field label="Deskripsi / Aktivitas" wide>
                    <Textarea 
                      rows={4} 
                      value={item.description} 
                      placeholder="Jelaskan peran, tanggung jawab, dan pencapaian Anda..."
                      onChange={(e) => update(index, "description", e.target.value)} 
                    />
                  </Field>
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
