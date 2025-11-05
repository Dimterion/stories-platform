import dagre from "dagre";
import {
  NODE_WIDTH,
  NODE_HEIGHT,
  OPTION_WIDTH,
  OPTION_HEIGHT,
} from "../../utils/constants";

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

/**
 * Calculate node layout positions using dagre.
 * @param {Array} nodes - React Flow nodes.
 * @param {Array} edges - React Flow edges.
 * @param {string} direction - "TB" | "LR".
 * @returns {Array} layoutedNodes - nodes with computed positions.
 */
export function getLayoutElements(nodes, edges, direction = "LR") {
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
    const isOption = node.type === "optionNode";

    return {
      ...node,
      targetPosition: isHorizontal ? "left" : "top",
      sourcePosition: isHorizontal ? "right" : "bottom",
      position: {
        x: nodeWithPosition.x - (isOption ? OPTION_WIDTH : NODE_WIDTH) / 2,
        y: nodeWithPosition.y - (isOption ? OPTION_HEIGHT : NODE_HEIGHT) / 2,
      },
    };
  });
}
