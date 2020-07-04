import React, { useState, useEffect, CSSProperties, useContext } from "react";
import css from "./index.module.css";
import { GithubClientContext, LayoutStoreContext } from "../contexts";

import NotificationListItem from "../components/NotificationListItem";
import IssueDetail from "../components/IssueDetail";
import PullRequestDetail from "../components/PullRequestDetail";
import RepositoryInvitationDetail from "../components/RepositoryInvitationDetail";

export default function Index() {
  const [notifications, setNotifications] = useState<App.Notification[]>([]);
  const [selected, setSelected] = useState<number>(-1);

  const ghClient = useContext(GithubClientContext).value;
  useEffect(() => {
    ghClient?.fetchNotifications()?.then((resp) => {
      setNotifications(resp.notifications);
    });
  }, [ghClient]);

  const select = (n: number) => {
    return () => setSelected(n);
  };

  // MEMO: Draggable & inner-scrollable split pane is too hard to me ...
  const layoutContext = useContext(LayoutStoreContext);
  const listSize = "40%";
  const separaterSize = "24px";
  const detailSize = `calc(100% - ${listSize} - ${separaterSize})`;
  let rStyle, nStyle, sStyle, dStyle; // root, notifications, separater, detail
  if (layoutContext.value == "H") {
    rStyle = { width: "1000px", flexDirection: "column" } as CSSProperties; // hack for type error
    nStyle = { height: listSize };
    sStyle = { height: separaterSize };
    dStyle = { height: detailSize };
  } else {
    rStyle = {
      width: "calc(100vw - 2 * 24px)",
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
