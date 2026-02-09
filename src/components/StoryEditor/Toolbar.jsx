import {
  CircleQuestionMark,
  FileDown,
  FileUp,
  Map,
  XCircle,
} from "lucide-react";
import Hint from "../ui/Hint";
import ToolbarBtn from "../ui/ToolbarBtn";

export default function Toolbar({
  showHints,
  onExportStory,
  onExportHTML,
  onImportStory,
  onShowDiagram,
  onClearSave,
  onShowModal,
}) {
  return (
    <section className="relative flex flex-wrap justify-center gap-4 pb-2 md:justify-start">
      {showHints && <Hint text="Choose what you want to do with your story." />}
      <ToolbarBtn
        onClick={onExportStory}
        color="bg-baseOrange hover:bg-lightOrange"
        icon={<FileUp className="size-8 sm:size-6" />}
        text="Export Story (JSON file)"
      />
      <ToolbarBtn
        onClick={onExportHTML}
        color="bg-lightGreen hover:bg-darkGreen"
        icon={<FileUp className="size-8 sm:size-6" />}
        text="Export Story (HTML file)"
      />
      <label className="border-darkBlue bg-darkGreen hover:bg-lightGreen inline-flex min-h-20 w-3xs max-w-[55vw] cursor-pointer items-center gap-2 border-3 px-4 py-2 text-center text-sm sm:text-base">
        <FileDown className="size-8 sm:size-6" />
        Import Story (JSON file)
        <input
          type="file"
          accept="application/json"
          onChange={onImportStory}
          className="hidden"
        />
      </label>
      <ToolbarBtn
        onClick={onShowDiagram}
        color="bg-basePurple hover:bg-lightPurple"
        icon={<Map className="size-8 sm:size-6" />}
        text="View Story Diagram"
      />
      <ToolbarBtn
        onClick={onClearSave}
        color="bg-baseRed hover:bg-lightRed"
        icon={<XCircle className="size-8 sm:size-6" />}
        text="Clear Save & Reset Editor"
      />
      <ToolbarBtn
        onClick={onShowModal}
        color="bg-baseGreen hover:bg-softGreen"
        icon={<CircleQuestionMark className="size-8 sm:size-6" />}
        text="Instructions"
      />
    </section>
  );
}
