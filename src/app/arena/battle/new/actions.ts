"use server";

import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { judgeBattle, type BattleCharacterInput } from "@/lib/ai/battle";
import type { CharacterPersonality } from "@/lib/ai/claude";
import { pickRandomScenario } from "@/lib/arena/scenarios";

const DAILY_BATTLE_LIMIT = 10;
const OPPONENT_POOL_RECENT_DAYS = 14;

export type StartBattleState = { error?: string };

export async function startBattle(
  characterId: string,
  _prev: StartBattleState,
  _formData: FormData
): Promise<StartBattleState> {
  const user = await currentUser();
  if (!user) return { error: "You're not signed in." };
  const email = user.primaryEmailAddress?.emailAddress;
  if (!email) return { error: "Your account has no email address." };

  // Verify ownership via parent email → kid → character.
  const playerCharacter = await prisma.character.findFirst({
    where: { id: characterId, kid: { parent: { email } } },
    include: { kid: true },
  });
  if (!playerCharacter) return { error: "We couldn't find that character." };

  // Per-kid daily rate limit (10 battles / 24h).
  const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const todaysBattles = await prisma.battle.count({
    where: {
      OR: [
        { characterA: { kidId: playerCharacter.kidId } },
        { characterB: { kidId: playerCharacter.kidId } },
      ],
      createdAt: { gt: dayAgo },
    },
  });
  if (todaysBattles >= DAILY_BATTLE_LIMIT) {
    return {
      error: `${playerCharacter.kid.displayName} has used all ${DAILY_BATTLE_LIMIT} battles today. Come back tomorrow.`,
    };
  }

  // Pick an opponent: any other recently-created character not owned by the
  // same kid. For alpha we can't guarantee a pool exists; surface a friendly
  // error if not.
  const recentSince = new Date(
    Date.now() - OPPONENT_POOL_RECENT_DAYS * 24 * 60 * 60 * 1000
  );
  // Avoid the same character as opponent. Allow same-kid opponents for
  // V1 alpha so a solo creator can still battle their own roster. Portrait
  // status is ignored — battle page renders fine with placeholders.
  const candidates = await prisma.character.findMany({
    where: {
      id: { not: playerCharacter.id },
      createdAt: { gt: recentSince },
    },
    select: { id: true },
    take: 50,
  });

  if (candidates.length === 0) {
    return {
      error: "No opponents are warmed up yet. Invite a friend to make a character, then try again.",
    };
  }

  const opponentId = candidates[Math.floor(Math.random() * candidates.length)].id;
  const opponent = await prisma.character.findUnique({ where: { id: opponentId } });
  if (!opponent) return { error: "Opponent disappeared. Try again." };

  const scenario = pickRandomScenario();

  const playerInput: BattleCharacterInput = {
    id: playerCharacter.id,
    name: playerCharacter.name,
    vibeDescription: playerCharacter.vibeDescription,
    visualStyle: playerCharacter.visualStyle,
    personality: playerCharacter.personalityJson as unknown as CharacterPersonality,
    stats: playerCharacter.statsJson as unknown as BattleCharacterInput["stats"],
  };
  const opponentInput: BattleCharacterInput = {
    id: opponent.id,
    name: opponent.name,
    vibeDescription: opponent.vibeDescription,
    visualStyle: opponent.visualStyle,
    personality: opponent.personalityJson as unknown as CharacterPersonality,
    stats: opponent.statsJson as unknown as BattleCharacterInput["stats"],
  };

  let verdict: Awaited<ReturnType<typeof judgeBattle>>;
  try {
    verdict = await judgeBattle({
      characterA: playerInput,
      characterB: opponentInput,
      scenario,
    });
  } catch (err) {
    console.error("Battle judging failed:", err);
    return { error: "The arena judge is taking a snack break. Try again in a moment." };
  }

  // Atomic: write battle + credit winner's kid sparkBalance.
  const winnerKidId =
    verdict.winnerId === playerCharacter.id
      ? playerCharacter.kidId
      : opponent.kidId;

  const battle = await prisma.$transaction(async (tx) => {
    const created = await tx.battle.create({
      data: {
        characterAId: playerCharacter.id,
        characterBId: opponent.id,
        scenarioId: scenario.id,
        winnerId: verdict.winnerId,
        outcomeNarrative: verdict.narrative,
        sparkCoinsAwarded: verdict.sparkCoinsAwarded,
        promptVersion: verdict.promptVersion,
      },
    });
    await tx.kid.update({
      where: { id: winnerKidId },
      data: { sparkBalance: { increment: verdict.sparkCoinsAwarded } },
    });
    return created;
  });

  redirect(`/arena/battle/${battle.id}`);
}
