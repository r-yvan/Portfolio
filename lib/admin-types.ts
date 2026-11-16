/** Shapes shared by admin server actions and client components. */
export type ActionResult<T = undefined> =
  | { ok: true; message?: string; data?: T }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

export type LinkStatus = { ok: boolean; status: number; error?: string };

export type RepoCandidate = {
  name: string;
  description: string;
  url: string;
  homepage: string;
  language: string;
  stars: number;
  updatedAt: string;
  imported: boolean;
};
