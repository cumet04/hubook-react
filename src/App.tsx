import React from "react";
import { BrowserRouter, Route, Switch, useLocation } from "react-router-dom";
import styled from "styled-components";

import Index from "./pages/index";
import Preferences from "./pages/preferences";
import TheHeader, { headerHeight } from "./components/TheHeader";

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
  const current = useLocation().pathname;
  const title = routes.find((r) => r.path == current)?.title;
  return <Title>{title}</Title>;
}

export default function App() {
  return (
    <BrowserRouter basename="hubook-react">
      <div>
        <TheHeader></TheHeader>
        <Main>
          <PageHeader />
          <Switch>
            {routes.map((r) => (
              <Route exact path={r.path} key={r.path}>
                <r.component />
              </Route>
            ))}
          </Switch>
        </Main>
      </div>
    </BrowserRouter>
  );
}

const titleHeight = "40px";

const Main = styled.main`
  flex-grow: 1;
  width: fit-content;
  /* set main area height with fixed value instead of percent or flex item, for split pane */
  height: calc(100vh - ${headerHeight});
  padding-top: calc(8px + ${titleHeight});
  padding-bottom: 8px;
  margin-left: auto;
  margin-right: auto;
`;

const Title = styled.div`
  font-size: 1.4rem;
  color: gray;
  height: calc(${titleHeight} - 16px);
  margin-top: calc(-1 * ${titleHeight});
  margin-bottom: 16px;
`;
