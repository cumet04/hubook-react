import React, { useState, useEffect } from "react";
import css from "./PullRequestDetail.module.css";
import UseGithubClient from "../services/github";

import IssueComment from "../components/IssueComment";

const GithubClient = UseGithubClient();

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

  const statusText =
    pullreq?.status == "merged" ? "merged into" : "wants to merge into";
  const timeText = pullreq?.publishedAt.toLocaleString();

  if (pullreq) {
    return (
      <article>
        <div className={css.info}>
          <span className={css.author}>{pullreq.author.login}</span>
          <span> {statusText} </span>
          <span className={css.code}>{pullreq.baseRefName}</span>
          <span> from </span>
          <span className={css.code}>{pullreq.headRefName}</span>
          <span> {timeText}</span>
        </div>
        <ol>
          <IssueComment comment={pullreq}></IssueComment>
          {pullreq.comments.map((item) => (
            <IssueComment comment={item} key={item.id}></IssueComment>
          ))}
        </ol>
      </article>
    );
  } else return <article></article>;
}
