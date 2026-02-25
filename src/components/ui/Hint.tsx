type HintProps = {
  text: string;
  position?: string;
};

export default function Hint({ text, position = "-top-5" }: HintProps) {
  return (
    <aside
      className={`hint-contentWrapper absolute z-50 mx-2 w-full max-w-[200px] text-center ${position}`}
    >
      <p className="bg-softWhite text-darkBlue border-darkBlue border-3 px-2 py-1 text-xs shadow-lg sm:text-sm">
        {text}
      </p>
      <div className="border-t-darkBlue mx-auto h-0 w-0 border-t-10 border-r-10 border-l-10 border-r-transparent border-l-transparent" />
    </aside>
  );
}
