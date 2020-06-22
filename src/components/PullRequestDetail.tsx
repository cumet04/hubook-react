import React, { useState, useEffect } from "react";
import { fetchPullRequest } from "../services/issue";

import MarkdownContent from "../components/MarkdownContent";

type PropType = {
  notification: App.Notification;
};

export default function IssueDetail(props: PropType) {
  const [pullreq, setPullreq] = useState<App.PullRequest | null>(null);

  useEffect(() => {
    const { apiBase, apiToken } = JSON.parse(
      localStorage.getItem("hubook-settings") || "{}"
    );
    fetchPullRequest(
      apiBase,
      apiToken,
      props.notification.subjectIdentifier
    ).then((pullreq) => setPullreq(pullreq));
  }, [props.notification.id]);

  if (pullreq) {
    return (
      <article>
        <header>{pullreq.title}</header>
        <MarkdownContent content={pullreq.body}></MarkdownContent>
      </article>
    );
  } else return <article></article>;
}
