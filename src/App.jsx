import { useState } from "react";
import { Toaster } from "sonner";
import Header from "./components/Layout/Header";
import MetaUpdater from "./components/MetaUpdater";
import StoryPlayer from "./components/StoryPlayer";
import StoryEditor from "./components/StoryEditor/StoryEditor";
import Footer from "./components/Layout/Footer";

export default function App() {
  const [activeTab, setActiveTab] = useState("play");

  return (
    <div className="flex min-h-screen flex-col bg-gray-900 text-white">
      <Toaster position="top-right" richColors closeButton />
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
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
      <Footer />
    </div>
  );
}
