export const PREVIEW_ORIGIN = "https://la-ca-da-nang-preview.quang24101977.workers.dev";
export function siteOrigin(value = process.env.SITE_URL): string {
  const url = new URL(value || PREVIEW_ORIGIN);
  if (url.protocol !== "https:" || url.username || url.password || url.pathname !== "/" || url.search || url.hash) throw new Error("SITE_URL must be an HTTPS origin");
  return url.origin;
}
export function placePath(id: number, locale = "vi"): string {
  return `/places/${id}${locale === "vi" ? "" : `?locale=${locale}`}`;
}
export function parsePlaceId(value: string): number | null {
  if (!/^[1-9]\d*$/.test(value)) return null;
  const id = Number(value);
  return Number.isSafeInteger(id) && id <= 2147483647 ? id : null;
}
