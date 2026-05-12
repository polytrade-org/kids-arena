"use client";

import { useActionState, useEffect, useRef } from "react";
import { sendChatMessage, type SendChatState } from "./actions";

type Message = {
  id: string;
  role: "USER" | "CHARACTER";
  content: string;
};

type Props = {
  kidId: string;
  characterId: string;
  characterName: string;
  initialMessages: Message[];
};

const initialState: SendChatState = {};

export default function CharacterChat({
  kidId,
  characterId,
  characterName,
  initialMessages,
}: Props) {
  const action = sendChatMessage.bind(null, kidId, characterId);
  const [state, formAction, pending] = useActionState(action, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Clear the input and scroll to bottom after a successful send.
  useEffect(() => {
    if (!pending && !state.error && !state.fieldError) {
      formRef.current?.reset();
    }
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [pending, state.error, state.fieldError, initialMessages.length]);

  return (
    <div className="flex h-[28rem] flex-col rounded-lg border border-black/10 dark:border-white/20">
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {initialMessages.length === 0 ? (
          <p className="text-center text-sm text-black/50 dark:text-white/50">
            Say hi to {characterName} to start chatting.
          </p>
        ) : (
          initialMessages.map((m) => (
            <MessageBubble key={m.id} role={m.role} content={m.content} />
          ))
        )}
        {pending && (
          <MessageBubble
            role="CHARACTER"
            content={`${characterName} is thinking…`}
            muted
          />
        )}
        <div ref={bottomRef} />
      </div>

      <form
        ref={formRef}
        action={formAction}
        className="border-t border-black/10 p-3 dark:border-white/20"
      >
        <div className="flex gap-2">
          <input
            name="content"
            type="text"
            required
            maxLength={300}
            placeholder={`Message ${characterName}…`}
            disabled={pending}
            className="flex-1 rounded-md border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:border-black/40 disabled:opacity-50 dark:border-white/20 dark:bg-black dark:focus:border-white/40"
          />
          <button
            type="submit"
            disabled={pending}
            className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition hover:opacity-90 disabled:opacity-50"
          >
            Send
          </button>
        </div>
        {state.fieldError && (
          <p className="mt-2 text-xs text-red-600 dark:text-red-400">
            {state.fieldError}
          </p>
        )}
        {state.error && (
          <p className="mt-2 text-xs text-red-600 dark:text-red-400">
            {state.error}
          </p>
        )}
      </form>
    </div>
  );
}

function MessageBubble({
  role,
  content,
  muted,
}: {
  role: "USER" | "CHARACTER";
  content: string;
  muted?: boolean;
}) {
  const isUser = role === "USER";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
          isUser
            ? "bg-foreground text-background"
            : muted
              ? "border border-dashed border-black/20 text-black/50 dark:border-white/20 dark:text-white/50"
              : "border border-black/10 dark:border-white/20"
        }`}
      >
        {content}
      </div>
    </div>
  );
}
