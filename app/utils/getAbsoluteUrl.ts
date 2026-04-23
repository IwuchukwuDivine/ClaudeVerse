const SITE_URL = "https://claude-verse.vercel.app";

export default (path?: string) => {
  if (!path) return `${SITE_URL}/og-image.png`;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
};
