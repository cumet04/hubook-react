import React from "react";
import css from "./index.module.css";
import { fetchNotifications, Notification } from "../services/notification";

import NotificationListItem from "../components/NotificationListItem";
import IssueDetail from "../components/IssueDetail";
import PullRequestDetail from "../components/PullRequestDetail";

type PropType = {};

type StateType = {
  notifications: Notification[];
};

export default class extends React.Component<PropType, StateType> {
  constructor(props: PropType) {
    super(props);
    this.state = {
      notifications: [],
    };
  }

  componentDidMount() {
    const { apiBase, apiToken } = JSON.parse(
      localStorage.getItem("hubook-settings") || "{}"
    );
    if (apiBase && apiToken) {
      fetchNotifications(apiBase, apiToken).then((resp) => {
        this.setState({
          notifications: resp.notifications,
        });
      });
    }
  }

  render() {
    const items = this.state.notifications;
    const selected = items[0] || null;
    let detailDom;
    if (selected?.type == "Issue") {
      detailDom = <IssueDetail notification={selected} />;
    } else if (selected?.type == "PullRequest") {
      detailDom = <PullRequestDetail notification={selected} />;
    }
    return (
      <div>
        <div className={css.notifications}>
          <h1 className={css.title}>notifications</h1>
          <ol className={css.list}>
            {items.map((item) => (
              <NotificationListItem notification={item} key={item.id} />
            ))}
          </ol>
        </div>
        <div className={css.content}>{detailDom}</div>
      </div>
    );
  }
}
