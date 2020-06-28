import React, { useState, useEffect } from "react";
import css from "./IssueDetail.module.css";
import UseGithubClient from "../services/github";

import IssueComment from "../components/IssueComment";

const GithubClient = UseGithubClient();

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

  const statusText = "opened this issue";
  const timeText = issue?.publishedAt.toLocaleString();

  if (issue) {
    return (
      <article>
        <div className={css.info}>
          <span className={css.author}>{issue.author.login}</span>
          <span>{`${statusText} at ${timeText}`}</span>
        </div>
        <ol>
          <IssueComment comment={issue}></IssueComment>
          {issue.comments.map((item) => (
            <IssueComment comment={item} key={item.id}></IssueComment>
          ))}
        </ol>
      </article>
    );
  } else return <article></article>;
}
