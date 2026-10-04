import { ContactPageSkeleton } from "@/components/site/skeletons";

/** Squelette de la page Contact pendant le chargement des coordonnées (Suspense de Next.js). */
export default function Loading() {
  return <ContactPageSkeleton />;
}
