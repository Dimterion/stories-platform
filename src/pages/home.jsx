import { useEffect, useState } from "react";
import { Link } from "react-router";
import { X } from "lucide-react";
import Instructions from "../components/Instructions";

export default function HomePage() {
  const [showModal, setShowModal] = useState(false);

  // Prevent background scroll when modal opens
  useEffect(() => {
    if (showModal) {
      // Save scroll position and prevent scroll
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
    } else {
      // Restore scroll position when modal closes
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      window.scrollTo(0, parseInt(scrollY || "0") * -1);
    }

    // Cleanup on unmount
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
    };
  }, [showModal]);

  return (
    <main className="flex flex-col items-center gap-10 p-4">
      <h1 className="text-center text-4xl italic">
        Interactive Stories Platform
      </h1>
      <button
        type="button"
        onClick={() => setShowModal(true)}
        className="hover:bg-softWhite hover:text-deepBlue mx-auto w-sm max-w-[80vw] cursor-pointer border p-2 text-center uppercase"
      >
        Instructions
      </button>
      <section className="flex flex-col gap-10 text-center">
        <article className="flex flex-col gap-4">
          <p className="flex gap-2">
            Read / play through interactive stories with multiple choices and
            outcomes.
          </p>
          <Link
            to="/story-player"
            className="hover:bg-softWhite hover:text-deepBlue mx-auto w-sm max-w-[80vw] border p-2 text-center uppercase"
          >
            Play Stories
          </Link>
        </article>
        <article className="flex flex-col gap-4">
          <p>Create your own interactive stories.</p>
          <Link
            to="/story-editor"
            className="hover:bg-softWhite hover:text-deepBlue mx-auto w-sm max-w-[80vw] border p-2 text-center uppercase"
          >
            Create Stories
          </Link>
        </article>
        <article className="flex flex-col gap-4">
          <p>Learn more about the platform.</p>
          <Link
            to="/about"
            className="hover:bg-softWhite hover:text-deepBlue mx-auto w-sm max-w-[80vw] border p-2 text-center uppercase"
          >
            About the platform
          </Link>
        </article>
      </section>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-labelledby="instructions-title"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-softWhite text-deepBlue relative max-h-[90vh] w-full max-w-lg overflow-y-auto p-4 sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="border-darkBlue hover:bg-deepBlue hover:text-softWhite absolute top-0.5 right-0.5 z-10 cursor-pointer border p-1 transition-colors"
              aria-label="Close instructions"
            >
              <X className="size-5" />
            </button>
            <Instructions />
          </div>
        </div>
      )}
    </main>
  );
}
