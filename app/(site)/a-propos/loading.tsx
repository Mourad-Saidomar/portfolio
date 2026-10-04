import { AboutPageSkeleton } from "@/components/site/skeletons";

/** Squelette de la page À propos pendant le chargement du profil (Suspense de Next.js). */
export default function Loading() {
  return <AboutPageSkeleton />;
}
