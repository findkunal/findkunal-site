const CLOUD = import.meta.env.PUBLIC_CLOUDINARY_CLOUD_NAME ?? '';

/**
 * Returns a Cloudinary delivery URL for the given public ID.
 * Applies the named "watermarked" transformation by default, which stamps
 * "© Kunal" in the bottom-right corner (configure in Cloudinary dashboard
 * under Settings → Transformations → Named Transformations).
 */
export function photoUrl(publicId: string, transform = 't_watermarked'): string {
  if (!CLOUD) return '';
  const t = transform ? `${transform}/` : '';
  return `https://res.cloudinary.com/${CLOUD}/image/upload/${t}${publicId}`;
}
