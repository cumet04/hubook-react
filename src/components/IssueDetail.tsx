import React, { useState, useEffect } from "react";
import CreateGithubClient from "../services/github";

import MarkdownContent from "../components/MarkdownContent";

const GithubClient = CreateGithubClient();

type PropType = {
  notification: App.Notification;
};

export default function IssueDetail(props: PropType) {
  const [issue, setIssue] = useState<App.Issue | null>(null);

  useEffect(() => {
    GithubClient.fetchIssue(
      props.notification.subjectIdentifier
    )?.then((issue) => setIssue(issue));
  }, [props.notification.id]);

  if (issue) {
    return (
      <article>
        <header>{issue.title}</header>
        <MarkdownContent content={issue.body}></MarkdownContent>
      </article>
    );
  } else return <article></article>;
}
