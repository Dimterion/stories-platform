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
    <section>
      <div>
        {/* Title/author/description */}
        <h1 className="text-center font-bold">
          {story.title || "Untitled Story"}
        </h1>
        <p>By {story.author || "an aspiring individual"}</p>
        <p>{story.description}</p>
        {story.showProgress && totalScenes > 0 && currentSceneIndex >= 0 && (
          <div>
            <div
              style={{
                width: `${((currentSceneIndex + 1) / totalScenes) * 100}%`,
              }}
            ></div>
          </div>
        )}

        {/* Text */}
        <div>
          {currentNode.text.split(/\n{2,}/).map((paragraph, pIndex) => (
            <p key={pIndex}>
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
        <div>
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
                aria-label="Option"
              >
                {option.text}
              </button>
            ))
          ) : (
            <div>
              <p>The End</p>
              <button onClick={restart}>Restart Story</button>
            </div>
          )}
        </div>

        {/* Upload new story */}
        <div>
          <label>Load another story (JSON file):</label>

          <div>
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json"
              onChange={handleFileUpload}
              className="hidden"
            />

            {/* Custom upload button */}
            <button onClick={() => fileInputRef.current?.click()}>
              Choose File
            </button>

            {/* File name display */}
            <span>{fileName || "No file chosen"}</span>
          </div>
        </div>

        <button onClick={resetProgress}>Clear Save & Reset Progress</button>
      </div>
    </section>
  );
}
