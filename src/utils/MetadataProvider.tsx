import { useEffect, useState, type ReactNode } from "react";
import { MetadataContext, type Metadata } from "./MetadataContext";

export function MetadataProvider({ children }: { children: ReactNode }) {
  const defaultTitle = "Stories Platform";
  const defaultDescription =
    "Create interactive stories with multiple choices and outcomes.";

  const [metadata, setMetadata] = useState<Metadata>({
    title: defaultTitle,
    description: defaultDescription,
  });

  useEffect(() => {
    document.title = metadata.title || defaultTitle;

    let meta = document.querySelector<HTMLMetaElement>(
      'meta[name="description"]',
    );
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
