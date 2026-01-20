import { Routes, Route } from "react-router";
import { Toaster } from "sonner";
import ScrollToTop from "./components/scrollToTop";
import ScrollToTopBtn from "./components/ScrollToTopBtn";
import Header from "./upd/LayoutUpd/HeaderUpd";
import HomePage from "./pages/home";
import StoryPlayerPage from "./pages/storyPlayer";
import StoryEditorPage from "./pages/storyEditor";
import AboutPage from "./pages/about";
import NotFoundPage from "./pages/notFound";
import Footer from "./upd/LayoutUpd/FooterUpd";

export default function App() {
  return (
    <>
      <ScrollToTop />
      <ScrollToTopBtn />
      <Toaster position="top-right" richColors closeButton />
      <div className="font-scienceGothic border-darkBlue from-deepBlue to-darkBlue text-softWhite flex min-h-screen flex-col justify-between border-x-4 bg-radial from-40%">
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
    </>
  );
}
