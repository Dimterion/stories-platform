import { Plus, Star, Trash2 } from "lucide-react";

export default function NodeEditor({
  selectedNode,
  start,
  nodes,
  orderedNodeIds,
  getNodeLabel,
  onUpdateText,
  onAddOption,
  onUpdateOption,
  onDeleteOption,
  onSetAsStart,
}) {
  if (!selectedNode) return null;
  const node = nodes[selectedNode];

  return (
    <div className="border-3 border-[#0a122a] bg-[#fdf0d5] p-1 text-[#0a122a] sm:p-4">
      <h2 className="mb-2 inline-flex items-center gap-2 font-semibold">
        {selectedNode === start && <Star />}
        Editing {getNodeLabel(selectedNode)}{" "}
        {selectedNode === start && "(start node)"}
      </h2>
      <textarea
        className="w-full border border-[#0a122a] p-2 text-[#0a122a]"
        rows="3"
        name="Story text"
        placeholder={
          selectedNode === start ? "Start your story here..." : "New scene..."
        }
        value={node.text}
        onChange={(e) => onUpdateText(selectedNode, e.target.value)}
      />

      <h3 className="mt-3 mb-2 font-semibold">Options</h3>
      <div className="space-y-2">
        {node.options.map((opt, i) => (
          <div key={i} className="flex flex-wrap items-center gap-2 pb-1">
            <input
              name="Option text"
              className="max-w-[140px] flex-1 border border-[#0a122a] p-0.5 py-1.5 text-xs text-[#0a122a] sm:max-w-full sm:p-1 sm:text-base"
              value={opt.text}
              placeholder="New choice"
              onChange={(e) =>
                onUpdateOption(selectedNode, i, "text", e.target.value)
              }
            />
            <select
              name="Next option"
              className="cursor-pointer border border-[#0a122a] p-0.5 py-1 text-xs text-[#0a122a] sm:p-1 sm:text-base"
              value={opt.next ?? ""}
              onChange={(e) =>
                onUpdateOption(selectedNode, i, "next", e.target.value || null)
              }
            >
              <option className="bg-[#fdf0d5] text-[#0a122a]" value="">
                Select target
              </option>
              {orderedNodeIds.map((id) => (
                <option
                  className="bg-[#fdf0d5] text-[#0a122a]"
                  key={id}
                  value={id}
                >
                  {getNodeLabel(id)}
                </option>
              ))}
            </select>
            <button
              onClick={() => onDeleteOption(selectedNode, i)}
              className="cursor-pointer border-3 border-[#0a122a] bg-[#c1121f] p-0.5 text-[#fdf0d5] hover:bg-[#d90429] sm:p-1"
              title="Delete Option"
              aria-label="Delete option"
            >
              <Trash2 className="size-5 sm:size-6" />
            </button>
          </div>
        ))}
      </div>
      <div className="mt-2 flex flex-wrap items-center justify-between">
        <button
          onClick={() => onAddOption(selectedNode)}
          className="my-2 inline-flex w-full cursor-pointer items-center gap-2 border-3 border-[#0a122a] bg-[#669bbc] px-1 py-1 text-sm text-[#fdf0d5] hover:bg-[#495057] sm:w-fit sm:gap-2 sm:px-2 sm:text-base"
        >
          <Plus />
          Add Option
        </button>
        <button
          onClick={() => onSetAsStart(selectedNode)}
          disabled={selectedNode === start}
          className={`my-2 inline-flex w-full items-center gap-2 border-3 border-[#0a122a] px-1 py-1 text-sm sm:w-fit sm:gap-2 sm:px-2 sm:text-base ${
            selectedNode === start
              ? "bg-[#780000] text-[#fdf0d5]"
              : "cursor-pointer bg-[#c1121f] text-[#fdf0d5] hover:bg-[#d90429]"
          }`}
        >
          <Star /> Set as Start Node
        </button>
      </div>
    </div>
  );
}
