import { getProfile, getProject } from "@/lib/data/public";
import { OG_SIZE, renderOgImage } from "@/lib/og";

export const alt = "Étude de cas — Mourad Saidomar";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function ProjectOpenGraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [project, profile] = await Promise.all([getProject(slug), getProfile()]);
  return renderOgImage({
    eyebrow: project?.stack.slice(0, 3).join(" · ") || "Étude de cas",
    title: project?.title ?? "Projet",
    subtitle: project?.period || undefined,
    footer: `${profile?.fullName ?? "Mourad Saidomar"} — ${profile?.headline ?? "Développeur web"}`,
  });
}
