import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { validateStoryJson } from "../utils/storyUtils";
import sampleStory from "../assets/sampleStory";

const STORAGE_KEY = "storyPlayerState";

export default function StoryPlayer() {
  const hasLoadedRef = useRef(false);

  const loadInitialState = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved) {
        const { story: savedStory, currentNodeId } = JSON.parse(saved);
        const validation = validateStoryJson(savedStory);

        if (validation.valid) {
          hasLoadedRef.current = true;

          return { story: savedStory, currentNodeId };
        }
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
    return { story: sampleStory, currentNodeId: sampleStory.start };
  };

  const initialState = loadInitialState();
  const [story, setStory] = useState(initialState.story);
  const [currentNodeId, setCurrentNodeId] = useState(
    initialState.currentNodeId,
  );

  useEffect(() => {
    if (!hasLoadedRef.current) {
      hasLoadedRef.current = true;

      return;
    }

    const timeout = setTimeout(() => {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ story, currentNodeId }),
      );
    }, 300);

    return () => clearTimeout(timeout);
  }, [story, currentNodeId]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target.result);
        const validation = validateStoryJson(json);

        if (!validation.valid) {
          toast.error(validation.error);

          return;
        }

        setStory(json);
        setCurrentNodeId(json.start);
        hasLoadedRef.current = false;

        toast.success("Story imported successfully.");
      } catch (err) {
        toast.error(
          `Error: invalid story file. Please choose a JSON-file. More info: ${err}`,
        );
      }
    };

    reader.readAsText(file);
  };

  const restart = () =>
    setCurrentNodeId(
      story.start && story.nodes[story.start]
        ? story.start
        : Object.keys(story.nodes)[0],
    );

  const resetProgress = () => {
    localStorage.removeItem(STORAGE_KEY);
    setStory(sampleStory);
    hasLoadedRef.current = false;
    setCurrentNodeId(sampleStory.start);
    toast.success("Progress reset. Sample story reloaded.");
  };

  const currentNode = story.nodes[currentNodeId] || { text: "", options: [] };

  return (
    <section className="flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-xl space-y-4 rounded-2xl bg-gray-800 p-6 shadow-lg">
        {/* Title/author/description */}
        <h1 className="text-center text-2xl font-bold">
          {story.title || "Untitled Story"}
        </h1>
        <p className="text-center text-sm text-gray-400">
          By {story.author || "an aspiring individual"}
        </p>
        <p className="text-center text-sm text-gray-400 italic">
          {story.description}
        </p>

        {/* Text */}
        <div className="mt-6 text-lg leading-relaxed">
          {currentNode.text.split(/\n{2,}/).map((paragraph, pIndex) => (
            <p key={pIndex} className="mb-4">
              {paragraph.split(/\n/).map((line, lIndex) => (
                <span key={lIndex}>
                  {line}
                  {lIndex < paragraph.split(/\n/).length - 1 && <br />}
                </span>
              ))}
            </p>
          ))}
        </div>

        {/* Options */}
        <div className="mt-6 flex flex-col gap-2">
          {currentNode.options.length > 0 ? (
            currentNode.options.map((option, index) => (
              <button
                key={index}
                onClick={() => setCurrentNodeId(option.next)}
                className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 hover:bg-blue-500"
                aria-label="Option"
              >
                {option.text}
              </button>
            ))
          ) : (
            <div className="flex flex-col items-center gap-3">
              <p className="mb-4 font-semibold text-yellow-400">The End</p>
              <button
                onClick={restart}
                className="w-full cursor-pointer rounded-lg bg-green-600 px-4 py-2 hover:bg-green-500"
              >
                Restart Story
              </button>
            </div>
          )}
        </div>

        {/* Upload new story */}
        <div className="mt-6 text-center">
          <label className="mb-2 block text-sm text-gray-400">
            Load another story (JSON file):
          </label>
          <input
            type="file"
            accept="application/json"
            onChange={handleFileUpload}
            className="max-w-[95%] cursor-pointer rounded bg-gray-700 p-2"
          />
        </div>

        <button
          onClick={resetProgress}
          className="w-full cursor-pointer rounded-lg bg-red-600 px-4 py-2 hover:bg-red-500"
        >
          Reset Progress
        </button>
      </div>
    </section>
  );
}
