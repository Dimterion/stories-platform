import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import ReactFlow, {
  Background,
  Controls,
  getNodesBounds,
  getViewportForBounds,
  Handle,
} from "reactflow";
import "reactflow/dist/style.css";
import dagre from "dagre";
import * as htmlToImage from "html-to-image";
import { Download, RefreshCcw, Settings, X } from "lucide-react";

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

  const handleMouseEnter = () => {
    if (nodeRef.current) {
      const rect = nodeRef.current.getBoundingClientRect();
      setCoords({
        x: rect.left + rect.width / 2,
        y: rect.top,
      });
    }
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

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
        <p className="truncate">{data.label}</p>
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
        position: "relative",
      }}
    >
      {data.label}

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

  const handleOverlayClick = (e) => {
    if (diagramRef.current && !diagramRef.current.contains(e.target)) {
      onClose();
    }
  };

  const toggleBtnMenu = () => {
    setIsBtnMenuOpen(!isBtnMenuOpen);
  };

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
      if (isStart) bg = "#2563eb";
      if (isEnding) bg = "#dc2626";

      return {
        id,
        type: "custom",
        data: {
          label: `${getNodeLabel(id)}: ${nodeData.text.slice(0, 40)}${
            nodeData.text.length > 40 ? "..." : ""
          }`,
          fullText: nodeData.text,
          bgColor: bg,
        },
        position: { x: 0, y: 0 },
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
            position: { x: 0, y: 0 },
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

    const allNodes = [...nodeList, ...optionNodes];
    const layouted = getLayoutElements(allNodes, edgeList, "TB");

    const nodesWithUserPos = layouted.map((n) => {
      if (userPositions[n.id]) {
        return { ...n, position: userPositions[n.id] };
      }

      return n;
    });

    return { nodes: nodesWithUserPos, edges: edgeList };
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

  const resetLayout = () => {
    setUserPositions({});
  };

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

      const svgDataUrl = await htmlToImage.toSvg(
        diagramRef.current.querySelector(".react-flow__viewport"),
        {
          width,
          height,
          style: {
            width: `${width}px`,
            height: `${height}px`,
            transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
            backgroundColor: "white",
          },
        },
      );

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

        <div className="absolute top-8 right-2 z-50">
          {isBtnMenuOpen && (
            <div className="mt-2 flex flex-col space-y-1">
              {/* Close button */}
              <button
                onClick={onClose}
                className="inline-flex cursor-pointer items-center rounded bg-red-600 px-2 py-1 text-sm text-white hover:bg-red-500"
                aria-label="Close diagram"
              >
                <X className="mr-1 size-5" />
                Close
              </button>

              {/* Reset Layout button */}
              <button
                onClick={resetLayout}
                className="inline-flex cursor-pointer items-center rounded bg-gray-600 px-2 py-1 text-sm text-white hover:bg-gray-500"
                aria-label="Reset diagram"
              >
                <RefreshCcw className="mr-1 size-5" />
                Reset
              </button>

              {/* Download SVG button */}
              <button
                onClick={handleDownloadSvg}
                className="inline-flex cursor-pointer items-center rounded bg-green-600 px-2 py-1 text-sm text-white hover:bg-green-500"
                aria-label="Download SVG"
              >
                <Download className="mr-1 size-5" />
                SVG
              </button>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="absolute top-2 left-2 text-xs">
          <p className="rounded bg-blue-500 px-2 py-1">Blue = start</p>
          <p className="rounded bg-red-500 px-2 py-1">Red = end</p>
          <p className="rounded bg-yellow-400 px-2 py-1 text-black">
            Yellow = option
          </p>
        </div>

        {/* Diagram */}
        <ReactFlow
          nodes={nodes}
          edges={edges}
          fitView
          nodeTypes={nodeTypes}
          nodesDraggable={true}
          nodesConnectable={false}
          zoomOnScroll
          panOnDrag
          onInit={(instance) => setRfInstance(instance)}
          onNodeClick={handleNodeClick}
          onNodeDragStart={onNodeDragStart}
          onNodeDrag={onNodeDrag}
          onNodeDragStop={onNodeDragStop}
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
}
