import { Link } from "react-router";

export default function NotFoundPage() {
  return (
    <main className="relative flex flex-col items-center justify-center gap-10">
      <h2 className="text-center text-4xl font-bold">Page not found</h2>
      <Link
        to="/"
        className="border-3 px-6 py-2 text-lg transition-all hover:bg-[#fdf0d5] hover:text-[#003049]"
      >
        Home page
      </Link>
    </main>
  );
}
