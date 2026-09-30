import type { Metadata } from "next";
import { SkillsManager } from "@/components/admin/skills-manager";
import { AdminHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";
import { listSkillCategories } from "@/lib/data/admin";

export const metadata: Metadata = { title: "Compétences" };

export default async function AdminSkillsPage() {
  const { supabase } = await requireAdmin();
  const categories = await listSkillCategories(supabase);

  return (
    <>
      <AdminHeader
        title="Compétences"
        description="Regroupées par domaine. Glissez-déposez les catégories et les compétences pour les ordonner ; chaque modification est publiée immédiatement."
      />
      <div className="mt-8">
        <SkillsManager
          initial={categories.map((c) => ({
            id: c.id,
            name: c.name,
            description: c.description,
            skills: c.skills.map((s) => ({ id: s.id, name: s.name })),
          }))}
        />
      </div>
    </>
  );
}
