import { BookOpenCheck, Pencil } from "lucide-react";
import NavBtn from "./NavBtn";

export default function Header({ activeTab, setActiveTab }) {
  return (
    <header>
      <h1>Interactive Story Platform</h1>
      <nav>
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
