import Link from "next/link";
import { notFound } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import {
  NICHE_LABELS,
  THUMBNAIL_STYLE_LABELS,
} from "@/lib/validation/thumbnail";
import ThumbnailGrid from "./ThumbnailGrid";

export const metadata = {
  title: "Thumbnails — Polytrade Studio",
};

export default async function ThumbnailSetDetailPage({
  params,
}: {
  params: Promise<{ kidId: string; setId: string }>;
}) {
  const { kidId, setId } = await params;

  const user = await currentUser();
  if (!user) throw new Error("Unreachable: middleware should have redirected");
  const email = user.primaryEmailAddress?.emailAddress;
  if (!email) throw new Error("Authenticated user has no primary email address");

  const set = await prisma.thumbnailSet.findFirst({
    where: {
      id: setId,
      kidId,
      kid: { parent: { email } },
    },
    include: {
      thumbnails: { orderBy: { position: "asc" } },
    },
  });
  if (!set) notFound();

  const readyCount = set.thumbnails.filter((t) => t.status === "READY").length;

  return (
    <div className="mx-auto max-w-4xl p-8">
      <nav className="mb-6 text-sm">
        <Link
          href={`/parent-dashboard/kids/${kidId}/studio`}
          className="text-black/60 hover:underline dark:text-white/60"
        >
          ← Back to Studio
        </Link>
      </nav>

      <header className="mb-6">
        <h1 className="text-2xl font-semibold">{set.titleText}</h1>
        <p className="mt-2 text-sm text-black/60 dark:text-white/60">
          {NICHE_LABELS[set.niche]} · {THUMBNAIL_STYLE_LABELS[set.stylePreset]} ·{" "}
          {readyCount} of {set.thumbnails.length} variants ready
        </p>
        <p className="mt-3 text-sm">{set.videoDescription}</p>
      </header>

      <ThumbnailGrid setId={set.id} thumbnails={set.thumbnails} />

      <div className="mt-8 flex gap-3 text-sm">
        <Link
          href={`/parent-dashboard/kids/${kidId}/studio/thumbnails/new`}
          className="rounded-full bg-foreground px-4 py-2 font-medium text-background transition hover:opacity-90"
        >
          Make another set
        </Link>
        <Link
          href={`/parent-dashboard/kids/${kidId}/studio`}
          className="rounded-full border border-black/15 px-4 py-2 hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
        >
          Back to Studio
        </Link>
      </div>
    </div>
  );
}
