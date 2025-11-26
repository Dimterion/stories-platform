import { useState } from "react";
import { Toaster } from "sonner";
import Header from "./upd/HeaderUpd";
import MetaUpdater from "./components/MetaUpdater";
import StoryPlayer from "./upd/StoryPlayerUpd";
import StoryEditor from "./components/StoryEditor/StoryEditor";
import Footer from "./upd/FooterUpd";

/*

  Colors:
  #fdf0d5 - soft white
  #c1121f - red
  #780000 - dark red
  #669bbc - light blue
  #003049 - deep blue
  #0a122a - dark blue

*/

export default function App() {
  const [activeTab, setActiveTab] = useState("play");

  return (
    <div className="font-scienceGothic flex min-h-screen flex-col bg-[#003049] text-[#fdf0d5]">
      <Toaster position="top-right" richColors closeButton />
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      {/* Main Content */}
      <main className="flex-1 border-x-4 border-[#0a122a]">
        {activeTab === "play" && (
          <>
            <MetaUpdater
              title="Play | Interactive Stories Platform"
              description="Experience interactive stories with multiple choices and outcomes."
            />
            <StoryPlayer />
          </>
        )}
        {activeTab === "create" && (
          <>
            <MetaUpdater
              title="Create | Interactive Stories Platform"
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
