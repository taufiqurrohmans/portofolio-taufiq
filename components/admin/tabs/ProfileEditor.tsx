"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, type ProfileFormValues, seoSchema, type SeoFormValues } from "@/lib/validations";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { UserRound, ImageIcon, Save, X } from "lucide-react";
import { MediaUploader } from "@/components/admin/ui/MediaUploader";

// Temporary Field wrapper until we create a centralized one
function Field({ label, wide = false, error, children }: { label: string; wide?: boolean; error?: string; children: React.ReactNode }) {
  return (
    <div className={`space-y-2 ${wide ? "md:col-span-2" : ""}`}>
      <Label className={error ? "text-destructive" : ""}>{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

type ProfileEditorProps = {
  profile: ProfileFormValues;
  seo: SeoFormValues;
  onSave: (profile: ProfileFormValues, seo: SeoFormValues) => Promise<void>;
  saving: boolean;
};

export function ProfileEditor({ profile, seo, onSave, saving }: ProfileEditorProps) {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: profile,
  });

  const seoForm = useForm<SeoFormValues>({
    resolver: zodResolver(seoSchema),
    defaultValues: seo,
  });

  const onSubmit = async () => {
    const isProfileValid = await form.trigger();
    const isSeoValid = await seoForm.trigger();
    
    if (isProfileValid && isSeoValid) {
      await onSave(form.getValues(), seoForm.getValues());
    }
  };

  const handleReset = () => {
    form.reset(profile);
    seoForm.reset(seo);
  };

  return (
    <div className="admin-grid-two">
      <section className="admin-panel">
        <div className="admin-panel-heading">
          <div>
            <p className="admin-eyebrow">Hero content</p>
            <h3>Identitas utama</h3>
          </div>
          <UserRound />
        </div>
        <div className="admin-form-grid">
          <Field label="Nama lengkap" error={form.formState.errors.name?.message}>
            <Input {...form.register("name")} />
          </Field>
          <Field label="Inisial" error={form.formState.errors.initials?.message}>
            <Input maxLength={4} {...form.register("initials")} onChange={(e) => {
              form.setValue("initials", e.target.value.toUpperCase());
            }} />
          </Field>
          <Field label="Headline" error={form.formState.errors.headline?.message}>
            <Input {...form.register("headline")} />
          </Field>
          <Field label="Subheadline" error={form.formState.errors.subheadline?.message}>
            <Input {...form.register("subheadline")} />
          </Field>
          <Field label="Email" error={form.formState.errors.email?.message}>
            <Input type="email" {...form.register("email")} />
          </Field>
          <Field label="Lokasi" error={form.formState.errors.location?.message}>
            <Input {...form.register("location")} />
          </Field>
          <Field label="Universitas" error={form.formState.errors.university?.message}>
            <Input {...form.register("university")} />
          </Field>
          <Field label="Program dan peminatan" error={form.formState.errors.program?.message}>
            <Input {...form.register("program")} />
          </Field>
          <Field label="Status ketersediaan" wide error={form.formState.errors.availability?.message}>
            <Input {...form.register("availability")} />
          </Field>
          <Field label="Bio" wide error={form.formState.errors.bio?.message}>
            <Textarea rows={6} {...form.register("bio")} />
          </Field>
        </div>
      </section>
      
      <div className="admin-stack">
        <section className="admin-panel">
          <div className="admin-panel-heading">
            <div>
              <p className="admin-eyebrow">Visual identity</p>
              <h3>Foto dan dokumen</h3>
            </div>
            <ImageIcon />
          </div>
          <div className="profile-preview">
            <div className="profile-preview-photo">
              {form.watch("photoUrl") ? (
                <img src={form.watch("photoUrl")} alt="Preview profil" />
              ) : form.watch("initials")}
            </div>
            <div>
              <strong>{form.watch("name")}</strong>
              <span>{form.watch("subheadline")}</span>
            </div>
          </div>
          <div className="admin-form-stack">
            <MediaUploader 
              label="URL foto profil"
              value={form.watch("photoUrl")} 
              onChange={(url) => form.setValue("photoUrl", url, { shouldValidate: true })} 
            />
            {form.formState.errors.photoUrl && <p className="text-xs text-destructive">{form.formState.errors.photoUrl.message}</p>}
            
            <MediaUploader 
              label="Dokumen CV (PDF)"
              accept="application/pdf"
              value={form.watch("cvUrl")} 
              onChange={(url) => form.setValue("cvUrl", url, { shouldValidate: true })} 
            />
            {form.formState.errors.cvUrl && <p className="text-xs text-destructive">{form.formState.errors.cvUrl.message}</p>}
          </div>
        </section>

        <section className="admin-panel">
          <div className="admin-panel-heading">
            <div>
              <p className="admin-eyebrow">Search Engine</p>
              <h3>SEO Pengaturan</h3>
            </div>
          </div>
          <div className="admin-form-stack">
            <Field label="SEO Title" error={seoForm.formState.errors.title?.message}>
              <Input {...seoForm.register("title")} />
            </Field>
            <Field label="SEO Description" error={seoForm.formState.errors.description?.message}>
              <Textarea rows={3} {...seoForm.register("description")} />
            </Field>
            <Field label="SEO Keywords" error={seoForm.formState.errors.keywords?.message}>
              <Input {...seoForm.register("keywords")} placeholder="pisahkan dengan koma" />
            </Field>
            <MediaUploader 
              label="OG Image URL (Preview Link Sosial)"
              value={seoForm.watch("ogImageUrl")} 
              onChange={(url) => seoForm.setValue("ogImageUrl", url, { shouldValidate: true })} 
            />
            {seoForm.formState.errors.ogImageUrl && <p className="text-xs text-destructive">{seoForm.formState.errors.ogImageUrl.message}</p>}
          </div>
        </section>

        <div className="flex gap-2 justify-end sticky bottom-6 z-10 p-4 bg-background/80 backdrop-blur-md rounded-2xl border shadow-lg">
          <Button variant="outline" onClick={handleReset} disabled={saving}>
            <X className="size-4 mr-2" /> Batal
          </Button>
          <Button onClick={onSubmit} disabled={saving}>
            <Save className="size-4 mr-2" /> {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </div>
      </div>
    </div>
  );
}
