import React, { useState, useEffect, useContext } from "react";
import { GithubClientContext } from "../contexts";
import Icon from "@mdi/react";
import {
  mdiAlertCircleOutline,
  mdiSourcePull,
  mdiSourceMerge,
  mdiEmailOutline,
} from "@mdi/js";
import styled from "styled-components";

type PropType = {
  notification: App.Notification;
  isSelected: boolean;
  onClick: (event: React.MouseEvent<HTMLLIElement>) => void;
};

function subtitle(id: App.Identifier) {
  if (id.number != null) {
    return `${id.owner}/${id.name} #${id.number}`;
  } else {
    return `${id.owner}/${id.name}`;
  }
}

export default function NotificationListItem(props: PropType) {
  const n = props.notification;
  const [subject, setSubject] = useState<
    App.Repository | App.Issue | App.PullRequest
  >();

  const ghClient = useContext(GithubClientContext).value;
  useEffect(() => {
    const id = props.notification.subjectIdentifier;
    if (!ghClient) return;
    switch (n.type) {
      case "Issue":
        ghClient.fetchIssue(id)?.then((issue) => setSubject(issue));
        break;
      case "PullRequest":
        ghClient.fetchPullRequest(id)?.then((pullreq) => setSubject(pullreq));
        break;
      case "RepositoryInvitation":
        ghClient.fetchRepository(id)?.then((repo) => setSubject(repo));
        break;
    }
  }, [props.notification.id]);

  const iconPath = (() => {
    switch (subject?.type) {
      case "Issue":
        return mdiAlertCircleOutline;
      case "PullRequest":
        return subject.status == "merged" ? mdiSourceMerge : mdiSourcePull;
      case "Repository":
        return mdiEmailOutline;
    }
  })();
  const iconColor = (() => {
    switch (subject?.type) {
      case "Issue":
      case "PullRequest":
        return {
          open: "green",
          closed: "red",
          draft: "gray",
          merged: "purple",
        }[subject.status];
      case "Repository":
        return "black";
    }
  })();

  const [unread, setUnread] = useState(n.unread);
  const onClick = (e: React.MouseEvent<HTMLLIElement>) => {
    props.onClick(e);
    ghClient?.markReadNotification(n).then(() => setUnread(false));
  };

  return (
    <Item onClick={onClick} current={props.isSelected}>
      <Head>
        {iconPath && <Icon path={iconPath} size="24px" color={iconColor} />}
      </Head>
      <Title isNew={unread} title={n.title}>
        {n.title}
      </Title>
      <SubTitle>{subtitle(n.subjectIdentifier)}</SubTitle>
    </Item>
  );
}

const Item = styled.li<{ current: boolean }>`
  display: grid;
  grid-template-rows: 20px 20px;
  grid-template-columns: 40px 1fr;
  background-color: ${({ current }) => (current ? "lavendar" : "inherit")};

  padding: 12px;
  border-top: solid 1px lightgray;

  cursor: pointer;
`;

const Title = styled.div<{ isNew: boolean }>`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: ${({ isNew }) => (isNew ? "bold" : "inherit")};
`;

const Head = styled.div`
  grid-row: 1/3;
  grid-column: 1;
`;

const SubTitle = styled.div`
  color: gray;
  font-size: 1.4rem;
`;
