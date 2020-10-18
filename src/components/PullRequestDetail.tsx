import React, { useState, useEffect, useContext } from "react";
import { GithubClientContext } from "../contexts";

import IssueComment from "../components/IssueComment";
import styled from "styled-components";

type PropType = {
  notification: App.Notification;
};

export default function IssueDetail(props: PropType) {
  const [pullreq, setPullreq] = useState<App.PullRequest | null>(null);

  const ghClient = useContext(GithubClientContext).value;
  useEffect(() => {
    ghClient
      ?.fetchPullRequest(props.notification.subjectIdentifier)
      ?.then((pullreq) => setPullreq(pullreq));
  }, [props.notification.id]);

  const statusText =
    pullreq?.status == "merged" ? "merged into" : "wants to merge into";
  const timeText = pullreq?.publishedAt.toLocaleString();

  return pullreq ? (
    <article>
      <Info>
        <Author>{pullreq.author.login}</Author>
        <span> {statusText} </span>
        <Code>{pullreq.baseRefName}</Code>
        <span> from </span>
        <Code>{pullreq.headRefName}</Code>
        <span> {timeText}</span>
      </Info>
      <ol>
        <IssueComment comment={pullreq}></IssueComment>
        {pullreq.comments.map((item) => (
          <IssueComment comment={item} key={item.id}></IssueComment>
        ))}
      </ol>
    </article>
  ) : (
    <article></article>
  );
}

const Info = styled.div`
  color: gray;
  font-size: 1.4rem;
  margin-bottom: 8px;
`;

const Author = styled.span`
  font-weight: bold;
  margin-right: 0.5rem;
`;

const Code = styled.span`
  font-family: monospace;
  color: royalblue;
  background-color: aliceblue;
  padding: 2px;
  border-radius: 2px;
`;
