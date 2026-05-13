import Link from "next/link";
import { notFound } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import NewThumbnailSetForm from "./NewThumbnailSetForm";

const WEEKLY_LIMIT = 5;

export const metadata = {
  title: "New thumbnails — Polytrade Studio",
};

export default async function NewThumbnailSetPage({
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
  });
  if (!kid) notFound();

  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const recent = await prisma.thumbnailSet.count({
    where: { kidId: kid.id, createdAt: { gt: weekAgo } },
  });
  const remaining = Math.max(0, WEEKLY_LIMIT - recent);

  return (
    <div className="mx-auto max-w-2xl p-8">
      <nav className="mb-6 text-sm">
        <Link
          href={`/parent-dashboard/kids/${kid.id}/studio`}
          className="text-black/60 hover:underline dark:text-white/60"
        >
          ← Back to Studio
        </Link>
      </nav>

      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Make 8 thumbnails</h1>
        <p className="mt-2 text-sm text-black/60 dark:text-white/60">
          Describe your video. We&apos;ll generate 8 thumbnail variants. Pick your
          favorite and download.{" "}
          <span className="font-medium">
            {remaining} of {WEEKLY_LIMIT} sets left this week.
          </span>
        </p>
      </header>

      {remaining === 0 ? (
        <div className="rounded-lg border border-dashed border-black/20 p-8 text-center text-sm text-black/60 dark:border-white/30 dark:text-white/60">
          {kid.displayName} has used all {WEEKLY_LIMIT} thumbnail sets this week.
          Come back in a few days.
        </div>
      ) : (
        <NewThumbnailSetForm kidId={kid.id} remainingSets={remaining} />
      )}
    </div>
  );
}
