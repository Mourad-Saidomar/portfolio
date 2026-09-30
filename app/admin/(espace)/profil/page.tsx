import type { Metadata } from "next";
import { CvUploader } from "@/components/admin/cv-uploader";
import { ProfileForm } from "@/components/admin/profile-form";
import { AdminHeader, Panel } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";
import { getProfileRow } from "@/lib/data/admin";
import { profileToForm } from "@/lib/data/admin-forms";
import { storageUrl } from "@/lib/media";

export const metadata: Metadata = { title: "Profil & CV" };

export default async function AdminProfilePage() {
  const { supabase } = await requireAdmin();
  const profile = await getProfileRow(supabase);

  return (
    <>
      <AdminHeader title="Profil & CV" description="Accroche, présentation, photo, liens et CV : tout ce qui vous présente sur le site." />
      <div className="mt-8 grid grid-cols-1 gap-6">
        <Panel id="cv" title="CV" description="Remplacez le PDF à tout moment : le lien /cv et les boutons du site pointent toujours vers la dernière version.">
          {profile ? (
            <CvUploader currentUrl={storageUrl("documents", profile.cv_path)} updatedAt={profile.cv_updated_at} />
          ) : (
            <p className="text-muted">Enregistrez d&apos;abord le profil ci-dessous.</p>
          )}
        </Panel>
        <ProfileForm key={profile?.updated_at ?? "nouveau"} initial={profileToForm(profile)} />
      </div>
    </>
  );
}
