import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/atkinson-hyperlegible-next/400.css";
import "@fontsource/atkinson-hyperlegible-next/500.css";
import "@fontsource/atkinson-hyperlegible-next/700.css";
import "@fontsource/fraunces/600.css";
import "@fontsource/fraunces/700.css";
import "./styles/tokens.css";
import "./styles/app.css";
import "./styles/tema.css";
import "./styles/identidade.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
