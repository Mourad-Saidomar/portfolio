"use client";

import { getBrowserClient } from "@/lib/supabase/browser";

const MAX_IMAGE_BYTES = 15 * 1024 * 1024;
const MAX_PDF_BYTES = 10 * 1024 * 1024;
const MAX_WIDTH = 2400;

export type UploadedImage = { path: string; width: number; height: number };

/**
 * Optimise l'image dans le navigateur (WebP, 2400 px max) puis la téléverse dans le bucket « media ».
 * Les droits sont vérifiés par Supabase (policies Storage réservées à l'admin, types et taille bornés).
 */
export async function uploadImage(file: File, folder: string): Promise<UploadedImage> {
  if (!file.type.startsWith("image/")) throw new Error(`« ${file.name} » n'est pas une image.`);
  if (file.size > MAX_IMAGE_BYTES) throw new Error(`« ${file.name} » dépasse 15 Mo.`);

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_WIDTH / bitmap.width);
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  canvas.getContext("2d")?.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Conversion de l'image impossible."))), "image/webp", 0.85),
  );

  const path = `${folder}/${crypto.randomUUID()}.webp`;
  const { error } = await getBrowserClient()
    .storage.from("media")
    .upload(path, blob, { contentType: "image/webp", cacheControl: "31536000", upsert: false });
  if (error) throw new Error(`Téléversement refusé : ${error.message}`);
  return { path, width, height };
}

/** Téléverse un CV PDF sous un nom horodaté (évite tout cache périmé). */
export async function uploadCv(file: File): Promise<string> {
  if (file.type !== "application/pdf") throw new Error("Le CV doit être un fichier PDF.");
  if (file.size > MAX_PDF_BYTES) throw new Error("Le CV dépasse 10 Mo.");
  const stamp = new Date().toISOString().slice(0, 16).replace(/[-:T]/g, "");
  const path = `cv/cv-mourad-saidomar-${stamp}.pdf`;
  const { error } = await getBrowserClient()
    .storage.from("documents")
    .upload(path, file, { contentType: "application/pdf", cacheControl: "3600", upsert: true });
  if (error) throw new Error(`Téléversement refusé : ${error.message}`);
  return path;
}
