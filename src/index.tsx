import React from "react";
import ReactDOM from "react-dom";
import { ContextProvider } from "./contexts";
import App from "./App";
import "./index.css"; // importing tailwind's output, have esbuild minify it

ReactDOM.render(
  <React.StrictMode>
    <ContextProvider>
      <App />
    </ContextProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
