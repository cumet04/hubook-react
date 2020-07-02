import React from "react";
import css from "./preferences.module.css";
import Icon from "@mdi/react";
import { mdiViewSplitHorizontal, mdiViewSplitVertical } from "@mdi/js";

export default function Setting() {
  return (
    <article className={css.root}>
      <section className={css.section}>
        <h1 className={css.title}>Appearance</h1>

        <div className={css.field}>
          <h2 className={css.label}>Layout</h2>
          <div className={css.radio_item}>
            <input
              type="radio"
              name="layout"
              id="radio_layout_h"
              value="h"
              className={css.radio_input}
            ></input>
            <label htmlFor="radio_layout_h" className={css.radio_label}>
              Horizontal
              <Icon path={mdiViewSplitHorizontal} size="60px" color="gray" />
            </label>
          </div>
          <div className={css.radio_item}>
            <input
              type="radio"
              name="layout"
              id="radio_layout_v"
              value="v"
              className={css.radio_input}
            ></input>
            <label htmlFor="radio_layout_v" className={css.radio_label}>
              Vertical
              <Icon path={mdiViewSplitVertical} size="60px" color="gray" />
            </label>
          </div>
        </div>
      </section>

      <section className={css.section}>
        <h1 className={css.title}>GitHub API</h1>

        <div className={css.field}>
          <h2 className={css.label}>API Endpoint</h2>
          <input
            type="text"
            className={css.input}
            placeholder="https://api.github.com or https://your.ghe.com/api"
          ></input>
        </div>

        <div className={css.field}>
          <h3 className={css.label}>API Token</h3>
          <input
            type="text"
            className={css.input}
            placeholder="12345abcde12345abcde12345abcde12345abcde"
          ></input>
        </div>
      </section>

      <footer className={css.actions}>
        <button className={`${css.save} ${css.active}`}>Save</button>
      </footer>
    </article>
  );
}
