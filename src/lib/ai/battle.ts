import { generateObject } from "ai";
import { z } from "zod";
import {
  BATTLE_JUDGE_SYSTEM_PROMPT_V1,
  BATTLE_PROMPT_VERSION,
} from "./prompts";
import type { CharacterPersonality } from "./claude";

const MODEL_BATTLE = "anthropic/claude-sonnet-4.6";

export type BattleCharacterInput = {
  id: string;
  name: string;
  vibeDescription: string;
  visualStyle: string;
  personality: CharacterPersonality;
  stats: { power: number; wit: number; charm: number; mystery: number };
};

export type JudgeBattleInput = {
  characterA: BattleCharacterInput;
  characterB: BattleCharacterInput;
  scenario: { id: string; title: string; prompt: string };
};

export type JudgeBattleResult = {
  winnerId: string;
  narrative: string;
  sparkCoinsAwarded: number;
  promptVersion: string;
};

export async function judgeBattle(
  input: JudgeBattleInput
): Promise<JudgeBattleResult> {
  // The model picks from a closed set of two IDs so we can be strict.
  const verdictSchema = z.object({
    winnerId: z.enum([input.characterA.id, input.characterB.id] as [
      string,
      string,
    ]),
    narrative: z.string().min(20).max(700),
    sparkCoinsAwarded: z.number().int().min(10).max(50),
  });

  const dossier = (c: BattleCharacterInput) => `Character "${c.name}" (id: ${c.id})
  Visual style: ${c.visualStyle}
  Vibe: ${c.vibeDescription}
  Catchphrase: "${c.personality.catchphrase}"
  Speaking style: ${c.personality.speakingStyle}
  Favorites: ${c.personality.favoriteThings.join(", ")}
  Quirks: ${c.personality.quirks.join(", ")}
  Stats: power=${c.stats.power}, wit=${c.stats.wit}, charm=${c.stats.charm}, mystery=${c.stats.mystery}`;

  const userPrompt = `Two characters enter the arena.

${dossier(input.characterA)}

vs.

${dossier(input.characterB)}

Scenario "${input.scenario.title}":
${input.scenario.prompt}

Judge it. Return the JSON verdict.`;

  const { object } = await generateObject({
    model: MODEL_BATTLE,
    schema: verdictSchema,
    system: BATTLE_JUDGE_SYSTEM_PROMPT_V1,
    prompt: userPrompt,
  });

  return {
    winnerId: object.winnerId,
    narrative: object.narrative.trim(),
    sparkCoinsAwarded: object.sparkCoinsAwarded,
    promptVersion: BATTLE_PROMPT_VERSION,
  };
}
