import React, { useContext, useState } from "react";
import Icon from "@mdi/react";
import { mdiViewSplitHorizontal, mdiViewSplitVertical } from "@mdi/js";
import * as Config from "../services/config";
import { GithubClientContext, LayoutStoreContext } from "../contexts";
import { CreateGithubClient } from "../services/github";
import GithubIcon from "../assets/ico-github.png";

export default function Setting() {
  const config = Config.value();
  const [layout, setLayout] = useState(config.layout);
  const [apiBase, setApiBase] = useState(config.github.apiBase);
  const [apiToken, setApiToken] = useState(config.github.apiToken);

  const ghcContext = useContext(GithubClientContext);
  const layoutContext = useContext(LayoutStoreContext);

  const saveLayout = (value: Config.Layout) => {
    setLayout(value);
    Config.setLayout(value);
  };

  const [isDirty, setIsDirty] = useState(false);
  function d<T>(f: React.Dispatch<React.SetStateAction<T>>) {
    return ((v: T) => {
      f(v);
      setIsDirty(true);
    }) as React.Dispatch<React.SetStateAction<T>>;
  }
  const saveGithub = () => {
    Config.setGithub({
      apiBase,
      apiToken,
    });
    layoutContext.set(layout);
    ghcContext.set(CreateGithubClient(apiBase, apiToken));
    setIsDirty(false);
  };

  const buildHash = (() => {
    // raw values inserted by esbuild
    const buildHashRaw = process.env.GITHUB_SHA;
    const buildTimeRaw = process.env.BUILD_TIME;

    const hash = buildHashRaw?.slice(0, 7);
    const time = new Date(Number(buildTimeRaw)).toISOString();
    return `${hash} at ${time}`;
  })();

  return (
    <article>
      <section className={sSection}>
        <h1 className={sSectionTitle}>Appearance</h1>
        <div className={sField}>
          <h2 className={sLabel}>Layout</h2>
          {[
            { value: "H", label: "Horizontal", icon: mdiViewSplitHorizontal },
            { value: "V", label: "Vertical", icon: mdiViewSplitVertical },
          ].map((l) => (
            <div className="flex items-center mx-1 my-2">
              <input
                className="mr-3"
                type="radio"
                name="layout"
                id={`radio_layout_${l.value}`}
                value={l.value}
                checked={layout == l.value}
                onChange={() => saveLayout(l.value as Config.Layout)}
              ></input>
              <label htmlFor={`radio_layout_${l.value}`} className="w-24">
                {l.label}
                <Icon
                  /* adjust for icon itself's margin*/
                  style={{ margin: "-8px -4px" }}
                  path={l.icon}
                  size="60px"
                  color="gray"
                />
              </label>
            </div>
          ))}
        </div>
      </section>

      <section className={sSection}>
        <h1 className={sSectionTitle}>GitHub API</h1>
        <div className={sField}>
          <h2 className={sLabel}>API Endpoint</h2>
          <input
            className={sInput}
            type="text"
            value={apiBase}
            onChange={(e) => d(setApiBase)(e.target.value)}
            placeholder="https://api.github.com or https://your.ghe.com/api"
          ></input>
        </div>

        <div className={sField}>
          <h2 className={sLabel}>API Token</h2>
          <input
            className={sInput}
            type="text"
            value={apiToken}
            onChange={(e) => d(setApiToken)(e.target.value)}
            placeholder="12345abcde12345abcde12345abcde12345abcde"
          ></input>
        </div>

        <div className={sField}>
          <button
            className={
              "rounded text-gray-100 py-1 px-3 " +
              (isDirty ? "bg-green-500" : "bg-gray-500")
            }
            disabled={!isDirty}
            onClick={saveGithub}
          >
            Set
          </button>
        </div>
      </section>

      <section className={sSection}>
        <h1 className={sSectionTitle}>About</h1>
        <div className={sField}>
          <h2 className={sLabel}>Build</h2>
          <p>{buildHash}</p>
        </div>

        <div className={sField}>
          <h2 className={sLabel}>Github</h2>
          <a
            className="flex items-center"
            href="https://github.com/cumet04/hubook-react"
          >
            <img className="mr-1" src={GithubIcon} width="24px" height="24px" />
            https://github.com/cumet04/hubook-react
          </a>
        </div>
      </section>
    </article>
  );
}

const sSection = "mb-8";
const sSectionTitle = "mb-4 text-lg border-bottom-1 border-gray-400";
const sField = "mb-4";
const sLabel = "font-bold";
const sInput = "w-1/3 px-2 py-1 text-sm border border-solid border-gray-500";
