import React from "react";

type PropType = {
  notification: App.Notification;
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
