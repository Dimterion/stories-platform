import { useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { PanelLeftOpen } from "lucide-react";
import { validateStoryJson } from "../utils/storyUtils";
import { generateStandaloneStoryHTML } from "../utils/exportStandaloneHTML";
import { downloadFile } from "../utils/downloadFile";
import Sidebar from "../upd/SidebarUpd";
import MetadataForm from "../upd/MetadataFormUpd";
import NodeEditor from "../upd/NodeEditorUpd";
import Toolbar from "../upd/ToolbarUpd";
import StoryDiagram from "../components/StoryDiagram/StoryDiagram";

export default function StoryEditorPage() {
  const STORAGE_KEY = "storyEditorState";

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [nodes, setNodes] = useState({});
  const [start, setStart] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [showDiagram, setShowDiagram] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [showProgress, setShowProgress] = useState(true);
  const [allowBackNavigation, setAllowBackNavigation] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);

        // Validate structure
        if (data && typeof data === "object" && data.nodes) {
          setTitle(data.title || "");
          setAuthor(data.author || "");
          setDescription(data.description || "");
          setShowProgress(data.showProgress ?? true);
          setAllowBackNavigation(data.allowBackNavigation ?? false);
          setNodes(data.nodes);
          const firstId = Object.keys(data.nodes)[0];
          setStart(data.start || firstId);
          setSelectedNode(data.selectedNode || data.start || firstId);
          return;
        }
      }

      // If nothing is saved, start fresh
      const firstId = uuidv4();
      const freshNodes = {
        [firstId]: { text: "", options: [], createdAt: Date.now() },
      };
      setTitle("");
      setAuthor("");
      setDescription("");
      setNodes(freshNodes);
      setStart(firstId);
      setSelectedNode(firstId);
    } catch (e) {
      console.error("Failed to load story editor state:", e);
    }
  }, []);

  // Autosave whenever state changes
  useEffect(() => {
    // Don’t autosave if nothing meaningful is ready
    if (!start || Object.keys(nodes).length === 0) return;

    const saveData = {
      title,
      author,
      description,
      nodes,
      start,
      showProgress,
      allowBackNavigation,
      selectedNode,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saveData));
    setLastSaved(Date.now());
  }, [
    title,
    author,
    description,
    nodes,
    start,
    showProgress,
    allowBackNavigation,
    selectedNode,
  ]);

  // Clear local save and reset editor
  const clearLocalSave = () => {
    localStorage.removeItem(STORAGE_KEY);

    // Reset all editor fields
    const firstId = uuidv4();
    const freshNodes = {
      [firstId]: { text: "", options: [], createdAt: Date.now() },
    };

    setTitle("");
    setAuthor("");
    setDescription("");
    setNodes(freshNodes);
    setStart(firstId);
    setShowProgress(true);
    setAllowBackNavigation(false);
    setSelectedNode(firstId);

    toast.success("Local save cleared and editor reset.", {
      style: {
        background: "#003049",
        border: "2px solid #fdf0d5",
        borderRadius: "0",
        color: "#fdf0d5",
      },
      classNames: {
        closeButton:
          "!bg-[#003049] !border-[#fdf0d5] !border-2 !text-[#fdf0d5] !rounded-none",
      },
    });
  };

  const orderedNodeIds = useMemo(() => {
    return Object.entries(nodes)
      .sort((a, b) => a[1].createdAt - b[1].createdAt)
      .map(([id]) => id);
  }, [nodes]);
  const currentSceneIndex = orderedNodeIds.indexOf(selectedNode);
  const totalScenes = orderedNodeIds.length;

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
    const newOption = { text: "", next: null };

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
    const oldNodes = { ...nodes };

    setNodes((prev) => {
      const updated = { ...prev };
      updated[nodeId] = {
        ...updated[nodeId],
        options: updated[nodeId].options.filter((_, i) => i !== optionIndex),
      };

      return updated;
    });

    toast.info("Option deleted.", {
      action: {
        label: "Undo",
        onClick: () => setNodes(oldNodes),
      },
      style: {
        background: "#003049",
        border: "2px solid #fdf0d5",
        borderRadius: "0",
        color: "#fdf0d5",
      },
      classNames: {
        actionButton:
          "!bg-[#fdf0d5] !text-[#0a122a] px-4 py-1 !rounded-none hover:!bg-[#0a122a] hover:!text-[#fdf0d5] transition-colors",
        closeButton:
          "!bg-[#003049] !border-[#fdf0d5] !border-2 !text-[#fdf0d5] !rounded-none",
      },
    });
  };

  // Delete a whole node
  const deleteNode = (nodeId) => {
    if (nodeId === start) {
      toast.error("You can’t delete the start node.", {
        style: {
          background: "#003049",
          border: "2px solid #fdf0d5",
          borderRadius: "0",
          color: "#fdf0d5",
        },
        classNames: {
          closeButton:
            "!bg-[#003049] !border-[#fdf0d5] !border-2 !text-[#fdf0d5] !rounded-none",
        },
      });

      return;
    }

    const oldNodes = { ...nodes };

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

    toast.info("Node deleted.", {
      action: {
        label: "Undo",
        onClick: () => setNodes(oldNodes),
      },
      style: {
        background: "#003049",
        border: "2px solid #fdf0d5",
        borderRadius: "0",
        color: "#fdf0d5",
      },
      classNames: {
        actionButton:
          "!bg-[#fdf0d5] !text-[#0a122a] px-4 py-1 !rounded-none hover:!bg-[#0a122a] hover:!text-[#fdf0d5] transition-colors",
        closeButton:
          "!bg-[#003049] !border-[#fdf0d5] !border-2 !text-[#fdf0d5] !rounded-none",
      },
    });
  };

  const setAsStartNode = (nodeId) => {
    setStart(nodeId);
    toast.success(`${getNodeLabel(nodeId)} set as start node.`, {
      style: {
        background: "#003049",
        border: "2px solid #fdf0d5",
        borderRadius: "0",
        color: "#fdf0d5",
      },
      classNames: {
        closeButton:
          "!bg-[#003049] !border-[#fdf0d5] !border-2 !text-[#fdf0d5] !rounded-none",
      },
    });
  };

  const exportStory = () => {
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
      title: title.trim() || "Untitled Story",
      author: author.trim() || "Anonymous",
      description: description.trim() || "",
      start,
      showProgress,
      allowBackNavigation,
      nodes: enrichedNodes,
    };

    const hasUnlinked = Object.values(nodes).some((n) =>
      n.options.some((opt) => !opt.next || !nodes[opt.next]),
    );

    if (hasUnlinked) {
      toast.error(
        "Some options are not connected to nodes. Please fix or delete them before exporting.",
        {
          style: {
            background: "#003049",
            border: "2px solid #fdf0d5",
            borderRadius: "0",
            color: "#fdf0d5",
          },
          classNames: {
            closeButton:
              "!bg-[#003049] !border-[#fdf0d5] !border-2 !text-[#fdf0d5] !rounded-none",
          },
        },
      );
      return;
    }

    const blob = new Blob([JSON.stringify(story, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    const safeTitle = (title.trim() || "Untitled_Story")
      .replace(/[<>:"/\\|?*]+/g, "")
      .replace(/\s+/g, "_")
      .slice(0, 50);

    link.download = `${safeTitle}.json`;
    link.href = url;
    link.click();

    toast.success("Story exported successfully.", {
      style: {
        background: "#003049",
        border: "2px solid #fdf0d5",
        borderRadius: "0",
        color: "#fdf0d5",
      },
      classNames: {
        closeButton:
          "!bg-[#003049] !border-[#fdf0d5] !border-2 !text-[#fdf0d5] !rounded-none",
      },
    });
  };

  const exportStandaloneHTML = () => {
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
      title: title.trim() || "Untitled Story",
      author: author.trim() || "Anonymous",
      description: description.trim() || "",
      start,
      showProgress,
      allowBackNavigation,
      nodes: enrichedNodes,
    };

    const hasUnlinked = Object.values(nodes).some((n) =>
      n.options.some((opt) => !opt.next || !nodes[opt.next]),
    );

    if (hasUnlinked) {
      toast.error(
        "Some options are not connected to nodes. Please fix or delete them before exporting.",
        {
          style: {
            background: "#003049",
            border: "2px solid #fdf0d5",
            borderRadius: "0",
            color: "#fdf0d5",
          },
          classNames: {
            closeButton:
              "!bg-[#003049] !border-[#fdf0d5] !border-2 !text-[#fdf0d5] !rounded-none",
          },
        },
      );

      return;
    }

    const html = generateStandaloneStoryHTML(story);
    const safeTitle = (title.trim() || "Untitled_Story")
      .replace(/[<>:"/\\|?*]+/g, "")
      .replace(/\s+/g, "_")
      .slice(0, 50);

    downloadFile(html, `${safeTitle}.html`);

    toast.success("HTML file exported successfully.", {
      style: {
        background: "#003049",
        border: "2px solid #fdf0d5",
        borderRadius: "0",
        color: "#fdf0d5",
      },
      classNames: {
        closeButton:
          "!bg-[#003049] !border-[#fdf0d5] !border-2 !text-[#fdf0d5] !rounded-none",
      },
    });
  };

  const importStory = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large. Please upload a story smaller than 5MB.", {
        style: {
          background: "#003049",
          border: "2px solid #fdf0d5",
          borderRadius: "0",
          color: "#fdf0d5",
        },
        classNames: {
          closeButton:
            "!bg-[#003049] !border-[#fdf0d5] !border-2 !text-[#fdf0d5] !rounded-none",
        },
      });

      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        const validation = validateStoryJson(data);

        if (!validation.valid) {
          toast.error(validation.error, {
            style: {
              background: "#003049",
              border: "2px solid #fdf0d5",
              borderRadius: "0",
              color: "#fdf0d5",
            },
            classNames: {
              closeButton:
                "!bg-[#003049] !border-[#fdf0d5] !border-2 !text-[#fdf0d5] !rounded-none",
            },
          });

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

        const validStart = data.nodes[data.start] ? data.start : orderedIds[0];

        setTitle(data.title || "Untitled Story");
        setAuthor(data.author || "Anonymous");
        setDescription(data.description || "");
        setShowProgress(data.showProgress ?? true);
        setAllowBackNavigation(data.allowBackNavigation ?? false);
        setStart(validStart);
        setNodes(rebuiltNodes);
        setSelectedNode(validStart);

        toast.success("Story imported successfully.", {
          style: {
            background: "#003049",
            border: "2px solid #fdf0d5",
            borderRadius: "0",
            color: "#fdf0d5",
          },
          classNames: {
            closeButton:
              "!bg-[#003049] !border-[#fdf0d5] !border-2 !text-[#fdf0d5] !rounded-none",
          },
        });
      } catch (err) {
        console.error(err);

        toast.error("Error reading story file.", {
          style: {
            background: "#003049",
            border: "2px solid #fdf0d5",
            borderRadius: "0",
            color: "#fdf0d5",
          },
          classNames: {
            closeButton:
              "!bg-[#003049] !border-[#fdf0d5] !border-2 !text-[#fdf0d5] !rounded-none",
          },
        });
      } finally {
        event.target.value = "";
      }
    };

    reader.readAsText(file);
  };

  // Called by StoryDiagram after centering animation
  const handleSelectNodeFromDiagram = (id) => {
    setSelectedNode(id); // Jump editor to this node
    setShowDiagram(false); // Close the diagram modal
  };

  if (!selectedNode || Object.keys(nodes).length === 0) {
    return (
      <section className="flex min-h-screen items-center justify-center text-gray-400">
        Loading story editor...
      </section>
    );
  }

  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return "";
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 5) return "just now";
    if (seconds < 60) return `${seconds} seconds ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    return `${Math.floor(seconds / 3600)} hours ago`;
  };

  return (
    <main className="relative flex min-h-screen">
      {/* Sidebar: nodes list */}
      {sidebarVisible && (
        <Sidebar
          nodes={nodes}
          start={start}
          selectedNode={selectedNode}
          orderedNodeIds={orderedNodeIds}
          onSelectNode={setSelectedNode}
          onAddNode={addNode}
          onDeleteNode={deleteNode}
          getNodeLabel={getNodeLabel}
          sidebarVisible={() => setSidebarVisible(!sidebarVisible)}
        />
      )}

      {/* Main editor */}
      <div className="flex-1 space-y-4 p-2 sm:p-6">
        <div className="flex flex-col flex-wrap justify-between gap-2 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            {!sidebarVisible && (
              <button
                onClick={() => setSidebarVisible(!sidebarVisible)}
                className="h-fit w-fit cursor-pointer bg-gray-700 p-1 hover:bg-gray-600"
                aria-label="Toggle sidebar"
              >
                <PanelLeftOpen className="size-3 sm:size-6" />
              </button>
            )}
            <h1 className="text-xl font-bold">Story Editor</h1>
          </div>
          {totalScenes > 0 && currentSceneIndex >= 0 && (
            <p className="text-sm text-gray-400">
              Scene {currentSceneIndex + 1} of {totalScenes}
            </p>
          )}
          {lastSaved && (
            <p className="text-sm text-gray-400 italic">
              Saved to browser local storage {formatTimeAgo(lastSaved)}.
            </p>
          )}
        </div>

        {/* Story metadata */}
        <MetadataForm
          title={title}
          author={author}
          description={description}
          showProgress={showProgress}
          allowBackNavigation={allowBackNavigation}
          onChange={{
            setTitle,
            setAuthor,
            setDescription,
            setShowProgress,
            setAllowBackNavigation,
          }}
        />

        {/* Node editor */}
        <NodeEditor
          selectedNode={selectedNode}
          start={start}
          nodes={nodes}
          orderedNodeIds={orderedNodeIds}
          getNodeLabel={getNodeLabel}
          onUpdateText={updateNodeText}
          onAddOption={addOption}
          onUpdateOption={updateOption}
          onDeleteOption={deleteOption}
          onSetAsStart={setAsStartNode}
        />

        <Toolbar
          onExportStory={exportStory}
          onExportHTML={exportStandaloneHTML}
          onImportStory={importStory}
          onShowDiagram={() => setShowDiagram(true)}
          onClearSave={clearLocalSave}
        />

        {/* Diagram modal */}
        {showDiagram && (
          <StoryDiagram
            story={{ title, author, description, start, nodes }}
            onClose={() => setShowDiagram(false)}
            onSelectNode={handleSelectNodeFromDiagram}
          />
        )}
      </div>
    </main>
  );
}
