"use client";

import { useState, useRef, useCallback } from "react";
import { UploadCloud, X, FileImage, Loader2, Link as LinkIcon, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";

type Props = {
  value?: string;
  onChange: (url: string) => void;
  accept?: string;
  maxSizeMB?: number;
  label?: string;
};

export function MediaUploader({ 
  value = "", 
  onChange, 
  accept = "image/jpeg,image/png,image/webp,image/avif", 
  maxSizeMB = 5,
  label = "Upload Media"
}: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewMode, setPreviewMode] = useState<"file" | "url">("file");
  const [urlInput, setUrlInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setIsDragging(true);
    else if (e.type === "dragleave" || e.type === "drop") setIsDragging(false);
  }, []);

  const uploadFile = async (file: File) => {
    if (!file) return;

    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(`Ukuran file maksimal ${maxSizeMB}MB`);
      return;
    }

    setIsUploading(true);
    try {
      const form = new FormData();
      form.set("file", file);
      form.set("altText", file.name);

      const res = await fetch("/api/admin/media", {
        method: "POST",
        body: form
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.error || "Gagal mengunggah file");
      }

      const json = await res.json();
      onChange(json.asset.url);
      toast.success("File berhasil diunggah");
    } catch (err: any) {
      toast.error(err.message || "Gagal mengunggah");
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  }, [maxSizeMB]);

  return (
    <div className="space-y-3">
      {label && <Label>{label}</Label>}

      {value ? (
        <div className="relative rounded-xl border overflow-hidden group bg-muted/20">
          {value.match(/\.(jpeg|jpg|gif|png|webp|avif|svg)$/i) ? (
            <img src={value} alt="Preview" className="w-full h-48 object-contain bg-black/5" />
          ) : (
            <div className="w-full h-48 flex flex-col items-center justify-center gap-2 text-muted-foreground">
              <FileImage className="size-10 opacity-50" />
              <span className="text-xs break-all px-4">{value.split("/").pop()}</span>
            </div>
          )}
          
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button size="sm" variant="secondary" onClick={() => onChange("")}>
              <X className="size-4 mr-2" /> Hapus / Ganti
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4">
          <div
            className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center transition-colors cursor-pointer ${
              isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
          >
            <input 
              type="file" 
              className="hidden" 
              ref={inputRef}
              accept={accept}
              disabled={isUploading}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) uploadFile(file);
              }}
            />
            
            {isUploading ? (
              <>
                <Loader2 className="size-8 text-primary animate-spin mb-2" />
                <p className="text-sm font-medium">Mengunggah file...</p>
                <p className="text-xs text-muted-foreground">Mohon tunggu sebentar</p>
              </>
            ) : (
              <>
                <UploadCloud className="size-8 text-muted-foreground mb-2" />
                <p className="text-sm font-medium">Klik atau tarik file ke sini</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Format didukung: {accept.split(",").map(a => a.split("/")[1]).join(", ").toUpperCase()}
                </p>
                <p className="text-xs text-muted-foreground">Maks {maxSizeMB}MB</p>
              </>
            )}
          </div>

          <div className="flex flex-col gap-2 justify-center">
            <div className="text-xs font-medium text-center text-muted-foreground mb-1">ATAU</div>
            <Button type="button" variant="outline" className="w-full justify-start h-9 text-xs" onClick={() => setPreviewMode("url")}>
              <LinkIcon className="size-3 mr-2" /> Masukkan URL Eksternal
            </Button>
            {/* Note: "Pilih dari Media Library" is a placeholder for future implementation since it requires opening the media modal */}
            <Button type="button" variant="outline" className="w-full justify-start h-9 text-xs" onClick={() => toast.info("Fitur Pilih dari Media segera hadir!")}>
              <ImageIcon className="size-3 mr-2" /> Pilih dari Media Library
            </Button>
          </div>
        </div>
      )}

      {previewMode === "url" && !value && (
        <div className="flex gap-2 animate-in fade-in slide-in-from-top-2">
          <Input 
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://..."
            className="flex-1"
          />
          <Button 
            type="button" 
            onClick={() => {
              if (urlInput) {
                onChange(urlInput);
                setPreviewMode("file");
                setUrlInput("");
              }
            }}
          >
            Terapkan
          </Button>
          <Button type="button" variant="ghost" onClick={() => setPreviewMode("file")}>
            <X className="size-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
