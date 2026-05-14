import Link from "next/link";
import { notFound } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { NICHE_LABELS } from "@/lib/validation/thumbnail";
import {
  SCRIPT_LENGTH_LABELS,
  SCRIPT_TONE_LABELS,
} from "@/lib/validation/script";

export const metadata = {
  title: "Scripts — Polytrade Studio",
};

export default async function ScriptsLibraryPage({
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
      scripts: { orderBy: { createdAt: "desc" } },
    },
  });
  if (!kid) notFound();

  return (
    <div className="mx-auto max-w-4xl p-8">
      <nav className="mb-6 text-sm">
        <Link
          href={`/parent-dashboard/kids/${kid.id}/studio`}
          className="text-black/60 hover:underline dark:text-white/60"
        >
          ← Back to Studio
        </Link>
      </nav>

      <header className="mb-8 flex flex-wrap items-baseline justify-between gap-3">
        <h1 className="text-2xl font-semibold">{kid.displayName}&apos;s scripts</h1>
        <Link
          href={`/parent-dashboard/kids/${kid.id}/studio/scripts/new`}
          className="rounded-full bg-foreground px-4 py-1.5 text-sm font-medium text-background transition hover:opacity-90"
        >
          + New script
        </Link>
      </header>

      {kid.scripts.length === 0 ? (
        <div className="rounded-lg border border-dashed border-black/20 p-8 text-center text-sm text-black/60 dark:border-white/30 dark:text-white/60">
          <p className="mb-3">No scripts yet.</p>
          <Link
            href={`/parent-dashboard/kids/${kid.id}/studio/scripts/new`}
            className="font-medium underline-offset-4 hover:underline"
          >
            Write your first script →
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {kid.scripts.map((s) => (
            <li key={s.id}>
              <Link
                href={`/parent-dashboard/kids/${kid.id}/studio/scripts/${s.id}`}
                className="block rounded-lg border border-black/10 p-4 transition hover:border-black/30 dark:border-white/20 dark:hover:border-white/40"
              >
                <p className="line-clamp-2 text-base font-medium">{s.topic}</p>
                <p className="mt-1 text-xs text-black/60 dark:text-white/60">
                  {NICHE_LABELS[s.niche]} · {SCRIPT_TONE_LABELS[s.tone]} ·{" "}
                  {SCRIPT_LENGTH_LABELS[s.targetLength]} ·{" "}
                  {s.createdAt.toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
