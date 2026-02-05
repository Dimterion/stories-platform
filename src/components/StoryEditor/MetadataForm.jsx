import Hint from "../ui/Hint";

export default function MetadataForm({
  showHints,
  title,
  author,
  description,
  showProgress,
  allowBackNavigation,
  onChange,
}) {
  return (
    <div className="relative grid grid-cols-2 gap-4">
      {showHints && (
        <Hint text="Add general information about the story here." />
      )}
      <input
        className="border-darkBlue text-darkBlue bg-softWhite border p-2"
        placeholder="Story Title"
        name="Title"
        value={title}
        onChange={(e) => onChange.setTitle(e.target.value)}
      />
      <input
        className="border-darkBlue text-darkBlue bg-softWhite border p-2"
        placeholder="Author"
        name="Author"
        value={author}
        onChange={(e) => onChange.setAuthor(e.target.value)}
      />
      <textarea
        className="border-darkBlue text-darkBlue bg-softWhite col-span-2 border p-2"
        placeholder="Description"
        name="Description"
        value={description}
        onChange={(e) => onChange.setDescription(e.target.value)}
      />
      <div className="col-span-2 flex items-center gap-2">
        <input
          type="checkbox"
          id="showProgress"
          checked={showProgress}
          onChange={(e) => onChange.setShowProgress(e.target.checked)}
          className="size-5 cursor-pointer"
        />
        <label
          htmlFor="showProgress"
          className="text-softWhite cursor-pointer text-sm"
        >
          Show progress indicator in Story Player
        </label>
      </div>
      <div className="col-span-2 flex items-center gap-2">
        <input
          type="checkbox"
          id="allowBackNavigation"
          checked={allowBackNavigation}
          onChange={(e) => onChange.setAllowBackNavigation(e.target.checked)}
          className="size-5 cursor-pointer"
        />
        <label
          htmlFor="allowBackNavigation"
          className="text-softWhite cursor-pointer text-sm"
        >
          Allow back button in Story Player
        </label>
      </div>
    </div>
  );
}
