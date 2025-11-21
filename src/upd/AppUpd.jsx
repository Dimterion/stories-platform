import { useState } from "react";
import { Toaster } from "sonner";
import Header from "./upd/HeaderUpd";
import MetaUpdater from "./components/MetaUpdater";
import StoryPlayer from "./upd/StoryPlayerUpd";
import StoryEditor from "./components/StoryEditor/StoryEditor";
import Footer from "./upd/FooterUpd";

/*

  Colors:
  #780000 - dark red
  #c1121f - red
  #fdf0d5 - soft white
  #0a122a - dark blue
  #003049 - deep blue
  #669bbc - light blue

*/

export default function App() {
  const [activeTab, setActiveTab] = useState("play");

  return (
    <div className="flex min-h-screen flex-col bg-[#003049] text-[#fdf0d5]">
      <Toaster position="top-right" richColors closeButton />
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      {/* Main Content */}
      <main className="flex-1">
        {activeTab === "play" && (
          <>
            <MetaUpdater
              title="Play Stories | Interactive Stories Platform"
              description="Experience interactive stories with multiple choices and outcomes."
            />
            <StoryPlayer />
          </>
        )}
        {activeTab === "create" && (
          <>
            <MetaUpdater
              title="Create Stories | Interactive Stories Platform"
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
