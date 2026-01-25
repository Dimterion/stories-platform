import { Link } from "react-router";
import { House } from "lucide-react";
import { useMetadata } from "../utils/hooks";

export default function NotFoundPage() {
  useMetadata({
    title: "Stories Platform | Page not found",
  });

  return (
    <main className="relative flex flex-col items-center justify-center gap-10 p-2">
      <h2 className="text-center text-4xl font-bold">Page not found</h2>
      <p className="text-center text-lg">
        Please check the link to the page or try refreshing it.
      </p>
      <Link
        to="/"
        className="hover:bg-softWhite hover:text-deepBlue flex flex-nowrap items-center gap-2 border-3 px-6 py-2 text-lg uppercase transition-all"
      >
        <House /> Home page
      </Link>
    </main>
  );
}
