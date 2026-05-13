"use server";

import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { createThumbnailSetSchema } from "@/lib/validation/thumbnail";
import { moderateText } from "@/lib/moderation";
import { generateThumbnailSet } from "@/lib/ai/thumbnails";

// V1.5 alpha: 5 thumbnail sets per kid per rolling 7d (free tier).
const WEEKLY_SET_LIMIT = 5;

export type CreateThumbnailSetState = {
  error?: string;
  fieldErrors?: Partial<
    Record<"videoDescription" | "titleText" | "niche" | "stylePreset", string>
  >;
};

export async function createThumbnailSet(
  kidId: string,
  _prev: CreateThumbnailSetState,
  formData: FormData
): Promise<CreateThumbnailSetState> {
  const user = await currentUser();
  if (!user) return { error: "You're not signed in." };
  const email = user.primaryEmailAddress?.emailAddress;
  if (!email) return { error: "Your account has no email address." };

  const kid = await prisma.kid.findFirst({
    where: { id: kidId, parent: { email } },
  });
  if (!kid) return { error: "We couldn't find that kid on your account." };

  const parsed = createThumbnailSetSchema.safeParse({
    videoDescription: formData.get("videoDescription"),
    titleText: formData.get("titleText"),
    niche: formData.get("niche"),
    stylePreset: formData.get("stylePreset"),
  });
  if (!parsed.success) {
    const fieldErrors: CreateThumbnailSetState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (
        key === "videoDescription" ||
        key === "titleText" ||
        key === "niche" ||
        key === "stylePreset"
      ) {
        fieldErrors[key] = issue.message;
      }
    }
    return { fieldErrors };
  }
  const input = parsed.data;

  // Per-kid weekly rate limit.
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const recent = await prisma.thumbnailSet.count({
    where: { kidId: kid.id, createdAt: { gt: weekAgo } },
  });
  if (recent >= WEEKLY_SET_LIMIT) {
    return {
      error: `${kid.displayName} has used all ${WEEKLY_SET_LIMIT} thumbnail sets this week. Come back in a few days.`,
    };
  }

  // Pre-display moderation on user input (description + title). Studio
  // surface — real-world brand names like "Lamborghini" are expected and OK.
  const inputModeration = await moderateText(
    `Title: ${input.titleText}\nVideo: ${input.videoDescription}`,
    "user_input",
    "studio"
  );
  if (!inputModeration.safe) {
    return { error: `Let's try a different idea — ${inputModeration.reason}` };
  }

  // Create the empty set first so we have an ID to namespace R2 uploads with.
  const set = await prisma.thumbnailSet.create({
    data: {
      kidId: kid.id,
      videoDescription: input.videoDescription,
      titleText: input.titleText,
      niche: input.niche,
      stylePreset: input.stylePreset,
      promptVersion: "thumbnail_v1",
    },
  });

  // Generate 8 variants in parallel. Per-variant failures don't abort.
  const result = await generateThumbnailSet({
    setId: set.id,
    videoDescription: input.videoDescription,
    titleText: input.titleText,
    niche: input.niche,
    stylePreset: input.stylePreset,
  });

  // Single bulk insert.
  await prisma.thumbnail.createMany({
    data: result.variants.map((v) => ({
      setId: set.id,
      position: v.position,
      imageUrl: v.imageUrl,
      status: v.status,
    })),
  });

  // Backfill promptVersion if the generator bumped it during the run.
  if (result.promptVersion !== set.promptVersion) {
    await prisma.thumbnailSet.update({
      where: { id: set.id },
      data: { promptVersion: result.promptVersion },
    });
  }

  redirect(`/parent-dashboard/kids/${kid.id}/studio/thumbnails/${set.id}`);
}

export async function selectThumbnail(
  setId: string,
  thumbnailId: string
): Promise<{ error?: string }> {
  const user = await currentUser();
  if (!user) return { error: "You're not signed in." };
  const email = user.primaryEmailAddress?.emailAddress;
  if (!email) return { error: "Your account has no email address." };

  // Verify ownership via parent → kid → set chain.
  const set = await prisma.thumbnailSet.findFirst({
    where: { id: setId, kid: { parent: { email } } },
    include: { thumbnails: { where: { id: thumbnailId } } },
  });
  if (!set || set.thumbnails.length === 0) {
    return { error: "We couldn't find that thumbnail." };
  }

  await prisma.$transaction([
    prisma.thumbnail.updateMany({
      where: { setId, selected: true },
      data: { selected: false },
    }),
    prisma.thumbnail.update({
      where: { id: thumbnailId },
      data: { selected: true },
    }),
  ]);

  return {};
}
