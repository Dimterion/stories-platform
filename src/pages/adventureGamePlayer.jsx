import { useRef, useState } from "react";
import { useMetadata } from "../utils/hooks";
import story from "../assets/sampleStory.json";

export default function AdventureGamePlayerPage() {
  useMetadata({
    title: "Stories Platform | Adventure Game Player",
  });

  const diamonds = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  const MAX_DRAG = 50;
  const MAX_ROT = 6;
  const COMMIT_THRESHOLD = 15; // px: require a meaningful drag to commit
  const PLACEHOLDER = "Only one option for this part.";

  const [currentNodeId, setCurrentNodeId] = useState(story.start);

  const node = story.nodes[currentNodeId];
  const nodeText = node?.text ?? "";

  const options = (node?.options ?? []).slice(0, 2);
  const leftOption = options[0] ?? null; // swipe left
  const rightOption = options[1] ?? null; // swipe right

  const [x, setX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const dragRef = useRef({ dragging: false, startClientX: 0, startX: 0 });

  const direction = x === 0 ? "none" : x < 0 ? "left" : "right";
  const swipeStrength = Math.min(1, Math.abs(x) / MAX_DRAG);
  const labelOpacity = direction === "none" ? 0 : swipeStrength;

  const foregroundText =
    direction === "left"
      ? (leftOption?.text ?? PLACEHOLDER)
      : direction === "right"
        ? (rightOption?.text ?? PLACEHOLDER)
        : "";

  const rot = (x / MAX_DRAG) * MAX_ROT;

  function commitChoice(dir) {
    const chosen = dir === "left" ? leftOption : rightOption;
    if (!chosen?.next) return; // missing option => do nothing
    setCurrentNodeId(chosen.next);
  }

  function onPointerDown(e) {
    e.currentTarget.setPointerCapture(e.pointerId); // keeps drag stable
    setIsDragging(true);
    dragRef.current = { dragging: true, startClientX: e.clientX, startX: x };
  }

  function onPointerMove(e) {
    if (!dragRef.current.dragging) return;

    const dx = e.clientX - dragRef.current.startClientX;
    const unclamped = dragRef.current.startX + dx;
    const clamped = Math.max(-MAX_DRAG, Math.min(MAX_DRAG, unclamped));
    setX(clamped);
  }

  function endDrag() {
    dragRef.current.dragging = false;
    setIsDragging(false);

    // Decide on release (mouse up / pointer up)
    if (x <= -COMMIT_THRESHOLD) commitChoice("left");
    else if (x >= COMMIT_THRESHOLD) commitChoice("right");
    // else: not far enough => do nothing

    setX(0); // snap back
  }

  return (
    <div className="agp-background">
      <section className="agp-verticalCard">
        <div className="agp-verticalCardHeader" />

        <div className="agp-verticalCardBody">
          <p>{nodeText}</p>

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
            </div>
          </div>

          <div>
            <h2>{node?.label ?? "—"}</h2>
            <p>{story.title}</p>
          </div>
        </div>

        <div className="agp-verticalCardFooter" />
      </section>
    </div>
  );
}
