import { Link } from "react-router";
import { BookOpenCheck, ExternalLink, House, Pencil } from "lucide-react";
import { useMetadata } from "../utils/hooks";

export default function AboutPage() {
  useMetadata({
    title: "Stories Platform | About",
  });

  return (
    <main className="flex flex-col items-center justify-center gap-8 p-10 text-center sm:gap-10">
      <h2 className="text-2xl italic sm:text-4xl">
        Interactive Stories Platform
      </h2>
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
      <h3 className="text-xl font-bold">Learn more about the project</h3>
      <section className="flex flex-wrap gap-10">
        <article className="border-darkBlue bg-softWhite text-deepBlue flex w-full max-w-[300px] flex-col items-center justify-center gap-2 border p-4">
          <p>
            I've described the project, its main purpose, features, and
            functionality in the following article:
          </p>
          <a
            href="https://medium.com/@dimterion/text-adventure-games-creation-tool-385667ac8904"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:bg-softWhite hover:text-deepBlue bg-darkBlue text-softWhite inline-flex w-full items-center justify-around gap-1 border p-2"
          >
            Creating the platform
            <ExternalLink className="size-4 shrink-0" />
          </a>
        </article>
        <article className="border-darkBlue bg-softWhite text-deepBlue flex w-full max-w-[300px] flex-col items-center justify-center gap-2 border p-4">
          <p>
            In this article I've talked about my approach to developing the
            project and adding new features:
          </p>
          <a
            href="https://medium.com/@dimterion/text-adventure-games-creation-tool-progress-update-4e2bd0524d03"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:bg-softWhite hover:text-deepBlue bg-darkBlue text-softWhite inline-flex w-full items-center justify-around gap-1 border p-2"
          >
            Progress update
            <ExternalLink className="size-4 shrink-0" />
          </a>
        </article>
      </section>
      <section>
        <h3 className="mb-4 text-xl font-bold">
          Visit the project's GitHub repository for more information and
          updates.
        </h3>
        <a
          href="https://github.com/Dimterion/stories-platform"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-lightBlue flex items-center justify-center gap-1 underline"
        >
          Interactive Stories Platform (GitHub repo){" "}
          <ExternalLink className="size-4 shrink-0" />
        </a>
      </section>
      <section className="mx-2 flex flex-col items-center gap-2">
        <h3 className="mb-4 text-xl font-bold">Questions or feedback?</h3>
        <a
          href="https://linktr.ee/dimterion"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-lightBlue flex items-center gap-1 underline"
        >
          Profile links <ExternalLink className="size-4 shrink-0" />
        </a>
        <a
          href="https://www.dimterion.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-lightBlue flex items-center gap-1 underline"
        >
          My main site <ExternalLink className="size-4 shrink-0" />
        </a>
      </section>
      <section>
        <h3 className="mb-4 text-xl font-bold">Other related projects</h3>
        <p>I have also made a couple of interactive text adventure games:</p>
        <ul className="mx-auto mt-4 max-w-fit list-disc space-y-1 text-left">
          <li>
            <a
              href="https://poets-of-tomorrows-world.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-lightBlue flex items-center gap-1 underline"
            >
              Poets of Tomorrow’s World{" "}
              <ExternalLink className="size-4 shrink-0" />
            </a>
          </li>
          <li>
            <a
              href="https://profound-cat-a609de.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-lightBlue flex items-center gap-1 underline"
            >
              Poets of Tomorrow’s World: gameOn(e){" "}
              <ExternalLink className="size-4 shrink-0" />
            </a>
          </li>
        </ul>
      </section>
    </main>
  );
}
