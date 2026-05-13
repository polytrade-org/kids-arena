import Image from "next/image";
import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import StartBattleButton from "./StartBattleButton";

export const metadata = {
  title: "Start a battle — Polytrade Kids AI Arena",
};

const DAILY_LIMIT = 10;

export default async function NewBattlePage() {
  const user = await currentUser();
  if (!user) throw new Error("Unreachable: middleware should have redirected");
  const email = user.primaryEmailAddress?.emailAddress;
  if (!email) throw new Error("Authenticated user has no primary email address");

  const kids = await prisma.kid.findMany({
    where: { parent: { email } },
    include: {
      characters: { orderBy: { createdAt: "desc" } },
    },
  });

  const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const battleCountByKid = new Map<string, number>();
  for (const kid of kids) {
    const n = await prisma.battle.count({
      where: {
        OR: [
          { characterA: { kidId: kid.id } },
          { characterB: { kidId: kid.id } },
        ],
        createdAt: { gt: dayAgo },
      },
    });
    battleCountByKid.set(kid.id, n);
  }

  const hasAnyCharacter = kids.some((k) => k.characters.length > 0);

  return (
    <div className="mx-auto max-w-3xl p-8">
      <nav className="mb-6 text-sm">
        <Link
          href="/arena"
          className="text-black/60 hover:underline dark:text-white/60"
        >
          ← Back to arena
        </Link>
      </nav>

      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Start a battle</h1>
        <p className="mt-2 text-sm text-black/60 dark:text-white/60">
          Pick a character to send into the arena. We&apos;ll match them with
          another creator&apos;s character and judge the duel.
        </p>
      </header>

      {!hasAnyCharacter ? (
        <div className="rounded-lg border border-dashed border-black/20 p-8 text-center text-sm text-black/60 dark:border-white/30 dark:text-white/60">
          <p className="mb-3">You don&apos;t have any battle-ready characters yet.</p>
          <Link
            href="/parent-dashboard"
            className="font-medium underline-offset-4 hover:underline"
          >
            Create your first character →
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {kids.map((kid) => {
            const used = battleCountByKid.get(kid.id) ?? 0;
            const remaining = Math.max(0, DAILY_LIMIT - used);
            return (
              <section key={kid.id}>
                <div className="mb-3 flex items-baseline justify-between">
                  <h2 className="text-sm font-medium">{kid.displayName}</h2>
                  <p className="text-xs text-black/60 dark:text-white/60">
                    {remaining} / {DAILY_LIMIT} battles left today
                  </p>
                </div>
                {kid.characters.length === 0 ? (
                  <p className="text-sm text-black/50 dark:text-white/50">
                    No ready characters yet.
                  </p>
                ) : (
                  <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {kid.characters.map((c) => (
                      <li
                        key={c.id}
                        className="overflow-hidden rounded-lg border border-black/10 dark:border-white/20"
                      >
                        <div className="flex gap-3 p-3">
                          {c.visualUrl && (
                            <Image
                              src={c.visualUrl}
                              alt={c.name}
                              width={80}
                              height={80}
                              className="h-20 w-20 rounded-md object-cover"
                              unoptimized
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="truncate font-medium">{c.name}</p>
                            <p className="mt-1 text-xs text-black/50 dark:text-white/50">
                              {c.visualStyle.toLowerCase()}
                            </p>
                          </div>
                        </div>
                        <div className="border-t border-black/10 p-3 dark:border-white/20">
                          {remaining > 0 ? (
                            <StartBattleButton
                              characterId={c.id}
                              characterName={c.name}
                            />
                          ) : (
                            <p className="text-center text-xs text-black/50 dark:text-white/50">
                              Daily battle limit reached.
                            </p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
