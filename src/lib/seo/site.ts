// Preview builds advertise the same public canonical site; never infer it from request host.
export const PRODUCTION_ORIGIN = "https://lacadanang.quangdev.id.vn";
export function siteOrigin(value = process.env.SITE_URL): string {
  const url = new URL(value || PRODUCTION_ORIGIN);
  if (url.protocol !== "https:" || url.username || url.password || url.pathname !== "/" || url.search || url.hash) throw new Error("SITE_URL must be an HTTPS origin");
  if (url.hostname.endsWith(".workers.dev") || url.hostname === "localhost" || url.hostname === "127.0.0.1" || url.hostname === "[::1]") throw new Error("SITE_URL must be the public canonical site, not Preview or localhost");
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
