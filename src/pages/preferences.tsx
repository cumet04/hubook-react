import React, { useContext, useState } from "react";
import css from "./preferences.module.css";
import Icon from "@mdi/react";
import { mdiViewSplitHorizontal, mdiViewSplitVertical } from "@mdi/js";
import * as Config from "../services/config";
import { GithubClientContext, LayoutStoreContext } from "../contexts";
import { CreateGithubClient } from "../services/github";

function LayoutRadioItem({
  value,
  current,
  setter,
  children,
}: {
  value: "H" | "V";
  current: "H" | "V";
  setter: React.Dispatch<React.SetStateAction<"H" | "V">>;
  children: (JSX.Element | string)[];
}) {
  return (
    <div className={css.radio_item}>
      <input
        type="radio"
        name="layout"
        id={`radio_layout_${value}`}
        value={value}
        checked={current == value}
        onChange={() => setter(value)}
        className={css.radio_input}
      ></input>
      <label htmlFor={`radio_layout_${value}`} className={css.radio_label}>
        {children}
      </label>
    </div>
  );
}

export default function Setting() {
  const config = Config.value();
  const [layout, setLayout] = useState(config.layout);
  const [apiBase, setApiBase] = useState(config.github.apiBase);
  const [apiToken, setApiToken] = useState(config.github.apiToken);

  const ghcContext = useContext(GithubClientContext);
  const layoutContext = useContext(LayoutStoreContext);

  const [isDirty, setIsDirty] = useState(false);
  function d<T>(f: React.Dispatch<React.SetStateAction<T>>) {
    return ((v: T) => {
      f(v);
      setIsDirty(true);
    }) as React.Dispatch<React.SetStateAction<T>>;
  }
  const save = () => {
    Config.set({
      github: {
        apiBase,
        apiToken,
      },
      layout,
    });
    layoutContext.set(layout);
    ghcContext.set(CreateGithubClient(apiBase, apiToken));
    setIsDirty(false);
  };

  return (
    <article className={css.root}>
      <section className={css.section}>
        <h1 className={css.title}>Appearance</h1>

        <div className={css.field}>
          <h2 className={css.label}>Layout</h2>
          <LayoutRadioItem value="H" current={layout} setter={d(setLayout)}>
            Horizontal
            <Icon path={mdiViewSplitHorizontal} size="60px" color="gray" />
          </LayoutRadioItem>
          <LayoutRadioItem value="V" current={layout} setter={d(setLayout)}>
            Vertical
            <Icon path={mdiViewSplitVertical} size="60px" color="gray" />
          </LayoutRadioItem>
        </div>
      </section>

      <section className={css.section}>
        <h1 className={css.title}>GitHub API</h1>

        <div className={css.field}>
          <h2 className={css.label}>API Endpoint</h2>
          <input
            type="text"
            className={css.input}
            value={apiBase}
            onChange={(e) => d(setApiBase)(e.target.value)}
            placeholder="https://api.github.com or https://your.ghe.com/api"
          ></input>
        </div>

        <div className={css.field}>
          <h3 className={css.label}>API Token</h3>
          <input
            type="text"
            className={css.input}
            value={apiToken}
            onChange={(e) => d(setApiToken)(e.target.value)}
            placeholder="12345abcde12345abcde12345abcde12345abcde"
          ></input>
        </div>
      </section>

      <footer className={css.actions}>
        <button
          className={`${css.save} ${isDirty ? css.active : ""}`}
          disabled={!isDirty}
          onClick={save}
        >
          Save
        </button>
      </footer>
    </article>
  );
}
