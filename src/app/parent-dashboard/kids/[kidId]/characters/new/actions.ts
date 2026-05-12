"use server";

import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { createCharacterSchema } from "@/lib/validation/character";
import { moderateText } from "@/lib/moderation";
import { generateCharacterPersonality } from "@/lib/ai/claude";
import { generateCharacterVisual } from "@/lib/ai/replicate";

const WEEKLY_CREATION_LIMIT = 3;

export type CreateCharacterState = {
  error?: string;
  fieldErrors?: Partial<
    Record<
      | "name"
      | "vibeDescription"
      | "visualStyle"
      | "power"
      | "wit"
      | "charm"
      | "mystery",
      string
    >
  >;
};

export async function createCharacter(
  kidId: string,
  _prev: CreateCharacterState,
  formData: FormData
): Promise<CreateCharacterState> {
  const user = await currentUser();
  if (!user) return { error: "You're not signed in." };

  const email = user.primaryEmailAddress?.emailAddress;
  if (!email) return { error: "Your account has no email address." };

  // Scope by parent email so a kidId from another parent can't be used.
  const kid = await prisma.kid.findFirst({
    where: { id: kidId, parent: { email } },
  });
  if (!kid) return { error: "We couldn't find that kid on your account." };

  const parsed = createCharacterSchema.safeParse({
    name: formData.get("name"),
    vibeDescription: formData.get("vibeDescription"),
    visualStyle: formData.get("visualStyle"),
    power: formData.get("power"),
    wit: formData.get("wit"),
    charm: formData.get("charm"),
    mystery: formData.get("mystery"),
  });
  if (!parsed.success) {
    const fieldErrors: CreateCharacterState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (
        key === "name" ||
        key === "vibeDescription" ||
        key === "visualStyle" ||
        key === "power" ||
        key === "wit" ||
        key === "charm" ||
        key === "mystery"
      ) {
        fieldErrors[key] = issue.message;
      }
    }
    return { fieldErrors };
  }
  const input = parsed.data;

  // Rate limit: max 3 characters / kid / rolling 7 days.
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const recentCount = await prisma.character.count({
    where: { kidId: kid.id, createdAt: { gt: weekAgo } },
  });
  if (recentCount >= WEEKLY_CREATION_LIMIT) {
    return {
      error: `${kid.displayName} has used all ${WEEKLY_CREATION_LIMIT} character creations this week. Try again in a few days.`,
    };
  }

  // Pre-display moderation on user input (name + vibe).
  const inputModeration = await moderateText(
    `Name: ${input.name}\nVibe: ${input.vibeDescription}`,
    "user_input"
  );
  if (!inputModeration.safe) {
    return {
      error: `Let's try a different idea — ${inputModeration.reason}`,
    };
  }

  // Generate personality.
  let personalityResult: Awaited<ReturnType<typeof generateCharacterPersonality>>;
  try {
    personalityResult = await generateCharacterPersonality({
      name: input.name,
      vibeDescription: input.vibeDescription,
      visualStyle: input.visualStyle,
      stats: {
        power: input.power,
        wit: input.wit,
        charm: input.charm,
        mystery: input.mystery,
      },
    });
  } catch (err) {
    console.error("Personality generation failed:", err);
    return {
      error: "Our character writer is having a moment. Try again in a few seconds.",
    };
  }

  // Post-display moderation on AI output before storage.
  const personalityText = [
    personalityResult.personality.catchphrase,
    personalityResult.personality.speakingStyle,
    ...personalityResult.personality.favoriteThings,
    ...personalityResult.personality.quirks,
  ].join("\n");
  const outputModeration = await moderateText(personalityText, "ai_output");
  if (!outputModeration.safe) {
    return {
      error: "That character ended up a bit off — let's try a different vibe.",
    };
  }

  // Generate visual. Failures don't block character creation — we save with
  // status=FAILED and let the kid retry from the detail page.
  let visualUrl: string | null = null;
  let visualStatus: "READY" | "FAILED" = "FAILED";
  try {
    const visual = await generateCharacterVisual({
      name: input.name,
      vibeDescription: input.vibeDescription,
      visualStyle: input.visualStyle,
    });
    visualUrl = visual.visualUrl;
    visualStatus = "READY";
  } catch (err) {
    console.error("Visual generation failed:", err);
  }

  const character = await prisma.character.create({
    data: {
      kidId: kid.id,
      name: input.name,
      vibeDescription: input.vibeDescription,
      visualStyle: input.visualStyle,
      personalityJson: personalityResult.personality,
      personalityVersion: personalityResult.promptVersion,
      statsJson: {
        power: input.power,
        wit: input.wit,
        charm: input.charm,
        mystery: input.mystery,
      },
      visualUrl,
      visualGenerationStatus: visualStatus,
    },
  });

  redirect(`/parent-dashboard/kids/${kid.id}/characters/${character.id}`);
}
