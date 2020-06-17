import React from "react";
import css from "./App.module.css";

interface AppProps {}

function App({}: AppProps) {
  return (
    <div>
      <header className={css.header}>
        <span>hubook</span>
      </header>
    </div>
  );
}

export default App;
