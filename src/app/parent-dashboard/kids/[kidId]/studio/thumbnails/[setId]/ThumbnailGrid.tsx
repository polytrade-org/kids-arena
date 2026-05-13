"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import { selectThumbnail } from "../new/actions";

type Thumbnail = {
  id: string;
  position: number;
  imageUrl: string | null;
  status: "PENDING" | "READY" | "FAILED";
  selected: boolean;
};

type Props = {
  setId: string;
  thumbnails: Thumbnail[];
};

export default function ThumbnailGrid({ setId, thumbnails }: Props) {
  const [local, setLocal] = useState(thumbnails);
  const [pending, startTransition] = useTransition();
  const [enlargedId, setEnlargedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSelect = (thumbnailId: string) => {
    setError(null);
    startTransition(async () => {
      const result = await selectThumbnail(setId, thumbnailId);
      if (result.error) {
        setError(result.error);
        return;
      }
      setLocal((prev) =>
        prev.map((t) => ({ ...t, selected: t.id === thumbnailId }))
      );
    });
  };

  const enlarged = enlargedId ? local.find((t) => t.id === enlargedId) : null;

  return (
    <>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {local.map((t) => (
          <li
            key={t.id}
            className={`overflow-hidden rounded-lg border transition ${
              t.selected
                ? "border-emerald-500 ring-2 ring-emerald-500/40"
                : "border-black/10 dark:border-white/20"
            }`}
          >
            <button
              type="button"
              onClick={() => t.imageUrl && setEnlargedId(t.id)}
              disabled={!t.imageUrl}
              className="block aspect-video w-full bg-black/5 disabled:cursor-not-allowed dark:bg-white/5"
            >
              {t.imageUrl ? (
                <Image
                  src={t.imageUrl}
                  alt={`Variant ${t.position + 1}`}
                  width={640}
                  height={360}
                  className="h-full w-full object-cover"
                  unoptimized
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center p-2 text-center text-xs text-black/40 dark:text-white/40">
                  {t.status === "FAILED" ? "Variant failed" : "Pending…"}
                </div>
              )}
            </button>

            <div className="flex items-center justify-between gap-2 p-2">
              <span className="text-xs text-black/50 dark:text-white/50">
                #{t.position + 1}
              </span>
              <div className="flex items-center gap-1">
                {t.imageUrl && (
                  <a
                    href={t.imageUrl}
                    download={`thumbnail-${t.position + 1}.webp`}
                    className="rounded border border-black/15 px-2 py-1 text-xs hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
                  >
                    Download
                  </a>
                )}
                {t.imageUrl &&
                  (t.selected ? (
                    <span className="rounded bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                      Picked
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSelect(t.id)}
                      disabled={pending}
                      className="rounded bg-foreground px-2 py-1 text-xs font-medium text-background disabled:opacity-50"
                    >
                      Pick
                    </button>
                  ))}
              </div>
            </div>
          </li>
        ))}
      </ul>

      {error && (
        <p className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      {enlarged && enlarged.imageUrl && (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
        <div
          onClick={() => setEnlargedId(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
        >
          <Image
            src={enlarged.imageUrl}
            alt={`Variant ${enlarged.position + 1} enlarged`}
            width={1280}
            height={720}
            className="max-h-full max-w-full rounded-lg object-contain"
            unoptimized
          />
        </div>
      )}
    </>
  );
}
