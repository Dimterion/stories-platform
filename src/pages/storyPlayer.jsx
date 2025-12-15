import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ArrowBigLeft, RotateCcw } from "lucide-react";
import { validateStoryJson } from "../utils/storyUtils";
import sampleStory from "../assets/sampleStory";

const STORAGE_KEY = "storyPlayerState";

export default function StoryPlayerPage() {
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
          toast.error(validation.error, {
            style: {
              background: "#003049",
              border: "2px solid #fdf0d5",
              borderRadius: "0",
              color: "#fdf0d5",
            },
            classNames: {
              closeButton:
                "!bg-[#003049] !border-[#fdf0d5] !border-2 !text-[#fdf0d5] !rounded-none",
            },
          });

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

        toast.success("Story imported successfully.", {
          style: {
            background: "#003049",
            border: "2px solid #fdf0d5",
            borderRadius: "0",
            color: "#fdf0d5",
          },
          classNames: {
            closeButton:
              "!bg-[#003049] !border-[#fdf0d5] !border-2 !text-[#fdf0d5] !rounded-none",
          },
        });

        if (fileInputRef.current) fileInputRef.current.value = "";
      } catch (err) {
        toast.error(
          `Error: invalid story file. Please choose a JSON-file. More info: ${err}`,
          {
            style: {
              background: "#003049",
              border: "2px solid #fdf0d5",
              borderRadius: "0",
              color: "#fdf0d5",
            },
            classNames: {
              closeButton:
                "!bg-[#003049] !border-[#fdf0d5] !border-2 !text-[#fdf0d5] !rounded-none",
            },
          },
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
    toast.success("Progress reset. Sample story reloaded.", {
      style: {
        background: "#003049",
        border: "2px solid #fdf0d5",
        borderRadius: "0",
        color: "#fdf0d5",
      },
      classNames: {
        closeButton:
          "!bg-[#003049] !border-[#fdf0d5] !border-2 !text-[#fdf0d5] !rounded-none",
      },
    });
  };

  const currentNode = story.nodes[currentNodeId] || { text: "", options: [] };
  const orderedNodeIds = Object.keys(story.nodes);
  const currentSceneIndex = orderedNodeIds.indexOf(currentNodeId);
  const totalScenes = orderedNodeIds.length;

  return (
    <main className="flex flex-col items-center justify-center p-4 sm:p-6">
      {/* Title/author/description */}
      <div className="flex w-full max-w-[1024px] flex-col items-center gap-1 border-3 border-[#0a122a] bg-[#fdf0d5] p-1 text-[#0a122a]">
        <h2 className="w-full border-3 border-[#0a122a] bg-[#0a122a] p-1 text-center text-2xl font-bold text-[#fdf0d5]">
          {story.title || "Untitled Story"}
        </h2>
        <div className="flex w-full flex-col items-center border-3 border-[#0a122a] px-4 py-1">
          <p className="font-semibold italic">
            By {story.author || "an aspiring individual"}
          </p>
          <p className="max-w-prose">{story.description}</p>
        </div>
      </div>
      {story.showProgress && totalScenes > 0 && currentSceneIndex >= 0 && (
        <div className="w-full max-w-[1024px] border-3 border-[#0a122a]">
          <div className="mx-auto h-3 w-full bg-[#fdf0d5]">
            <div
              className="h-3 bg-[#669bbc] transition-all duration-500"
              style={{
                width: `${((currentSceneIndex + 1) / totalScenes) * 100}%`,
              }}
            ></div>
          </div>
        </div>
      )}

      {/* Text */}
      <div className="flex min-h-72 w-full max-w-[1024px] flex-col items-center justify-center border-3 border-[#0a122a] bg-[#fdf0d5] p-4 text-[#0a122a]">
        <div className="max-w-prose">
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
      </div>

      {/* Options */}
      <div className="w-full max-w-[1024px] space-y-2 border-3 border-[#0a122a] bg-[#fdf0d5] p-2 text-[#0a122a]">
        {currentNode.options.length > 0 ? (
          currentNode.options.map((option, index) => (
            <button
              key={index}
              onClick={() => {
                setHistory((prev) => [...prev, option.next]);
                setCurrentNodeId(option.next);
              }}
              aria-label="Option"
              className="w-full cursor-pointer border-3 border-[#0a122a] bg-[#669bbc] p-1 text-[#fdf0d5] transition duration-200 hover:bg-[#003049]"
            >
              {option.text}
            </button>
          ))
        ) : (
          <>
            <h3 className="w-full border-3 border-[#0a122a] bg-[#0a122a] p-1 text-center text-xl font-bold text-[#fdf0d5]">
              The End
            </h3>
            <button
              onClick={restart}
              className="inline-flex w-full cursor-pointer justify-center gap-1 border-3 border-[#0a122a] bg-[#669bbc] p-1 text-[#fdf0d5] transition duration-200 hover:bg-[#003049]"
            >
              <RotateCcw />
              Restart
            </button>
          </>
        )}
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
            className="inline-flex w-full cursor-pointer justify-center gap-1 border-3 border-[#0a122a] bg-[#2a9d8f] p-1 text-[#fdf0d5] transition duration-200 hover:bg-[#006d77]"
          >
            <ArrowBigLeft />
            Back
          </button>
        )}
      </div>

      {/* Upload new story */}
      <div className="flex w-full max-w-[1024px] flex-col items-center space-y-2 border-3 border-[#0a122a] bg-[#fdf0d5] p-2 text-center text-[#0a122a]">
        <label>File Upload (JSON format):</label>

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
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full cursor-pointer border-3 border-[#0a122a] bg-[#669bbc] p-1 text-[#fdf0d5] transition duration-200 hover:bg-[#003049]"
          >
            Choose File
          </button>

          {/* File name display */}
          <span>{fileName || "No file chosen"}</span>
        </div>
      </div>

      <button
        onClick={resetProgress}
        className="inline-flex w-full max-w-[1024px] cursor-pointer justify-center gap-1 border-3 border-[#0a122a] bg-[#c1121f] p-1 text-[#fdf0d5] transition duration-200 hover:bg-[#d90429]"
      >
        Clear Save & Reset Progress
      </button>
    </main>
  );
}
