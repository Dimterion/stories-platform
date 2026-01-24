import { useState } from "react";
import { Link } from "react-router";
import { BookOpenCheck, CircleQuestionMark, Info, Pencil } from "lucide-react";
import Modal from "../components/Modal";
import Instructions from "../components/Instructions";

export default function HomePage() {
  const [showModal, setShowModal] = useState(false);

  return (
    <main className="mb-4 flex flex-col items-center gap-6 p-4 sm:mb-0 sm:gap-12">
      <h2 className="my-2 text-center text-2xl font-bold italic sm:text-4xl">
        Interactive Stories Platform
      </h2>
      <button
        type="button"
        onClick={() => setShowModal(true)}
        className="hover:bg-softWhite hover:text-deepBlue bg-darkBlue mx-auto flex w-sm max-w-[80vw] cursor-pointer flex-nowrap items-center justify-center gap-2 border p-2 text-center text-xs uppercase sm:text-base"
      >
        <CircleQuestionMark /> Instructions
      </button>
      <section className="flex flex-wrap gap-4 text-center">
        <article className="bg-darkBlue m-auto flex w-sm max-w-[80vw] flex-col gap-4 border p-4">
          <Link
            to="/story-player"
            className="hover:bg-softWhite hover:text-deepBlue mx-auto flex w-full flex-nowrap items-center justify-center gap-2 border p-2 text-center text-xs uppercase sm:text-base"
          >
            <BookOpenCheck />
            Story Player
          </Link>
          <p className="text-sm sm:text-base">
            Read / play interactive stories.
          </p>
        </article>
        <article className="bg-darkBlue m-auto flex w-sm max-w-[80vw] flex-col gap-4 border p-4">
          <Link
            to="/story-editor"
            className="hover:bg-softWhite hover:text-deepBlue mx-auto flex w-full flex-nowrap items-center justify-center gap-2 border p-2 text-center text-xs uppercase sm:text-base"
          >
            <Pencil />
            Story Editor
          </Link>
          <p className="text-sm sm:text-base">
            Create your own interactive stories.
          </p>
        </article>
      </section>
      <Link
        to="/about"
        className="hover:bg-softWhite hover:text-deepBlue bg-darkBlue mx-auto flex w-sm max-w-[80vw] flex-nowrap items-center justify-center gap-2 border p-2 text-center text-xs uppercase sm:text-base"
      >
        <Info />
        About the platform
      </Link>
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
