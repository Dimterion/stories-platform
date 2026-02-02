import { PanelLeftClose, Plus, Star, Trash2 } from "lucide-react";
import Hint from "../../components/Layout/Hint";

export default function Sidebar({
  showHints,
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
    <section className="border-darkBlue relative w-1/3 space-y-2 border-r-3 sm:w-1/4">
      {showHints && <Hint text="Add more texts for your story here." />}
      <div className="mb-3 flex items-center justify-between">
        <h2 className="ml-1 text-sm font-bold sm:text-lg">Nodes</h2>
        <button
          onClick={sidebarVisible}
          className="border-darkBlue hover:bg-lightGray bg-darkGray h-fit w-fit cursor-pointer border-b-3 border-l-3 p-1"
          aria-label="Toggle sidebar"
        >
          <PanelLeftClose className="size-3 sm:size-6" />
        </button>
      </div>
      {orderedNodeIds.map((id) => (
        <div key={id} className="flex items-center gap-0.5 px-1">
          <button
            onClick={() => onSelectNode(id)}
            className={`border-darkBlue flex flex-1 cursor-pointer flex-col items-center justify-center border-3 px-1 py-1 text-sm sm:flex-row sm:gap-2 sm:px-2 sm:text-base ${
              id === selectedNode
                ? "hover:bg-lightGray bg-lightBlue"
                : "hover:bg-lightGray bg-darkGray"
            }`}
            aria-label="Open node"
          >
            {getNodeLabel(id)}
            {id === start && <Star className="size-3 sm:size-6" />}
          </button>
          <button
            onClick={() => onDeleteNode(id)}
            className="border-darkBlue bg-baseRed hover:bg-lightRed cursor-pointer border-3 px-1 py-2 sm:p-1"
            title="Delete Node"
            aria-label="Delete node"
          >
            <Trash2 className="size-3 sm:size-6" />
          </button>
        </div>
      ))}
      <div className="p-1">
        <button
          onClick={onAddNode}
          className="border-darkBlue bg-baseGreen hover:bg-softGreen mt-1 inline-flex w-full cursor-pointer items-center border-3 px-1 py-1 text-sm sm:gap-2 sm:px-2 sm:text-base"
        >
          <Plus />
          Add Node
        </button>
      </div>
    </section>
  );
}
