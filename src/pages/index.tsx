import React from "react";
import { fetchNotifications, Notification } from "../services/notification";

import NotificationListItem from "../components/NotificationListItem";

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
    return (
      <div>
        <ol>
          {items.map((item) => (
            <NotificationListItem notification={item} key={item.id} />
          ))}
        </ol>
      </div>
    );
  }
}
