import { useRef, useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useMetadata } from "../../utils/hooks";
import "./adventureGamePlayer.css";
import sampleStory from "../../assets/sampleAdventureGame.json";

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

  const [currentStory, setCurrentStory] = useState(sampleStory);
  const [currentNodeId, setCurrentNodeId] = useState(sampleStory.start);
  const [x, setX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const dragRef = useRef({ dragging: false, startClientX: 0, startX: 0 });
  const xRef = useRef(0);

  const node = currentStory.nodes[currentNodeId];
  const nodeText = node?.text ?? "";
  const options = (node?.options ?? []).slice(0, 2);

  // Swipe left
  const leftOption = options[0] ?? null;
  // Swipe right
  const rightOption = options[1] ?? null;

  const hasOptions = options.length > 0;

  const direction = !hasOptions
    ? "none"
    : x === 0
      ? "none"
      : x < 0
        ? "left"
        : "right";

  const bgTint =
    direction === "left"
      ? "agp-foreground--left"
      : direction === "right"
        ? "agp-foreground--right"
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

  function commitChoice(dir) {
    const chosen = dir === "left" ? leftOption : rightOption;

    // Missing option => do nothing
    if (!chosen?.next) return;

    setCurrentNodeId(chosen.next);
  }

  function onPointerDown(e) {
    if (!hasOptions) return;

    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    dragRef.current = { dragging: true, startClientX: e.clientX, startX: x };
  }

  function onPointerMove(e) {
    if (!hasOptions) return;
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

  function handleStoryUpload(event) {
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
    <div className="agp-background">
      <section className="agp-verticalCard">
        <div className="agp-verticalCardHeader" />

        <div className="agp-verticalCardBody">
          <p className="agp-nodeNext">{nodeText}</p>

          {hasOptions ? (
            <div className="agp-stage">
              <div className="agp-verticalCardImgBackground">
                {diamonds.map((d) => (
                  <div key={d} className="agp-diamond">
                    <div className="agp-innerDiamond" />
                  </div>
                ))}
              </div>

              <div
                className={
                  "agp-verticalCardImgForeground " +
                  (isDragging ? "is-dragging" : "is-settling") +
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
                  className="agp-foregroundLabel"
                  style={{ opacity: labelOpacity }}
                >
                  {foregroundText}
                </div>
                <div className="agp-arrowIconsContainer">
                  <ArrowLeft className="agp-arrowIcon" />
                  <p>Swipe left or right.</p>
                  <ArrowRight className="agp-arrowIcon" />
                </div>
              </div>
            </div>
          ) : (
            <div className="agp-endGameCard">
              <p>The End</p>
              <button
                type="button"
                className="agp-restartBtn"
                onClick={restartGame}
              >
                Restart
              </button>
            </div>
          )}

          <div className="agp-metaContainer">
            <h2>{currentStory.title}</h2>
            <p>{currentStory.author}</p>
          </div>
        </div>

        <div className="agp-verticalCardFooter">
          <label className="agp-uploadLabel">
            <span>Upload story (JSON format)</span>
            <input
              type="file"
              accept="application/json"
              onChange={handleStoryUpload}
              className="agp-uploadInput"
            />
          </label>
        </div>
      </section>
    </div>
  );
}
