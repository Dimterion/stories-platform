export default function MetadataForm({
  title,
  author,
  description,
  showProgress,
  allowBackNavigation,
  onChange,
}) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <input
        className="border border-gray-500 bg-gray-800 p-2 text-white"
        placeholder="Story Title"
        name="Title"
        value={title}
        onChange={(e) => onChange.setTitle(e.target.value)}
      />
      <input
        className="border border-gray-500 bg-gray-800 p-2 text-white"
        placeholder="Author"
        name="Author"
        value={author}
        onChange={(e) => onChange.setAuthor(e.target.value)}
      />
      <textarea
        className="col-span-2 border border-gray-500 bg-gray-800 p-2 text-white"
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
        />
        <label htmlFor="showProgress" className="text-sm text-gray-300">
          Show progress indicator in Story Player
        </label>
      </div>
      <div className="col-span-2 flex items-center gap-2">
        <input
          type="checkbox"
          id="allowBackNavigation"
          checked={allowBackNavigation}
          onChange={(e) => onChange.setAllowBackNavigation(e.target.checked)}
        />
        <label htmlFor="allowBackNavigation" className="text-sm text-gray-300">
          Allow back button in Story Player
        </label>
      </div>
    </div>
  );
}
