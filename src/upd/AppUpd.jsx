import { Routes, Route } from "react-router";
import HomePage from "./pages/home";
import AboutPage from "./pages/about";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
    </Routes>
  );
}
