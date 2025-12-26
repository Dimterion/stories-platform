import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  getNodesBounds,
  getViewportForBounds,
  Handle,
} from "reactflow";
import "reactflow/dist/style.css";
import * as htmlToImage from "html-to-image";
import {
  ChevronDown,
  Download,
  Map,
  Play,
  RefreshCcw,
  Settings,
  Square,
  X,
} from "lucide-react";
import { getLayoutElements } from "../../components/StoryDiagram/useDiagramLayout";
import { getOrderedNodeIds, getNodeLabel } from "../../utils/storyUtils";
import {
  NODE_WIDTH,
  NODE_HEIGHT,
  OPTION_WIDTH,
  COLOR_NODE_START,
  COLOR_NODE_END,
  COLOR_NODE_BRANCH,
  COLOR_NODE_LONG,
  COLOR_NODE_DEFAULT,
  COLOR_OPTION,
  DEFAULT_LAYOUT_DIRECTION,
} from "../../utils/constants";

/* Main Story Node */
function CustomNode({ data }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const nodeRef = useRef(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  const updateTooltipPosition = useCallback(() => {
    if (nodeRef.current) {
      const rect = nodeRef.current.getBoundingClientRect();
      setCoords({
        x: rect.left + rect.width / 2,
        y: rect.top,
      });
    }
  }, []);

  const handleMouseEnter = () => {
    updateTooltipPosition();
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  // Recalculate position on scroll/resize if tooltip is visible
  useEffect(() => {
    if (!showTooltip) return;

    window.addEventListener("scroll", updateTooltipPosition, true);
    window.addEventListener("resize", updateTooltipPosition);

    return () => {
      window.removeEventListener("scroll", updateTooltipPosition, true);
      window.removeEventListener("resize", updateTooltipPosition);
    };
  }, [showTooltip, updateTooltipPosition]);

  return (
    <div
      ref={nodeRef}
      style={{ width: NODE_WIDTH - 20 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        style={{
          background: data.bgColor,
          padding: 10,
          color: "white",
          border: "2px solid #333",
          cursor: "pointer",
          textAlign: "center",
        }}
      >
        <p className="flex items-center justify-start gap-1 truncate">
          {data.isStart && <Play className="h-3 w-3 shrink-0" />}
          {data.isEnding && <Square className="h-3 w-3 shrink-0" />}
          <span className="truncate">{data.label}</span>
        </p>
      </div>

      {showTooltip &&
        createPortal(
          <div
            style={{
              position: "fixed",
              top: coords.y - 10,
              left: coords.x,
              transform: "translate(-50%, -100%)",
              background: "rgba(31,41,55,0.95)",
              color: "white",
              padding: "8px",
              zIndex: 99999,
              fontSize: 12,
              boxShadow: "0 6px 18px rgba(0,0,0,0.3)",
              pointerEvents: "none",
              maxWidth: "300px",
            }}
          >
            {data.fullText || data.label}
          </div>,
          document.body,
        )}

      <Handle type="target" position="top" style={{ borderRadius: 0 }} />
      <Handle type="source" position="bottom" style={{ borderRadius: 0 }} />
    </div>
  );
}

function OptionNode({ data }) {
  return (
    <div
      style={{
        background: COLOR_OPTION,
        color: "#111",
        padding: "6px 10px",
        border: "2px solid #a16207",
        textAlign: "center",
        fontSize: 12,
        fontWeight: 600,
        minWidth: OPTION_WIDTH - 20,
        cursor: "pointer",
      }}
    >
      <p className="flex items-center justify-start gap-1">
        <ChevronDown className="h-3 w-3" />
        {data.label}
      </p>

      <Handle
        type="target"
        position="top"
        style={{ background: "#a16207", borderRadius: 0 }}
      />
      <Handle
        type="source"
        position="bottom"
        style={{ background: "#a16207", borderRadius: 0 }}
      />
    </div>
  );
}

const nodeTypes = { custom: CustomNode, optionNode: OptionNode };

export default function StoryDiagram({ story, onClose, onSelectNode }) {
  const diagramRef = useRef(null);
  const timeoutRef = useRef(null);
  const dragState = useRef({ isDragging: false, moved: false });

  const [rfInstance, setRfInstance] = useState(null);
  const [userPositions, setUserPositions] = useState({});
  const [isBtnMenuOpen, setIsBtnMenuOpen] = useState(false);
  const [miniMap, setMiniMap] = useState(false);

  const handleOverlayClick = (e) => {
    if (dragState.current.isDragging) return;
    if (diagramRef.current && !diagramRef.current.contains(e.target)) {
      onClose();
    }
  };

  const toggleBtnMenu = () => setIsBtnMenuOpen(!isBtnMenuOpen);

  const toggleMiniMap = () => setMiniMap(!miniMap);

  const orderedNodeIds = getOrderedNodeIds(story.nodes);

  const { nodes, edges } = useMemo(() => {
    const nodeList = Object.keys(story.nodes).map((id) => {
      const nodeData = story.nodes[id];
      const isStart = story.start === id;
      const isEnding = nodeData.options.length === 0;

      let bg = COLOR_NODE_DEFAULT;

      if (isStart) {
        bg = COLOR_NODE_START;
      } else if (isEnding) {
        bg = COLOR_NODE_END;
      } else if (nodeData.options.length > 1) {
        bg = COLOR_NODE_BRANCH;
      } else if (nodeData.text.length > 120) {
        bg = COLOR_NODE_LONG;
      }

      return {
        id,
        type: "custom",
        data: {
          label: `${getNodeLabel(id, orderedNodeIds)}: ${nodeData.text.slice(0, 40)}${
            nodeData.text.length > 40 ? "..." : ""
          }`,
          fullText: nodeData.text,
          bgColor: bg,
          isStart,
          isEnding,
        },
        position: userPositions[id] || { x: 0, y: 0 },
        draggable: true,
      };
    });

    const edgeList = [];
    const optionNodes = [];

    Object.keys(story.nodes).forEach((id) => {
      story.nodes[id].options.forEach((opt, idx) => {
        if (opt.next && story.nodes[opt.next]) {
          const optionId = `${id}-opt-${idx}`;

          optionNodes.push({
            id: optionId,
            type: "optionNode",
            data: { label: opt.text },
            position: userPositions[optionId] || { x: 0, y: 0 },
            draggable: true,
          });

          edgeList.push({
            id: `${id}->${optionId}`,
            source: id,
            target: optionId,
            animated: true,
            style: { stroke: COLOR_OPTION },
          });

          edgeList.push({
            id: `${optionId}->${opt.next}`,
            source: optionId,
            target: opt.next,
            animated: true,
            style: { stroke: COLOR_OPTION },
          });
        }
      });
    });

    const layouted = getLayoutElements(
      [...nodeList, ...optionNodes],
      edgeList,
      DEFAULT_LAYOUT_DIRECTION,
    );

    const finalNodes = layouted.map((n) => ({
      ...n,
      position: userPositions[n.id] ?? n.position,
    }));

    return { nodes: finalNodes, edges: edgeList };
  }, [story, orderedNodeIds, userPositions]);

  const onNodeDragStart = useCallback(() => {
    dragState.current.isDragging = true;
    dragState.current.moved = false;
  }, []);

  const onNodeDrag = useCallback(() => {
    dragState.current.moved = true;
  }, []);

  const onNodeDragStop = useCallback((_event, node) => {
    if (dragState.current.moved) {
      setUserPositions((prev) => ({
        ...prev,
        [node.id]: { x: node.position.x, y: node.position.y },
      }));
    }
    dragState.current.isDragging = false;
    dragState.current.moved = false;
  }, []);

  const handleNodeClick = useCallback(
    (_event, node) => {
      if (dragState.current.moved) return;
      if (node.type === "optionNode") return;
      if (!rfInstance) {
        onSelectNode?.(node.id);
        return;
      }

      const centerX = node.position.x + NODE_WIDTH / 2;
      const centerY = node.position.y + NODE_HEIGHT / 2;
      const duration = 500;

      rfInstance.setCenter(centerX, centerY, { duration });

      timeoutRef.current = setTimeout(() => {
        onSelectNode?.(node.id);
      }, duration + 50);
    },
    [rfInstance, onSelectNode],
  );

  const resetLayout = () => setUserPositions({});

  const captureElement = (el) => {
    if (!el) return null;
    return el;
  };

  const delayNextFrame = () =>
    new Promise((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(resolve));
    });

  const handleDownloadSvg = useCallback(async () => {
    if (!rfInstance || !diagramRef.current) return;

    try {
      setIsBtnMenuOpen(false);
      await delayNextFrame();

      const nodes = rfInstance.getNodes();
      if (!nodes || nodes.length === 0) return;

      const bounds = getNodesBounds(nodes);
      const viewportElCandidate =
        diagramRef.current.querySelector(".react-flow__viewport") ||
        diagramRef.current.querySelector(".react-flow");

      let width = Math.round(bounds.width + 100);
      let height = Math.round(bounds.height + 100);

      if (!width || !height) {
        const rect = (
          viewportElCandidate || diagramRef.current
        ).getBoundingClientRect();
        width = Math.max(800, Math.round(rect.width));
        height = Math.max(400, Math.round(rect.height));
      }

      const viewport = getViewportForBounds(bounds, width, height, 0.1, 2);

      const viewportEl =
        viewportElCandidate ||
        diagramRef.current.querySelector(".react-flow") ||
        diagramRef.current;

      if (!viewportEl) {
        console.error("No viewport element to export.");
        return;
      }

      const svgDataUrl = await htmlToImage.toSvg(captureElement(viewportEl), {
        width,
        height,
        style: {
          width: `${width}px`,
          height: `${height}px`,
          transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
          backgroundColor: "white",
        },
        filter: (node) => {
          try {
            return (
              !node.classList?.contains?.("react-flow__controls") &&
              !node.classList?.contains?.("diagram-export-button")
            );
          } catch (err) {
            console.error(err);
            return true;
          }
        },
      });

      const link = document.createElement("a");
      link.href = svgDataUrl;
      link.download = "story-diagram.svg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("SVG export failed:", err);
    }
  }, [rfInstance]);

  const handleDownloadPng = useCallback(async () => {
    if (!rfInstance || !diagramRef.current) return;

    try {
      setIsBtnMenuOpen(false);
      await delayNextFrame();

      const nodes = rfInstance.getNodes();
      if (!nodes || nodes.length === 0) return;

      const bounds = getNodesBounds(nodes);
      let width = Math.round(bounds.width + 100);
      let height = Math.round(bounds.height + 100);

      const viewportElCandidate =
        diagramRef.current.querySelector(".react-flow__viewport") ||
        diagramRef.current.querySelector(".react-flow");

      if (!width || !height) {
        const rect = (
          viewportElCandidate || diagramRef.current
        ).getBoundingClientRect();
        width = Math.max(800, Math.round(rect.width));
        height = Math.max(400, Math.round(rect.height));
      }

      const viewport = getViewportForBounds(bounds, width, height, 0.1, 2);

      const viewportEl =
        viewportElCandidate ||
        diagramRef.current.querySelector(".react-flow") ||
        diagramRef.current;

      if (!viewportEl) {
        console.error("No viewport element to export.");
        return;
      }

      const pngDataUrl = await htmlToImage.toPng(captureElement(viewportEl), {
        width,
        height,
        backgroundColor: "#ffffff",
        style: {
          width: `${width}px`,
          height: `${height}px`,
          transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
          backgroundColor: "white",
        },
        filter: (node) => {
          try {
            return (
              !node.classList?.contains?.("react-flow__controls") &&
              !node.classList?.contains?.("diagram-export-button")
            );
          } catch (err) {
            console.error(err);
            return true;
          }
        },
      });

      const link = document.createElement("a");
      link.href = pngDataUrl;
      link.download = "story-diagram.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("PNG export failed:", err);
    }
  }, [rfInstance]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div
      className="bg-opacity-70 fixed inset-0 z-50 flex items-center justify-center bg-black"
      onClick={handleOverlayClick}
    >
      <div className="relative h-4/5 w-4/5 bg-white p-4" ref={diagramRef}>
        <button
          onClick={toggleBtnMenu}
          className="absolute top-2 right-2 z-50 inline-flex cursor-pointer items-center border border-blue-600 bg-blue-500 p-1 text-white hover:bg-blue-700"
          aria-label="Diagram menu"
        >
          {isBtnMenuOpen ? (
            <X className="size-4" />
          ) : (
            <Settings className="size-4" />
          )}
        </button>

        {isBtnMenuOpen && (
          <div className="absolute top-7.5 right-2 z-50 mt-2 flex flex-col space-y-1">
            <button
              onClick={onClose}
              className="inline-flex cursor-pointer items-center border border-darkRed bg-baseRed p-1 text-xs text-white hover:bg-lightRed"
            >
              <X className="mr-1 size-4" />
              Close
            </button>
            <button
              onClick={resetLayout}
              className="inline-flex cursor-pointer items-center border border-gray-600 bg-gray-500 p-1 text-xs text-white hover:bg-gray-700"
            >
              <RefreshCcw className="mr-1 size-4" />
              Reset
            </button>
            <button
              onClick={handleDownloadSvg}
              className="inline-flex cursor-pointer items-center border border-gray-600 bg-green-500 p-1 text-xs text-white hover:bg-green-700"
            >
              <Download className="mr-1 size-4" />
              SVG
            </button>
            <button
              onClick={handleDownloadPng}
              className="inline-flex cursor-pointer items-center border border-gray-600 bg-blue-500 p-1 text-xs text-white hover:bg-blue-700"
            >
              <Download className="mr-1 size-4" />
              PNG
            </button>
            <button
              onClick={toggleMiniMap}
              className="inline-flex cursor-pointer items-center border border-yellow-600 bg-yellow-500 p-1 text-xs text-white hover:bg-yellow-700"
            >
              <Map className="mr-1 size-4" />
              Map
            </button>
          </div>
        )}

        <aside className="absolute top-2 left-2 z-50 space-y-1 text-xs">
          <p className="flex items-center justify-center border border-blue-600 bg-blue-500 p-1 text-white">
            <Play className="mr-1 size-4" /> Start
          </p>
          <p className="flex items-center justify-center border border-darkRed bg-baseRed p-1 text-white">
            <Square className="mr-1 size-4" /> End
          </p>
          <p className="flex items-center justify-center border border-yellow-600 bg-yellow-400 p-1 text-gray-900">
            <ChevronDown className="mr-1 size-4" /> Option
          </p>
          <p className="flex items-center justify-center border border-purple-600 bg-purple-500 p-1 text-white">
            {">"} 1 choice
          </p>
          <p className="flex items-center justify-center border border-teal-600 bg-teal-500 p-1 text-white">
            Long Text
          </p>
        </aside>

        <ReactFlow
          nodes={nodes}
          edges={edges}
          fitView={false}
          nodeTypes={nodeTypes}
          nodesDraggable
          nodesConnectable={false}
          zoomOnScroll
          panOnDrag
          onInit={(instance) => {
            setRfInstance(instance);
            instance.fitView({ duration: 0 });
          }}
          onNodeClick={handleNodeClick}
          onNodeDragStart={onNodeDragStart}
          onNodeDrag={onNodeDrag}
          onNodeDragStop={onNodeDragStop}
        >
          <Background />
          <Controls />
          {miniMap && (
            <MiniMap
              nodeColor={(node) => node.data.bgColor || "rgb(250, 204, 21)"}
              nodeStrokeWidth={2}
              pannable
              zoomable
              style={{ background: "#333" }}
            />
          )}
        </ReactFlow>
      </div>
    </div>
  );
}
