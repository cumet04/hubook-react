import React, { useState, useEffect, CSSProperties } from "react";
import css from "./index.module.css";
import UseGithubClient from "../services/github";

import NotificationListItem from "../components/NotificationListItem";
import IssueDetail from "../components/IssueDetail";
import PullRequestDetail from "../components/PullRequestDetail";
import RepositoryInvitationDetail from "../components/RepositoryInvitationDetail";

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
  const listSize = "40%";
  const separaterSize = "24px";
  const detailSize = `calc(100% - ${listSize} - ${separaterSize})`;
  let rStyle, nStyle, sStyle, dStyle; // root, notifications, separater, detail
  if (true) {
    // TODO: setting UI
    rStyle = { width: "1000px", flexDirection: "column" } as CSSProperties; // hack for type error
    nStyle = { height: listSize };
    sStyle = { height: separaterSize };
    dStyle = { height: detailSize };
  } else {
    rStyle = {
      width: "100vw",
      padding: "0 24px",
      flexDirection: "row",
    } as CSSProperties;
    nStyle = { width: listSize };
    sStyle = { width: separaterSize };
    dStyle = { width: detailSize };
  }

  const DetailComponent = {
    Issue: IssueDetail,
    PullRequest: PullRequestDetail,
    RepositoryInvitation: RepositoryInvitationDetail,
  }[notifications[selected]?.type];

  return (
    <div className={css.root} style={rStyle}>
      <div className={css.notifications} style={nStyle}>
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
      <div style={sStyle}></div>
      {notifications[selected] && (
        <div className={css.content} style={dStyle}>
          <DetailComponent notification={notifications[selected]} />
        </div>
      )}
    </div>
  );
}
