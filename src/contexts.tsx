import React, { useState } from "react";
import { GithubClient, CreateGithubClient } from "./services/github";
import * as Config from "./services/config";

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

const ghcStore = createStore<GithubClient | null>(
  (() => {
    const { apiBase, apiToken } = Config.value().github;
    if (apiBase == "" || apiToken == "") return null;
    return CreateGithubClient(apiBase, apiToken);
  })()
);
export const GithubClientContext = ghcStore.context;

const layoutStore = createStore<"H" | "V">(Config.value().layout);
export const LayoutStoreContext = layoutStore.context;

export const ContextProvider = ({ children }: { children: JSX.Element }) => {
  return (
    <ghcStore.provider>
      <layoutStore.provider>{children}</layoutStore.provider>
    </ghcStore.provider>
  );
};
