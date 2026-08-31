"use client";

import { useState } from "react";
import { 
  Plus, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  ExternalLink,
  FileText,
  Video,
  Monitor,
  Link as LinkIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { MultiLinkValues } from "@/lib/validations";

type Props = {
  links?: MultiLinkValues[];
  onChange: (links: MultiLinkValues[]) => void;
};

const LINK_TYPES = [
  "Live Demo", "GitHub", "Repository", "Dokumentasi", "Case Study", 
  "Figma", "Canva", "YouTube", "Google Drive", "LinkedIn", 
  "Credential", "Download", "Website", "Custom Link"
] as const;

export function getLinkIcon(type: string) {
  switch (type) {
    case "GitHub":
    case "Repository": return <FileText className="size-4" />;
    case "YouTube": return <Video className="size-4" />;
    case "LinkedIn": return <FileText className="size-4" />;
    case "Figma": return <FileText className="size-4" />;
    case "Dokumentasi":
    case "Case Study":
    case "Credential":
    case "Download": return <FileText className="size-4" />;
    case "Live Demo":
    case "Website": return <Monitor className="size-4" />;
    case "Video": return <Video className="size-4" />;
    default: return <LinkIcon className="size-4" />;
  }
}

export function MultiLinkEditor({ links = [], onChange }: Props) {
  
  const addLink = () => {
    onChange([
      ...links, 
      { 
        id: crypto.randomUUID(), 
        type: "Custom Link", 
        label: "Visit Link", 
        url: "", 
        isActive: true, 
        openInNewTab: true 
      }
    ]);
  };

  const updateLink = (index: number, field: keyof MultiLinkValues, value: any) => {
    const newLinks = [...links];
    newLinks[index] = { ...newLinks[index], [field]: value };
    onChange(newLinks);
  };

  const removeLink = (index: number) => {
    const newLinks = [...links];
    newLinks.splice(index, 1);
    onChange(newLinks);
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newLinks = [...links];
    [newLinks[index - 1], newLinks[index]] = [newLinks[index], newLinks[index - 1]];
    onChange(newLinks);
  };

  const moveDown = (index: number) => {
    if (index === links.length - 1) return;
    const newLinks = [...links];
    [newLinks[index + 1], newLinks[index]] = [newLinks[index], newLinks[index + 1]];
    onChange(newLinks);
  };

  return (
    <div className="space-y-4">
      {links.length > 0 ? (
        <div className="space-y-3">
          {links.map((link, index) => (
            <div key={link.id || index} className="p-4 border rounded-xl bg-card space-y-4">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  {getLinkIcon(link.type)}
                  Tautan #{index + 1}
                </div>
                <div className="flex items-center gap-1">
                  <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => moveUp(index)} disabled={index === 0}>
                    <ArrowUp className="size-3" />
                  </Button>
                  <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => moveDown(index)} disabled={index === links.length - 1}>
                    <ArrowDown className="size-3" />
                  </Button>
                  <Button type="button" variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => removeLink(index)}>
                    <Trash2 className="size-3" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Jenis Tautan</Label>
                  <select 
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={link.type}
                    onChange={(e) => updateLink(index, "type", e.target.value)}
                  >
                    {LINK_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Label Tombol</Label>
                  <Input 
                    value={link.label} 
                    onChange={(e) => updateLink(index, "label", e.target.value)} 
                    placeholder="Contoh: Kunjungi Web"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>URL</Label>
                  <Input 
                    type="url"
                    value={link.url} 
                    onChange={(e) => updateLink(index, "url", e.target.value)} 
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <div className="flex items-center gap-2">
                  <Switch 
                    checked={link.isActive} 
                    onCheckedChange={(checked) => updateLink(index, "isActive", checked)} 
                    id={`link-active-${index}`}
                  />
                  <Label htmlFor={`link-active-${index}`} className="text-xs font-normal">Tampilkan</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch 
                    checked={link.openInNewTab} 
                    onCheckedChange={(checked) => updateLink(index, "openInNewTab", checked)} 
                    id={`link-newtab-${index}`}
                  />
                  <Label htmlFor={`link-newtab-${index}`} className="text-xs font-normal">Buka di Tab Baru</Label>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-6 border border-dashed rounded-xl flex flex-col items-center justify-center text-center text-muted-foreground bg-muted/20">
          <LinkIcon className="size-8 mb-2 opacity-50" />
          <p className="text-sm">Belum ada tautan yang ditambahkan.</p>
        </div>
      )}

      <Button type="button" variant="outline" className="w-full border-dashed" onClick={addLink}>
        <Plus className="size-4 mr-2" /> Tambah Tautan Ekstra
      </Button>
    </div>
  );
}
