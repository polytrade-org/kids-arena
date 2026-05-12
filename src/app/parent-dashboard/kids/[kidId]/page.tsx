import Link from "next/link";
import { notFound } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { AGE_RANGE_LABELS } from "@/lib/validation/kid";

export const metadata = {
  title: "Kid — Polytrade Kids AI Arena",
};

export default async function KidDetailPage({
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
    include: { characters: true },
  });

  if (!kid) notFound();

  return (
    <div className="mx-auto max-w-3xl p-8">
      <nav className="mb-6 text-sm">
        <Link
          href="/parent-dashboard"
          className="text-black/60 hover:underline dark:text-white/60"
        >
          ← Back to dashboard
        </Link>
      </nav>

      <header className="mb-8 flex flex-wrap items-baseline justify-between gap-3">
        <h1 className="text-2xl font-semibold">{kid.displayName}</h1>
        <p className="text-sm text-black/60 dark:text-white/60">
          {AGE_RANGE_LABELS[kid.ageRange]} · added{" "}
          {kid.createdAt.toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </p>
      </header>

      <section>
        <h2 className="mb-3 text-sm font-medium text-black/60 dark:text-white/60">
          Characters
        </h2>
        {kid.characters.length === 0 ? (
          <div className="rounded-lg border border-dashed border-black/20 p-8 text-center text-sm text-black/60 dark:border-white/30 dark:text-white/60">
            No characters yet. Character creation arrives in the next build session.
          </div>
        ) : (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {kid.characters.map((c) => (
              <li
                key={c.id}
                className="rounded-lg border border-black/10 p-4 dark:border-white/20"
              >
                <p className="font-medium">{c.name}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
