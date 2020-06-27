import React, { useState, useEffect } from "react";
import css from "./NotificationListItem.module.css";
import UseGithubClient from "../services/github";
import Icon from "@mdi/react";
import { mdiAlertCircleOutline, mdiSourcePull, mdiSourceMerge } from "@mdi/js";

const GithubClient = UseGithubClient();

type PropType = {
  notification: App.Notification;
  isSelected: boolean;
  onClick: (event: React.MouseEvent<HTMLLIElement>) => void;
};

function subtitle(id: App.Identifier) {
  return `${id.owner}/${id.name} #${id.number}`;
}

export default function NotificationListItem(props: PropType) {
  const n = props.notification;
  const [subject, setSubject] = useState<App.Issue | App.PullRequest>();

  useEffect(() => {
    if (n.type == "Issue") {
      GithubClient.fetchIssue(
        props.notification.subjectIdentifier
      )?.then((issue) => setSubject(issue));
    } else {
      GithubClient.fetchPullRequest(
        props.notification.subjectIdentifier
      )?.then((pullreq) => setSubject(pullreq));
    }
  }, [props.notification.id]);

  const iconPath = (() => {
    if (!subject) return undefined;
    if (n.type == "Issue") {
      return mdiAlertCircleOutline;
    } else if (n.type == "PullRequest") {
      return subject.status == "merged" ? mdiSourceMerge : mdiSourcePull;
    }
  })();
  const iconColor = {
    open: "green",
    closed: "red",
    draft: "gray",
    merged: "purple",
    "": undefined,
  }[subject?.status || ""];

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
