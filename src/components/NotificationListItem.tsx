import React from "react";
import type { Notification } from "../services/notification";

type PropType = {
  notification: Notification;
};

type StateType = {};

export default class extends React.Component<PropType, StateType> {
  constructor(props: PropType) {
    super(props);
  }

  render() {
    const n = this.props.notification;
    return (
      <li>
        <p>{n.title}</p>
      </li>
    );
  }
}
