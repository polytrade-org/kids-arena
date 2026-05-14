import { generateObject } from "ai";
import { z } from "zod";
import {
  SCRIPT_AGE_BAND_LABELS,
  SCRIPT_PROMPT_VERSION,
  SCRIPT_SYSTEM_PROMPT_V1,
  SCRIPT_TONE_HINTS,
  SCRIPT_USER_PROMPT_TEMPLATE_V1,
} from "./prompts";

const MODEL_SCRIPT = "anthropic/claude-sonnet-4.6";

// Body-section count per target length — keeps the script tractable for a kid.
const SECTION_COUNT_BY_LENGTH: Record<string, number> = {
  SECS_30: 2,
  SECS_60: 3,
  MINS_2: 5,
};
const SECONDS_BY_LENGTH: Record<string, number> = {
  SECS_30: 30,
  SECS_60: 60,
  MINS_2: 120,
};

const scriptSchema = z.object({
  hook: z.string().min(8).max(280),
  sections: z.array(z.string().min(8).max(400)).min(1).max(8),
  outro: z.string().min(4).max(200),
  estimatedDurationSec: z.number().int().min(10).max(180),
});

export type ScriptContent = z.infer<typeof scriptSchema>;

export type ScriptGenInput = {
  niche: "CARS" | "GAMING" | "ANIME" | "SPORTS" | "GENERAL";
  topic: string;
  tone: "EXCITED" | "EDUCATIONAL" | "FUNNY" | "CALM_EXPLAINER";
  targetLength: "SECS_30" | "SECS_60" | "MINS_2";
  ageRange: "AGES_8_10" | "AGES_11_12" | "AGES_13_14";
};

export type ScriptGenResult = {
  content: ScriptContent;
  promptVersion: string;
};

/**
 * Generates a structured kid-creator video script via Claude through AI Gateway.
 * Caller is responsible for moderating both the topic input and the
 * generated content (full hook + sections + outro concatenated).
 */
export async function generateScript(
  input: ScriptGenInput
): Promise<ScriptGenResult> {
  const targetSeconds = SECONDS_BY_LENGTH[input.targetLength] ?? 60;
  const sectionCount = SECTION_COUNT_BY_LENGTH[input.targetLength] ?? 3;
  const toneHint = SCRIPT_TONE_HINTS[input.tone] ?? "natural";
  const ageBandLabel =
    SCRIPT_AGE_BAND_LABELS[input.ageRange] ?? "natural reading level for kids";

  const userPrompt = SCRIPT_USER_PROMPT_TEMPLATE_V1({
    niche: input.niche,
    topic: input.topic,
    toneLabel: input.tone,
    toneHint,
    ageBandLabel,
    targetLengthLabel:
      input.targetLength === "SECS_30"
        ? "30 seconds"
        : input.targetLength === "SECS_60"
          ? "60 seconds"
          : "2 minutes",
    targetSeconds,
    sectionCount,
  });

  const { object } = await generateObject({
    model: MODEL_SCRIPT,
    schema: scriptSchema,
    system: SCRIPT_SYSTEM_PROMPT_V1,
    prompt: userPrompt,
  });

  return { content: object, promptVersion: SCRIPT_PROMPT_VERSION };
}
