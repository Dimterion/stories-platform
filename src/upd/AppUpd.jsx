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
  #003049 - dark blue
  #669bbc - light blue

*/

export default function App() {
  const [activeTab, setActiveTab] = useState("play");

  return (
    <div className="flex min-h-screen flex-col bg-[#003049] text-[#fdf0d5]">
      <Toaster position="top-right" richColors closeButton />
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      {/* Main Content */}
      <main className="m-2 flex-1 gap-2 border-4 border-[#fdf0d5] p-2">
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
