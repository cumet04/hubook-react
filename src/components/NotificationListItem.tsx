import React from "react";

type PropType = {
  notification: App.Notification;
  onClick: (event: React.MouseEvent<HTMLLIElement>) => void;
};

export default function NotificationListItem(props: PropType) {
  const n = props.notification;
  return (
    <li onClick={props.onClick}>
      <p>{n.title}</p>
    </li>
  );
}
