import React from "react";
import ReactDOM from "react-dom";
import { GithubClientProvider } from "./contexts";
import App from "./App";
import "ress";
import "./index.css";

ReactDOM.render(
  <React.StrictMode>
    <GithubClientProvider>
      <App />
    </GithubClientProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://www.snowpack.dev/#hot-module-replacement
if (import.meta.hot) {
  import.meta.hot.accept();
}
