import {
  CircleQuestionMark,
  FileDown,
  FileUp,
  Map,
  XCircle,
} from "lucide-react";

export default function Toolbar({
  onExportStory,
  onExportHTML,
  onImportStory,
  onShowDiagram,
  onClearSave,
  onShowModal,
}) {
  return (
    <section className="flex flex-wrap justify-center gap-4 pb-2 md:justify-start">
      <button
        onClick={onExportStory}
        className="border-darkBlue bg-baseOrange hover:bg-lightOrange inline-flex w-3xs max-w-[55vw] cursor-pointer items-center gap-2 border-3 px-4 py-2 text-center"
      >
        <FileUp />
        Export Story (JSON file)
      </button>
      <button
        onClick={onExportHTML}
        className="border-darkBlue bg-lightGreen hover:bg-darkGreen inline-flex w-3xs max-w-[55vw] cursor-pointer items-center gap-2 border-3 px-4 py-2 text-center"
      >
        <FileUp />
        Export Story (HTML file)
      </button>
      <label className="border-darkBlue bg-darkGreen hover:bg-lightGreen inline-flex w-3xs max-w-[55vw] cursor-pointer items-center gap-2 border-3 px-4 py-2 text-center">
        <FileDown />
        Import Story (JSON file)
        <input
          type="file"
          accept="application/json"
          onChange={onImportStory}
          className="hidden"
        />
      </label>
      <button
        onClick={onShowDiagram}
        className="border-darkBlue bg-basePurple hover:bg-lightPurple inline-flex w-3xs max-w-[55vw] cursor-pointer items-center gap-2 border-3 px-4 py-2 text-center"
      >
        <Map />
        View Story Diagram
      </button>
      <button
        onClick={onClearSave}
        className="border-darkBlue bg-baseRed hover:bg-lightRed inline-flex w-3xs max-w-[55vw] cursor-pointer items-center gap-2 border-3 px-4 py-2 text-center"
      >
        <XCircle />
        Clear Save & Reset Editor
      </button>
      <button
        onClick={onShowModal}
        className="border-darkBlue bg-baseGreen hover:bg-softGreen inline-flex w-3xs max-w-[55vw] cursor-pointer items-center gap-2 border-3 px-4 py-2 text-center"
      >
        <CircleQuestionMark />
        Instructions
      </button>
    </section>
  );
}
