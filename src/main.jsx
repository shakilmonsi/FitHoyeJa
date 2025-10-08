import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { ScaleLoader } from "react-spinners";
import App from "./App.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <ScaleLoader color="#36d7b7" />
        </div>
      }
    >
      <App />
    </Suspense>
  </StrictMode>,
);
