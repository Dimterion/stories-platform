import { useState } from "react";
import { Toaster } from "sonner";
import { BookOpenCheck, Pencil } from "lucide-react";
import StoryPlayer from "./components/StoryPlayer";
import StoryEditor from "./components/StoryEditor";

export default function App() {
  const [activeTab, setActiveTab] = useState("play");

  return (
    <div className="flex min-h-screen flex-col justify-between bg-gray-900 text-white">
      <Toaster position="top-right" richColors closeButton />
      <header className="flex items-center justify-between bg-gray-800 p-4">
        <h1 className="font-bold sm:text-xl">Interactive Story Platform</h1>
        <nav className="flex flex-wrap justify-end gap-4">
          <button
            onClick={() => setActiveTab("play")}
            className={`inline-flex min-w-36 cursor-pointer items-center gap-2 rounded px-3 py-1 text-sm sm:text-base ${
              activeTab === "play" ? "bg-blue-600" : "bg-gray-700"
            }`}
          >
            <BookOpenCheck />
            Play Stories
          </button>
          <button
            onClick={() => setActiveTab("create")}
            className={`inline-flex min-w-36 cursor-pointer items-center gap-2 rounded px-3 py-1 text-sm sm:text-base ${
              activeTab === "create" ? "bg-green-600" : "bg-gray-700"
            }`}
          >
            <Pencil />
            Create Stories
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {activeTab === "play" && <StoryPlayer />}
        {activeTab === "create" && <StoryEditor />}
      </main>

      <footer className="flex items-center justify-center gap-1 bg-gray-800 py-1 text-sm">
        <p>&copy; {new Date().getFullYear()}</p>
        <a
          href="https://www.dimterion.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          Dimterion
        </a>
      </footer>
    </div>
  );
}
