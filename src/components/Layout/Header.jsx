import { BookOpenCheck, Pencil } from "lucide-react";

export default function Header({ navButton }) {
  return (
    <header className="flex items-center justify-between bg-gray-800 p-4">
      <h1 className="font-bold sm:text-xl">Interactive Story Platform</h1>
      <nav className="flex flex-wrap justify-end gap-4">
        {navButton("play", <BookOpenCheck />, "Play Stories", "bg-blue-600")}
        {navButton("create", <Pencil />, "Create Stories", "bg-green-600")}
      </nav>
    </header>
  );
}
