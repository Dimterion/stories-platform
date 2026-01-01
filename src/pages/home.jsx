import { Link } from "react-router";

export default function HomePage() {
  return (
    <main className="flex flex-col items-center gap-10">
      <h1 className="text-center text-4xl italic">
        Interactive Stories Platform
      </h1>
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
    </main>
  );
}
