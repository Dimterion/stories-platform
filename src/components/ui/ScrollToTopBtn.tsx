import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";

export default function ScrollBtn() {
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }

  function handleScroll() {
    setShowScrollBtn(window.scrollY > 0);
  }

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <button
      className={`bg-softWhite fixed right-3 bottom-3 z-10 cursor-pointer opacity-70 transition-all duration-300 hover:opacity-100 active:scale-95 ${
        showScrollBtn ? "block" : "hidden"
      }`}
      onClick={() => scrollToTop()}
      aria-label="Scroll to top"
    >
      <ChevronUp />
    </button>
  );
}
