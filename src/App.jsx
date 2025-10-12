import { useState } from "react";
import { Toaster } from "sonner";
import { BookOpenCheck, Pencil } from "lucide-react";
import MetaUpdater from "./components/MetaUpdater";
import StoryPlayer from "./components/StoryPlayer";
import StoryEditor from "./components/StoryEditor";

export default function App() {
  const [activeTab, setActiveTab] = useState("play");

  const navButton = (tab, icon, label, activeColor) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`inline-flex min-w-36 cursor-pointer items-center gap-2 rounded px-3 py-1 text-sm sm:text-base ${
        activeTab === tab ? activeColor : "bg-gray-700"
      }`}
      aria-label={`${label} tab`}
    >
      {icon}
      {label}
    </button>
  );

  return (
    <div className="flex min-h-screen flex-col bg-gray-900 text-white">
      <Toaster position="top-right" richColors closeButton />
      <header className="flex items-center justify-between bg-gray-800 p-4">
        <h1 className="font-bold sm:text-xl">Interactive Story Platform</h1>
        <nav className="flex flex-wrap justify-end gap-4">
          {navButton("play", <BookOpenCheck />, "Play Stories", "bg-blue-600")}
          {navButton("create", <Pencil />, "Create Stories", "bg-green-600")}
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {activeTab === "play" && (
          <>
            <MetaUpdater
              title="Play Stories | Interactive Story Platform"
              description="Experience interactive stories with multiple choices and outcomes."
            />
            <StoryPlayer />
          </>
        )}

        {activeTab === "create" && (
          <>
            <MetaUpdater
              title="Create Stories | Interactive Story Platform"
              description="Create your own interactive stories with multiple choices and outcomes."
            />
            <StoryEditor />
          </>
        )}
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
