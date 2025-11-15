import { BookOpenCheck, Pencil } from "lucide-react";
import NavBtn from "./NavBtnUpd";

export default function Header({ activeTab, setActiveTab }) {
  return (
    <header className="flex flex-wrap justify-between p-1">
      <h1>Interactive Story Platform</h1>
      <nav className="flex flex-wrap gap-2">
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
