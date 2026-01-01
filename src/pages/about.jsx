import { Link } from "react-router";

export default function AboutPage() {
  return (
    <main className="relative flex flex-col items-center justify-center gap-10 p-10">
      <h2 className="text-center text-4xl font-bold">
        Interactive Stories Platform
      </h2>
      <p className="text-xl">
        A platform to create interactive stories with multiple choices and
        outcomes.
      </p>
      <p className="text-lg">
        Learn more about the project{" "}
        <a
          href="https://medium.com/@dimterion/text-adventure-games-creation-tool-385667ac8904"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-lightBlue underline"
        >
          here
        </a>{" "}
        and{" "}
        <a
          href="https://medium.com/@dimterion/text-adventure-games-creation-tool-progress-update-4e2bd0524d03"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-lightBlue underline"
        >
          here
        </a>
        .
      </p>
      <Link
        to="/"
        className="hover:bg-softWhite hover:text-deepBlue w-md max-w-full border-3 px-6 py-2 text-center text-lg uppercase transition-all"
      >
        Home page
      </Link>
      <Link
        to="/story-editor"
        className="hover:bg-softWhite hover:text-deepBlue w-md max-w-full border-3 px-6 py-2 text-center text-lg uppercase transition-all"
      >
        Start creating
      </Link>
      <Link
        to="/story-player"
        className="hover:bg-softWhite hover:text-deepBlue w-md max-w-full border-3 px-6 py-2 text-center text-lg uppercase transition-all"
      >
        Start playing
      </Link>
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
      <p className="text-lg">
        P.S.: I have also made a couple of Interactive text adventure gams which
        you can check{" "}
        <a
          href="https://poets-of-tomorrows-world.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-lightBlue underline"
        >
          here
        </a>{" "}
        and{" "}
        <a
          href="https://profound-cat-a609de.netlify.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-lightBlue underline"
        >
          here
        </a>
        .
      </p>
    </main>
  );
}
