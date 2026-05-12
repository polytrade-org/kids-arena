"use server";

import { revalidatePath } from "next/cache";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { sendChatMessageSchema } from "@/lib/validation/character";
import { moderateText } from "@/lib/moderation";
import {
  chatWithCharacter,
  type CharacterPersonality,
  type ChatTurn,
} from "@/lib/ai/claude";

const CHAT_HISTORY_TURNS = 12;
const SAFE_FALLBACK_REPLY = "Hmm, let me think of something else to say.";

export type SendChatState = {
  error?: string;
  fieldError?: string;
};

export async function sendChatMessage(
  kidId: string,
  characterId: string,
  _prev: SendChatState,
  formData: FormData
): Promise<SendChatState> {
  const user = await currentUser();
  if (!user) return { error: "You're not signed in." };
  const email = user.primaryEmailAddress?.emailAddress;
  if (!email) return { error: "Your account has no email address." };

  const character = await prisma.character.findFirst({
    where: {
      id: characterId,
      kidId,
      kid: { parent: { email } },
    },
  });
  if (!character) return { error: "We couldn't find that character." };

  const parsed = sendChatMessageSchema.safeParse({
    content: formData.get("content"),
  });
  if (!parsed.success) {
    return { fieldError: parsed.error.issues[0]?.message ?? "Invalid message." };
  }
  const userText = parsed.data.content;

  const inputCheck = await moderateText(userText, "user_input");
  if (!inputCheck.safe) {
    return { fieldError: `Try a different message — ${inputCheck.reason}` };
  }

  // Save user message before AI call so we keep a record even if the model errors.
  await prisma.chatMessage.create({
    data: { characterId: character.id, role: "USER", content: userText },
  });

  // Load recent history (excluding the just-saved user message — we pass it
  // separately as `userMessage` to the model).
  const recent = await prisma.chatMessage.findMany({
    where: { characterId: character.id },
    orderBy: { createdAt: "desc" },
    take: CHAT_HISTORY_TURNS + 1,
  });
  const ordered = recent.reverse();
  const historyForModel: ChatTurn[] = ordered
    .slice(0, -1) // drop the trailing USER message we just inserted
    .map((m) => ({ role: m.role, content: m.content }));

  let replyText: string;
  try {
    const result = await chatWithCharacter({
      character: {
        name: character.name,
        vibeDescription: character.vibeDescription,
        personality: character.personalityJson as unknown as CharacterPersonality,
      },
      history: historyForModel,
      userMessage: userText,
    });
    replyText = result.reply;
  } catch (err) {
    console.error("Chat generation failed:", err);
    return {
      error: "Couldn't reach the character right now. Try again in a moment.",
    };
  }

  const outputCheck = await moderateText(replyText, "ai_output");
  const finalReply = outputCheck.safe ? replyText : SAFE_FALLBACK_REPLY;

  await prisma.chatMessage.create({
    data: {
      characterId: character.id,
      role: "CHARACTER",
      content: finalReply,
    },
  });

  revalidatePath(`/parent-dashboard/kids/${kidId}/characters/${characterId}`);
  return {};
}
