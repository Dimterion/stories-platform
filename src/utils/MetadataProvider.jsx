import { useEffect, useState } from "react";
import { MetadataContext } from "./MetadataContext";

export function MetadataProvider({ children }) {
  const defaultTitle = "Stories Platform";
  const defaultDescription =
    "Create interactive stories with multiple choices and outcomes.";

  const [metadata, setMetadata] = useState({
    title: defaultTitle,
    description: defaultDescription,
  });

  useEffect(() => {
    document.title = metadata.title || defaultTitle;

    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }

    meta.setAttribute("content", metadata.description || defaultDescription);
  }, [metadata, defaultTitle, defaultDescription]);

  return (
    <MetadataContext.Provider value={setMetadata}>
      {children}
    </MetadataContext.Provider>
  );
}
