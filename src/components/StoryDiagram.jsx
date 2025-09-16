import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ReactFlow, { Background, Controls, Handle } from "reactflow";
import "reactflow/dist/style.css";
import dagre from "dagre";

const dagreGraph = new dagre.graphlib.Graph();

dagreGraph.setDefaultEdgeLabel(() => ({}));

const NODE_WIDTH = 220;
const NODE_HEIGHT = 80;

function getLayoutElements(nodes, edges, direction = "LR") {
  const isHorizontal = direction === "LR";

  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
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
      x: nodeWithPosition.x - NODE_WIDTH / 2,
      y: nodeWithPosition.y - NODE_HEIGHT / 2,
    };

    return node;
  });
}

/* Custom node with tooltip */
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

const nodeTypes = { custom: CustomNode };

export default function StoryDiagram({ story, onClose, onSelectNode }) {
  const timeoutRef = useRef(null);
  const [rfInstance, setRfInstance] = useState(null);

  // Compute UUID order once
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

    const nodes = Object.keys(story.nodes).map((id) => {
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

    const edges = [];
    Object.keys(story.nodes).forEach((id) => {
      story.nodes[id].options.forEach((opt, idx) => {
        if (opt.next && story.nodes[opt.next]) {
          edges.push({
            id: `${id}-${idx}`,
            source: id,
            target: opt.next,
            label: opt.text,
            animated: true,
            style: { stroke: "#facc15" },
            labelStyle: { fill: "#facc15", fontWeight: "600", fontSize: 12 },
          });
        }
      });
    });

    return {
      nodes: getLayoutElements(nodes, edges, "TB"),
      edges,
    };
  }, [story, orderedNodeIds]);

  const handleNodeClick = useCallback(
    (_event, node) => {
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
          className="absolute top-2 right-2 z-50 cursor-pointer rounded bg-red-600 px-2 py-1 text-sm text-white hover:bg-red-500 sm:text-base"
        >
          ✖ Close
        </button>

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
