import { useContext, useEffect } from "react";
import { MetadataContext, type Metadata } from "./MetadataContext";

export function useBodyScrollLock(locked: boolean): void {
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

export function useMetadata({ title, description }: Metadata): void {
  const setMetadata = useContext(MetadataContext);

  if (!setMetadata) {
    throw new Error(
      "useMetadata must be used within a MetadataContext.Provider",
    );
  }

  useEffect(() => {
    setMetadata({ title, description });
    return () => {
      setMetadata({});
    };
  }, [title, description, setMetadata]);
}
