import React, { useState, useEffect } from "react";
import CreateGithubClient from "../services/github";

import MarkdownContent from "../components/MarkdownContent";

const GithubClient = CreateGithubClient();

type PropType = {
  notification: App.Notification;
};

export default function IssueDetail(props: PropType) {
  const [pullreq, setPullreq] = useState<App.PullRequest | null>(null);

  useEffect(() => {
    GithubClient.fetchPullRequest(
      props.notification.subjectIdentifier
    )?.then((pullreq) => setPullreq(pullreq));
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
