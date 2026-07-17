/**
 * Force Next Image optimizer through /blog/_next/image so the host LB
 * routes to commonblog (assetPrefix alone does not prefix image URLs).
 */
export default function blogImageLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}): string {
  const params = new URLSearchParams();
  params.set("url", src);
  params.set("w", String(width));
  params.set("q", String(quality ?? 75));
  return `/blog/_next/image?${params.toString()}`;
}
