import React from 'react';
import {Route, Switch, useLocation} from 'react-router-dom';

import Index from './pages/index';
import Preferences from './pages/preferences';
import TheHeader from './components/TheHeader';

const routes = [
  {
    path: '/preferences',
    component: Preferences,
    title: 'Preferences',
  },
];

export default function App() {
  const current = useLocation().pathname;
  const title = routes.find(r => r.path === current)?.title;

  if (current === '/') {
    return (
      <div className="h-screen flex flex-col">
        <div className="flex-shrink-0">
          <TheHeader></TheHeader>
        </div>
        <main className="min-h-0">
          <Index></Index>
        </main>
      </div>
    );
  } else {
    return (
      <>
        <TheHeader></TheHeader>
        <main className="max-w-5xl mx-auto pt-1 pb-4">
          <h1 className="text-base text-gray-600 mb-4">{title}</h1>
          <Switch>
            {routes.map(r => (
              <Route exact path={r.path} key={r.path}>
                <r.component />
              </Route>
            ))}
          </Switch>
        </main>
      </>
    );
  }
}
