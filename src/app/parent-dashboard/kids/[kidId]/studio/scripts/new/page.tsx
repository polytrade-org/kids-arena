import Link from "next/link";
import { notFound } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import NewScriptForm from "./NewScriptForm";

const WEEKLY_LIMIT = 10;

export const metadata = {
  title: "New script — Polytrade Studio",
};

export default async function NewScriptPage({
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
  const recent = await prisma.script.count({
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
        <h1 className="text-2xl font-semibold">Write a script</h1>
        <p className="mt-2 text-sm text-black/60 dark:text-white/60">
          Tell us the topic and we&apos;ll draft a hook, body, and outro
          tuned to {kid.displayName}&apos;s age band.{" "}
          <span className="font-medium">
            {remaining} of {WEEKLY_LIMIT} scripts left this week.
          </span>
        </p>
      </header>

      {remaining === 0 ? (
        <div className="rounded-lg border border-dashed border-black/20 p-8 text-center text-sm text-black/60 dark:border-white/30 dark:text-white/60">
          {kid.displayName} has used all {WEEKLY_LIMIT} scripts this week. Come
          back in a few days.
        </div>
      ) : (
        <NewScriptForm kidId={kid.id} remainingScripts={remaining} />
      )}
    </div>
  );
}
