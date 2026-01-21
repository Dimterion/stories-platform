import { useState } from "react";
import { Link } from "react-router";
import { BookOpenCheck, CircleQuestionMark, Info, Pencil } from "lucide-react";
import Modal from "../components/Modal";
import Instructions from "../components/Instructions";

export default function HomePage() {
  const [showModal, setShowModal] = useState(false);

  return (
    <main className="flex flex-col items-center gap-12 p-4">
      <h1 className="my-2 text-center text-4xl italic">
        Interactive Stories Platform
      </h1>
      <button
        type="button"
        onClick={() => setShowModal(true)}
        className="hover:bg-softWhite hover:text-deepBlue bg-darkBlue mx-auto flex w-sm max-w-[80vw] cursor-pointer flex-nowrap items-center justify-center gap-2 border p-2 text-center uppercase"
      >
        <CircleQuestionMark /> Instructions
      </button>
      <section className="flex flex-col gap-10 text-center">
        <div className="flex flex-wrap gap-4">
          <article className="bg-darkBlue m-auto flex w-sm max-w-[80vw] flex-col gap-4 border p-4">
            <Link
              to="/story-player"
              className="hover:bg-softWhite hover:text-deepBlue mx-auto flex w-full flex-nowrap items-center justify-center gap-2 border p-2 text-center uppercase"
            >
              <BookOpenCheck />
              Story Player
            </Link>
            <p>Read / play interactive stories.</p>
          </article>
          <article className="bg-darkBlue m-auto flex w-sm max-w-[80vw] flex-col gap-4 border p-4">
            <Link
              to="/story-editor"
              className="hover:bg-softWhite hover:text-deepBlue mx-auto flex w-full flex-nowrap items-center justify-center gap-2 border p-2 text-center uppercase"
            >
              <Pencil />
              Story Editor
            </Link>
            <p>Create your own interactive stories.</p>
          </article>
        </div>
      </section>
      <Link
        to="/about"
        className="hover:bg-softWhite hover:text-deepBlue bg-darkBlue mx-auto flex w-sm max-w-[80vw] flex-nowrap items-center justify-center gap-2 border p-2 text-center uppercase"
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
