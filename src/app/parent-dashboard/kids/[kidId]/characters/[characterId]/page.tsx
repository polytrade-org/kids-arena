import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { VISUAL_STYLE_LABELS } from "@/lib/validation/character";
import type { CharacterPersonality } from "@/lib/ai/claude";
import CharacterChat from "./CharacterChat";

export const metadata = {
  title: "Character — Polytrade Kids AI Arena",
};

type CharacterStats = {
  power: number;
  wit: number;
  charm: number;
  mystery: number;
};

export default async function CharacterDetailPage({
  params,
}: {
  params: Promise<{ kidId: string; characterId: string }>;
}) {
  const { kidId, characterId } = await params;

  const user = await currentUser();
  if (!user) throw new Error("Unreachable: middleware should have redirected");
  const email = user.primaryEmailAddress?.emailAddress;
  if (!email) throw new Error("Authenticated user has no primary email address");

  const character = await prisma.character.findFirst({
    where: {
      id: characterId,
      kidId,
      kid: { parent: { email } },
    },
    include: {
      kid: true,
      chatMessages: { orderBy: { createdAt: "asc" }, take: 50 },
    },
  });
  if (!character) notFound();

  const personality = character.personalityJson as unknown as CharacterPersonality;
  const stats = character.statsJson as unknown as CharacterStats;

  const [wins, losses, sparkSum, recentBattles] = await Promise.all([
    prisma.battle.count({ where: { winnerId: character.id } }),
    prisma.battle.count({
      where: {
        OR: [{ characterAId: character.id }, { characterBId: character.id }],
        NOT: { winnerId: character.id },
      },
    }),
    prisma.battle.aggregate({
      _sum: { sparkCoinsAwarded: true },
      where: { winnerId: character.id },
    }),
    prisma.battle.findMany({
      where: {
        OR: [{ characterAId: character.id }, { characterBId: character.id }],
      },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        characterA: { select: { id: true, name: true } },
        characterB: { select: { id: true, name: true } },
      },
    }),
  ]);
  const sparkEarned = sparkSum._sum.sparkCoinsAwarded ?? 0;

  return (
    <div className="mx-auto max-w-3xl p-8">
      <nav className="mb-6 text-sm">
        <Link
          href={`/parent-dashboard/kids/${character.kid.id}`}
          className="text-black/60 hover:underline dark:text-white/60"
        >
          ← Back to {character.kid.displayName}
        </Link>
      </nav>

      <header className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-[200px_1fr]">
        <div className="aspect-square overflow-hidden rounded-lg border border-black/10 bg-black/5 dark:border-white/20 dark:bg-white/5">
          {character.visualUrl ? (
            <Image
              src={character.visualUrl}
              alt={character.name}
              width={400}
              height={400}
              className="h-full w-full object-cover"
              unoptimized
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center p-4 text-center text-xs text-black/50 dark:text-white/50">
              {character.visualGenerationStatus === "FAILED"
                ? "Portrait didn't come through."
                : "Portrait pending…"}
            </div>
          )}
        </div>

        <div>
          <h1 className="text-2xl font-semibold">{character.name}</h1>
          <p className="mt-1 text-sm text-black/60 dark:text-white/60">
            {VISUAL_STYLE_LABELS[character.visualStyle]} · created{" "}
            {character.createdAt.toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>
          <p className="mt-4 text-base italic">&ldquo;{personality.catchphrase}&rdquo;</p>

          <dl className="mt-4 grid grid-cols-4 gap-3 text-center">
            <Stat label="Power" value={stats.power} />
            <Stat label="Wit" value={stats.wit} />
            <Stat label="Charm" value={stats.charm} />
            <Stat label="Mystery" value={stats.mystery} />
          </dl>
        </div>
      </header>

      <section className="mb-8 space-y-4 rounded-lg border border-black/10 p-6 dark:border-white/20">
        <h2 className="text-sm font-medium text-black/60 dark:text-white/60">
          Personality
        </h2>
        <p className="text-sm">
          <span className="font-medium">Vibe: </span>
          {character.vibeDescription}
        </p>
        <p className="text-sm">
          <span className="font-medium">Speaking style: </span>
          {personality.speakingStyle}
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-wide text-black/50 dark:text-white/50">
              Favorite things
            </p>
            <ul className="mt-1 list-inside list-disc text-sm">
              {personality.favoriteThings.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-black/50 dark:text-white/50">
              Quirks
            </p>
            <ul className="mt-1 list-inside list-disc text-sm">
              {personality.quirks.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-8 rounded-lg border border-black/10 p-6 dark:border-white/20">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-sm font-medium text-black/60 dark:text-white/60">
            Arena record
          </h2>
          <Link
            href="/arena/battle/new"
            className="text-sm font-medium underline-offset-4 hover:underline"
          >
            Send to arena →
          </Link>
        </div>
        <dl className="mb-4 grid grid-cols-3 gap-3 text-center">
          <Stat label="Wins" value={wins} />
          <Stat label="Losses" value={losses} />
          <Stat label="Spark earned" value={sparkEarned} />
        </dl>
        {recentBattles.length === 0 ? (
          <p className="text-sm text-black/50 dark:text-white/50">
            No battles yet.
          </p>
        ) : (
          <ul className="space-y-2 text-sm">
            {recentBattles.map((b) => {
              const isA = b.characterAId === character.id;
              const opponent = isA ? b.characterB : b.characterA;
              const won = b.winnerId === character.id;
              return (
                <li
                  key={b.id}
                  className="flex items-center justify-between gap-3 rounded-md border border-black/5 px-3 py-2 dark:border-white/10"
                >
                  <span>
                    vs <span className="font-medium">{opponent.name}</span>
                  </span>
                  <span
                    className={
                      won
                        ? "text-emerald-700 dark:text-emerald-400"
                        : "text-black/50 dark:text-white/50"
                    }
                  >
                    {won ? `+${b.sparkCoinsAwarded} ✨` : "Lost"}
                  </span>
                  <Link
                    href={`/arena/battle/${b.id}`}
                    className="text-xs underline-offset-4 hover:underline"
                  >
                    see
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-sm font-medium text-black/60 dark:text-white/60">
          Chat with {character.name}
        </h2>
        <CharacterChat
          kidId={character.kid.id}
          characterId={character.id}
          characterName={character.name}
          initialMessages={character.chatMessages.map((m) => ({
            id: m.id,
            role: m.role,
            content: m.content,
          }))}
        />
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border border-black/10 p-2 dark:border-white/20">
      <p className="text-xs uppercase tracking-wide text-black/50 dark:text-white/50">
        {label}
      </p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  );
}
