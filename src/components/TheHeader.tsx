import React from "react";
import { Link } from "react-router-dom";
import css from "./TheHeader.module.css";
import { mdiCog } from "@mdi/js";
import Icon from "@mdi/react";

export default function TheHeader() {
  return (
    <header className={css.root}>
      <Link to="/" className={css.title}>
        hubook
      </Link>
      <div className={css.spacer}></div>
      <Link to="/preferences" className={css.preferences}>
        <Icon path={mdiCog} color="dimgray" />
      </Link>
    </header>
  );
}
