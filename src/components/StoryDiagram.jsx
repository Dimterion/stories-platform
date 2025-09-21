import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ReactFlow, { Background, Controls, Handle } from "reactflow";
import "reactflow/dist/style.css";
import dagre from "dagre";
import { X } from "lucide-react";

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
  return (
    <div className="group relative" style={{ width: NODE_WIDTH - 20 }}>
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

      {/* Tooltip */}
      <div
        className="absolute bottom-full left-1/2 mb-2 hidden max-w-xs -translate-x-1/2 group-hover:block sm:max-w-md"
        style={{
          background: "rgba(31,41,55,0.95)",
          color: "white",
          padding: "8px",
          borderRadius: 6,
          zIndex: 50,
          fontSize: 12,
          boxShadow: "0 6px 18px rgba(0,0,0,0.3)",
        }}
      >
        {data.fullText}
      </div>

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
        cursor: "default",
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
  const timeoutRef = useRef(null);
  const [rfInstance, setRfInstance] = useState(null);

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
      };
    });

    const edgeList = [];
    const optionNodes = [];

    Object.keys(story.nodes).forEach((id) => {
      story.nodes[id].options.forEach((opt, idx) => {
        if (opt.next && story.nodes[opt.next]) {
          const optionId = `${id}-opt-${idx}`;

          // Add option node
          optionNodes.push({
            id: optionId,
            type: "optionNode",
            data: { label: opt.text },
            position: { x: 0, y: 0 },
          });

          // Link source → optionNode
          edgeList.push({
            id: `${id}->${optionId}`,
            source: id,
            target: optionId,
            animated: true,
            style: { stroke: "#facc15" },
          });

          // Link optionNode → target
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

    return {
      nodes: getLayoutElements(allNodes, edgeList, "TB"),
      edges: edgeList,
    };
  }, [story, orderedNodeIds]);

  const handleNodeClick = useCallback(
    (_event, node) => {
      if (node.type === "optionNode") return; // Skip clicks on option nodes
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

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div className="bg-opacity-70 fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="relative h-4/5 w-4/5 rounded-lg bg-white p-4">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 z-50 inline-flex cursor-pointer items-center rounded bg-red-600 px-2 py-1 text-sm text-white hover:bg-red-500 sm:text-base"
        >
          <X />
          Close
        </button>

        {/* Legend */}
        <div className="absolute top-2 left-2 text-xs">
          <p className="rounded bg-blue-500 px-2 py-1">Blue = start</p>
          <p className="rounded bg-red-500 px-2 py-1">Red = end</p>
          <p className="rounded bg-yellow-400 px-2 py-1 text-black">
            Yellow = option
          </p>
        </div>

        <ReactFlow
          nodes={nodes}
          edges={edges}
          fitView
          nodeTypes={nodeTypes}
          nodesDraggable={false}
          nodesConnectable={false}
          zoomOnScroll
          panOnDrag
          onInit={(instance) => setRfInstance(instance)}
          onNodeClick={handleNodeClick}
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
}
