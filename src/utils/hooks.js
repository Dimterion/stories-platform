import { useEffect } from "react";

export function useBodyScrollLock(locked) {
  useEffect(() => {
    if (!locked) return;

    const scrollY = window.scrollY;
    const { style } = document.body;

    style.position = "fixed";
    style.top = `-${scrollY}px`;
    style.width = "100%";
    style.overflow = "hidden";

    return () => {
      const y = style.top;
      style.position = "";
      style.top = "";
      style.width = "";
      style.overflow = "";
      window.scrollTo(0, parseInt(y || "0", 10) * -1);
    };
  }, [locked]);
}
