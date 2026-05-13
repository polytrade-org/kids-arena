import { z } from "zod";

export const NICHE_VALUES = ["CARS", "GAMING", "ANIME", "SPORTS", "GENERAL"] as const;

export const NICHE_LABELS: Record<(typeof NICHE_VALUES)[number], string> = {
  CARS: "Cars",
  GAMING: "Gaming",
  ANIME: "Anime",
  SPORTS: "Sports",
  GENERAL: "General",
};

export const THUMBNAIL_STYLE_VALUES = [
  "BRIGHT_ENERGETIC",
  "MYSTERIOUS",
  "COMEDIC",
  "PROFESSIONAL",
] as const;

export const THUMBNAIL_STYLE_LABELS: Record<
  (typeof THUMBNAIL_STYLE_VALUES)[number],
  string
> = {
  BRIGHT_ENERGETIC: "Bright & energetic",
  MYSTERIOUS: "Mysterious",
  COMEDIC: "Comedic",
  PROFESSIONAL: "Professional",
};

export const VIDEO_DESC_MIN = 10;
export const VIDEO_DESC_MAX = 300;
export const TITLE_TEXT_MIN = 2;
export const TITLE_TEXT_MAX = 50;

export const createThumbnailSetSchema = z.object({
  videoDescription: z
    .string()
    .trim()
    .min(VIDEO_DESC_MIN, `Describe the video in at least ${VIDEO_DESC_MIN} characters.`)
    .max(VIDEO_DESC_MAX, `Keep the description under ${VIDEO_DESC_MAX} characters.`),
  titleText: z
    .string()
    .trim()
    .min(TITLE_TEXT_MIN, `Title needs at least ${TITLE_TEXT_MIN} characters.`)
    .max(TITLE_TEXT_MAX, `Keep the title under ${TITLE_TEXT_MAX} characters.`),
  niche: z.enum(NICHE_VALUES, { message: "Pick a niche." }),
  stylePreset: z.enum(THUMBNAIL_STYLE_VALUES, { message: "Pick a style." }),
});

export type CreateThumbnailSetInput = z.infer<typeof createThumbnailSetSchema>;
