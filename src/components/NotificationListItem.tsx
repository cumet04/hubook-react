import React, { useState, useEffect } from "react";
import css from "./NotificationListItem.module.css";
import UseGithubClient from "../services/github";
import Icon from "@mdi/react";
import {
  mdiAlertCircleOutline,
  mdiSourcePull,
  mdiSourceMerge,
  mdiEmailOutline,
} from "@mdi/js";

const GithubClient = UseGithubClient();

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

  useEffect(() => {
    const id = props.notification.subjectIdentifier;
    switch (n.type) {
      case "Issue":
        GithubClient.fetchIssue(id)?.then((issue) => setSubject(issue));
        break;
      case "PullRequest":
        GithubClient.fetchPullRequest(id)?.then((pullreq) =>
          setSubject(pullreq)
        );
        break;
      case "RepositoryInvitation":
        GithubClient.fetchRepository(id)?.then((repo) => setSubject(repo));
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

  const selectedClass = props.isSelected ? ` ${css.current}` : "";
  return (
    <li onClick={props.onClick} className={css.item + selectedClass}>
      <div className={css.head}>
        {iconPath && <Icon path={iconPath} size="24px" color={iconColor} />}
      </div>
      <div className={css.title} title={n.title}>
        {n.title}
      </div>
      <div className={css.subtitle}>{subtitle(n.subjectIdentifier)}</div>
    </li>
  );
}
