import React from "react";

type PropType = {
  notification: App.Notification;
};

export default function NotificationListItem(props: PropType) {
  const n = props.notification;
  return (
    <li>
      <p>{n.title}</p>
    </li>
  );
}
