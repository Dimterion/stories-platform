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
        <article className="flex flex-col gap-4">
          <p className="flex gap-2">
            Read / play through interactive stories with multiple choices and
            outcomes.
          </p>
          <Link
            to="/story-player"
            className="hover:bg-softWhite hover:text-deepBlue mx-auto flex w-sm max-w-[80vw] flex-nowrap items-center justify-center gap-2 border p-2 text-center text-xs uppercase sm:text-base"
          >
            <BookOpenCheck />
            Story Player
          </Link>
        </article>
        <article className="flex flex-col gap-4">
          <p>Create your own interactive stories.</p>
          <Link
            to="/story-editor"
            className="hover:bg-softWhite hover:text-deepBlue mx-auto flex w-sm max-w-[80vw] flex-nowrap items-center justify-center gap-2 border p-2 text-center text-xs uppercase sm:text-base"
          >
            <Pencil />
            Story Editor
          </Link>
        </article>
        <article className="flex flex-col gap-4">
          <p>Learn more about the platform.</p>
          <Link
            to="/about"
            className="hover:bg-softWhite hover:text-deepBlue mx-auto flex w-sm max-w-[80vw] flex-nowrap items-center justify-center gap-2 border p-2 text-center text-xs uppercase sm:text-base"
          >
            <Info />
            About the platform
          </Link>
        </article>
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
