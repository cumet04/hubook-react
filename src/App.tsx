import React from "react";
import logo from "./logo.svg";
import css from "./App.module.css";

function App() {
  return (
    <div className={css.App}>
      <header className={css.App_header}>
        <img src={logo} className={css.App_logo} alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className={css.App_link}
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
