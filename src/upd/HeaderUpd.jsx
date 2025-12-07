import { BookOpenCheck, Pencil } from "lucide-react";
import PageLink from "../components/Layout/PageLink";
import { Link } from "react-router";

export default function Header() {
  return (
    <header className="flex flex-wrap justify-between bg-[#0a122a] p-2">
      <Link to="/">
        <h1 className="font-bold italic sm:text-lg">ISP</h1>
      </Link>
      <nav className="flex flex-wrap gap-3">
        <PageLink
          tab="story-player"
          icon={<BookOpenCheck className="size-4" />}
          label="Play"
          activeColor="text-[#669bbc]"
        />
        <PageLink
          tab="story-editor"
          icon={<Pencil className="size-4" />}
          label="Create"
          activeColor="text-[#669bbc]"
        />
      </nav>
    </header>
  );
}
