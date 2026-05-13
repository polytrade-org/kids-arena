"use client";

import { useActionState } from "react";
import { startBattle, type StartBattleState } from "./actions";

type Props = {
  characterId: string;
  characterName: string;
};

const initialState: StartBattleState = {};

export default function StartBattleButton({ characterId, characterName }: Props) {
  const action = startBattle.bind(null, characterId);
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="space-y-2">
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition hover:opacity-90 disabled:opacity-50"
      >
        {pending ? `${characterName} is heading to the arena…` : `Battle with ${characterName}`}
      </button>
      {state.error && (
        <p className="text-xs text-red-600 dark:text-red-400">{state.error}</p>
      )}
    </form>
  );
}
