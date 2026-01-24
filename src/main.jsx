import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { MetadataProvider } from "./utils/MetadataProvider.jsx";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <MetadataProvider>
        <App />
      </MetadataProvider>
    </BrowserRouter>
  </StrictMode>,
);
