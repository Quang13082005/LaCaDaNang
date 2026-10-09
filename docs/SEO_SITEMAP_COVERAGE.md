# SEO sitemap coverage — final local build, 2026-10-10

Evidence: `baseline.json`, `catalog.json`, `local-http-coverage.json` and `metadata-local.json` in sibling `SEO_PRODUCTION_2026-10-09`. The fix has not been deployed.

## Before/after coverage

- Neon total: **1500**. Public and SEO eligible: **1500**, using the existing `active=true AND business_status=OPERATIONAL` predicate. Ineligible: 0.
- Baseline Production sitemap: all 1500 place paths represented, but all **1501 locs** including Home use Preview origin. Correct Production-origin locs: **0**. Duplicate locs: 0. Missing eligible IDs: 0. Baseline HTTP checks sampled details; they did not crawl every live page.
- Final local production build: **1500/1500 canonical VI pages** fetched; 1500 HTTP 200; 1500 correct Production canonicals; zero errors, redirects or noindex responses. JSON-LD venue name/address/exact Maps compared with fresh SELECT data. Technical local coverage: **100%**.
- Final sitemap: HTTP 200, application/xml, valid XML, **573780 bytes**. Home 1 + canonical place entries 1500 = **1501 locs**. Zero missing IDs, duplicates, wrong origins, nonpublic IDs or API/dev/localhost entries.
- Locale alternate links: **4500**, nested inside entries, not additional loc entries. HTML language alternates are reciprocal. VI uses `/places/id`; EN/KO use their actual query routes with self-canonical URLs.
- Additional locale checks: **24 HTTP 200 cases** from 12 venues × EN/KO. Combined with their VI pages, 36 representative cases span EAT 1/1501/1526, CAFE 16/1502/1503, GO 5/1510/1511 and STAY 6/1525/1550. Not all 4500 translated routes were individually crawled.
- Invalid IDs `0`, `abc`, `999999999`: **404**.
- Supplemental title/description/OG/hreflang/no-image checks on 1501/1502/1510/1525: PASS.

There are no duplicate name/address pairs within each locale in the current catalog. Titles now include both. All 4500 short descriptions are empty; existing real type/address content is retained. Editorial depth and human translation quality remain future data work, without fabricated content.

## Query, cache and interpretation

Sitemap generation executes one compact ID SELECT. The separate audit crawler requested every page solely for verification; it is not part of sitemap generation. Detail React cache deduplicates metadata/page queries per request, with no global result cache. Sitemap is dynamic: new eligible records appear on generation; inactive/deleted records leave the sitemap and detail returns 404.

No fabricated lastmod, changefreq or priority. Current XML is well below 50000 entries and 50MB, so no split is needed. Snapshot counts may change if another actor updates the database.

**Google indexing count is unknown.** Local technical coverage does not mean Google indexed 1500 places. Production still has the old origin until Owner approves release; rerun live checks before Search Console submission.
