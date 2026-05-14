"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  hook: string;
  sections: string[];
  outro: string;
  estimatedDurationSec: number;
};

export default function ScriptView({
  hook,
  sections,
  outro,
  estimatedDurationSec,
}: Props) {
  const [mode, setMode] = useState<"read" | "teleprompter">("read");
  const [copied, setCopied] = useState(false);

  const plainText = useMemo(
    () => [hook, ...sections, outro].join("\n\n"),
    [hook, sections, outro]
  );

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(plainText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard might be blocked in some contexts; fall back to a textarea select.
      const ta = document.createElement("textarea");
      ta.value = plainText;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center gap-2 text-sm">
        <button
          type="button"
          onClick={() => setMode("read")}
          className={`rounded-full px-3 py-1.5 ${
            mode === "read"
              ? "bg-foreground text-background"
              : "border border-black/15 hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
          }`}
        >
          Read
        </button>
        <button
          type="button"
          onClick={() => setMode("teleprompter")}
          className={`rounded-full px-3 py-1.5 ${
            mode === "teleprompter"
              ? "bg-foreground text-background"
              : "border border-black/15 hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
          }`}
        >
          Teleprompter
        </button>
        <button
          type="button"
          onClick={handleCopy}
          className="ml-auto rounded-full border border-black/15 px-3 py-1.5 hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
        >
          {copied ? "Copied ✓" : "Copy script"}
        </button>
        <span className="text-xs text-black/50 dark:text-white/50">
          ~{estimatedDurationSec}s
        </span>
      </div>

      {mode === "read" ? (
        <ReadMode hook={hook} sections={sections} outro={outro} />
      ) : (
        <TeleprompterMode plainText={plainText} />
      )}
    </>
  );
}

function ReadMode({
  hook,
  sections,
  outro,
}: {
  hook: string;
  sections: string[];
  outro: string;
}) {
  return (
    <div className="space-y-6 rounded-lg border border-black/10 p-6 dark:border-white/20">
      <section>
        <p className="mb-2 text-xs uppercase tracking-wide text-black/50 dark:text-white/50">
          Hook
        </p>
        <p className="text-lg leading-relaxed">{hook}</p>
      </section>

      {sections.map((s, i) => (
        <section key={i}>
          <p className="mb-2 text-xs uppercase tracking-wide text-black/50 dark:text-white/50">
            Section {i + 1}
          </p>
          <p className="leading-relaxed">{s}</p>
        </section>
      ))}

      <section>
        <p className="mb-2 text-xs uppercase tracking-wide text-black/50 dark:text-white/50">
          Outro
        </p>
        <p className="leading-relaxed">{outro}</p>
      </section>
    </div>
  );
}

function TeleprompterMode({ plainText }: { plainText: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [playing, setPlaying] = useState(false);
  // Speed in pixels per second of scroll.
  const [speed, setSpeed] = useState(40);
  // Font size in rem.
  const [fontSize, setFontSize] = useState(2);

  useEffect(() => {
    if (!playing) return;
    const el = containerRef.current;
    if (!el) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      el.scrollTop += speed * dt;
      if (el.scrollTop + el.clientHeight >= el.scrollHeight - 1) {
        setPlaying(false);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, speed]);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          className="rounded-full bg-foreground px-4 py-1.5 font-medium text-background transition hover:opacity-90"
        >
          {playing ? "Pause" : "Play"}
        </button>
        <button
          type="button"
          onClick={() => {
            if (containerRef.current) containerRef.current.scrollTop = 0;
            setPlaying(false);
          }}
          className="rounded-full border border-black/15 px-3 py-1.5 hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
        >
          Reset
        </button>
        <label className="ml-auto flex items-center gap-2 text-xs text-black/60 dark:text-white/60">
          Speed
          <input
            type="range"
            min={10}
            max={120}
            step={5}
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
          />
          <span className="w-10 text-right font-mono">{speed}px/s</span>
        </label>
        <label className="flex items-center gap-2 text-xs text-black/60 dark:text-white/60">
          Size
          <input
            type="range"
            min={1.2}
            max={4}
            step={0.1}
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
          />
        </label>
      </div>

      <div
        ref={containerRef}
        className="h-[60vh] overflow-y-auto rounded-lg border border-black/10 bg-black p-8 text-white dark:border-white/20"
      >
        <p
          className="whitespace-pre-line text-center font-semibold leading-snug"
          style={{ fontSize: `${fontSize}rem` }}
        >
          {plainText}
        </p>
      </div>
    </div>
  );
}
