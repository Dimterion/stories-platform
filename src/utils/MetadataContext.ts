import { createContext } from "react";

export type Metadata = {
  title?: string;
  description?: string;
};

export type MetadataContextValue = (meta: Metadata) => void;

export const MetadataContext = createContext<MetadataContextValue | null>(null);
