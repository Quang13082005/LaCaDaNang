import type { MetadataRoute } from "next";
import { listPlaceIds } from "@/lib/data/place-detail";
import { siteOrigin, placePath } from "@/lib/seo/site";
import { BROWSE_SLUGS, hubPath, type BrowseSlug } from "@/lib/seo/browse";
import { SUPPORTED_LOCALES, documentLangForLocale } from "@/lib/i18n/locales";

export const dynamic = "force-dynamic";

const BROWSE_KEYS = Object.keys(BROWSE_SLUGS) as BrowseSlug[];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = siteOrigin();
  const ids = await listPlaceIds();

  const browseEntries: MetadataRoute.Sitemap = BROWSE_KEYS.map((slug) => ({
    url: origin + hubPath(slug),
    alternates: {
      languages: Object.fromEntries(
        SUPPORTED_LOCALES.map((l) => [documentLangForLocale(l), origin + hubPath(slug, 1, l)])
      ),
    },
  }));

  const placeEntries: MetadataRoute.Sitemap = ids.map((id) => ({
    url: origin + placePath(id),
    alternates: {
      languages: Object.fromEntries(
        (["vi", "en", "ko"] as const).map((l) => [l, origin + placePath(id, l)])
      ),
    },
  }));

  return [
    { url: origin + "/" },
    ...browseEntries,
    ...placeEntries,
  ];
}
