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
    <div className="border-3 border-[#0a122a] bg-gray-800 p-1 sm:p-4">
      <h2 className="mb-2 inline-flex items-center gap-2 font-semibold">
        {selectedNode === start && <Star />}
        Editing {getNodeLabel(selectedNode)}{" "}
        {selectedNode === start && "(start node)"}
      </h2>
      <textarea
        className="w-full border border-gray-500 p-2 text-white"
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
              className="max-w-[140px] flex-1 border border-gray-500 p-0.5 py-1 text-sm text-white sm:max-w-full sm:p-1 sm:text-base"
              value={opt.text}
              placeholder="New choice"
              onChange={(e) =>
                onUpdateOption(selectedNode, i, "text", e.target.value)
              }
            />
            <select
              name="Next option"
              className="border border-gray-500 p-1 text-sm text-white sm:text-base"
              value={opt.next ?? ""}
              onChange={(e) =>
                onUpdateOption(selectedNode, i, "next", e.target.value || null)
              }
            >
              <option className="bg-gray-800" value="">
                Select target
              </option>
              {orderedNodeIds.map((id) => (
                <option className="bg-gray-800" key={id} value={id}>
                  {getNodeLabel(id)}
                </option>
              ))}
            </select>
            <button
              onClick={() => onDeleteOption(selectedNode, i)}
              className="cursor-pointer border-3 border-[#0a122a] bg-[#c1121f] p-0.5 hover:opacity-90 sm:p-1"
              title="Delete Option"
              aria-label="Delete option"
            >
              <Trash2 />
            </button>
          </div>
        ))}
      </div>
      <div className="mt-2 flex flex-wrap items-center justify-between">
        <button
          onClick={() => onAddOption(selectedNode)}
          className="my-2 inline-flex w-full cursor-pointer items-center gap-2 border-3 border-[#0a122a] bg-[#669bbc] px-1 py-1 text-sm hover:opacity-90 sm:w-fit sm:gap-2 sm:px-2 sm:text-base"
        >
          <Plus />
          Add Option
        </button>
        <button
          onClick={() => onSetAsStart(selectedNode)}
          disabled={selectedNode === start}
          className={`my-2 inline-flex w-full items-center gap-2 border-3 border-[#0a122a] px-1 py-1 text-sm sm:w-fit sm:gap-2 sm:px-2 sm:text-base ${
            selectedNode === start
              ? "bg-yellow-800 text-gray-300"
              : "cursor-pointer bg-yellow-600 hover:bg-yellow-500"
          }`}
        >
          <Star /> Set as Start Node
        </button>
      </div>
    </div>
  );
}
