import { Link } from "react-router";

export default function HomePage() {
  return (
    <main className="flex flex-col items-center gap-10">
      <h1 className="text-center text-4xl italic">
        Interactive Stories Platform
      </h1>
      <section className="flex flex-wrap gap-4">
        <Link
          to="/story-player"
          className="hover:bg-softWhite hover:text-deepBlue mx-auto w-sm max-w-[80vw] border p-2 text-center uppercase"
        >
          Play Stories
        </Link>
        <Link
          to="/story-editor"
          className="hover:bg-softWhite hover:text-deepBlue mx-auto w-sm max-w-[80vw] border p-2 text-center uppercase"
        >
          Create Stories
        </Link>
      </section>
      <Link
        to="/about"
        className="hover:bg-softWhite hover:text-deepBlue mx-auto w-sm max-w-[80vw] border p-2 text-center uppercase"
      >
        About the platform
      </Link>
    </main>
  );
}
