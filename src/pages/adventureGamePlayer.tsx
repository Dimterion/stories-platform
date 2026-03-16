import { useRef, useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Story, StoryNode } from "../types/story";
import { useMetadata } from "../utils/hooks";
import Modal from "../components/ui/Modal";
import Instructions from "../components/ui/Instructions";
import Hint from "../components/ui/Hint";
import sampleStoryJson from "../assets/sampleAdventureGame.json";

type SwipeDir = "left" | "right";
type SwipeDirection = "none" | SwipeDir;

type DragRef = { dragging: boolean; startClientX: number; startX: number };

const sampleStory = sampleStoryJson as Story;

export default function AdventureGamePlayerPage() {
  useMetadata({
    title: "Stories Platform | Adventure Game Player",
  });

  const MAX_DRAG = 70;
  const MAX_ROT = 10;
  // Require a meaningful drag to commit
  const COMMIT_THRESHOLD = 35;
  const PLACEHOLDER = "Only one option for this part.";

  const diamonds = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  const [currentStory, setCurrentStory] = useState<Story>(sampleStory);
  const [currentNodeId, setCurrentNodeId] = useState<string>(sampleStory.start);
  const [x, setX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showHints, setShowHints] = useState(false);

  const dragRef = useRef<DragRef>({
    dragging: false,
    startClientX: 0,
    startX: 0,
  });
  const xRef = useRef<number>(0);

  const node: StoryNode | undefined = currentStory.nodes[currentNodeId];
  const nodeText = node?.text ?? "";
  const options = (node?.options ?? []).slice(0, 2);

  // Swipe left
  const leftOption = options[0] ?? null;
  // Swipe right
  const rightOption = options[1] ?? null;

  const hasOptions = options.length > 0;

  const direction: SwipeDirection = !hasOptions
    ? "none"
    : x === 0
      ? "none"
      : x < 0
        ? "left"
        : "right";

  const bgTint =
    direction === "left"
      ? "shadow-[-10px_0_30px_0px] shadow-lightGreen"
      : direction === "right"
        ? "shadow-[10px_0_30px_0px] shadow-lightPurple"
        : "";

  const swipeStrength = hasOptions ? Math.min(1, Math.abs(x) / MAX_DRAG) : 0;
  const labelOpacity = direction === "none" ? 0 : swipeStrength;

  const foregroundText = !hasOptions
    ? ""
    : direction === "left"
      ? (leftOption?.text ?? PLACEHOLDER)
      : direction === "right"
        ? (rightOption?.text ?? PLACEHOLDER)
        : "";

  const rot = (x / MAX_DRAG) * MAX_ROT;

  function commitChoice(dir: SwipeDir): void {
    const chosen = dir === "left" ? leftOption : rightOption;

    // Missing option => do nothing
    if (!chosen?.next) return;

    setCurrentNodeId(chosen.next);
  }

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>): void {
    if (!hasOptions) return;

    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    dragRef.current = { dragging: true, startClientX: e.clientX, startX: x };
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>): void {
    if (!hasOptions) return;

    e.preventDefault();

    if (!dragRef.current.dragging) return;

    const dx = e.clientX - dragRef.current.startClientX;
    const unclamped = dragRef.current.startX + dx;
    const clamped = Math.max(-MAX_DRAG, Math.min(MAX_DRAG, unclamped));

    setX(clamped);
    xRef.current = clamped;
  }

  function endDrag() {
    if (!hasOptions) return;

    dragRef.current.dragging = false;
    setIsDragging(false);

    const finalX = xRef.current;

    if (finalX <= -COMMIT_THRESHOLD) commitChoice("left");
    else if (finalX >= COMMIT_THRESHOLD) commitChoice("right");

    xRef.current = 0;
    setX(0);
  }

  function restartGame() {
    setCurrentNodeId(currentStory.start);
    setX(0);
    xRef.current = 0;
    setIsDragging(false);
    dragRef.current = { dragging: false, startClientX: 0, startX: 0 };
  }

  function handleStoryUpload(event: React.ChangeEvent<HTMLInputElement>): void {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text !== "string") return;

        const parsed = JSON.parse(text);

        // Minimal validation: must have start and nodes
        if (
          !parsed.start ||
          !parsed.nodes ||
          typeof parsed.nodes !== "object"
        ) {
          toast.error("Invalid story file: missing 'start' or 'nodes'.", {
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

        // Ensure the start node exists
        if (!parsed.nodes[parsed.start]) {
          toast.error(
            "Invalid story file: 'start' node not found in 'nodes'.",
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
          return;
        }

        setCurrentStory(parsed);
        setCurrentNodeId(parsed.start);
        setX(0);
        xRef.current = 0;
        setIsDragging(false);
        dragRef.current = { dragging: false, startClientX: 0, startX: 0 };
        setFileName(file.name);
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
      } catch (err) {
        console.error("Could not load story", err);
        toast.error("Could not read story file. Make sure it's valid JSON.", {
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
      } finally {
        // Allow re-uploading the same file
        event.target.value = "";
      }
    };

    reader.readAsText(file);
  }

  return (
    <div className="adventureGamePlayerPage-contentWrapper flex flex-1 flex-col overflow-y-auto">
      <section className="bg-darkBlue m-auto flex w-[500px] max-w-[90vw] flex-1 flex-col items-center justify-between">
        <div className="bg-darkGray flex h-[100px] w-full flex-row flex-wrap items-center justify-around">
          <button
            type="button"
            className="bg-lightBlue text-softWhite hover:bg-darkBlue inline-flex max-w-[200px] min-w-28 cursor-pointer items-center justify-center p-2 text-center text-xs active:scale-95 sm:text-sm"
            onClick={() => setShowModal(true)}
          >
            Instructions
          </button>

          <button
            onClick={() => setShowHints((prev) => !prev)}
            aria-pressed={showHints}
            className="bg-lightBlue text-softWhite hover:bg-darkBlue z-50 inline-flex max-w-[200px] min-w-28 cursor-pointer items-center justify-center p-2 text-center text-xs active:scale-95 sm:text-sm"
          >
            {showHints ? "Hide hints" : "Show hints"}
          </button>
        </div>

        <div className="relative flex h-full flex-col justify-between text-center">
          {showHints && <Hint text="Main story text is displayed here." />}
          <p className="m-2 text-sm sm:text-lg">{nodeText}</p>

          {hasOptions ? (
            <div className="relative m-auto h-[200px] w-[200px] max-w-[90vw] sm:h-[400px] sm:w-[400px] sm:max-w-[80vw]">
              <div className="bg-lightBlue grid h-full w-full grid-cols-3 grid-rows-3 gap-2 p-2">
                {diamonds.map((d) => (
                  <div
                    key={d}
                    className="border-darkBlue m-auto flex h-[36px] w-[36px] rotate-45 flex-col items-center justify-center border-5"
                  >
                    <div className="bg-darkBlue h-[18px] w-[18px]" />
                  </div>
                ))}
              </div>
              {showHints && (
                <Hint text="Options are displayed here when swiping left or right." />
              )}
              <div
                className={
                  "bg-softWhite absolute inset-0 z-20 origin-[50%_80%] cursor-grab touch-none will-change-transform select-none active:cursor-grabbing " +
                  (isDragging
                    ? "transition-none"
                    : "transition-transform duration-[180ms] ease-in-out") +
                  " " +
                  bgTint
                }
                style={{ transform: `translateX(${x}px) rotate(${rot}deg)` }}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={endDrag}
                onPointerCancel={endDrag}
              >
                <div
                  className="pointer-events-none absolute w-full bg-black/90 p-2 text-center text-xs transition-opacity duration-[120ms] ease-linear sm:text-base"
                  style={{ opacity: labelOpacity }}
                >
                  {foregroundText}
                </div>
                <div className="text-darkBlue flex flex-row justify-between text-xs sm:text-base">
                  <ArrowLeft className="text-darkBlue relative top-[8rem] h-[5rem] w-[5rem] sm:top-[10rem]" />
                  <p className="relative top-[9.5rem] sm:top-[11.5rem]">
                    Swipe left or right.
                  </p>
                  <ArrowRight className="text-darkBlue relative top-[8rem] h-[5rem] w-[5rem] sm:top-[10rem]" />
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-softWhite relative m-auto flex h-[250px] w-[250px] max-w-[90vw] flex-col items-center justify-center gap-4 sm:h-[400px] sm:w-[400px] sm:max-w-[80vw]">
              <p className="text-darkBlue text-xl font-bold">The End</p>
              <button
                type="button"
                className="bg-lightBlue text-softWhite hover:bg-darkBlue cursor-pointer border-0 px-4 py-2 active:scale-95"
                onClick={restartGame}
              >
                Restart
              </button>
            </div>
          )}

          <div className="m-2">
            <h2>{currentStory.title}</h2>
            <p>{currentStory.author}</p>
          </div>
        </div>

        <div className="bg-darkGray relative flex h-[100px] w-full flex-col items-center justify-around text-xs sm:text-sm">
          {showHints && <Hint text="Upload your own story here." />}
          <label className="bg-lightBlue text-softWhite hover:bg-darkBlue inline-flex max-w-[200px] cursor-pointer items-center gap-2 px-2 py-1 text-center active:scale-95">
            <span>Upload story (JSON format)</span>
            <input
              type="file"
              accept="application/json"
              onChange={handleStoryUpload}
              className="hidden"
            />
          </label>
          <span>{fileName || "No file chosen"}</span>
        </div>
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
    </div>
  );
}
