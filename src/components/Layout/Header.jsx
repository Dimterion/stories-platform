import { Link } from "react-router";
import { BookOpenCheck, Pencil } from "lucide-react";
import NavbarLink from "../ui/NavbarLink";

export default function Header() {
  return (
    <header className="bg-darkBlue flex flex-wrap justify-between p-2">
      <Link to="/">
        <h1 className="text-lg font-bold italic sm:text-xl">ISP</h1>
      </Link>
      <nav className="flex flex-wrap gap-3">
        <NavbarLink
          tab="story-player"
          icon={<BookOpenCheck className="size-4" />}
          label="Play"
          activeColor="text-lightBlue"
        />
        <NavbarLink
          tab="story-editor"
          icon={<Pencil className="size-4" />}
          label="Create"
          activeColor="text-lightBlue"
        />
      </nav>
    </header>
  );
}
