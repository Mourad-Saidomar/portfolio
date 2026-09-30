import type { MetadataRoute } from "next";
import { getProjects } from "@/lib/data/public";
import { env } from "@/lib/env";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getProjects();
  const pages = ["", "/projets", "/parcours", "/competences", "/a-propos", "/contact"];

  return [
    ...pages.map((path) => ({
      url: `${env.siteUrl}${path}`,
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.8,
    })),
    ...projects.map((project) => ({
      url: `${env.siteUrl}/projets/${project.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
