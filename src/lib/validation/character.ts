import { z } from "zod";

export const VISUAL_STYLE_VALUES = [
  "REALISTIC",
  "CARTOON",
  "ANIME",
  "PIXEL",
] as const;

export const VISUAL_STYLE_LABELS: Record<
  (typeof VISUAL_STYLE_VALUES)[number],
  string
> = {
  REALISTIC: "Realistic",
  CARTOON: "Cartoon",
  ANIME: "Anime",
  PIXEL: "Pixel art",
};

export const STATS_MAX_SUM = 20;
export const STAT_MIN = 1;
export const STAT_MAX = 10;
export const NAME_MIN = 2;
export const NAME_MAX = 50;
export const VIBE_MIN = 10;
export const VIBE_MAX = 500;

const statSchema = z.coerce.number().int().min(STAT_MIN).max(STAT_MAX);

export const createCharacterSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(NAME_MIN, `Name needs at least ${NAME_MIN} characters.`)
      .max(NAME_MAX, `Keep the name under ${NAME_MAX} characters.`)
      .regex(
        /^[A-Za-z0-9 _.\-!?']+$/,
        "Letters, numbers, spaces and basic punctuation only."
      ),
    vibeDescription: z
      .string()
      .trim()
      .min(VIBE_MIN, "Tell us a bit more about the vibe (10+ characters).")
      .max(VIBE_MAX, `Keep it under ${VIBE_MAX} characters.`),
    visualStyle: z.enum(VISUAL_STYLE_VALUES, { message: "Pick a visual style." }),
    power: statSchema,
    wit: statSchema,
    charm: statSchema,
    mystery: statSchema,
  })
  .superRefine((val, ctx) => {
    const sum = val.power + val.wit + val.charm + val.mystery;
    if (sum > STATS_MAX_SUM) {
      ctx.addIssue({
        code: "custom",
        path: ["power"],
        message: `Stats sum to ${sum} — keep the total at ${STATS_MAX_SUM} or under.`,
      });
    }
  });

export type CreateCharacterInput = z.infer<typeof createCharacterSchema>;

export const sendChatMessageSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Type something to send.")
    .max(300, "Keep messages under 300 characters."),
});
