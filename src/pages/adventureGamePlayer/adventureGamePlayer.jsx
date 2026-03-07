import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useMetadata } from "../../utils/hooks";
import "./adventureGamePlayer.css";
import story from "../../assets/sampleAdventureGame.json";

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

  const [currentNodeId, setCurrentNodeId] = useState(story.start);
  const [x, setX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const dragRef = useRef({ dragging: false, startClientX: 0, startX: 0 });

  const xRef = useRef(0);
  const node = story.nodes[currentNodeId];
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
    setCurrentNodeId(story.start);
    setX(0);
    xRef.current = 0;
    setIsDragging(false);
    dragRef.current = { dragging: false, startClientX: 0, startX: 0 };
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
                  (isDragging ? "is-dragging" : "is-settling")
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
            <h2>{story.title}</h2>
            <p>{story.author}</p>
          </div>
        </div>

        <div className="agp-verticalCardFooter" />
      </section>
    </div>
  );
}
