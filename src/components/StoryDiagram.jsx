import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import ReactFlow, {
  Background,
  Controls,
  getNodesBounds,
  getViewportForBounds,
  Handle,
  MiniMap,
} from "reactflow";
import "reactflow/dist/style.css";
import dagre from "dagre";
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

const dagreGraph = new dagre.graphlib.Graph();

dagreGraph.setDefaultEdgeLabel(() => ({}));

const NODE_WIDTH = 220;
const NODE_HEIGHT = 80;
const OPTION_WIDTH = 160;
const OPTION_HEIGHT = 50;

function getLayoutElements(nodes, edges, direction = "LR") {
  const isHorizontal = direction === "LR";

  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    const width = node.type === "optionNode" ? OPTION_WIDTH : NODE_WIDTH;
    const height = node.type === "optionNode" ? OPTION_HEIGHT : NODE_HEIGHT;

    dagreGraph.setNode(node.id, { width, height });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  return nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);

    node.targetPosition = isHorizontal ? "left" : "top";
    node.sourcePosition = isHorizontal ? "right" : "bottom";
    node.position = {
      x:
        nodeWithPosition.x -
        (node.type === "optionNode" ? OPTION_WIDTH : NODE_WIDTH) / 2,
      y:
        nodeWithPosition.y -
        (node.type === "optionNode" ? OPTION_HEIGHT : NODE_HEIGHT) / 2,
    };
    return node;
  });
}

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
          borderRadius: 8,
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
              borderRadius: 6,
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
        background: "#facc15",
        color: "#111",
        padding: "6px 10px",
        borderRadius: 12,
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

  const orderedNodeIds = useMemo(() => {
    return Object.entries(story.nodes)
      .sort((a, b) => (a[1].createdAt || 0) - (b[1].createdAt || 0))
      .map(([id]) => id);
  }, [story.nodes]);

  const { nodes, edges } = useMemo(() => {
    const getNodeLabel = (id) => {
      const index = orderedNodeIds.indexOf(id);
      return index >= 0 ? `Node ${index + 1}` : "Unknown Node";
    };

    const nodeList = Object.keys(story.nodes).map((id) => {
      const nodeData = story.nodes[id];
      const isStart = story.start === id;
      const isEnding = nodeData.options.length === 0;

      let bg = "#1f2937";

      if (isStart) {
        bg = "#2563eb"; // blue
      } else if (isEnding) {
        bg = "#dc2626"; // red
      } else if (nodeData.options.length > 1) {
        bg = "#7e22ce"; // purple for branching
      } else if (nodeData.text.length > 120) {
        bg = "#0d9488"; // teal for long passages
      }

      return {
        id,
        type: "custom",
        data: {
          label: `${getNodeLabel(id)}: ${nodeData.text.slice(0, 40)}${
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
            style: { stroke: "#facc15" },
          });

          edgeList.push({
            id: `${optionId}->${opt.next}`,
            source: optionId,
            target: opt.next,
            animated: true,
            style: { stroke: "#facc15" },
          });
        }
      });
    });

    const layouted = getLayoutElements(
      [...nodeList, ...optionNodes],
      edgeList,
      "TB",
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

  const handleDownloadSvg = useCallback(async () => {
    if (!rfInstance || !diagramRef.current) return;

    try {
      setIsBtnMenuOpen(false);

      const nodes = rfInstance.getNodes();

      if (!nodes.length) return;

      const bounds = getNodesBounds(nodes);

      const width = Math.round(bounds.width + 100);
      const height = Math.round(bounds.height + 100);

      const viewport = getViewportForBounds(bounds, width, height, 0.1, 2);

      const viewportEl = diagramRef.current.querySelector(
        ".react-flow__viewport",
      );

      if (!viewportEl) {
        console.error("Could not find React Flow viewport element for export");
        return;
      }

      const svgDataUrl = await htmlToImage.toSvg(viewportEl, {
        width,
        height,
        style: {
          width: `${width}px`,
          height: `${height}px`,
          transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
          backgroundColor: "white",
        },
        filter: (node) => !node.classList?.contains("react-flow__controls"),
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
      <div
        className="relative h-4/5 w-4/5 rounded-lg bg-white p-4"
        ref={diagramRef}
      >
        <button
          onClick={toggleBtnMenu}
          className="absolute top-2 right-2 z-50 inline-flex cursor-pointer items-center rounded bg-blue-600 px-2 py-1 text-white hover:bg-blue-500"
          aria-label="Diagram menu"
        >
          {isBtnMenuOpen ? (
            <X className="size-5" />
          ) : (
            <Settings className="size-5" />
          )}
        </button>

        {isBtnMenuOpen && (
          <div className="absolute top-8 right-2 z-50 mt-2 flex flex-col space-y-1">
            <button
              onClick={onClose}
              className="inline-flex cursor-pointer items-center rounded bg-red-600 px-2 py-1 text-sm text-white hover:bg-red-500"
            >
              <X className="mr-1 size-5" />
              Close
            </button>
            <button
              onClick={resetLayout}
              className="inline-flex cursor-pointer items-center rounded bg-gray-600 px-2 py-1 text-sm text-white hover:bg-gray-500"
            >
              <RefreshCcw className="mr-1 size-5" />
              Reset
            </button>
            <button
              onClick={handleDownloadSvg}
              className="inline-flex cursor-pointer items-center rounded bg-green-600 px-2 py-1 text-sm text-white hover:bg-green-500"
            >
              <Download className="mr-1 size-5" />
              SVG
            </button>
            <button
              onClick={toggleMiniMap}
              className="inline-flex cursor-pointer items-center rounded bg-yellow-600 px-2 py-1 text-sm text-white hover:bg-yellow-500"
            >
              <Map className="mr-1 size-5" />
              Map
            </button>
          </div>
        )}

        <aside className="absolute top-2 left-2 space-y-1 text-xs">
          <p className="flex items-center rounded border border-blue-600 bg-blue-500 px-2 py-1 text-white">
            <Play className="mr-1 h-3 w-3" /> Start
          </p>
          <p className="flex items-center rounded border border-red-600 bg-red-500 px-2 py-1 text-white">
            <Square className="mr-1 h-3 w-3" /> End
          </p>
          <p className="flex items-center rounded border border-yellow-600 bg-yellow-400 px-2 py-1 text-gray-900">
            <ChevronDown className="mr-1 h-3 w-3" /> Option
          </p>
          <p className="flex items-center rounded border border-purple-600 bg-purple-500 px-2 py-1 text-white">
            Branching Node
          </p>
          <p className="flex items-center rounded border border-teal-600 bg-teal-500 px-2 py-1 text-white">
            Long Text Node
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
              nodeColor={(node) => node.data.bgColor || "#fff"}
              nodeStrokeWidth={2}
              pannable
              zoomable
              style={{ background: "#333", borderRadius: 8 }}
            />
          )}
        </ReactFlow>
      </div>
    </div>
  );
}
