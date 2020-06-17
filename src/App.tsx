import React from "react";
import css from "./App.module.css";

import Index from "./pages/index";

function App() {
  return (
    <div>
      <header className={css.header}>
        <span>hubook</span>
      </header>
      <main className={css.main}>
        <Index />
      </main>
    </div>
  );
}

export default App;
