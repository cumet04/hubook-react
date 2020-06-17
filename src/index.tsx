import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "ress";
import "./index.css";

import { fetchIssue, fetchPullRequest } from "./services/issue";
import { fetchNotifications } from "./services/notification";

const { apiBase, apiToken } = JSON.parse(
  localStorage.getItem("hubook-settings") || "{}"
);
if (apiBase && apiToken) {
  // dummy code
  fetchNotifications(apiBase, apiToken).then((resp) => {
    console.log(resp);

    const first = resp.notifications[0];
    if (first.type == "PullRequest") {
      fetchPullRequest(apiBase, apiToken, first.subjectIdentifier).then(
        (issue) => {
          console.log(issue);
        }
      );
    } else if (first.type == "Issue") {
      fetchIssue(apiBase, apiToken, first.subjectIdentifier).then((issue) => {
        console.log(issue);
      });
    }
  });
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://www.snowpack.dev/#hot-module-replacement
if (import.meta.hot) {
  import.meta.hot.accept();
}
