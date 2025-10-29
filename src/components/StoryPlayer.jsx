import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { validateStoryJson } from "../utils/storyUtils";
import sampleStory from "../assets/sampleStory";

const STORAGE_KEY = "storyPlayerState";

export default function StoryPlayer() {
  const fileInputRef = useRef(null);

  const loadInitialState = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved) {
        const { story: savedStory, currentNodeId, history } = JSON.parse(saved);
        const validation = validateStoryJson(savedStory);

        if (validation.valid) {
          return {
            story: savedStory,
            currentNodeId,
            history:
              Array.isArray(history) && history.length > 0
                ? history
                : [currentNodeId],
          };
        }
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
    return {
      story: sampleStory,
      currentNodeId: sampleStory.start,
      history: [sampleStory.start],
    };
  };

  const initialState = loadInitialState();
  const [story, setStory] = useState(initialState.story);
  const [currentNodeId, setCurrentNodeId] = useState(
    initialState.currentNodeId,
  );
  const [history, setHistory] = useState(initialState.history);
  const [fileName, setFileName] = useState(null);
  const [isReadyToSave, setIsReadyToSave] = useState(false);

  useEffect(() => {
    if (!isReadyToSave) {
      setIsReadyToSave(true);
      return;
    }

    const timeout = setTimeout(() => {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ story, currentNodeId, history }),
      );
    }, 300);

    return () => clearTimeout(timeout);
  }, [story, currentNodeId, history, isReadyToSave]);

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

        const startNode =
          json.start && json.nodes[json.start]
            ? json.start
            : Object.keys(json.nodes)[0];

        setStory(json);
        setCurrentNodeId(startNode);
        setHistory([startNode]);
        setFileName(file.name);

        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            story: json,
            currentNodeId: startNode,
            history: [startNode],
          }),
        );

        toast.success("Story imported successfully.");

        if (fileInputRef.current) fileInputRef.current.value = "";
      } catch (err) {
        toast.error(
          `Error: invalid story file. Please choose a JSON-file. More info: ${err}`,
        );
      }
    };

    reader.readAsText(file);
  };

  const restart = () => {
    const startNode =
      story.start && story.nodes[story.start]
        ? story.start
        : Object.keys(story.nodes)[0];
    setCurrentNodeId(startNode);
    setHistory([startNode]);
  };

  const resetProgress = () => {
    localStorage.removeItem(STORAGE_KEY);
    const startNode = sampleStory.start;
    setStory(sampleStory);
    setCurrentNodeId(startNode);
    setHistory([startNode]);
    setFileName(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    toast.success("Progress reset. Sample story reloaded.");
  };

  const currentNode = story.nodes[currentNodeId] || { text: "", options: [] };
  const orderedNodeIds = Object.keys(story.nodes);
  const currentSceneIndex = orderedNodeIds.indexOf(currentNodeId);
  const totalScenes = orderedNodeIds.length;

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
        {story.showProgress && totalScenes > 0 && currentSceneIndex >= 0 && (
          <div className="mx-auto mt-1 h-2 w-2/3 rounded-full bg-gray-700">
            <div
              className="h-2 rounded-full bg-blue-500 transition-all duration-500"
              style={{
                width: `${((currentSceneIndex + 1) / totalScenes) * 100}%`,
              }}
            ></div>
          </div>
        )}

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
          {story.allowBackNavigation && history.length > 1 && (
            <button
              onClick={() => {
                setHistory((prev) => {
                  const newHistory = [...prev];
                  newHistory.pop();
                  const previousNode = newHistory[newHistory.length - 1];
                  setCurrentNodeId(previousNode);
                  return newHistory;
                });
              }}
              className="w-full cursor-pointer rounded-lg bg-gray-600 px-4 py-2 hover:bg-gray-500"
            >
              Back
            </button>
          )}
          {currentNode.options.length > 0 ? (
            currentNode.options.map((option, index) => (
              <button
                key={index}
                onClick={() => {
                  setHistory((prev) => [...prev, option.next]);
                  setCurrentNodeId(option.next);
                }}
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

          <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-center">
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json"
              onChange={handleFileUpload}
              className="hidden"
            />

            {/* Custom upload button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex cursor-pointer items-center gap-2 rounded bg-blue-600 px-4 py-2 text-sm hover:bg-blue-500"
            >
              Choose File
            </button>

            {/* File name display */}
            <span className="text-sm text-gray-300">
              {fileName || "No file chosen"}
            </span>
          </div>
        </div>

        <button
          onClick={resetProgress}
          className="w-full cursor-pointer rounded-lg bg-red-600 px-4 py-2 hover:bg-red-500"
        >
          Clear Save & Reset Progress
        </button>
      </div>
    </section>
  );
}
