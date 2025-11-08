import { FileDown, FileUp, Map, XCircle } from "lucide-react";

export default function Toolbar({
  onExportStory,
  onExportHTML,
  onImportStory,
  onShowDiagram,
  onClearSave,
}) {
  return (
    <section className="flex flex-wrap justify-center gap-4 pb-2 md:justify-start">
      <button
        onClick={onExportStory}
        className="inline-flex w-3xs max-w-[55vw] cursor-pointer items-center gap-2 rounded bg-yellow-600 px-4 py-2 text-center hover:bg-yellow-500"
      >
        <FileUp />
        Export Story (JSON file)
      </button>
      <button
        onClick={onExportHTML}
        className="inline-flex w-3xs max-w-[55vw] cursor-pointer items-center gap-2 rounded bg-teal-600 px-4 py-2 text-center hover:bg-teal-500"
      >
        <FileUp />
        Export Story (HTML file)
      </button>
      <label className="inline-flex w-3xs max-w-[55vw] cursor-pointer items-center gap-2 rounded bg-green-600 px-4 py-2 text-center hover:bg-green-500">
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
        className="inline-flex w-3xs max-w-[55vw] cursor-pointer items-center gap-2 rounded bg-purple-600 px-4 py-2 text-center hover:bg-purple-500"
      >
        <Map />
        View Story Diagram
      </button>
      <button
        onClick={onClearSave}
        className="inline-flex w-3xs max-w-[55vw] cursor-pointer items-center gap-2 rounded bg-red-600 px-4 py-2 text-center hover:bg-red-500"
      >
        <XCircle />
        Clear Save & Reset Editor
      </button>
    </section>
  );
}
