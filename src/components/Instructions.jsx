import { Link, useLocation } from "react-router";
import { ExternalLink } from "lucide-react";

export default function Instructions() {
  const location = useLocation();
  const path = location.pathname;
  const isStoryPlayer = path.startsWith("/story-player");
  const isStoryEditor = path.startsWith("/story-editor");

  return (
    <section className="space-y-4">
      <h3 className="text-center text-xl font-bold">Instructions</h3>
      {!isStoryEditor && (
        <article>
          <p>
            Use{" "}
            <Link
              to="/story-player"
              className="hover:text-lightBlue font-bold underline"
            >
              Story Player
            </Link>{" "}
            to read/play through the interactive stories.
          </p>
          <ul className="list-disc space-y-1 pt-2 pl-5">
            <li>Upload your own stories in JSON format.</li>
            <li>Navigate through the stories by choosing various options.</li>
            <li>Progress is saved locally in your current browser.</li>
            <li>Clear and reset progress to start over.</li>
            <li>Use "Show Hints" button to view additional instructions.</li>
          </ul>
        </article>
      )}
      {!isStoryPlayer && (
        <article>
          <p>
            Use{" "}
            <Link
              to="/story-editor"
              className="hover:text-lightBlue font-bold underline"
            >
              Story Editor
            </Link>{" "}
            to create interactive stories.
          </p>
          <ul className="list-disc space-y-1 pt-2 pl-5">
            <li>Upload your own stories in JSON format.</li>
            <li>Download created stories in HTML or JSON format.</li>
            <li>Progress is saved locally in your current browser.</li>
            <li>Clear and reset progress to start over.</li>
            <li>
              Review your stories structure by using{" "}
              <strong>Story diagram</strong> functionality.
            </li>
            <li>Download your stories diagrams in SVG or PNG format.</li>
          </ul>
        </article>
      )}
      <article>
        <p>
          Visit the{" "}
          <Link
            to="/about"
            className="hover:text-lightBlue font-bold underline"
          >
            About page
          </Link>{" "}
          for additional information and links.
        </p>
      </article>
      <h3 className="border-t pt-4 text-center text-lg font-semibold">
        Questions or feedback?
      </h3>
      <article className="mx-2 flex flex-wrap justify-around gap-2 border-b pb-6">
        <a
          href="https://linktr.ee/dimterion"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-lightBlue flex items-center gap-1 underline"
        >
          Profile links <ExternalLink className="size-4" />
        </a>
        <a
          href="https://www.dimterion.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-lightBlue flex items-center gap-1 underline"
        >
          My main site <ExternalLink className="size-4" />
        </a>
      </article>
    </section>
  );
}
