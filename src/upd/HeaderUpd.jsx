import { BookOpenCheck, Pencil } from "lucide-react";
import NavBtn from "./NavBtnUpd";

export default function Header({ activeTab, setActiveTab }) {
  return (
    <header className="flex flex-wrap justify-between p-1">
      <h1 className="text-sm font-bold sm:text-base">
        Interactive Story Platform
      </h1>
      <nav className="flex flex-wrap gap-2">
        <NavBtn
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          tab="play"
          icon={<BookOpenCheck className="size-4 sm:size-fit" />}
          label="Play Stories"
          activeColor="text-[#669bbc]"
        />
        <NavBtn
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          tab="create"
          icon={<Pencil className="size-4 sm:size-fit" />}
          label="Create Stories"
          activeColor="text-[#669bbc]"
        />
      </nav>
    </header>
  );
}
