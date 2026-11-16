import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-canvas px-6 text-center text-fg">
      <div aria-hidden className="grid-lines absolute inset-0 opacity-60" />
      <p className="label relative flex items-center gap-2">
        <span className="h-1.5 w-1.5 bg-accent" /> Error 404
      </p>
      <h1 className="h-display relative mt-6">
        Lost in <em className="tone-accent">space.</em>
      </h1>
      <p className="relative mt-5 max-w-sm text-muted">This page doesn&apos;t exist — or it moved somewhere better.</p>
      <Link href="/" className="btn btn-primary relative mt-10">
        <ArrowLeft size={15} />
        <span>Back home</span>
      </Link>
    </main>
  );
}
