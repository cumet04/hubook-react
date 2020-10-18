import React, { useState, useEffect, useContext } from "react";
import { GithubClientContext } from "../contexts";

import IssueComment from "../components/IssueComment";
import styled from "styled-components";

type PropType = {
  notification: App.Notification;
};

export default function IssueDetail(props: PropType) {
  const [issue, setIssue] = useState<App.Issue | null>(null);

  const ghClient = useContext(GithubClientContext).value;
  useEffect(() => {
    ghClient
      ?.fetchIssue(props.notification.subjectIdentifier)
      ?.then((issue) => setIssue(issue));
  }, [props.notification.id]);

  const statusText = "opened this issue";
  const timeText = issue?.publishedAt.toLocaleString();

  return issue ? (
    <article>
      <Info>
        <Author>{issue.author.login}</Author>
        <span>{`${statusText} at ${timeText}`}</span>
      </Info>
      <ol>
        <IssueComment comment={issue}></IssueComment>
        {issue.comments.map((item) => (
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
