import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import "./index.css";
import App from "./App.tsx";
import { QuestionTypeProvider } from "./context/QuestionTypeContext";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <StrictMode>
      <QuestionTypeProvider>
        <App />
      </QuestionTypeProvider>
    </StrictMode>
  </BrowserRouter>
);
