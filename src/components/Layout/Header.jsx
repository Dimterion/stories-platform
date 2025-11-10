import { BookOpenCheck, Pencil } from "lucide-react";
import NavBtn from "./NavBtn";

export default function Header({ activeTab, setActiveTab }) {
  return (
    <header className="flex items-center justify-between bg-gray-800 p-4">
      <h1 className="font-bold sm:text-xl">Interactive Story Platform</h1>
      <nav className="flex flex-wrap justify-end gap-4">
        <NavBtn
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          tab="play"
          icon={<BookOpenCheck />}
          label="Play Stories"
          activeColor="bg-blue-600"
        />
        <NavBtn
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          tab="create"
          icon={<Pencil />}
          label="Create Stories"
          activeColor="bg-green-600"
        />
      </nav>
    </header>
  );
}
