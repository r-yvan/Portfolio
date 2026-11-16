/** Static, non-editable site configuration. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://r-yvan.vercel.app").replace(
  /\/$/,
  "",
);

export type NavItem = { label: string; href: string };
