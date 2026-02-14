export default function ResetConfirmation({ text, cancelReset, confirmReset }) {
  return (
    <section>
      <h2
        id="reset-confirm-title"
        className="mt-6 mb-4 text-center text-xl font-bold"
      >
        Reset progress?
      </h2>
      <p className="mb-6">{text}</p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={cancelReset}
          className="border-darkBlue bg-lightGray hover:bg-darkGray text-softWhite w-full cursor-pointer border-3 p-1 transition-all duration-300"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={confirmReset}
          className="border-darkBlue bg-baseRed hover:bg-lightRed text-softWhite w-full cursor-pointer border-3 p-1 transition-all duration-300"
        >
          Yes, reset
        </button>
      </div>
    </section>
  );
}
