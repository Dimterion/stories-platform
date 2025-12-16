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
        className="border-3 px-6 py-2 text-lg transition-all hover:bg-[#fdf0d5] hover:text-[#003049]"
      >
        Home page
      </Link>
    </main>
  );
}
