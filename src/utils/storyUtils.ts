export type StoryValidationResult =
  | { valid: true }
  | { valid: false; error: string };

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null;
}

export function getOrderedNodeIds(
  nodes: Record<string, { createdAt?: number }>,
): string[] {
  return Object.entries(nodes)
    .sort((a, b) => (a[1].createdAt || 0) - (b[1].createdAt || 0))
    .map(([id]) => id);
}

export function getNodeLabel(id: string, orderedIds: string[]): string {
  const index = orderedIds.indexOf(id);
  return index >= 0 ? `Node ${index + 1}` : "Unknown Node";
}

export function validateStoryJson(json: unknown): StoryValidationResult {
  if (!isRecord(json)) {
    return { valid: false, error: "File is not valid JSON." };
  }

  if (!("nodes" in json) || !isRecord(json.nodes)) {
    return { valid: false, error: "Invalid story file: missing nodes." };
  }

  const nodes = json.nodes as Record<string, unknown>;
  const nodeIds = Object.keys(nodes);

  if (nodeIds.length === 0) {
    return { valid: false, error: "Story has no nodes." };
  }

  if (nodeIds.length > 5000) {
    return {
      valid: false,
      error: "Story is too large to load (max 5000 nodes).",
    };
  }

  const start = typeof json.start === "string" ? json.start : "";
  const hasValidStart = !!(start && nodes[start]);

  if (!hasValidStart) {
    return { valid: false, error: "Story has no valid starting node." };
  }

  for (const [id, node] of Object.entries(nodes)) {
    if (!isRecord(node)) {
      return { valid: false, error: `Node ${id} is invalid.` };
    }

    if (typeof node.label !== "string" || !node.label.trim()) {
      return { valid: false, error: `Node ${id} is missing a label.` };
    }

    if (typeof node.text !== "string") {
      return { valid: false, error: `Node ${id} is missing text.` };
    }

    if (!Array.isArray(node.options)) {
      return { valid: false, error: `Node ${id} has invalid options.` };
    }

    if (typeof node.createdAt !== "number") {
      return { valid: false, error: `Node ${id} is missing createdAt value.` };
    }

    for (const opt of node.options) {
      if (!isRecord(opt)) {
        return { valid: false, error: `Node ${id} has an invalid option.` };
      }

      if (typeof opt.text !== "string") {
        return { valid: false, error: `Node ${id} option is missing text.` };
      }

      if (typeof opt.next !== "string" || !nodes[opt.next]) {
        return {
          valid: false,
          error: `Node ${id} has an option with invalid "next" reference.`,
        };
      }
    }
  }

  return { valid: true };
}
