import { useState } from "react";
import StoryPlayer from "./components/StoryPlayer";
import StoryEditor from "./components/StoryEditor";

export default function App() {
  const [activeTab, setActiveTab] = useState("play");

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header Navigation */}
      <header className="flex items-center justify-between bg-gray-800 p-4">
        <h1 className="font-bold sm:text-xl">Interactive Story Platform</h1>
        <nav className="flex flex-wrap justify-end gap-4">
          <button
            onClick={() => setActiveTab("play")}
            className={`min-w-36 cursor-pointer rounded px-3 py-1 text-sm sm:text-base ${
              activeTab === "play" ? "bg-blue-600" : "bg-gray-700"
            }`}
          >
            📖 Play Stories
          </button>
          <button
            onClick={() => setActiveTab("create")}
            className={`min-w-36 cursor-pointer rounded px-3 py-1 text-sm sm:text-base ${
              activeTab === "create" ? "bg-green-600" : "bg-gray-700"
            }`}
          >
            ✍️ Create Stories
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main>
        {activeTab === "play" && <StoryPlayer />}
        {activeTab === "create" && <StoryEditor />}
      </main>
    </div>
  );
}
