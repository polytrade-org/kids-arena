"use server";

import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { createKidSchema } from "@/lib/validation/kid";

export type CreateKidState = {
  error?: string;
  fieldErrors?: Partial<Record<"displayName" | "ageRange", string>>;
};

export async function createKid(
  _prev: CreateKidState,
  formData: FormData
): Promise<CreateKidState> {
  const user = await currentUser();
  if (!user) return { error: "You're not signed in." };

  const email = user.primaryEmailAddress?.emailAddress;
  if (!email) return { error: "Your account has no email address." };

  const parsed = createKidSchema.safeParse({
    displayName: formData.get("displayName"),
    ageRange: formData.get("ageRange"),
  });

  if (!parsed.success) {
    const fieldErrors: CreateKidState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (key === "displayName" || key === "ageRange") {
        fieldErrors[key] = issue.message;
      }
    }
    return { fieldErrors };
  }

  const parent = await prisma.parent.upsert({
    where: { email },
    update: {},
    create: { email },
  });

  const kid = await prisma.kid.create({
    data: {
      parentId: parent.id,
      displayName: parsed.data.displayName,
      ageRange: parsed.data.ageRange,
    },
  });

  redirect(`/parent-dashboard/kids/${kid.id}`);
}
