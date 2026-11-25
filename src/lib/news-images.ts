const GENERIC_IMAGE = /steamstatic\.com|images\.unsplash\.com|logo|favicon|avatar|placeholder|default[-_.]|sprite|gravatar|news\.google|googleusercontent|\.svg(\?|$)/i;

export function isUsableNewsImage(image: string | null | undefined): image is string {
  if (!image) return false;

  try {
    const url = new URL(image);
    return (url.protocol === 'http:' || url.protocol === 'https:') && !GENERIC_IMAGE.test(url.href);
  } catch {
    return false;
  }
}
