# Production Search Console handoff
Wait for approved SEO release and post-deploy verification first. Do NOT submit Preview workers.dev sitemap. Owner must perform Google login and DNS changes; agent made none.

1. Open Search Console with Owner Google account. Add Domain property `lacadanang.quangdev.id.vn` (no scheme/path), if Owner can manage its DNS; alternatively an already verified parent Domain property can cover this host. Use exactly the TXT record/name issued by Google at the authoritative DNS provider. Do not delete unrelated records or modify Worker/domain routing.
2. Wait for DNS propagation and click Verify. Keep verification TXT afterward. If DNS access is unavailable, use URL-prefix property `https://lacadanang.quangdev.id.vn/` and HTML-tag verification. Supply only token content as `GOOGLE_SITE_VERIFICATION` to approved build environment, rebuild/redeploy after separate approval. No fabricated token; local token currently absent. DNS method needs no app token.
3. After successful production release, check robots references `https://lacadanang.quangdev.id.vn/sitemap.xml`; sitemap returns200/application/xml and contains only Production canonical locs/alternates.
4. Submit `https://lacadanang.quangdev.id.vn/sitemap.xml` in Sitemaps. Confirm Google read status and last read; investigate fetch/parse failures rather than assuming success.
5. URL Inspection: Home and /places/1501,/places/1502,/places/1510,/places/1525 plus ?locale=en/ko examples. Run Live Test and compare declared vs Google-selected canonical. Request indexing for representative pages when appropriate.
6. Monitor Page indexing indexed/not indexed, duplicate/canonical choices, crawled/discovered-not-indexed, soft404 and server errors. Sitemap inclusion/HTTP200 is not proof of indexing or ranking. No promise all1500 will be indexed immediately.

Official guidance: https://support.google.com/webmasters/answer/34592 ; https://support.google.com/webmasters/answer/9008080 ; https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap .

Deferred Analytics Event Coverage backlog (audit only, no implementation): evaluate intent/preference/results, detail viewed, Maps/directions, Nearby request/result/failure, language, recommendation refresh and meaningful CTAs. Distinguish11 first-party events from GA-only detail events; test consent/hostname controls and duplication with Owner-authorized traffic. No preciseGPS/PII, no decorative/noisy event expansion. Preserve current GA4 implementation and Measurement ID.
