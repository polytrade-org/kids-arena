import { generateObject, generateText } from "ai";
import { z } from "zod";
import {
  CHAT_PROMPT_VERSION,
  CHAT_SYSTEM_PROMPT_TEMPLATE_V1,
  PERSONALITY_PROMPT_VERSION,
  PERSONALITY_SYSTEM_PROMPT_V1,
} from "./prompts";

// Models accessed via Vercel AI Gateway (routes by provider/model string).
// Auth comes from AI_GATEWAY_API_KEY in dev or OIDC token in Vercel deployments.
const MODEL_PERSONALITY = "anthropic/claude-sonnet-4.6";
const MODEL_CHAT = "anthropic/claude-sonnet-4.6";

const personalitySchema = z.object({
  catchphrase: z.string().min(2).max(80),
  speakingStyle: z.string().min(8).max(250),
  favoriteThings: z.array(z.string().min(2).max(100)).min(3).max(5),
  quirks: z.array(z.string().min(2).max(150)).min(2).max(3),
});

export type CharacterPersonality = z.infer<typeof personalitySchema>;

export type GeneratePersonalityInput = {
  name: string;
  vibeDescription: string;
  visualStyle: string;
  stats: { power: number; wit: number; charm: number; mystery: number };
};

export type GeneratePersonalityResult = {
  personality: CharacterPersonality;
  promptVersion: string;
};

/**
 * Generates a JSON personality dossier for a kid-created character.
 * Caller is responsible for moderating both the input and the returned
 * personality before storage.
 */
export async function generateCharacterPersonality(
  input: GeneratePersonalityInput
): Promise<GeneratePersonalityResult> {
  const userMessage = `Create a personality dossier for this character.

Name: ${input.name}
Visual style: ${input.visualStyle}
Stat balance (out of 20 total): power=${input.stats.power}, wit=${input.stats.wit}, charm=${input.stats.charm}, mystery=${input.stats.mystery}
Kid's vibe description:
"""
${input.vibeDescription}
"""

Return JSON matching the schema. The catchphrase should be short and quotable; speakingStyle should describe how they talk in one sentence; favoriteThings 3 items; quirks 2 items.`;

  const { object } = await generateObject({
    model: MODEL_PERSONALITY,
    schema: personalitySchema,
    system: PERSONALITY_SYSTEM_PROMPT_V1,
    prompt: userMessage,
  });

  return { personality: object, promptVersion: PERSONALITY_PROMPT_VERSION };
}

export type ChatTurn = { role: "USER" | "CHARACTER"; content: string };

export type CharacterChatInput = {
  character: {
    name: string;
    vibeDescription: string;
    personality: CharacterPersonality;
  };
  history: ChatTurn[];
  userMessage: string;
};

export type CharacterChatResult = {
  reply: string;
  promptVersion: string;
};

/**
 * Single-turn reply from the character. Caller must moderate `userMessage`
 * before calling and `reply` before display.
 */
export async function chatWithCharacter(
  input: CharacterChatInput
): Promise<CharacterChatResult> {
  const system = CHAT_SYSTEM_PROMPT_TEMPLATE_V1({
    name: input.character.name,
    vibeDescription: input.character.vibeDescription,
    catchphrase: input.character.personality.catchphrase,
    speakingStyle: input.character.personality.speakingStyle,
    favoriteThings: input.character.personality.favoriteThings,
    quirks: input.character.personality.quirks,
  });

  const { text } = await generateText({
    model: MODEL_CHAT,
    system,
    messages: [
      ...input.history.map((t) => ({
        role: t.role === "USER" ? ("user" as const) : ("assistant" as const),
        content: t.content,
      })),
      { role: "user" as const, content: input.userMessage },
    ],
  });

  const reply = text.trim();
  if (!reply) throw new Error("Empty reply from character chat.");
  return { reply, promptVersion: CHAT_PROMPT_VERSION };
}
