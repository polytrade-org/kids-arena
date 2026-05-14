"use server";

import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { createScriptSchema } from "@/lib/validation/script";
import { moderateText } from "@/lib/moderation";
import { generateScript } from "@/lib/ai/scripts";

const WEEKLY_SCRIPT_LIMIT = 10;

export type CreateScriptState = {
  error?: string;
  fieldErrors?: Partial<
    Record<"niche" | "topic" | "tone" | "targetLength", string>
  >;
};

export async function createScript(
  kidId: string,
  _prev: CreateScriptState,
  formData: FormData
): Promise<CreateScriptState> {
  const user = await currentUser();
  if (!user) return { error: "You're not signed in." };
  const email = user.primaryEmailAddress?.emailAddress;
  if (!email) return { error: "Your account has no email address." };

  const kid = await prisma.kid.findFirst({
    where: { id: kidId, parent: { email } },
  });
  if (!kid) return { error: "We couldn't find that kid on your account." };

  const parsed = createScriptSchema.safeParse({
    niche: formData.get("niche"),
    topic: formData.get("topic"),
    tone: formData.get("tone"),
    targetLength: formData.get("targetLength"),
  });
  if (!parsed.success) {
    const fieldErrors: CreateScriptState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (
        key === "niche" ||
        key === "topic" ||
        key === "tone" ||
        key === "targetLength"
      ) {
        fieldErrors[key] = issue.message;
      }
    }
    return { fieldErrors };
  }
  const input = parsed.data;

  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const recent = await prisma.script.count({
    where: { kidId: kid.id, createdAt: { gt: weekAgo } },
  });
  if (recent >= WEEKLY_SCRIPT_LIMIT) {
    return {
      error: `${kid.displayName} has used all ${WEEKLY_SCRIPT_LIMIT} scripts this week. Come back in a few days.`,
    };
  }

  // Moderate the user's topic against Studio (permissive on brand mentions).
  const inputModeration = await moderateText(input.topic, "user_input", "studio");
  if (!inputModeration.safe) {
    return { error: `Let's try a different idea — ${inputModeration.reason}` };
  }

  // Generate the script.
  let result: Awaited<ReturnType<typeof generateScript>>;
  try {
    result = await generateScript({
      niche: input.niche,
      topic: input.topic,
      tone: input.tone,
      targetLength: input.targetLength,
      ageRange: kid.ageRange,
    });
  } catch (err) {
    console.error("Script generation failed:", err);
    return {
      error: "Our writer is taking a break. Try again in a few seconds.",
    };
  }

  // Moderate the full generated text on the Studio surface.
  const generatedText = [
    result.content.hook,
    ...result.content.sections,
    result.content.outro,
  ].join("\n\n");
  const outputModeration = await moderateText(generatedText, "ai_output", "studio");
  if (!outputModeration.safe) {
    return {
      error: "That script came back a bit off — let's try a different angle on the topic.",
    };
  }

  const script = await prisma.script.create({
    data: {
      kidId: kid.id,
      niche: input.niche,
      topic: input.topic,
      tone: input.tone,
      targetLength: input.targetLength,
      contentJson: result.content,
      promptVersion: result.promptVersion,
    },
  });

  redirect(`/parent-dashboard/kids/${kid.id}/studio/scripts/${script.id}`);
}
