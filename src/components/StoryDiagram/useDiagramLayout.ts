import dagre from "dagre";
import type { Edge, Node, Position } from "reactflow";
import {
  NODE_WIDTH,
  NODE_HEIGHT,
  OPTION_WIDTH,
  OPTION_HEIGHT,
} from "../../utils/constants";

type LayoutDirection = "TB" | "LR";

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

/**
 * Calculate node layout positions using dagre.
 * @param {Array} nodes - React Flow nodes.
 * @param {Array} edges - React Flow edges.
 * @param {string} direction - "TB" | "LR".
 * @returns {Array} layoutedNodes - nodes with computed positions.
 */
export function getLayoutElements<TData = unknown>(
  nodes: Array<Node<TData>>,
  edges: Array<Edge>,
  direction: LayoutDirection = "LR",
): Array<Node<TData>> {
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
    const nodeWithPosition = dagreGraph.node(node.id) as {
      x: number;
      y: number;
    };
    const isOption = node.type === "optionNode";

    return {
      ...node,
      targetPosition: (isHorizontal ? "left" : "top") as Position,
      sourcePosition: (isHorizontal ? "right" : "bottom") as Position,
      position: {
        x: nodeWithPosition.x - (isOption ? OPTION_WIDTH : NODE_WIDTH) / 2,
        y: nodeWithPosition.y - (isOption ? OPTION_HEIGHT : NODE_HEIGHT) / 2,
      },
    };
  });
}
