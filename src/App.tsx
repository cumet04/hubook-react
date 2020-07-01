import React, { useEffect, useContext } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { GithubClientContext } from "./contexts";
import { CreateGithubClient } from "./services/github";
import css from "./App.module.css";

import Index from "./pages/index";
import Setting from "./pages/setting";
import TheHeader from "./components/TheHeader";

interface AppProps {}

function App({}: AppProps) {
  const ghcContext = useContext(GithubClientContext);
  useEffect(() => ghcContext.set(CreateGithubClient()), []);

  return (
    <BrowserRouter>
      <div>
        <TheHeader></TheHeader>
        <main className={css.main}>
          <Switch>
            <Route exact path="/">
              <Index />
            </Route>
            <Route path="/setting">
              <Setting />
            </Route>
          </Switch>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
