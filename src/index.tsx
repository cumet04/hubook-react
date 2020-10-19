import React from "react";
import ReactDOM from "react-dom";
import { ContextProvider } from "./contexts";
import App from "./App";
import "ress";
import "./index.css";

ReactDOM.render(
  <React.StrictMode>
    <ContextProvider>
      <App />
    </ContextProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
