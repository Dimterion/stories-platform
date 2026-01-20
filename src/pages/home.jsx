import { useState } from "react";
import { Link } from "react-router";
import { BookOpenCheck, CircleQuestionMark, Info, Pencil } from "lucide-react";
import Modal from "../components/Modal";
import Instructions from "../components/Instructions";

export default function HomePage() {
  const [showModal, setShowModal] = useState(false);

  return (
    <main className="flex flex-col items-center gap-10 p-4">
      <h1 className="text-center text-4xl italic">
        Interactive Stories Platform
      </h1>
      <button
        type="button"
        onClick={() => setShowModal(true)}
        className="hover:bg-softWhite hover:text-deepBlue mx-auto flex w-sm max-w-[80vw] cursor-pointer flex-nowrap items-center justify-center gap-2 border p-2 text-center text-xs uppercase sm:text-base"
      >
        <CircleQuestionMark /> Instructions
      </button>
      <section className="flex flex-col gap-10 text-center">
        <div className="flex flex-wrap gap-4">
          <article className="m-auto flex w-sm max-w-[80vw] flex-col gap-4 border p-2">
            <Link
              to="/story-player"
              className="hover:bg-softWhite hover:text-deepBlue mx-auto flex w-full flex-nowrap items-center justify-center gap-2 border p-2 text-center text-xs uppercase sm:text-base"
            >
              <BookOpenCheck />
              Story Player
            </Link>
            <p className="text-sm">Read / play through interactive stories.</p>
          </article>
          <article className="m-auto flex w-sm max-w-[80vw] flex-col gap-4 border p-2">
            <Link
              to="/story-editor"
              className="hover:bg-softWhite hover:text-deepBlue mx-auto flex w-full flex-nowrap items-center justify-center gap-2 border p-2 text-center text-xs uppercase sm:text-base"
            >
              <Pencil />
              Story Editor
            </Link>
            <p className="text-sm">Create your own interactive stories.</p>
          </article>
        </div>
        <Link
          to="/about"
          className="hover:bg-softWhite hover:text-deepBlue mx-auto flex w-sm max-w-[80vw] flex-nowrap items-center justify-center gap-2 border p-2 text-center text-xs uppercase sm:text-base"
        >
          <Info />
          About the platform
        </Link>
      </section>
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        ariaLabelledBy="instructions-title"
      >
        <Instructions />
      </Modal>
    </main>
  );
}
