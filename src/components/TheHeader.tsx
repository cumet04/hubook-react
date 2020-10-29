import React from "react";
import { Link } from "react-router-dom";
import { mdiCog } from "@mdi/js";
import Icon from "@mdi/react";

export default function TheHeader() {
  const prefHoverStyle =
    "rounded-full transition-colors duration-200 bg-white hover:bg-gray-400";
  return (
    <header
      className="flex items-center h-12 px-6 border-solid border-gray-400"
      style={{ borderBottomWidth: "1px" }}
    >
      <Link to="/" className="text-lg">
        hubook
      </Link>
      <div className="flex-grow"></div>
      <Link
        to="/preferences"
        className={`grid place-items-center w-8 h-8 ${prefHoverStyle}`}
      >
        <Icon path={mdiCog} color="dimgray" className="w-6 h-6 inset-auto" />
      </Link>
    </header>
  );
}
