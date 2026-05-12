import { currentUser } from "@clerk/nextjs/server";
import { SignOutButton } from "@clerk/nextjs";
import { prisma } from "@/lib/db";

export default async function ParentDashboard() {
  const user = await currentUser();

  // Middleware guarantees we're authenticated here, but TypeScript doesn't know that.
  if (!user) {
    throw new Error("Unreachable: middleware should have redirected");
  }

  const email = user.primaryEmailAddress?.emailAddress;
  if (!email) {
    throw new Error("Authenticated user has no primary email address");
  }

  // Idempotent: creates Parent row on first dashboard load, no-op on subsequent loads.
  // Upsert by email is safe because email is unique and Clerk-verified.
  const parent = await prisma.parent.upsert({
    where: { email },
    update: {},
    create: { email },
  });

  return (
    <div className="mx-auto max-w-3xl p-8">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Parent Dashboard</h1>
        <SignOutButton>
          <button className="rounded-full border border-black/10 px-4 py-2 text-sm hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10">
            Sign out
          </button>
        </SignOutButton>
      </header>

      <section className="space-y-2 rounded-lg border border-black/10 p-6 dark:border-white/20">
        <p className="text-sm text-black/60 dark:text-white/60">Signed in as</p>
        <p className="font-mono text-lg">{email}</p>
        <p className="text-sm text-black/60 dark:text-white/60">
          Parent record id: <span className="font-mono">{parent.id}</span>
        </p>
      </section>

      <section className="mt-8 rounded-lg border border-dashed border-black/20 p-6 text-sm text-black/60 dark:border-white/30 dark:text-white/60">
        Kid management, character oversight, time limits, and earnings will appear here.
      </section>
    </div>
  );
}
