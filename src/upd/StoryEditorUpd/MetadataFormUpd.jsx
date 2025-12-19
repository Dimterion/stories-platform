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
        className="border border-[#0a122a] bg-[#fdf0d5] p-2 text-[#0a122a]"
        placeholder="Story Title"
        name="Title"
        value={title}
        onChange={(e) => onChange.setTitle(e.target.value)}
      />
      <input
        className="border border-[#0a122a] bg-[#fdf0d5] p-2 text-[#0a122a]"
        placeholder="Author"
        name="Author"
        value={author}
        onChange={(e) => onChange.setAuthor(e.target.value)}
      />
      <textarea
        className="col-span-2 border border-[#0a122a] bg-[#fdf0d5] p-2 text-[#0a122a]"
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
          className="cursor-pointer text-sm text-[#fdf0d5]"
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
          className="cursor-pointer text-sm text-[#fdf0d5]"
        >
          Allow back button in Story Player
        </label>
      </div>
    </div>
  );
}
