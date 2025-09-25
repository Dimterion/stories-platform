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

  const hasValidStart = json.start && json.nodes[json.start];

  if (!hasValidStart) {
    return { valid: false, error: "Story has no valid starting node." };
  }

  return { valid: true };
}
