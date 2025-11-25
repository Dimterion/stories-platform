import { BookOpenCheck, Pencil } from "lucide-react";
import NavBtn from "./NavBtnUpd";

export default function Header({ activeTab, setActiveTab }) {
  return (
    <header className="flex flex-wrap justify-between bg-[#0a122a] p-2">
      <h1 className="font-scienceGothic font-bold italic sm:text-lg">ISP</h1>
      <nav className="flex flex-wrap gap-3">
        <NavBtn
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          tab="play"
          icon={<BookOpenCheck className="size-4" />}
          label="Play"
          activeColor="text-[#669bbc]"
        />
        <NavBtn
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          tab="create"
          icon={<Pencil className="size-4" />}
          label="Create"
          activeColor="text-[#669bbc]"
        />
      </nav>
    </header>
  );
}
