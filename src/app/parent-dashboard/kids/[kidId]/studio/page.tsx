import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { NICHE_LABELS } from "@/lib/validation/thumbnail";

export const metadata = {
  title: "Studio — Polytrade Kids AI Arena",
};

type Tool = {
  id: string;
  label: string;
  description: string;
  status: "available" | "soon";
  href?: string;
};

const TOOLS: Tool[] = [
  {
    id: "thumbnails",
    label: "Thumbnail generator",
    description: "Describe your video, get 8 thumbnail variants to choose from.",
    status: "available",
  },
  {
    id: "scripts",
    label: "Script writer",
    description: "Generate a video script in your niche and tone.",
    status: "soon",
  },
  {
    id: "broll",
    label: "B-roll fetcher",
    description: "Get short clips that match a description — stock or AI-generated.",
    status: "soon",
  },
  {
    id: "shorts",
    label: "Shorts auto-editor",
    description: "Turn raw footage into a publishable 30–60s short.",
    status: "soon",
  },
  {
    id: "voice",
    label: "Voice generation",
    description: "Clone your voice for narration (parent-approved).",
    status: "soon",
  },
];

export default async function StudioPage({
  params,
}: {
  params: Promise<{ kidId: string }>;
}) {
  const { kidId } = await params;

  const user = await currentUser();
  if (!user) throw new Error("Unreachable: middleware should have redirected");
  const email = user.primaryEmailAddress?.emailAddress;
  if (!email) throw new Error("Authenticated user has no primary email address");

  const kid = await prisma.kid.findFirst({
    where: { id: kidId, parent: { email } },
    include: {
      thumbnailSets: {
        orderBy: { createdAt: "desc" },
        take: 12,
        include: {
          thumbnails: {
            orderBy: { position: "asc" },
            take: 1,
            where: { OR: [{ selected: true }, { status: "READY" }] },
          },
        },
      },
    },
  });
  if (!kid) notFound();

  return (
    <div className="mx-auto max-w-4xl p-8">
      <nav className="mb-6 text-sm">
        <Link
          href={`/parent-dashboard/kids/${kid.id}`}
          className="text-black/60 hover:underline dark:text-white/60"
        >
          ← Back to {kid.displayName}
        </Link>
      </nav>

      <header className="mb-8">
        <h1 className="text-2xl font-semibold">{kid.displayName}&apos;s Studio</h1>
        <p className="mt-2 text-sm text-black/60 dark:text-white/60">
          Creator tools for the kid making real videos. Same earnings, same parent
          dashboard, just a different surface.
        </p>
      </header>

      <section className="mb-10">
        <h2 className="mb-3 text-sm font-medium text-black/60 dark:text-white/60">
          Tools
        </h2>
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {TOOLS.map((tool) => (
            <li key={tool.id}>
              {tool.status === "available" ? (
                <Link
                  href={`/parent-dashboard/kids/${kid.id}/studio/${tool.id}/new`}
                  className="block rounded-lg border border-black/10 p-4 transition hover:border-black/30 dark:border-white/20 dark:hover:border-white/40"
                >
                  <div className="flex items-baseline justify-between">
                    <p className="font-medium">{tool.label}</p>
                    <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                      Available
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-black/60 dark:text-white/60">
                    {tool.description}
                  </p>
                </Link>
              ) : (
                <div className="rounded-lg border border-dashed border-black/15 p-4 dark:border-white/15">
                  <div className="flex items-baseline justify-between">
                    <p className="font-medium text-black/60 dark:text-white/60">
                      {tool.label}
                    </p>
                    <span className="text-xs uppercase tracking-wide text-black/40 dark:text-white/40">
                      Soon
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-black/50 dark:text-white/50">
                    {tool.description}
                  </p>
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-medium text-black/60 dark:text-white/60">
            Recent thumbnail sets
          </h2>
          <Link
            href={`/parent-dashboard/kids/${kid.id}/studio/thumbnails/new`}
            className="rounded-full bg-foreground px-4 py-1.5 text-sm font-medium text-background transition hover:opacity-90"
          >
            + Make thumbnails
          </Link>
        </div>

        {kid.thumbnailSets.length === 0 ? (
          <div className="rounded-lg border border-dashed border-black/20 p-8 text-center text-sm text-black/60 dark:border-white/30 dark:text-white/60">
            <p className="mb-3">No thumbnail sets yet.</p>
            <Link
              href={`/parent-dashboard/kids/${kid.id}/studio/thumbnails/new`}
              className="font-medium underline-offset-4 hover:underline"
            >
              Make your first set →
            </Link>
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
            {kid.thumbnailSets.map((s) => {
              const preview = s.thumbnails[0];
              return (
                <li key={s.id}>
                  <Link
                    href={`/parent-dashboard/kids/${kid.id}/studio/thumbnails/${s.id}`}
                    className="block overflow-hidden rounded-lg border border-black/10 transition hover:border-black/30 dark:border-white/20 dark:hover:border-white/40"
                  >
                    <div className="aspect-video bg-black/5 dark:bg-white/5">
                      {preview?.imageUrl && (
                        <Image
                          src={preview.imageUrl}
                          alt={s.titleText}
                          width={400}
                          height={225}
                          className="h-full w-full object-cover"
                          unoptimized
                        />
                      )}
                    </div>
                    <div className="p-3">
                      <p className="truncate text-sm font-medium">{s.titleText}</p>
                      <p className="mt-0.5 text-xs text-black/50 dark:text-white/50">
                        {NICHE_LABELS[s.niche]} ·{" "}
                        {s.createdAt.toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
