import Link from "next/link";
import { notFound } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import NewCharacterForm from "./NewCharacterForm";

const WEEKLY_LIMIT = 3;

export const metadata = {
  title: "New character — Polytrade Kids AI Arena",
};

export default async function NewCharacterPage({
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
  const recentCount = await prisma.character.count({
    where: { kidId: kid.id, createdAt: { gt: weekAgo } },
  });
  const remaining = Math.max(0, WEEKLY_LIMIT - recentCount);

  return (
    <div className="mx-auto max-w-2xl p-8">
      <nav className="mb-6 text-sm">
        <Link
          href={`/parent-dashboard/kids/${kid.id}`}
          className="text-black/60 hover:underline dark:text-white/60"
        >
          ← Back to {kid.displayName}
        </Link>
      </nav>

      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Create a character</h1>
        <p className="mt-2 text-sm text-black/60 dark:text-white/60">
          Describe a character. We&apos;ll write their personality and draw their
          portrait.{" "}
          <span className="font-medium">
            {remaining} of {WEEKLY_LIMIT} creations left this week.
          </span>
        </p>
      </header>

      {remaining === 0 ? (
        <div className="rounded-lg border border-dashed border-black/20 p-8 text-center text-sm text-black/60 dark:border-white/30 dark:text-white/60">
          {kid.displayName} has used all {WEEKLY_LIMIT} character creations this
          week. Come back in a few days.
        </div>
      ) : (
        <NewCharacterForm kidId={kid.id} remainingCreations={remaining} />
      )}
    </div>
  );
}
