"use client";

import { useActionState } from "react";
import { createKid, type CreateKidState } from "./actions";
import { AGE_RANGE_LABELS, AGE_RANGE_VALUES } from "@/lib/validation/kid";

const initialState: CreateKidState = {};

export default function NewKidForm() {
  const [state, formAction, pending] = useActionState(createKid, initialState);

  return (
    <form action={formAction} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="displayName" className="block text-sm font-medium">
          Nickname
        </label>
        <input
          id="displayName"
          name="displayName"
          type="text"
          required
          minLength={2}
          maxLength={30}
          autoComplete="off"
          placeholder="e.g. SparkPilot, Rocket42"
          className="w-full rounded-md border border-black/15 bg-white px-3 py-2 text-base outline-none focus:border-black/40 dark:border-white/20 dark:bg-black dark:focus:border-white/40"
        />
        <p className="text-xs text-black/60 dark:text-white/60">
          Use a fun nickname — not your kid&apos;s real name. 2–30 characters.
        </p>
        {state.fieldErrors?.displayName && (
          <p className="text-xs text-red-600 dark:text-red-400">
            {state.fieldErrors.displayName}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="ageRange" className="block text-sm font-medium">
          Age range
        </label>
        <select
          id="ageRange"
          name="ageRange"
          required
          defaultValue=""
          className="w-full rounded-md border border-black/15 bg-white px-3 py-2 text-base outline-none focus:border-black/40 dark:border-white/20 dark:bg-black dark:focus:border-white/40"
        >
          <option value="" disabled>
            Pick one
          </option>
          {AGE_RANGE_VALUES.map((value) => (
            <option key={value} value={value}>
              {AGE_RANGE_LABELS[value]}
            </option>
          ))}
        </select>
        {state.fieldErrors?.ageRange && (
          <p className="text-xs text-red-600 dark:text-red-400">
            {state.fieldErrors.ageRange}
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
          disabled={pending}
          className="rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition hover:opacity-90 disabled:opacity-50"
        >
          {pending ? "Adding…" : "Add kid"}
        </button>
        <a
          href="/parent-dashboard"
          className="text-sm text-black/60 underline-offset-4 hover:underline dark:text-white/60"
        >
          Cancel
        </a>
      </div>
    </form>
  );
}
