import { Plus, Star, Trash2 } from "lucide-react";

export default function Sidebar({
  start,
  selectedNode,
  orderedNodeIds,
  onSelectNode,
  onAddNode,
  onDeleteNode,
  getNodeLabel,
}) {
  return (
    <section className="w-1/3 space-y-2 bg-gray-800 p-1 sm:w-1/4 sm:p-4">
      <h2 className="mb-6 font-bold sm:text-lg">Scenes</h2>
      {orderedNodeIds.map((id) => (
        <div key={id} className="flex items-center gap-2">
          <button
            onClick={() => onSelectNode(id)}
            className={`inline-flex flex-1 cursor-pointer items-center justify-center px-1 py-1 text-sm sm:gap-2 sm:px-2 sm:text-base ${
              id === selectedNode
                ? "bg-blue-600 hover:bg-blue-500"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
            aria-label="Open node"
          >
            {getNodeLabel(id)}
            {id === start && <Star className="size-3 sm:size-6" />}
          </button>
          <button
            onClick={() => onDeleteNode(id)}
            className="cursor-pointer bg-red-500 px-1 py-2 hover:bg-red-400 sm:p-1"
            title="Delete Node"
            aria-label="Delete node"
          >
            <Trash2 className="size-3 sm:size-6" />
          </button>
        </div>
      ))}
      <button
        onClick={onAddNode}
        className="mt-4 inline-flex w-full cursor-pointer items-center bg-green-600 px-1 py-1 text-sm hover:bg-green-500 sm:gap-2 sm:px-2 sm:text-base"
      >
        <Plus />
        Add Node
      </button>
    </section>
  );
}
