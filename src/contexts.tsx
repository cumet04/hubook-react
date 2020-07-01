import React, { useState } from "react";
import type { GithubClient } from "./services/github";

type contextType<T> = {
  value: T;
  set: React.Dispatch<T>;
};
function createStore<T>(initial: T) {
  const context = React.createContext<contextType<T>>({
    value: initial,
    set: () => console.error("Uninitialized context setter is called"),
  });
  const provider = ({ children }: { children: JSX.Element }) => {
    const [value, set] = useState(initial);
    return (
      <context.Provider value={{ value, set }}>{children}</context.Provider>
    );
  };
  return {
    context,
    provider,
  };
}

const ghcStore = createStore<GithubClient | null>(null);
export const GithubClientProvider = ghcStore.provider;
export const GithubClientContext = ghcStore.context;
