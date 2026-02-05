export default function Hint({ text }) {
  return (
    <aside className="hint-contentWrapper absolute -top-5 z-50 mx-2 w-full max-w-[200px] text-center">
      <p className="bg-softWhite text-darkBlue border-darkBlue border-3 px-2 py-1 text-xs shadow-lg sm:text-sm">
        {text}
      </p>
      <div className="border-t-darkBlue mx-auto h-0 w-0 border-t-10 border-r-10 border-l-10 border-r-transparent border-l-transparent" />
    </aside>
  );
}
