import { PanelLeftClose, Plus, Star, Trash2 } from "lucide-react";

export default function Sidebar({
  start,
  selectedNode,
  orderedNodeIds,
  onSelectNode,
  onAddNode,
  onDeleteNode,
  getNodeLabel,
  sidebarVisible,
}) {
  return (
    <section className="w-1/3 space-y-2 bg-gray-800 p-1 sm:w-1/4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-bold sm:text-lg">Scenes</h2>
        <button
          onClick={sidebarVisible}
          className="h-fit w-fit cursor-pointer border-3 border-[#0a122a] bg-gray-700 p-1 hover:bg-gray-600"
          aria-label="Toggle sidebar"
        >
          <PanelLeftClose className="size-3 sm:size-6" />
        </button>
      </div>
      {orderedNodeIds.map((id) => (
        <div key={id} className="flex items-center gap-2">
          <button
            onClick={() => onSelectNode(id)}
            className={`flex flex-1 cursor-pointer flex-col items-center justify-center border-3 border-[#0a122a] px-1 py-1 text-sm sm:flex-row sm:gap-2 sm:px-2 sm:text-base ${
              id === selectedNode
                ? "bg-[#669bbc] hover:opacity-90"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
            aria-label="Open node"
          >
            {getNodeLabel(id)}
            {id === start && <Star className="size-3 sm:size-6" />}
          </button>
          <button
            onClick={() => onDeleteNode(id)}
            className="cursor-pointer border-3 border-[#0a122a] bg-[#c1121f] px-1 py-2 hover:opacity-90 sm:p-1"
            title="Delete Node"
            aria-label="Delete node"
          >
            <Trash2 className="size-3 sm:size-6" />
          </button>
        </div>
      ))}
      <button
        onClick={onAddNode}
        className="mt-1 inline-flex w-full cursor-pointer items-center border-3 border-[#0a122a] bg-green-600 px-1 py-1 text-sm hover:bg-green-500 sm:gap-2 sm:px-2 sm:text-base"
      >
        <Plus />
        Add Node
      </button>
    </section>
  );
}
