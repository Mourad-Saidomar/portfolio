import { getProfile } from "@/lib/data/public";
import { OG_SIZE, renderOgImage } from "@/lib/og";

export const alt = "Mourad Saidomar — Développeur web & web mobile";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const profile = await getProfile();
  return renderOgImage({
    eyebrow: profile?.location ?? "Mayotte",
    title: profile?.fullName ?? "Mourad Saidomar",
    subtitle: profile?.headline ?? "Développeur web & web mobile",
    footer: profile?.email ?? "",
  });
}
