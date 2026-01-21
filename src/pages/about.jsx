import { Link } from "react-router";
import { BookOpenCheck, ExternalLink, House, Pencil } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="relative flex flex-col items-center justify-center gap-10 p-10 text-center">
      <h2 className="text-4xl font-bold">Interactive Stories Platform</h2>
      <p className="text-xl">
        A platform to create interactive stories with multiple choices and
        outcomes.
      </p>
      <section className="space-y-6">
        <Link
          to="/"
          className="hover:bg-softWhite hover:text-deepBlue bg-darkBlue mx-auto flex w-sm max-w-[80vw] cursor-pointer flex-nowrap items-center justify-center gap-2 border p-2 text-xs uppercase sm:text-base"
        >
          <House />
          Home page
        </Link>
        <Link
          to="/story-editor"
          className="hover:bg-softWhite hover:text-deepBlue bg-darkBlue mx-auto flex w-sm max-w-[80vw] cursor-pointer flex-nowrap items-center justify-center gap-2 border p-2 text-xs uppercase sm:text-base"
        >
          <Pencil />
          Start creating
        </Link>
        <Link
          to="/story-player"
          className="hover:bg-softWhite hover:text-deepBlue bg-darkBlue mx-auto flex w-sm max-w-[80vw] cursor-pointer flex-nowrap items-center justify-center gap-2 border p-2 text-xs uppercase sm:text-base"
        >
          <BookOpenCheck /> Start playing
        </Link>
      </section>
      <section>
        <p className="mb-4 text-xl font-bold">Learn more about the project:</p>
        <ul className="list-disc space-y-1 text-left">
          <li>
            <a
              href="https://medium.com/@dimterion/text-adventure-games-creation-tool-385667ac8904"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-lightBlue inline-flex items-center gap-1 underline"
            >
              Text adventure games creation tool
              <ExternalLink className="size-4 shrink-0" />
            </a>
          </li>
          <li>
            <a
              href="https://medium.com/@dimterion/text-adventure-games-creation-tool-progress-update-4e2bd0524d03"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-lightBlue inline-flex items-center gap-1 underline"
            >
              Text adventure games creation tool (progress update)
              <ExternalLink className="size-4 shrink-0" />
            </a>
          </li>
        </ul>
      </section>
      <section>
        <p className="text-lg">
          Visit the{" "}
          <a
            href="https://github.com/Dimterion/stories-platform"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-lightBlue underline"
          >
            project's GitHub repository
          </a>{" "}
          for more information and updates.
        </p>
      </section>
      <h3 className="text-lg font-semibold">Questions or feedback?</h3>
      <article className="mx-2 flex flex-wrap justify-around gap-2">
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
      <section className="border-t pt-2 text-lg">
        <p>I have also made a couple of interactive text adventure games:</p>
        <ul>
          <li>
            <a
              href="https://poets-of-tomorrows-world.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-lightBlue underline"
            >
              Poets of Tomorrow’s World
            </a>
          </li>
          <li>
            <a
              href="https://profound-cat-a609de.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-lightBlue underline"
            >
              Poets of Tomorrow’s World: gameOn(e)
            </a>
          </li>
        </ul>
      </section>
    </main>
  );
}
