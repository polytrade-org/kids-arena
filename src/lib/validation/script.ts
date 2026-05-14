import { z } from "zod";
import { NICHE_VALUES } from "./thumbnail";

export const SCRIPT_LENGTH_VALUES = ["SECS_30", "SECS_60", "MINS_2"] as const;

export const SCRIPT_LENGTH_LABELS: Record<
  (typeof SCRIPT_LENGTH_VALUES)[number],
  string
> = {
  SECS_30: "30 seconds",
  SECS_60: "60 seconds",
  MINS_2: "2 minutes",
};

export const SCRIPT_TONE_VALUES = [
  "EXCITED",
  "EDUCATIONAL",
  "FUNNY",
  "CALM_EXPLAINER",
] as const;

export const SCRIPT_TONE_LABELS: Record<
  (typeof SCRIPT_TONE_VALUES)[number],
  string
> = {
  EXCITED: "Excited",
  EDUCATIONAL: "Educational",
  FUNNY: "Funny",
  CALM_EXPLAINER: "Calm explainer",
};

export const TOPIC_MIN = 10;
export const TOPIC_MAX = 500;

export const createScriptSchema = z.object({
  niche: z.enum(NICHE_VALUES, { message: "Pick a niche." }),
  topic: z
    .string()
    .trim()
    .min(TOPIC_MIN, `Tell us a bit more about the topic (${TOPIC_MIN}+ characters).`)
    .max(TOPIC_MAX, `Keep it under ${TOPIC_MAX} characters.`),
  tone: z.enum(SCRIPT_TONE_VALUES, { message: "Pick a tone." }),
  targetLength: z.enum(SCRIPT_LENGTH_VALUES, { message: "Pick a length." }),
});

export type CreateScriptInput = z.infer<typeof createScriptSchema>;
