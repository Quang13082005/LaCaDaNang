import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { getBrowse } from "@/lib/data/place-browse";
import { BROWSE_COPY, BROWSE_SLUGS, browseItemListJsonLd, hubPath, parseBrowsePage, parseBrowseSlug } from "@/lib/seo/browse";
import { siteOrigin } from "@/lib/seo/site";
import { serializeJsonLd } from "@/lib/seo/place";
import { translate } from "@/lib/i18n/messages";
import { PlaceLinkList } from "@/components/places/PlaceLinkList";
import { isSupportedLocale, SUPPORTED_LOCALES, documentLangForLocale } from "@/lib/i18n/locales";
import type { DiscoveryLocale } from "@/lib/data/discovery-contract";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ section: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> };
const LANGUAGES = { vi: "Tiếng Việt", en: "English", ko: "한국어", ru: "Русский", zh: "简体中文" } as const;
const OG_LOCALE = { vi: "vi_VN", en: "en_US", ko: "ko_KR", ru: "ru_RU", zh: "zh_CN" } as const;

async function resolve(props: Props) {
  const { section: raw } = await props.params;
  const slug = parseBrowseSlug(raw);
  if (!slug) notFound();
  const search = await props.searchParams;
  const rawLocale = typeof search.locale === "string" ? search.locale : undefined;
  const locale: DiscoveryLocale = isSupportedLocale(rawLocale) ? rawLocale : "vi";
  const page = typeof search.page === "string" ? parseBrowsePage(search.page) : search.page === undefined ? 1 : null;
  // Anything but the canonical form (vi has no ?locale, others have ?locale=en|ko|ru|zh, ?page>=2) is redirected so every listing has exactly one URL.
  const isCleanLocale = search.locale === undefined || (isSupportedLocale(search.locale) && search.locale !== "vi");
  const canonical = Object.keys(search).every(k => k === "locale" || k === "page")
    && isCleanLocale
    && page !== null && (search.page === undefined || page > 1);
  if (!canonical) permanentRedirect(hubPath(slug, page ?? 1, locale));
  const data = await getBrowse(BROWSE_SLUGS[slug], locale, page);
  if (data.total === 0 || page > data.pages) notFound();
  return { slug, locale, page, data };
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug, locale, page, data } = await resolve(props);
  const copy = BROWSE_COPY[locale];
  const label = copy.sections[BROWSE_SLUGS[slug]];
  const origin = siteOrigin();
  const url = origin + hubPath(slug, page, locale);
  const description = copy.description(label, data.total);
  return {
    title: copy.title(label, page),
    description,
    alternates: {
      canonical: url,
      languages: Object.fromEntries(
        SUPPORTED_LOCALES.map(l => [documentLangForLocale(l), origin + hubPath(slug, page, l)])
      ),
    },
    openGraph: { title: copy.heading(label), description, url, type: "website", locale: OG_LOCALE[locale] },
  };
}

export default async function Page(props: Props) {
  const { slug, locale, page, data } = await resolve(props);
  const copy = BROWSE_COPY[locale];
  const label = copy.sections[BROWSE_SLUGS[slug]];
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(browseItemListJsonLd(slug, page, data.places, data.total, locale)),
        }}
      />
      <main lang={documentLangForLocale(locale)} className="max-w-2xl mx-auto p-4 sm:p-6 space-y-5 break-words [overflow-wrap:anywhere]">
        <Link href="/" className="inline-flex min-h-[44px] items-center text-sky-700">
          {copy.back}
        </Link>
        <nav aria-label={copy.navLabel} className="flex flex-wrap gap-2">
          {(Object.keys(BROWSE_SLUGS) as (keyof typeof BROWSE_SLUGS)[]).map(s => (
            <a
              key={s}
              href={hubPath(s, 1, locale)}
              aria-current={s === slug ? "page" : undefined}
              className={`min-h-[44px] inline-flex items-center px-3 border rounded-lg ${s === slug ? "bg-sky-50 border-sky-300 font-semibold" : ""}`}
            >
              {copy.sections[BROWSE_SLUGS[s]]}
            </a>
          ))}
        </nav>
        <nav aria-label={translate(locale, "language.label")} className="flex flex-wrap gap-2">
          {SUPPORTED_LOCALES.map(l => (
            <a
              key={l}
              href={hubPath(slug, page, l)}
              hrefLang={documentLangForLocale(l)}
              aria-current={l === locale ? "page" : undefined}
              className={`min-h-[44px] inline-flex items-center px-3 border rounded-lg ${l === locale ? "bg-sky-50 border-sky-300 font-semibold" : ""}`}
            >
              {LANGUAGES[l]}
            </a>
          ))}
        </nav>
        <h1 className="text-2xl sm:text-3xl font-bold">{copy.heading(label)}</h1>
        <p className="text-slate-600">
          {copy.count(data.total)}
          {data.pages > 1 && ` · ${copy.pageOf(page, data.pages)}`}
        </p>
        {page === 1 && (
          <section className="text-sm text-slate-700 leading-relaxed bg-slate-50 border border-slate-200/60 rounded-xl p-4">
            <p>{copy.intro[BROWSE_SLUGS[slug]]}</p>
          </section>
        )}
        <PlaceLinkList
          places={data.places}
          locale={locale}
          currentPath={hubPath(slug, page, locale)}
          navType="browse"
        />
        {data.pages > 1 && (
          <nav aria-label={copy.pagination} className="flex flex-wrap gap-2">
            {Array.from({ length: data.pages }, (_, i) => i + 1).map(n => (
              <a
                key={n}
                href={hubPath(slug, n, locale)}
                aria-current={n === page ? "page" : undefined}
                className={`min-h-[44px] min-w-[44px] inline-flex items-center justify-center px-3 border rounded-lg ${n === page ? "bg-sky-50 border-sky-300 font-semibold" : ""}`}
              >
                {n}
              </a>
            ))}
          </nav>
        )}
      </main>
    </>
  );
}
