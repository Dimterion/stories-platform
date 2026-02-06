import { useState } from "react";
import { BookOpenCheck, CircleQuestionMark, Info, Pencil } from "lucide-react";
import PageLink from "../components/ui/PageLink";
import Modal from "../components/ui/Modal";
import Instructions from "../components/ui/Instructions";

export default function HomePage() {
  const [showModal, setShowModal] = useState(false);

  return (
    <section className="mx-auto mb-4 flex max-w-[1024px] flex-col items-center justify-center gap-6 p-4 sm:mb-0 sm:gap-12">
      <h2 className="homePage-h2 my-2 text-center text-2xl font-bold italic opacity-0 sm:text-4xl">
        Interactive Stories Platform
      </h2>
      <button
        type="button"
        onClick={() => setShowModal(true)}
        className="homePage-btn hover:bg-softWhite hover:text-deepBlue bg-darkBlue mx-auto flex w-full max-w-sm cursor-pointer flex-nowrap items-center justify-center gap-2 border p-2 text-center text-xs uppercase opacity-0 transition-all duration-300 active:scale-95 sm:text-base"
      >
        <CircleQuestionMark /> Instructions
      </button>
      <section className="flex flex-wrap gap-4 text-center">
        <article className="homePage-leftLink bg-darkBlue m-auto flex w-sm max-w-[80vw] flex-col gap-4 border p-4 opacity-0">
          <PageLink
            link="story-player"
            icon={<BookOpenCheck />}
            text="Story Player"
          />
          <p className="text-sm sm:text-base">
            Read / play interactive stories.
          </p>
        </article>
        <article className="homePage-rightLink bg-darkBlue m-auto flex w-sm max-w-[80vw] flex-col gap-4 border p-4 opacity-0">
          <PageLink link="story-editor" icon={<Pencil />} text="Story Editor" />
          <p className="text-sm sm:text-base">
            Create your own interactive stories.
          </p>
        </article>
      </section>
      <PageLink
        link="about"
        animation="homePage-bottomLink"
        icon={<Info />}
        text="About the platform"
      />
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        ariaLabelledBy="instructions-title"
      >
        <Instructions />
      </Modal>
    </section>
  );
}
