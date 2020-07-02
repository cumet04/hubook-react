import React, { useEffect, useContext } from "react";
import { BrowserRouter, Route, Switch, useLocation } from "react-router-dom";
import { GithubClientContext } from "./contexts";
import { CreateGithubClient } from "./services/github";
import css from "./App.module.css";

import Index from "./pages/index";
import Preferences from "./pages/preferences";
import TheHeader from "./components/TheHeader";

const routes = [
  {
    path: "/",
    component: Index,
    title: "Notifications",
  },
  {
    path: "/preferences",
    component: Preferences,
    title: "Preferences",
  },
];

function PageHeader() {
  // extract as a component from App for useLocation
  const title = routes.find((r) => r.path == useLocation().pathname)?.title;
  return <div className={css.title}>{title}</div>;
}

export default function App() {
  const ghcContext = useContext(GithubClientContext);
  useEffect(() => ghcContext.set(CreateGithubClient()), []);

  return (
    <BrowserRouter>
      <div>
        <TheHeader></TheHeader>
        <main className={css.main}>
          <PageHeader />
          <Switch>
            {routes.map((r) => (
              <Route exact path={r.path} key={r.path}>
                <r.component />
              </Route>
            ))}
          </Switch>
        </main>
      </div>
    </BrowserRouter>
  );
}
