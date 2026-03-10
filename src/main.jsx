import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
// import "./index.css";
import "./styles/theme.css";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: "#0f172a",
          color: "#fff",
          borderRadius: "8px",
          padding: "12px 14px"
        }
      }}
    />
  </React.StrictMode>
);