import { Routes, Route } from "react-router";
import HomePage from "./pages/home";
import StoryPlayerPage from "./pages/storyPlayer";
import StoryEditorPage from "./pages/storyEditor";
import AboutPage from "./pages/about";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/story-player" element={<StoryPlayerPage />} />
      <Route path="/story-editor" element={<StoryEditorPage />} />
      <Route path="/about" element={<AboutPage />} />
    </Routes>
  );
}
