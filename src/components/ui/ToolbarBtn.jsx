export default function ToolbarBtn({ onClick, color, icon, text }) {
  return (
    <button
      onClick={onClick}
      className={`border-darkBlue inline-flex min-h-20 w-3xs max-w-[55vw] cursor-pointer items-center gap-2 border-3 px-4 py-2 text-center text-sm duration-300 hover:opacity-100 active:scale-95 sm:text-base ${color}`}
    >
      {icon}
      {text}
    </button>
  );
}
