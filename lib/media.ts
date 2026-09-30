import { env, isDemoMode } from "@/lib/env";

export type Bucket = "media" | "documents";

/** URL publique d'un fichier Storage (ou du fichier de démo équivalent). */
export function storageUrl(bucket: Bucket, path: string | null | undefined): string | null {
  if (!path) return null;
  if (/^https?:\/\//.test(path)) return path;
  const clean = path.replace(/^\/+/, "");
  if (isDemoMode() || !env.supabaseUrl) return `/demo/${bucket}/${clean}`;
  return `${env.supabaseUrl}/storage/v1/object/public/${bucket}/${clean.split("/").map(encodeURIComponent).join("/")}`;
}
