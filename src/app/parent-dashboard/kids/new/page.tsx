import Link from "next/link";
import NewKidForm from "./NewKidForm";

export const metadata = {
  title: "Add a Kid — Polytrade Kids AI Arena",
};

export default function NewKidPage() {
  return (
    <div className="mx-auto max-w-xl p-8">
      <nav className="mb-6 text-sm">
        <Link
          href="/parent-dashboard"
          className="text-black/60 hover:underline dark:text-white/60"
        >
          ← Back to dashboard
        </Link>
      </nav>

      <header className="mb-8">
        <h1 className="text-2xl font-semibold">Add a kid</h1>
        <p className="mt-2 text-sm text-black/60 dark:text-white/60">
          Each kid you add gets their own space to create AI characters. You&apos;ll see
          everything they make from your dashboard.
        </p>
      </header>

      <NewKidForm />
    </div>
  );
}
