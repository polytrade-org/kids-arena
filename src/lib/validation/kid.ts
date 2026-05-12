import { z } from "zod";

export const AGE_RANGE_VALUES = ["AGES_8_10", "AGES_11_12", "AGES_13_14"] as const;

export const AGE_RANGE_LABELS: Record<(typeof AGE_RANGE_VALUES)[number], string> = {
  AGES_8_10: "Ages 8–10",
  AGES_11_12: "Ages 11–12",
  AGES_13_14: "Ages 13–14",
};

export const createKidSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(2, "Pick a nickname with at least 2 characters.")
    .max(30, "Keep the nickname under 30 characters.")
    .regex(
      /^[A-Za-z0-9 _.\-]+$/,
      "Use letters, numbers, spaces, dashes, dots or underscores only."
    ),
  ageRange: z.enum(AGE_RANGE_VALUES, {
    message: "Pick an age range.",
  }),
});

export type CreateKidInput = z.infer<typeof createKidSchema>;
