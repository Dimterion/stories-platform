export function validateStoryJson(json) {
  if (!json || typeof json !== "object") {
    return { valid: false, error: "File is not valid JSON." };
  }

  if (!json.nodes || typeof json.nodes !== "object") {
    return { valid: false, error: "Invalid story file: missing nodes." };
  }

  const nodeIds = Object.keys(json.nodes);

  if (nodeIds.length === 0) {
    return { valid: false, error: "Story has no nodes." };
  }

  if (nodeIds.length > 5000) {
    return {
      valid: false,
      error: "Story is too large to load (max 5000 nodes).",
    };
  }

  const hasValidStart = json.start && json.nodes[json.start];

  if (!hasValidStart) {
    return { valid: false, error: "Story has no valid starting node." };
  }

  for (const [id, node] of Object.entries(json.nodes)) {
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
  }

  return { valid: true };
}
