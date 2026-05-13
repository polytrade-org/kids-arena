import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/db";

export const metadata = {
  title: "Arena — Polytrade Kids AI Arena",
};

// Disable static caching — leaderboards should reflect recent activity.
export const revalidate = 30;

export default async function ArenaPage() {
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [recentBattles, topThisWeek] = await Promise.all([
    prisma.battle.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
      include: {
        characterA: { select: { id: true, name: true, visualUrl: true } },
        characterB: { select: { id: true, name: true, visualUrl: true } },
        winner: {
          select: {
            id: true,
            name: true,
            visualUrl: true,
            kid: { select: { displayName: true } },
          },
        },
      },
    }),
    prisma.character.findMany({
      where: {
        visualGenerationStatus: "READY",
        battlesWon: { some: { createdAt: { gt: weekAgo } } },
      },
      include: {
        kid: { select: { displayName: true } },
        _count: { select: { battlesWon: { where: { createdAt: { gt: weekAgo } } } } },
      },
      take: 50,
    }),
  ]);

  const topSorted = topThisWeek
    .sort((a, b) => b._count.battlesWon - a._count.battlesWon)
    .slice(0, 10);

  return (
    <div className="mx-auto max-w-5xl p-8">
      <header className="mb-8 flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">The Arena</h1>
          <p className="mt-1 text-sm text-black/60 dark:text-white/60">
            Where kid-built AI characters duel. Public, kid-safe, parent-watched.
          </p>
        </div>
        <Link
          href="/arena/battle/new"
          className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition hover:opacity-90"
        >
          Start a battle
        </Link>
      </header>

      <section className="mb-12">
        <h2 className="mb-3 text-sm font-medium text-black/60 dark:text-white/60">
          Top characters this week
        </h2>
        {topSorted.length === 0 ? (
          <div className="rounded-lg border border-dashed border-black/20 p-6 text-sm text-black/60 dark:border-white/30 dark:text-white/60">
            No battles yet this week. Be the first.
          </div>
        ) : (
          <ol className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            {topSorted.map((c, i) => (
              <li key={c.id}>
                <Link
                  href={`/c/${c.id}`}
                  className="block overflow-hidden rounded-lg border border-black/10 transition hover:border-black/30 dark:border-white/20 dark:hover:border-white/40"
                >
                  <div className="aspect-square bg-black/5 dark:bg-white/5">
                    {c.visualUrl && (
                      <Image
                        src={c.visualUrl}
                        alt={c.name}
                        width={200}
                        height={200}
                        className="h-full w-full object-cover"
                        unoptimized
                      />
                    )}
                  </div>
                  <div className="p-2">
                    <p className="truncate text-sm font-medium">
                      <span className="mr-1 text-black/40 dark:text-white/40">
                        #{i + 1}
                      </span>
                      {c.name}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-black/50 dark:text-white/50">
                      by {c.kid.displayName} · {c._count.battlesWon} win
                      {c._count.battlesWon === 1 ? "" : "s"}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ol>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-sm font-medium text-black/60 dark:text-white/60">
          Recent battles
        </h2>
        {recentBattles.length === 0 ? (
          <div className="rounded-lg border border-dashed border-black/20 p-6 text-sm text-black/60 dark:border-white/30 dark:text-white/60">
            No battles yet — start the very first one.
          </div>
        ) : (
          <ul className="space-y-2">
            {recentBattles.map((b) => (
              <li
                key={b.id}
                className="flex items-center gap-3 rounded-lg border border-black/10 p-3 dark:border-white/20"
              >
                <Mini character={b.characterA} />
                <span className="text-xs text-black/40 dark:text-white/40">vs</span>
                <Mini character={b.characterB} />
                <div className="ml-auto text-right text-xs">
                  <p className="font-medium text-emerald-700 dark:text-emerald-400">
                    {b.winner.name} won
                  </p>
                  <p className="text-black/50 dark:text-white/50">
                    +{b.sparkCoinsAwarded} ✨
                  </p>
                </div>
                <Link
                  href={`/arena/battle/${b.id}`}
                  className="text-xs underline-offset-4 hover:underline"
                >
                  see →
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function Mini({
  character,
}: {
  character: { id: string; name: string; visualUrl: string | null };
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-8 w-8 overflow-hidden rounded bg-black/5 dark:bg-white/5">
        {character.visualUrl && (
          <Image
            src={character.visualUrl}
            alt={character.name}
            width={64}
            height={64}
            className="h-full w-full object-cover"
            unoptimized
          />
        )}
      </div>
      <span className="text-sm">{character.name}</span>
    </div>
  );
}
