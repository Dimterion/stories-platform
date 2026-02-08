import { useEffect, useState } from "react";
import { toast } from "sonner";
import { validateStoryJson } from "../utils/storyUtils";

export default function StoryGallery({ manifestUrl, onPickStory }) {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | loading | ready | error

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setStatus("loading");
        const res = await fetch(manifestUrl, {
          headers: { Accept: "application/json" },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();

        if (!Array.isArray(json)) throw new Error("Manifest must be an array.");

        const validItems = json
          .map((entry) => {
            const story = entry?.story ?? entry; // allow either {id, story} or story directly
            const validation = validateStoryJson(story);
            return validation.valid
              ? { id: entry?.id ?? story?.title ?? crypto.randomUUID(), story }
              : null;
          })
          .filter(Boolean);

        if (!cancelled) {
          setItems(validItems);
          setStatus("ready");
        }
      } catch (err) {
        if (!cancelled) setStatus("error");
        toast.error(`Could not load sample stories: ${err}`, {
          style: {
            background: "#003049",
            border: "2px solid #fdf0d5",
            borderRadius: "0",
            color: "#fdf0d5",
          },
          classNames: {
            closeButton:
              "!bg-deepBlue !border-softWhite !border-2 !text-softWhite !rounded-none",
          },
        });
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [manifestUrl]);

  return (
    <section className="bg-softWhite border-darkBlue text-darkBlue w-full max-w-[1024px] border-3 p-2">
      <h3 className="text-softWhite border-darkBlue bg-darkBlue w-full border-3 p-1 text-center text-xl font-bold">
        Sample stories
      </h3>

      {status === "loading" && <p className="p-2 text-center">Loading…</p>}

      {status === "error" && (
        <p className="p-2 text-center">Could not load stories.</p>
      )}

      {status === "ready" && items.length === 0 && (
        <p className="p-2 text-center">No valid sample stories found.</p>
      )}

      {status === "ready" && items.length > 0 && (
        <div className="flex gap-2 overflow-x-auto p-2">
          {items.map(({ id, story }) => (
            <button
              key={id}
              onClick={() => onPickStory(story)}
              className="text-softWhite bg-lightBlue hover:bg-deepBlue border-darkBlue flex h-28 w-28 shrink-0 cursor-pointer items-center justify-center border-3 p-2 text-center text-sm uppercase transition-all duration-300 active:scale-95"
              title={story.description || story.title}
            >
              {story.title || "Untitled"}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
