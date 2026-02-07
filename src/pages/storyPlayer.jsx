import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import {
  ArrowBigLeft,
  CircleQuestionMark,
  FileDown,
  RotateCcw,
  XCircle,
} from "lucide-react";
import { useMetadata } from "../utils/hooks";
import { validateStoryJson } from "../utils/storyUtils";
import Hint from "../components/ui/Hint";
import Modal from "../components/ui/Modal";
import Instructions from "../components/ui/Instructions";
import sampleStory from "../assets/sampleStory";

const STORAGE_KEY = "storyPlayerState";

export default function StoryPlayerPage() {
  const fileInputRef = useRef(null);

  useMetadata({
    title: "Stories Platform | Story Player",
    description:
      "Experience interactive stories with multiple choices and outcomes.",
  });

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
  const [showHints, setShowHints] = useState(false);
  const [story, setStory] = useState(initialState.story);
  const [currentNodeId, setCurrentNodeId] = useState(
    initialState.currentNodeId,
  );
  const [history, setHistory] = useState(initialState.history);
  const [fileName, setFileName] = useState(null);
  const [isReadyToSave, setIsReadyToSave] = useState(false);
  const [showModal, setShowModal] = useState(false);

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
    }, 800);

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
                "!bg-deepBlue !border-softWhite !border-2 !text-softWhite !rounded-none",
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
              "!bg-deepBlue !border-softWhite !border-2 !text-softWhite !rounded-none",
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
                "!bg-deepBlue !border-softWhite !border-2 !text-softWhite !rounded-none",
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
          "!bg-deepBlue !border-softWhite !border-2 !text-softWhite !rounded-none",
      },
    });
  };

  const currentNode = story.nodes[currentNodeId] || { text: "", options: [] };
  const orderedNodeIds = useMemo(() => Object.keys(story.nodes), [story.nodes]);
  const currentSceneIndex = useMemo(
    () => orderedNodeIds.indexOf(currentNodeId),
    [orderedNodeIds, currentNodeId],
  );
  const totalScenes = orderedNodeIds.length;

  const goBack = () => {
    setHistory((prev) => {
      if (prev.length <= 1) return prev;

      const newHistory = prev.slice(0, -1);

      setCurrentNodeId(newHistory[newHistory.length - 1]);

      return newHistory;
    });
  };

  return (
    <section className="storyPlayerPage-contentWrapper flex flex-1 flex-col items-center justify-center p-4 sm:p-6">
      <div className="flex w-full max-w-[1024px] justify-end">
        <button
          onClick={() => setShowHints((prev) => !prev)}
          aria-pressed={showHints}
          className="bg-lightBlue text-softWhite border-darkBlue hover:bg-softWhite hover:text-darkBlue z-50 min-w-26 cursor-pointer border-3 p-1 text-xs uppercase transition-all duration-300 active:scale-95"
        >
          {showHints ? "Hide hints" : "Show hints"}
        </button>
      </div>
      {/* Title/author/description */}
      <div className="bg-softWhite border-darkBlue text-darkBlue flex w-full max-w-[1024px] flex-col items-center gap-1 border-3 p-1">
        <h2 className="text-softWhite border-darkBlue bg-darkBlue w-full border-3 p-1 text-center text-2xl font-bold">
          {story.title || "Untitled Story"}
        </h2>
        <div className="border-darkBlue flex w-full flex-col items-center border-3 px-4 py-1">
          <p className="font-semibold italic">
            By {story.author || "an aspiring individual"}
          </p>
          <p className="max-w-prose">{story.description}</p>
        </div>
      </div>
      {story.showProgress && totalScenes > 0 && currentSceneIndex >= 0 && (
        <div className="border-darkBlue w-full max-w-[1024px] border-3">
          <div className="bg-softWhite mx-auto h-3 w-full">
            <div
              className="bg-lightBlue h-3 transition-all duration-500"
              style={{
                width: `${((currentSceneIndex + 1) / totalScenes) * 100}%`,
              }}
            ></div>
          </div>
        </div>
      )}

      {/* Text */}
      <div className="bg-softWhite border-darkBlue text-darkBlue relative flex min-h-72 w-full max-w-[1024px] flex-col items-center justify-center border-3 p-4">
        {showHints && <Hint text="Main story text is displayed here." />}

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
      <div className="bg-softWhite border-darkBlue text-darkBlue relative w-full max-w-[1024px] space-y-2 border-3 p-2">
        {showHints && <Hint text="Choose one of the options to continue." />}

        {currentNode.options.length > 0 ? (
          currentNode.options.map((option, index) => (
            <button
              key={index}
              onClick={() => {
                setHistory((prev) => [...prev, option.next]);
                setCurrentNodeId(option.next);
              }}
              aria-label="Option"
              className="text-softWhite bg-lightBlue hover:bg-deepBlue border-darkBlue w-full cursor-pointer border-3 p-1 transition-all duration-300"
            >
              {option.text}
            </button>
          ))
        ) : (
          <>
            <h3 className="text-softWhite border-darkBlue bg-darkBlue/70 w-full border-3 p-1 text-center text-xl font-bold">
              The End
            </h3>
            <button
              onClick={restart}
              className="text-softWhite bg-lightBlue hover:bg-deepBlue border-darkBlue inline-flex w-full cursor-pointer justify-center gap-1 border-3 p-1 transition-all duration-300"
            >
              <RotateCcw />
              Restart
            </button>
          </>
        )}
        {story.allowBackNavigation && (
          <button
            onClick={goBack}
            disabled={history.length <= 1}
            className={`text-softWhite border-darkBlue bg-lightGreen inline-flex w-full justify-center gap-1 border-3 p-1 transition-all duration-300 ${history.length <= 1 ? "opacity-70" : "hover:bg-darkGreen cursor-pointer"}`}
          >
            <ArrowBigLeft />
            Back{history.length > 1 ? "" : " (Start)"}
          </button>
        )}
      </div>

      {/* Upload new story */}
      <div className="bg-softWhite border-darkBlue text-darkBlue relative flex w-full max-w-[1024px] flex-col items-center space-y-2 border-3 p-2 text-center">
        <label>File Upload (JSON format):</label>
        {showHints && (
          <Hint text="If you created your story in Story Editor, you can upload it here." />
        )}

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
            className="text-softWhite bg-lightBlue hover:bg-deepBlue border-darkBlue inline-flex w-full cursor-pointer items-center justify-center gap-2 border-3 p-1 transition-all duration-300"
          >
            <FileDown className="size-8 sm:size-6" /> Choose File
          </button>

          {/* File name display */}
          <span>{fileName || "No file chosen"}</span>
        </div>
      </div>

      <section className="relative flex w-full max-w-[1024px] flex-wrap">
        {showHints && <Hint text="Start over." />}
        <button
          onClick={resetProgress}
          className="text-softWhite bg-baseRed hover:bg-lightRed border-darkBlue inline-flex min-h-16 w-full cursor-pointer items-center justify-center gap-2 border-3 p-1 transition-all duration-300 sm:min-h-10"
        >
          <XCircle className="size-8 sm:size-6" />
          Clear Save & Reset Progress
        </button>

        <button
          onClick={() => setShowModal(true)}
          className="text-softWhite bg-baseGreen hover:bg-softGreen border-darkBlue inline-flex min-h-16 w-full cursor-pointer items-center justify-center gap-2 border-3 p-1 transition-all duration-300 sm:min-h-10"
        >
          <CircleQuestionMark className="size-8 sm:size-6" />
          Instructions
        </button>
      </section>
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        ariaLabelledBy="instructions-title"
      >
        <Instructions />
      </Modal>
      {showHints && (
        <div
          onClick={() => setShowHints(false)}
          className="pointer-events-auto fixed inset-0 z-40 bg-black/40"
          aria-hidden="true"
        />
      )}
    </section>
  );
}
