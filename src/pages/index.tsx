import React, { useState, useEffect } from "react";
import css from "./index.module.css";
import UseGithubClient from "../services/github";

import NotificationListItem from "../components/NotificationListItem";
import IssueDetail from "../components/IssueDetail";
import PullRequestDetail from "../components/PullRequestDetail";

function detailDom(notification: App.Notification | null) {
  if (notification?.type == "Issue") {
    return <IssueDetail notification={notification} />;
  } else if (notification?.type == "PullRequest") {
    return <PullRequestDetail notification={notification} />;
  }
  return null;
}

const GithubClient = UseGithubClient();

export default function Index() {
  const [notifications, setNotifications] = useState<App.Notification[]>([]);
  const [selected, setSelected] = useState<number>(-1);

  useEffect(() => {
    GithubClient.fetchNotifications()?.then((resp) => {
      setNotifications(resp.notifications);
    });
  }, []);

  const select = (n: number) => {
    return () => setSelected(n);
  };

  // MEMO: Draggable & inner-scrollable split pane is too hard to me ...
  const listHeight = "40%";
  const separaterHeight = "24px";

  return (
    <div className={css.root}>
      <div className={css.notifications} style={{ height: listHeight }}>
        <ol className={css.list}>
          {notifications.map((item, i) => (
            <NotificationListItem
              notification={item}
              key={item.id}
              isSelected={i == selected}
              onClick={select(i)}
            />
          ))}
        </ol>
      </div>
      <div style={{ height: separaterHeight }}></div>
      {notifications[selected] && (
        <div
          className={css.content}
          style={{ height: `calc(100% - ${listHeight} - ${separaterHeight})` }}
        >
          {detailDom(notifications[selected])}
        </div>
      )}
    </div>
  );
}
