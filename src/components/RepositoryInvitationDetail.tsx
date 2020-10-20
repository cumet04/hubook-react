import React, { useState, useEffect, useContext } from "react";
import { GithubClientContext } from "../contexts";
import styled from "styled-components";

type PropType = {
  notification: App.Notification;
};

export default function IssueDetail(props: PropType) {
  const [repo, setRepo] = useState<App.Repository | null>(null);

  const ghClient = useContext(GithubClientContext).value;
  useEffect(() => {
    ghClient
      ?.fetchRepository(props.notification.subjectIdentifier)
      ?.then((repo) => setRepo(repo));
  }, [props.notification.id]);

  return repo ? (
    <Root>
      <Text>{repo.owner.login} invited you to collaborate</Text>
      <TextLink href={`${repo.url}/invitations`} target="_blank">
        Go to invitation page
      </TextLink>
    </Root>
  ) : (
    <article></article>
  );
}

const Root = styled.article`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Text = styled.p`
  font-size: 1.8rem;
  margin-bottom: 12px;
`;

const TextLink = styled.a`
  color: whitesmoke;
  background-color: mediumseagreen;
  padding: 4px 12px;
  border-radius: 4px;

  &:hover {
    text-decoration: none;
  }
`;
