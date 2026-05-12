"use client";

import { useActionState, useState } from "react";
import { createCharacter, type CreateCharacterState } from "./actions";
import {
  STAT_MAX,
  STAT_MIN,
  STATS_MAX_SUM,
  VISUAL_STYLE_LABELS,
  VISUAL_STYLE_VALUES,
  NAME_MAX,
  VIBE_MAX,
} from "@/lib/validation/character";

type Props = {
  kidId: string;
  remainingCreations: number;
};

const initialState: CreateCharacterState = {};

export default function NewCharacterForm({ kidId, remainingCreations }: Props) {
  const action = createCharacter.bind(null, kidId);
  const [state, formAction, pending] = useActionState(action, initialState);

  const [power, setPower] = useState(5);
  const [wit, setWit] = useState(5);
  const [charm, setCharm] = useState(5);
  const [mystery, setMystery] = useState(5);
  const statsSum = power + wit + charm + mystery;
  const statsOver = statsSum > STATS_MAX_SUM;

  const disabled = pending || remainingCreations <= 0;

  return (
    <form action={formAction} className="space-y-6">
      <fieldset disabled={disabled} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium">
            Character name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            maxLength={NAME_MAX}
            autoComplete="off"
            placeholder="e.g. CometDancer, GlitchKnight"
            className="w-full rounded-md border border-black/15 bg-white px-3 py-2 text-base outline-none focus:border-black/40 dark:border-white/20 dark:bg-black dark:focus:border-white/40"
          />
          {state.fieldErrors?.name && (
            <p className="text-xs text-red-600 dark:text-red-400">
              {state.fieldErrors.name}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="vibeDescription" className="block text-sm font-medium">
            What&apos;s their vibe?
          </label>
          <textarea
            id="vibeDescription"
            name="vibeDescription"
            required
            maxLength={VIBE_MAX}
            rows={4}
            placeholder="A neon-loving hover-skater who quotes star charts and collects bottle caps."
            className="w-full rounded-md border border-black/15 bg-white px-3 py-2 text-base outline-none focus:border-black/40 dark:border-white/20 dark:bg-black dark:focus:border-white/40"
          />
          <p className="text-xs text-black/60 dark:text-white/60">
            10–{VIBE_MAX} characters. No real names or real-world celebrities.
          </p>
          {state.fieldErrors?.vibeDescription && (
            <p className="text-xs text-red-600 dark:text-red-400">
              {state.fieldErrors.vibeDescription}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="visualStyle" className="block text-sm font-medium">
            Visual style
          </label>
          <select
            id="visualStyle"
            name="visualStyle"
            required
            defaultValue=""
            className="w-full rounded-md border border-black/15 bg-white px-3 py-2 text-base outline-none focus:border-black/40 dark:border-white/20 dark:bg-black dark:focus:border-white/40"
          >
            <option value="" disabled>
              Pick one
            </option>
            {VISUAL_STYLE_VALUES.map((v) => (
              <option key={v} value={v}>
                {VISUAL_STYLE_LABELS[v]}
              </option>
            ))}
          </select>
          {state.fieldErrors?.visualStyle && (
            <p className="text-xs text-red-600 dark:text-red-400">
              {state.fieldErrors.visualStyle}
            </p>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-medium">Stats</span>
            <span
              className={`text-xs ${
                statsOver
                  ? "text-red-600 dark:text-red-400"
                  : "text-black/60 dark:text-white/60"
              }`}
            >
              Total: {statsSum} / {STATS_MAX_SUM}
            </span>
          </div>
          <StatSlider label="Power" name="power" value={power} onChange={setPower} />
          <StatSlider label="Wit" name="wit" value={wit} onChange={setWit} />
          <StatSlider label="Charm" name="charm" value={charm} onChange={setCharm} />
          <StatSlider
            label="Mystery"
            name="mystery"
            value={mystery}
            onChange={setMystery}
          />
          <p className="text-xs text-black/60 dark:text-white/60">
            Each stat is {STAT_MIN}–{STAT_MAX}. Keep the total at {STATS_MAX_SUM} or
            under to force trade-offs.
          </p>
          {state.fieldErrors?.power && (
            <p className="text-xs text-red-600 dark:text-red-400">
              {state.fieldErrors.power}
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
            disabled={disabled || statsOver}
            className="rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition hover:opacity-90 disabled:opacity-50"
          >
            {pending ? "Creating your character…" : "Create character"}
          </button>
          {pending && (
            <span className="text-xs text-black/60 dark:text-white/60">
              This takes ~10 seconds — we&apos;re writing personality and drawing a portrait.
            </span>
          )}
        </div>
      </fieldset>
    </form>
  );
}

function StatSlider({
  label,
  name,
  value,
  onChange,
}: {
  label: string;
  name: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-16 text-sm text-black/70 dark:text-white/70">{label}</span>
      <input
        type="range"
        name={name}
        min={STAT_MIN}
        max={STAT_MAX}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="flex-1"
      />
      <span className="w-6 text-right text-sm font-mono">{value}</span>
    </div>
  );
}
