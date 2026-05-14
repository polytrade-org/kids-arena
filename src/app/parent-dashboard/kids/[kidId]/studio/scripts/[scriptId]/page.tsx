import Link from "next/link";
import { notFound } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { NICHE_LABELS } from "@/lib/validation/thumbnail";
import {
  SCRIPT_LENGTH_LABELS,
  SCRIPT_TONE_LABELS,
} from "@/lib/validation/script";
import type { ScriptContent } from "@/lib/ai/scripts";
import ScriptView from "./ScriptView";

export const metadata = {
  title: "Script — Polytrade Studio",
};

export default async function ScriptDetailPage({
  params,
}: {
  params: Promise<{ kidId: string; scriptId: string }>;
}) {
  const { kidId, scriptId } = await params;

  const user = await currentUser();
  if (!user) throw new Error("Unreachable: middleware should have redirected");
  const email = user.primaryEmailAddress?.emailAddress;
  if (!email) throw new Error("Authenticated user has no primary email address");

  const script = await prisma.script.findFirst({
    where: {
      id: scriptId,
      kidId,
      kid: { parent: { email } },
    },
  });
  if (!script) notFound();

  const content = script.contentJson as unknown as ScriptContent;

  return (
    <div className="mx-auto max-w-3xl p-8">
      <nav className="mb-6 text-sm">
        <Link
          href={`/parent-dashboard/kids/${kidId}/studio/scripts`}
          className="text-black/60 hover:underline dark:text-white/60"
        >
          ← Back to scripts
        </Link>
      </nav>

      <header className="mb-6">
        <h1 className="text-2xl font-semibold">{script.topic}</h1>
        <p className="mt-2 text-sm text-black/60 dark:text-white/60">
          {NICHE_LABELS[script.niche]} · {SCRIPT_TONE_LABELS[script.tone]} ·{" "}
          {SCRIPT_LENGTH_LABELS[script.targetLength]}
        </p>
      </header>

      <ScriptView
        hook={content.hook}
        sections={content.sections}
        outro={content.outro}
        estimatedDurationSec={content.estimatedDurationSec}
      />

      <div className="mt-8 flex gap-3 text-sm">
        <Link
          href={`/parent-dashboard/kids/${kidId}/studio/scripts/new`}
          className="rounded-full bg-foreground px-4 py-2 font-medium text-background transition hover:opacity-90"
        >
          Write another
        </Link>
        <Link
          href={`/parent-dashboard/kids/${kidId}/studio`}
          className="rounded-full border border-black/15 px-4 py-2 hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
        >
          Back to Studio
        </Link>
      </div>
    </div>
  );
}
