import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { SignOutButton } from "@clerk/nextjs";
import { prisma } from "@/lib/db";
import { AGE_RANGE_LABELS } from "@/lib/validation/kid";

export default async function ParentDashboard() {
  const user = await currentUser();

  // Middleware guarantees we're authenticated here, but TypeScript doesn't know that.
  if (!user) {
    throw new Error("Unreachable: middleware should have redirected");
  }

  const email = user.primaryEmailAddress?.emailAddress;
  if (!email) {
    throw new Error("Authenticated user has no primary email address");
  }

  // Idempotent: creates Parent row on first dashboard load, no-op on subsequent loads.
  // Upsert by email is safe because email is unique and Clerk-verified.
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const parent = await prisma.parent.upsert({
    where: { email },
    update: {},
    create: { email },
    include: {
      kids: {
        orderBy: { createdAt: "asc" },
        include: {
          _count: {
            select: {
              characters: true,
              thumbnailSets: { where: { createdAt: { gt: weekAgo } } },
            },
          },
        },
      },
    },
  });

  return (
    <div className="mx-auto max-w-3xl p-8">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Parent Dashboard</h1>
        <SignOutButton>
          <button className="rounded-full border border-black/10 px-4 py-2 text-sm hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10">
            Sign out
          </button>
        </SignOutButton>
      </header>

      <section className="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-black/10 p-6 dark:border-white/20">
        <div>
          <p className="text-sm text-black/60 dark:text-white/60">Signed in as</p>
          <p className="font-mono text-lg">{email}</p>
        </div>
        <Link
          href="/arena"
          className="rounded-full border border-black/15 px-4 py-2 text-sm hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
        >
          Visit the arena →
        </Link>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-medium text-black/60 dark:text-white/60">
            Kids
          </h2>
          <Link
            href="/parent-dashboard/kids/new"
            className="rounded-full bg-foreground px-4 py-1.5 text-sm font-medium text-background transition hover:opacity-90"
          >
            + Add a kid
          </Link>
        </div>

        {parent.kids.length === 0 ? (
          <div className="rounded-lg border border-dashed border-black/20 p-8 text-center text-sm text-black/60 dark:border-white/30 dark:text-white/60">
            <p className="mb-3">No kids yet.</p>
            <Link
              href="/parent-dashboard/kids/new"
              className="font-medium underline-offset-4 hover:underline"
            >
              Add your first kid →
            </Link>
          </div>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2">
            {parent.kids.map((kid) => (
              <li key={kid.id}>
                <Link
                  href={`/parent-dashboard/kids/${kid.id}`}
                  className="block rounded-lg border border-black/10 p-4 transition hover:border-black/30 dark:border-white/20 dark:hover:border-white/40"
                >
                  <p className="text-lg font-medium">{kid.displayName}</p>
                  <p className="mt-1 text-xs text-black/60 dark:text-white/60">
                    {AGE_RANGE_LABELS[kid.ageRange]} · {kid._count.characters}{" "}
                    character{kid._count.characters === 1 ? "" : "s"} ·{" "}
                    {kid._count.thumbnailSets} thumbnail set
                    {kid._count.thumbnailSets === 1 ? "" : "s"} this week
                  </p>
                  <p className="mt-2 text-sm">
                    <span className="font-medium">{kid.sparkBalance}</span>{" "}
                    <span className="text-black/50 dark:text-white/50">✨ Spark</span>
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
