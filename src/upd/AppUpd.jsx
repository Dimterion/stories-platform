import { Routes, Route } from "react-router";
import Header from "./upd/HeaderUpd";
import HomePage from "./pages/home";
import StoryPlayerPage from "./pages/storyPlayer";
import StoryEditorPage from "./pages/storyEditor";
import AboutPage from "./pages/about";
import NotFoundPage from "./pages/notFound";
import Footer from "./upd/FooterUpd";

export default function App() {
  return (
    <div className="font-scienceGothic flex min-h-screen flex-col justify-between bg-[#003049] text-[#fdf0d5]">
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/story-player" element={<StoryPlayerPage />} />
        <Route path="/story-editor" element={<StoryEditorPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Footer />
    </div>
  );
}
