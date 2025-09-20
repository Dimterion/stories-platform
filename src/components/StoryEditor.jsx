import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { FileDown, FileUp, Map, Plus, Trash2 } from "lucide-react";
import StoryDiagram from "./StoryDiagram";

export default function StoryEditor() {
  const firstId = uuidv4();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [nodes, setNodes] = useState({
    [firstId]: { text: "", options: [], createdAt: Date.now() },
  });
  const [start, setStart] = useState(firstId);
  const [selectedNode, setSelectedNode] = useState(firstId);
  const [showDiagram, setShowDiagram] = useState(false);

  // Get ordered list of node ids (for display & selects)
  const orderedNodeIds = Object.entries(nodes)
    .sort((a, b) => a[1].createdAt - b[1].createdAt)
    .map(([id]) => id);

  // Find display label for a node
  const getNodeLabel = (id) => {
    const index = orderedNodeIds.indexOf(id);

    return index >= 0 ? `Node ${index + 1}` : "Unknown Node";
  };

  // Handle text changes for current node
  const updateNodeText = (id, newText) => {
    setNodes((prev) => ({
      ...prev,
      [id]: { ...prev[id], text: newText },
    }));
  };

  const addNode = () => {
    const newId = uuidv4();
    setNodes((prev) => ({
      ...prev,
      [newId]: { text: "", options: [], createdAt: Date.now() },
    }));
    setSelectedNode(newId);
  };

  // Add option (choice) to current node
  const addOption = (nodeId) => {
    const newOption = { text: "", next: start };

    setNodes((prev) => ({
      ...prev,
      [nodeId]: {
        ...prev[nodeId],
        options: [...prev[nodeId].options, newOption],
      },
    }));
  };

  const updateOption = (nodeId, index, field, value) => {
    setNodes((prev) => {
      const updatedOptions = [...prev[nodeId].options];

      updatedOptions[index] = { ...updatedOptions[index], [field]: value };

      return {
        ...prev,
        [nodeId]: { ...prev[nodeId], options: updatedOptions },
      };
    });
  };

  // Delete option from a node
  const deleteOption = (nodeId, optionIndex) => {
    setNodes((prev) => {
      const updated = { ...prev };
      updated[nodeId] = {
        ...updated[nodeId],
        options: updated[nodeId].options.filter((_, i) => i !== optionIndex),
      };

      return updated;
    });
  };

  // Delete a whole node
  const deleteNode = (nodeId) => {
    if (nodeId === start) {
      alert("You can’t delete the start node!");

      return;
    }

    setNodes((prev) => {
      const updated = { ...prev };

      delete updated[nodeId];

      // Remove references in other nodes options
      Object.keys(updated).forEach((id) => {
        updated[id] = {
          ...updated[id],
          options: updated[id].options.filter((opt) => opt.next !== nodeId),
        };
      });

      // If the deleted node was selected, pick another
      if (selectedNode === nodeId) {
        const remaining = Object.keys(updated);

        setSelectedNode(remaining.length > 0 ? remaining[0] : null);
      }

      return updated;
    });
  };

  const exportStory = () => {
    const orderedNodeIds = Object.entries(nodes)
      .sort((a, b) => a[1].createdAt - b[1].createdAt)
      .map(([id]) => id);

    const enrichedNodes = {};
    orderedNodeIds.forEach((id, index) => {
      const node = nodes[id];
      const label = `Node ${index + 1}`;

      enrichedNodes[id] = {
        label,
        text: node.text,
        options: node.options.map((opt) => ({
          ...opt,
          nextLabel: nodes[opt.next]
            ? `Node ${orderedNodeIds.indexOf(opt.next) + 1}`
            : "Unknown Node",
        })),
        createdAt: node.createdAt,
      };
    });

    const story = {
      title,
      author,
      description,
      start,
      nodes: enrichedNodes,
    };

    const blob = new Blob([JSON.stringify(story, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.download = `${title.replace(/\s+/g, "_")}.json`;
    link.href = url;
    link.click();
  };

  const importStory = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);

        if (!data || !data.nodes || typeof data.nodes !== "object") {
          alert("Invalid story file!");
          return;
        }

        // Recompute labels on import (ignores saved ones to stay consistent)
        const orderedIds = Object.entries(data.nodes)
          .sort((a, b) => (a[1].createdAt || 0) - (b[1].createdAt || 0))
          .map(([id]) => id);

        const rebuiltNodes = {};

        orderedIds.forEach((id, index) => {
          const node = data.nodes[id];

          rebuiltNodes[id] = {
            ...node,
            label: `Node ${index + 1}`,
            options: (node.options || []).map((opt) => ({
              ...opt,
              nextLabel: data.nodes[opt.next]
                ? `Node ${orderedIds.indexOf(opt.next) + 1}`
                : "Unknown Node",
            })),
          };
        });

        const validStart =
          data.start && rebuiltNodes[data.start]
            ? data.start
            : orderedIds[0] || null;

        setTitle(data.title || "Untitled Story");
        setAuthor(data.author || "Anonymous");
        setDescription(data.description || "");
        setStart(validStart);
        setNodes(rebuiltNodes);
        setSelectedNode(validStart);

        alert("Story imported successfully!");
      } catch (err) {
        console.error(err);
        alert("Error reading story file.");
      }
    };

    reader.readAsText(file);
  };

  // Called by StoryDiagram after centering animation
  const handleSelectNodeFromDiagram = (id) => {
    setSelectedNode(id); // Jump editor to this node
    setShowDiagram(false); // Close the diagram modal
  };

  return (
    <section className="flex min-h-screen bg-gray-900 text-white">
      {/* Sidebar: nodes list */}
      <div className="w-1/3 space-y-2 bg-gray-800 p-1 sm:w-1/4 sm:p-4">
        <h2 className="mb-2 font-bold">Scenes</h2>
        {orderedNodeIds.map((id) => (
          <div key={id} className="flex items-center gap-2">
            <button
              onClick={() => setSelectedNode(id)}
              className={`flex-1 cursor-pointer rounded px-1 py-1 text-sm sm:px-2 sm:text-base ${
                id === selectedNode ? "bg-blue-600" : "bg-gray-700"
              }`}
            >
              {getNodeLabel(id)}
            </button>
            <button
              onClick={() => deleteNode(id)}
              className="cursor-pointer rounded bg-red-500 p-1 hover:bg-red-400"
              title="Delete Node"
            >
              <Trash2 className="size-3 sm:size-6" />
            </button>
          </div>
        ))}
        <button
          onClick={addNode}
          className="mt-4 inline-flex w-full cursor-pointer items-center rounded bg-green-600 px-1 py-1 text-sm hover:bg-green-500 sm:gap-2 sm:px-2 sm:text-base"
        >
          <Plus />
          Add Node
        </button>
      </div>

      {/* Main editor */}
      <div className="flex-1 space-y-4 p-2 sm:p-6">
        <h1 className="text-xl font-bold">Story Editor</h1>

        {/* Story metadata */}
        <div className="grid grid-cols-2 gap-4">
          <input
            className="rounded-lg border border-gray-500 bg-gray-800 p-2 text-white"
            placeholder="Story Title"
            name="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            className="rounded-lg border border-gray-500 bg-gray-800 p-2 text-white"
            placeholder="Author"
            name="Author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
          <textarea
            className="col-span-2 rounded-lg border border-gray-500 bg-gray-800 p-2 text-white"
            placeholder="Description"
            name="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Node editor */}
        {selectedNode && (
          <div className="rounded-lg bg-gray-800 p-1 sm:p-4">
            <h2 className="mb-2 font-semibold">
              Editing {getNodeLabel(selectedNode)}
            </h2>
            <textarea
              className="w-full rounded-lg border border-gray-500 p-2 text-white"
              rows="3"
              name="Story text"
              placeholder={
                selectedNode === start
                  ? "Start your story here..."
                  : "New scene..."
              }
              value={nodes[selectedNode].text}
              onChange={(e) => updateNodeText(selectedNode, e.target.value)}
            />

            <h3 className="mt-3 font-semibold">Options</h3>
            <div className="space-y-2">
              {nodes[selectedNode].options.map((opt, i) => (
                <div key={i} className="flex flex-wrap items-center gap-2">
                  <input
                    name="Option text"
                    className="flex-1 rounded-lg border border-gray-500 p-0.5 text-sm text-white sm:p-1 sm:text-base"
                    value={opt.text}
                    placeholder="New choice"
                    onChange={(e) =>
                      updateOption(selectedNode, i, "text", e.target.value)
                    }
                  />
                  <select
                    name="Next option"
                    className="rounded-lg border border-gray-500 p-1 text-sm text-white sm:text-base"
                    value={opt.next}
                    onChange={(e) =>
                      updateOption(selectedNode, i, "next", e.target.value)
                    }
                  >
                    {orderedNodeIds.map((id) => (
                      <option className="bg-gray-800" key={id} value={id}>
                        {getNodeLabel(id)}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => deleteOption(selectedNode, i)}
                    className="cursor-pointer rounded bg-red-500 p-1 hover:bg-red-400"
                    title="Delete Option"
                  >
                    <Trash2 />
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={() => addOption(selectedNode)}
              className="my-4 inline-flex cursor-pointer items-center rounded bg-blue-600 px-1 py-1 text-sm hover:bg-blue-500 sm:gap-2 sm:px-2 sm:text-base"
            >
              <Plus />
              Add Option
            </button>
          </div>
        )}

        <div className="flex flex-wrap justify-center gap-4 sm:justify-start">
          {/* Export button */}
          <button
            onClick={exportStory}
            className="inline-flex w-3xs max-w-[50vw] cursor-pointer items-center gap-2 rounded bg-yellow-600 px-4 py-2 text-center hover:bg-yellow-500"
          >
            <FileUp />
            Export Story JSON
          </button>

          {/* Import button */}
          <label className="inline-flex w-3xs max-w-[50vw] cursor-pointer items-center gap-2 rounded bg-green-600 px-4 py-2 text-center hover:bg-green-500">
            <FileDown />
            Import Story JSON
            <input
              type="file"
              accept="application/json"
              onChange={importStory}
              className="hidden"
            />
          </label>

          {/* Story diagram button */}
          <button
            onClick={() => setShowDiagram(true)}
            className="inline-flex w-3xs max-w-[50vw] cursor-pointer items-center gap-2 rounded bg-purple-600 px-4 py-2 text-center hover:bg-purple-500"
          >
            <Map />
            View Story Diagram
          </button>
        </div>

        {/* Diagram modal */}
        {showDiagram && (
          <StoryDiagram
            story={{ title, author, description, start, nodes }}
            onClose={() => setShowDiagram(false)}
            onSelectNode={handleSelectNodeFromDiagram}
          />
        )}
      </div>
    </section>
  );
}
