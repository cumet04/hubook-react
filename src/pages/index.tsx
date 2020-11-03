import React, { useState, useEffect, useContext } from "react";
import { GithubClientContext, LayoutStoreContext } from "../contexts";

import NotificationListItem from "../components/NotificationListItem";
import IssueDetail from "../components/IssueDetail";
import PullRequestDetail from "../components/PullRequestDetail";
import RepositoryInvitationDetail from "../components/RepositoryInvitationDetail";

const LayoutContianer: React.FC<{ layout: "H" | "V" }> = ({
  children,
  layout,
}) => {
  const [List, Content] = React.Children.toArray(children);

  const baseSize = "40%";
  const sContainer = layout === "H" ? "flex-col" : "flex-row";
  const sList = layout === "H" ? { height: baseSize } : { width: baseSize };
  return (
    <div className={"h-full w-full flex " + sContainer}>
      <div className="flex-shrink-0" style={sList}>
        {List}
      </div>
      <div className="flex-grow min-h-0 min-w-0">{Content}</div>
    </div>
  );
};

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

  const layoutContext = useContext(LayoutStoreContext);

  const DetailComponent = {
    Issue: IssueDetail,
    PullRequest: PullRequestDetail,
    RepositoryInvitation: RepositoryInvitationDetail,
  }[notifications[selected]?.type];

  return (
    <LayoutContianer layout={layoutContext.value}>
      <ol className="h-full overflow-y-scroll with_thin_scrollbar">
        {notifications.map((item, i) => (
          <NotificationListItem
            notification={item}
            key={item.id}
            isSelected={i == selected}
            onClick={select(i)}
          />
        ))}
      </ol>
      {notifications[selected] && (
        <div className="w-full h-full p-4 overflow-y-scroll">
          <DetailComponent notification={notifications[selected]} />
        </div>
      )}
    </LayoutContianer>
  );
}
