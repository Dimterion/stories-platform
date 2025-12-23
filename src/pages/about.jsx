import { Link } from "react-router";

export default function AboutPage() {
  return (
    <main className="relative flex flex-col items-center justify-center gap-10">
      <h2 className="text-center text-4xl font-bold">
        Interactive Stories Platform
      </h2>
      <p>
        A platform to create interactive stories with multiple choices and
        outcomes.
      </p>
      <Link
        to="/"
        className="hover:bg-softWhite hover:text-deepBlue border-3 px-6 py-2 text-lg transition-all"
      >
        Home page
      </Link>
    </main>
  );
}
