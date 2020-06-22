import React, { useState, useEffect } from "react";
import { fetchIssue } from "../services/issue";

import MarkdownContent from "../components/MarkdownContent";

type PropType = {
  notification: App.Notification;
};

export default function IssueDetail(props: PropType) {
  const [issue, setIssue] = useState<App.Issue | null>(null);

  useEffect(() => {
    const { apiBase, apiToken } = JSON.parse(
      localStorage.getItem("hubook-settings") || "{}"
    );
    fetchIssue(
      apiBase,
      apiToken,
      props.notification.subjectIdentifier
    ).then((issue) => setIssue(issue));
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
