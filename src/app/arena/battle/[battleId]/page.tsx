import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getScenarioById } from "@/lib/arena/scenarios";

export const metadata = {
  title: "Battle — Polytrade Kids AI Arena",
};

export default async function BattlePage({
  params,
}: {
  params: Promise<{ battleId: string }>;
}) {
  const { battleId } = await params;

  const battle = await prisma.battle.findUnique({
    where: { id: battleId },
    include: {
      characterA: { include: { kid: { select: { displayName: true } } } },
      characterB: { include: { kid: { select: { displayName: true } } } },
    },
  });

  if (!battle) notFound();

  const scenario = getScenarioById(battle.scenarioId);
  const winnerIsA = battle.winnerId === battle.characterAId;
  const winner = winnerIsA ? battle.characterA : battle.characterB;

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

      <header className="mb-8">
        <p className="text-xs uppercase tracking-wide text-black/50 dark:text-white/50">
          Scenario
        </p>
        <h1 className="text-xl font-semibold sm:text-2xl">
          {scenario?.title ?? "Mystery scenario"}
        </h1>
        {scenario?.prompt && (
          <p className="mt-2 text-sm text-black/60 dark:text-white/60">
            {scenario.prompt}
          </p>
        )}
      </header>

      <div className="mb-8 grid grid-cols-2 items-stretch gap-4">
        <BattleSide
          character={battle.characterA}
          isWinner={winnerIsA}
        />
        <BattleSide
          character={battle.characterB}
          isWinner={!winnerIsA}
        />
      </div>

      <section className="mb-6 rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-6">
        <p className="text-xs uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
          Winner — {winner.name}
        </p>
        <p className="mt-2 text-base">{battle.outcomeNarrative}</p>
        <p className="mt-3 text-sm font-medium">
          +{battle.sparkCoinsAwarded} Spark coins
        </p>
      </section>

      <div className="flex flex-wrap gap-3 text-sm">
        <Link
          href="/arena/battle/new"
          className="rounded-full bg-foreground px-4 py-2 font-medium text-background transition hover:opacity-90"
        >
          Battle again
        </Link>
        <Link
          href="/arena"
          className="rounded-full border border-black/15 px-4 py-2 hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
        >
          See the arena
        </Link>
      </div>
    </div>
  );
}

function BattleSide({
  character,
  isWinner,
}: {
  character: {
    id: string;
    name: string;
    visualUrl: string | null;
    kid: { displayName: string };
  };
  isWinner: boolean;
}) {
  return (
    <div
      className={`flex flex-col overflow-hidden rounded-lg border ${
        isWinner
          ? "border-emerald-500/50"
          : "border-black/10 dark:border-white/20"
      }`}
    >
      <div className="aspect-square bg-black/5 dark:bg-white/5">
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
          <div className="flex h-full w-full items-center justify-center text-xs text-black/40 dark:text-white/40">
            No portrait
          </div>
        )}
      </div>
      <div className="p-3">
        <p className="font-medium">{character.name}</p>
        <p className="mt-1 text-xs text-black/60 dark:text-white/60">
          by {character.kid.displayName}
        </p>
        {isWinner && (
          <p className="mt-2 text-xs font-medium uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
            Winner
          </p>
        )}
      </div>
    </div>
  );
}
