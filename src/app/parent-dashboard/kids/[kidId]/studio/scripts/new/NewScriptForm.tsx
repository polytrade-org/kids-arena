"use client";

import { useActionState } from "react";
import { createScript, type CreateScriptState } from "./actions";
import {
  NICHE_LABELS,
  NICHE_VALUES,
} from "@/lib/validation/thumbnail";
import {
  SCRIPT_LENGTH_LABELS,
  SCRIPT_LENGTH_VALUES,
  SCRIPT_TONE_LABELS,
  SCRIPT_TONE_VALUES,
  TOPIC_MAX,
} from "@/lib/validation/script";

type Props = {
  kidId: string;
  remainingScripts: number;
};

const initialState: CreateScriptState = {};

export default function NewScriptForm({ kidId, remainingScripts }: Props) {
  const action = createScript.bind(null, kidId);
  const [state, formAction, pending] = useActionState(action, initialState);

  const disabled = pending || remainingScripts <= 0;

  return (
    <form action={formAction} className="space-y-6">
      <fieldset disabled={disabled} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="topic" className="block text-sm font-medium">
            What&apos;s the video about?
          </label>
          <textarea
            id="topic"
            name="topic"
            required
            rows={4}
            maxLength={TOPIC_MAX}
            placeholder="Spotting the rarest hypercars in Dubai Marina on a Friday night — what to look for, where to go."
            className="w-full rounded-md border border-black/15 bg-white px-3 py-2 text-base outline-none focus:border-black/40 dark:border-white/20 dark:bg-black dark:focus:border-white/40"
          />
          <p className="text-xs text-black/60 dark:text-white/60">
            10–{TOPIC_MAX} characters. The more specific, the better the script.
          </p>
          {state.fieldErrors?.topic && (
            <p className="text-xs text-red-600 dark:text-red-400">
              {state.fieldErrors.topic}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="niche" className="block text-sm font-medium">
              Niche
            </label>
            <select
              id="niche"
              name="niche"
              required
              defaultValue=""
              className="w-full rounded-md border border-black/15 bg-white px-3 py-2 text-base outline-none focus:border-black/40 dark:border-white/20 dark:bg-black dark:focus:border-white/40"
            >
              <option value="" disabled>
                Pick one
              </option>
              {NICHE_VALUES.map((v) => (
                <option key={v} value={v}>
                  {NICHE_LABELS[v]}
                </option>
              ))}
            </select>
            {state.fieldErrors?.niche && (
              <p className="text-xs text-red-600 dark:text-red-400">
                {state.fieldErrors.niche}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="tone" className="block text-sm font-medium">
              Tone
            </label>
            <select
              id="tone"
              name="tone"
              required
              defaultValue=""
              className="w-full rounded-md border border-black/15 bg-white px-3 py-2 text-base outline-none focus:border-black/40 dark:border-white/20 dark:bg-black dark:focus:border-white/40"
            >
              <option value="" disabled>
                Pick one
              </option>
              {SCRIPT_TONE_VALUES.map((v) => (
                <option key={v} value={v}>
                  {SCRIPT_TONE_LABELS[v]}
                </option>
              ))}
            </select>
            {state.fieldErrors?.tone && (
              <p className="text-xs text-red-600 dark:text-red-400">
                {state.fieldErrors.tone}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <span className="block text-sm font-medium">Target length</span>
          <div className="grid grid-cols-3 gap-2">
            {SCRIPT_LENGTH_VALUES.map((v) => (
              <label
                key={v}
                className="flex cursor-pointer items-center justify-center rounded-md border border-black/15 px-3 py-2 text-sm hover:bg-black/5 has-checked:border-foreground has-checked:bg-foreground/5 dark:border-white/20 dark:hover:bg-white/10"
              >
                <input
                  type="radio"
                  name="targetLength"
                  value={v}
                  required
                  defaultChecked={v === "SECS_60"}
                  className="sr-only"
                />
                {SCRIPT_LENGTH_LABELS[v]}
              </label>
            ))}
          </div>
          {state.fieldErrors?.targetLength && (
            <p className="text-xs text-red-600 dark:text-red-400">
              {state.fieldErrors.targetLength}
            </p>
          )}
        </div>

        {state.error && (
          <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
            {state.error}
          </p>
        )}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={disabled}
            className="rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition hover:opacity-90 disabled:opacity-50"
          >
            {pending ? "Writing your script…" : "Generate script"}
          </button>
          {pending && (
            <span className="text-xs text-black/60 dark:text-white/60">
              ~5 seconds.
            </span>
          )}
        </div>
      </fieldset>
    </form>
  );
}
