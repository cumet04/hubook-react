import React, { useState, useEffect, useContext } from "react";
import { GithubClientContext, LayoutStoreContext } from "../contexts";
import styled from "styled-components";

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

  const layoutContext = useContext(LayoutStoreContext);

  const DetailComponent = {
    Issue: IssueDetail,
    PullRequest: PullRequestDetail,
    RepositoryInvitation: RepositoryInvitationDetail,
    Release: RepositoryInvitationDetail, // TODO: impl
  }[notifications[selected]?.type];

  return (
    <Root layout={layoutContext.value}>
      <Notifications>
        <List>
          {notifications.map((item, i) => (
            <NotificationListItem
              notification={item}
              key={item.id}
              isSelected={i == selected}
              onClick={select(i)}
            />
          ))}
        </List>
      </Notifications>
      <Separater />
      {notifications[selected] && (
        <Content>
          <DetailComponent notification={notifications[selected]} />
        </Content>
      )}
    </Root>
  );
}

const Root = styled.div<{ layout: "H" | "V" }>`
  display: flex;
  height: 100%;

  width: ${({ layout }) =>
    layout == "H" ? "1000px" : "calc(100vw - 2 * 24px)"};
  flex-direction: ${({ layout }) => (layout == "H" ? "column" : "row")};
`;

const List = styled.ol`
  height: 100%;
  overflow-y: scroll;

  &::-webkit-scrollbar {
    width: 5px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: lightslategray;
    border-radius: 5px;
  }
`;

// MEMO: Draggable & inner-scrollable split pane is too hard to me ...
const listSize = "40%";
const separaterSize = "24px";
const contentSize = `calc(100% - ${listSize} - ${separaterSize})`;

const Notifications = styled.div`
  height: ${listSize};
`;
const Separater = styled.div`
  height: ${separaterSize};
`;
const Content = styled.div`
  height: ${contentSize};
  border: solid 1px lightgray;
  border-radius: 5px;
  padding: 16px;
  overflow-y: scroll;
`;
