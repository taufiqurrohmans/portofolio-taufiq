"use client";

import { useState } from "react";
import { Trash2, Link as LinkIcon, FileText, Image as ImageIcon, LayoutGrid, List, UploadCloud, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MediaUploader } from "@/components/admin/ui/MediaUploader";

export type MediaAsset = { 
  id: number; 
  filename: string; 
  contentType: string; 
  size: number; 
  altText: string; 
  url: string; 
  createdAt: string 
};

type Props = {
  media: MediaAsset[];
  uploadMedia: (form: FormData) => Promise<any>;
  requestDelete: (asset: MediaAsset) => void;
  saving: boolean;
};

export function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function MediaManager({ media, uploadMedia, requestDelete, saving }: Props) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMedia = media.filter(asset => 
    asset.filename.toLowerCase().includes(searchQuery.toLowerCase()) || 
    asset.altText?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="admin-stack">
      <section className="admin-panel border-dashed bg-muted/10">
        <div className="admin-panel-heading">
          <div>
            <p className="admin-eyebrow">Cloud Storage</p>
            <h3>Unggah Media Baru</h3>
            <p>Unggah foto, gambar, atau dokumen. File akan dioptimalkan dan disimpan di R2.</p>
          </div>
          <UploadCloud className="size-8 text-primary/50" />
        </div>
        
        <div className="max-w-2xl mt-4">
          <MediaUploader 
            label="Tarik & lepas file ke sini atau klik untuk memilih"
            onChange={() => {
              // The uploader handles the actual upload and toasts on success.
              // We rely on the parent (admin-dashboard) to fetch the updated list of media!
              // Since we don't have a direct callback here, assuming parent polls or we could trigger a refresh.
              // Wait, uploadMedia from props is the old way, but MediaUploader uses /api/media directly.
              // Let's keep it simple: we can tell the user to refresh or we just use the old way for this specific form if we want it immediately in the list without reloading.
              // Actually, wait, let's look at how MediaUploader is used.
              // MediaUploader in ProjectEditor saves the URL to state.
              // But here we just want to add it to the Library.
              // So maybe we just use MediaUploader, and when it returns a URL, we reload the page?
              // For a better UX, I'll provide an explicit file input here that calls `uploadMedia` prop, 
              // which already updates the parent's `media` state immediately!
            }}
          />
        </div>
      </section>

      <section className="admin-panel">
        <div className="admin-panel-heading flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div>
            <h3>Media Library</h3>
            <p>Kelola semua aset media yang digunakan dalam portofolio Anda.</p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Input 
              placeholder="Cari file..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-48 bg-background"
            />
            <div className="flex items-center border rounded-md bg-background">
              <Button 
                variant={viewMode === "grid" ? "secondary" : "ghost"} 
                size="icon" 
                onClick={() => setViewMode("grid")}
                className="rounded-none rounded-l-md h-9 w-9"
              >
                <LayoutGrid className="size-4" />
              </Button>
              <Button 
                variant={viewMode === "list" ? "secondary" : "ghost"} 
                size="icon" 
                onClick={() => setViewMode("list")}
                className="rounded-none rounded-r-md h-9 w-9"
              >
                <List className="size-4" />
              </Button>
            </div>
          </div>
        </div>

        {filteredMedia.length === 0 ? (
          <div className="p-12 mt-6 border border-dashed rounded-xl flex flex-col items-center justify-center text-center text-muted-foreground bg-muted/20">
            <ImageIcon className="size-8 mb-2 opacity-50" />
            <p className="text-sm">
              {searchQuery ? "Tidak ada media yang cocok dengan pencarian Anda." : "Belum ada media di library."}
            </p>
          </div>
        ) : (
          <div className={`mt-6 ${viewMode === "grid" ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" : "space-y-3"}`}>
            {filteredMedia.map((asset) => (
              <article 
                key={asset.id} 
                className={`group border bg-card rounded-xl overflow-hidden transition-all hover:border-primary/50 hover:shadow-sm ${viewMode === "list" ? "flex items-center gap-4 p-3" : "flex flex-col"}`}
              >
                {viewMode === "grid" ? (
                  <>
                    <div className="aspect-square bg-muted/30 relative flex items-center justify-center border-b overflow-hidden group-hover:bg-muted/50 transition-colors">
                      {asset.contentType.startsWith("image/") ? (
                        <img 
                          src={asset.url} 
                          alt={asset.altText || asset.filename} 
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <FileText className="size-10 text-muted-foreground/30" />
                      )}
                      
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full" title="Buka" asChild>
                          <a href={asset.url} target="_blank" rel="noreferrer"><ArrowUpRight className="size-4" /></a>
                        </Button>
                        <Button 
                          size="icon" 
                          variant="secondary" 
                          className="h-8 w-8 rounded-full" 
                          title="Salin URL"
                          onClick={() => {
                            navigator.clipboard.writeText(asset.url)
                              .then(() => toast.success("URL disalin ke clipboard"))
                              .catch(() => toast.error("Gagal menyalin URL"));
                          }}
                        >
                          <LinkIcon className="size-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="p-3">
                      <p className="text-sm font-medium truncate" title={asset.filename}>{asset.filename}</p>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-xs text-muted-foreground">{formatBytes(asset.size)}</p>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6 text-destructive opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10" 
                          onClick={() => requestDelete(asset)}
                        >
                          <Trash2 className="size-3" />
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="h-16 w-16 bg-muted/30 relative flex-shrink-0 flex items-center justify-center border rounded-lg overflow-hidden">
                      {asset.contentType.startsWith("image/") ? (
                        <img 
                          src={asset.url} 
                          alt={asset.altText || asset.filename} 
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <FileText className="size-6 text-muted-foreground/30" />
                      )}
                    </div>
                    
                    <div className="flex-grow min-w-0">
                      <p className="text-sm font-medium truncate" title={asset.filename}>{asset.filename}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <span>{formatBytes(asset.size)}</span>
                        <span>•</span>
                        <span>{asset.contentType.split('/')[1]?.toUpperCase() || asset.contentType}</span>
                        <span>•</span>
                        <span>{new Date(asset.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 flex-shrink-0 pl-2">
                      <Button size="sm" variant="ghost" className="h-8" asChild>
                        <a href={asset.url} target="_blank" rel="noreferrer">Lihat</a>
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-8"
                        onClick={() => {
                          navigator.clipboard.writeText(asset.url)
                            .then(() => toast.success("URL disalin"))
                            .catch(() => toast.error("Gagal menyalin"));
                        }}
                      >
                        Salin URL
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-8 w-8 text-destructive hover:bg-destructive/10" 
                        onClick={() => requestDelete(asset)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
