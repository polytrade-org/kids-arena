"use client";

import { useActionState } from "react";
import { createThumbnailSet, type CreateThumbnailSetState } from "./actions";
import {
  NICHE_LABELS,
  NICHE_VALUES,
  THUMBNAIL_STYLE_LABELS,
  THUMBNAIL_STYLE_VALUES,
  TITLE_TEXT_MAX,
  VIDEO_DESC_MAX,
} from "@/lib/validation/thumbnail";

type Props = {
  kidId: string;
  remainingSets: number;
};

const initialState: CreateThumbnailSetState = {};

export default function NewThumbnailSetForm({ kidId, remainingSets }: Props) {
  const action = createThumbnailSet.bind(null, kidId);
  const [state, formAction, pending] = useActionState(action, initialState);

  const disabled = pending || remainingSets <= 0;

  return (
    <form action={formAction} className="space-y-6">
      <fieldset disabled={disabled} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="videoDescription" className="block text-sm font-medium">
            What&apos;s the video about?
          </label>
          <textarea
            id="videoDescription"
            name="videoDescription"
            required
            rows={3}
            maxLength={VIDEO_DESC_MAX}
            placeholder="A drag race between a Lamborghini Aventador and a Ferrari SF90."
            className="w-full rounded-md border border-black/15 bg-white px-3 py-2 text-base outline-none focus:border-black/40 dark:border-white/20 dark:bg-black dark:focus:border-white/40"
          />
          <p className="text-xs text-black/60 dark:text-white/60">
            10–{VIDEO_DESC_MAX} characters. Describe the action / subject — no real names.
          </p>
          {state.fieldErrors?.videoDescription && (
            <p className="text-xs text-red-600 dark:text-red-400">
              {state.fieldErrors.videoDescription}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="titleText" className="block text-sm font-medium">
            Title text on thumbnail
          </label>
          <input
            id="titleText"
            name="titleText"
            type="text"
            required
            maxLength={TITLE_TEXT_MAX}
            placeholder="LAMBO vs FERRARI"
            className="w-full rounded-md border border-black/15 bg-white px-3 py-2 text-base outline-none focus:border-black/40 dark:border-white/20 dark:bg-black dark:focus:border-white/40"
          />
          <p className="text-xs text-black/60 dark:text-white/60">
            Short, punchy, ALL CAPS reads best. Max {TITLE_TEXT_MAX} chars.
          </p>
          {state.fieldErrors?.titleText && (
            <p className="text-xs text-red-600 dark:text-red-400">
              {state.fieldErrors.titleText}
            </p>
          )}
        </div>

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
          <label htmlFor="stylePreset" className="block text-sm font-medium">
            Style
          </label>
          <select
            id="stylePreset"
            name="stylePreset"
            required
            defaultValue=""
            className="w-full rounded-md border border-black/15 bg-white px-3 py-2 text-base outline-none focus:border-black/40 dark:border-white/20 dark:bg-black dark:focus:border-white/40"
          >
            <option value="" disabled>
              Pick one
            </option>
            {THUMBNAIL_STYLE_VALUES.map((v) => (
              <option key={v} value={v}>
                {THUMBNAIL_STYLE_LABELS[v]}
              </option>
            ))}
          </select>
          {state.fieldErrors?.stylePreset && (
            <p className="text-xs text-red-600 dark:text-red-400">
              {state.fieldErrors.stylePreset}
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
            {pending ? "Drawing 8 thumbnails…" : "Generate 8 thumbnails"}
          </button>
          {pending && (
            <span className="text-xs text-black/60 dark:text-white/60">
              This takes ~30 seconds — we&apos;re running 8 variants in parallel.
            </span>
          )}
        </div>
      </fieldset>
    </form>
  );
}
