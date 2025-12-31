import { Link } from "react-router";

export default function AboutPage() {
  return (
    <main className="relative flex flex-col items-center justify-center gap-10 p-10">
      <h2 className="text-center text-4xl font-bold">
        Interactive Stories Platform
      </h2>
      <p className="text-lg">
        A platform to create interactive stories with multiple choices and
        outcomes.
      </p>
      <p>
        Learn more about the project{" "}
        <a
          href="https://medium.com/@dimterion/text-adventure-games-creation-tool-385667ac8904"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-softWhite underline"
        >
          here
        </a>{" "}
        and{" "}
        <a
          href="https://medium.com/@dimterion/text-adventure-games-creation-tool-progress-update-4e2bd0524d03"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-softWhite underline"
        >
          here
        </a>
        .
      </p>
      <p>
        Check the{" "}
        <a
          href="https://github.com/Dimterion/stories-platform"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-softWhite underline"
        >
          project's GitHub repository
        </a>{" "}
        for more information and updates.
      </p>
      <Link
        to="/"
        className="hover:bg-softWhite hover:text-deepBlue w-md max-w-full border-3 px-6 py-2 text-center text-lg transition-all"
      >
        Home page
      </Link>
      <Link
        to="/story-editor"
        className="hover:bg-softWhite hover:text-deepBlue w-md max-w-full border-3 px-6 py-2 text-center text-lg transition-all"
      >
        Start creating
      </Link>
      <Link
        to="/story-player"
        className="hover:bg-softWhite hover:text-deepBlue w-md max-w-full border-3 px-6 py-2 text-center text-lg transition-all"
      >
        Start playing
      </Link>
    </main>
  );
}
