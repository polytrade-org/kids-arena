import Image from "next/image";
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
    include: {
      characters: { orderBy: { createdAt: "desc" } },
    },
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
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-medium text-black/60 dark:text-white/60">
            Characters
          </h2>
          <Link
            href={`/parent-dashboard/kids/${kid.id}/characters/new`}
            className="rounded-full bg-foreground px-4 py-1.5 text-sm font-medium text-background transition hover:opacity-90"
          >
            + Create character
          </Link>
        </div>

        {kid.characters.length === 0 ? (
          <div className="rounded-lg border border-dashed border-black/20 p-8 text-center text-sm text-black/60 dark:border-white/30 dark:text-white/60">
            <p className="mb-3">No characters yet.</p>
            <Link
              href={`/parent-dashboard/kids/${kid.id}/characters/new`}
              className="font-medium underline-offset-4 hover:underline"
            >
              Create your first character →
            </Link>
          </div>
        ) : (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {kid.characters.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/parent-dashboard/kids/${kid.id}/characters/${c.id}`}
                  className="block overflow-hidden rounded-lg border border-black/10 transition hover:border-black/30 dark:border-white/20 dark:hover:border-white/40"
                >
                  <div className="aspect-square bg-black/5 dark:bg-white/5">
                    {c.visualUrl ? (
                      <Image
                        src={c.visualUrl}
                        alt={c.name}
                        width={300}
                        height={300}
                        className="h-full w-full object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center p-2 text-center text-xs text-black/40 dark:text-white/40">
                        {c.visualGenerationStatus === "FAILED"
                          ? "No portrait"
                          : "Pending…"}
                      </div>
                    )}
                  </div>
                  <p className="px-3 py-2 text-sm font-medium">{c.name}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
