"use client";

import { useState } from "react";
import { Plus, Trash2, Save, Terminal, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { PortfolioContent } from "@/lib/default-content";

type Skill = PortfolioContent["skills"][number];

type Props = {
  skills: Skill[];
  onSave: (skills: Skill[]) => Promise<void>;
  saving: boolean;
};

export function SkillsEditor({ skills: initialSkills, onSave, saving }: Props) {
  const [draft, setDraft] = useState<Skill[]>(initialSkills);

  const addSkill = () => {
    setDraft([
      ...draft,
      {
        name: "",
        group: "Languages",
        level: "Familiar",
      },
    ]);
  };

  const update = (index: number, field: keyof Skill, value: string) => {
    const newDraft = [...draft];
    newDraft[index] = { ...newDraft[index], [field]: value };
    setDraft(newDraft);
  };

  const removeSkill = (index: number) => {
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
            <p className="admin-eyebrow">Technical toolkit</p>
            <h3>Teknologi dan kemampuan</h3>
            <p>Daftar bahasa pemrograman, framework, dan tools yang Anda kuasai.</p>
          </div>
          <Button onClick={addSkill}><Plus className="size-4 mr-2" /> Tambah Skill</Button>
        </div>

        {draft.length === 0 ? (
          <div className="p-12 border border-dashed rounded-xl flex flex-col items-center justify-center text-center text-muted-foreground bg-muted/20">
            <Terminal className="size-8 mb-2 opacity-50" />
            <p className="text-sm">Belum ada skill yang ditambahkan.</p>
          </div>
        ) : (
          <div className="border rounded-xl bg-card overflow-hidden">
            <div className="grid grid-cols-12 gap-4 p-4 border-b bg-muted/50 text-sm font-medium text-muted-foreground">
              <div className="col-span-1 text-center">#</div>
              <div className="col-span-4">Nama Teknologi</div>
              <div className="col-span-3">Kategori</div>
              <div className="col-span-3">Level Penguasaan</div>
              <div className="col-span-1 text-right">Aksi</div>
            </div>
            <div className="divide-y">
              {draft.map((skill, index) => (
                <div key={index} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-muted/10 transition-colors">
                  <div className="col-span-1 flex items-center justify-center">
                    <div className="flex flex-col items-center">
                      <Button type="button" variant="ghost" size="icon" className="h-4 w-4 rounded-none" onClick={() => moveUp(index)} disabled={index === 0}>
                        <ArrowUp className="size-3" />
                      </Button>
                      <span className="text-xs font-mono text-muted-foreground my-1">{String(index + 1).padStart(2, "0")}</span>
                      <Button type="button" variant="ghost" size="icon" className="h-4 w-4 rounded-none" onClick={() => moveDown(index)} disabled={index === draft.length - 1}>
                        <ArrowDown className="size-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="col-span-4">
                    <Label className="sr-only">Nama Teknologi</Label>
                    <Input 
                      placeholder="Contoh: Python, React" 
                      value={skill.name} 
                      onChange={(e) => update(index, "name", e.target.value)} 
                    />
                  </div>
                  
                  <div className="col-span-3">
                    <Label className="sr-only">Kategori</Label>
                    <Select value={skill.group} onValueChange={(val) => update(index, "group", val)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Languages">Languages</SelectItem>
                        <SelectItem value="AI / ML Frameworks">AI / ML Frameworks</SelectItem>
                        <SelectItem value="Web & Backend">Web & Backend</SelectItem>
                        <SelectItem value="Data & Database">Data & Database</SelectItem>
                        <SelectItem value="Tools & Cloud">Tools & Cloud</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="col-span-3">
                    <Label className="sr-only">Level</Label>
                    <Select value={skill.level} onValueChange={(val) => update(index, "level", val)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Familiar">Familiar</SelectItem>
                        <SelectItem value="Comfortable">Comfortable</SelectItem>
                        <SelectItem value="Proficient">Proficient</SelectItem>
                        <SelectItem value="Expert">Expert</SelectItem>
                        <SelectItem value="Currently Learning">Currently Learning</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="col-span-1 flex justify-end">
                    <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => removeSkill(index)}>
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
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
