import React from "react";
import css from "./NotificationListItem.module.css";
import Icon from "@mdi/react";
import { mdiAlertCircleOutline, mdiSourcePull, mdiSourceMerge } from "@mdi/js";

type PropType = {
  notification: App.Notification;
  isSelected: boolean;
  onClick: (event: React.MouseEvent<HTMLLIElement>) => void;
};

function subtitle(id: App.Identifier) {
  return `${id.owner}/${id.name} #${id.number}`;
}

export default function NotificationListItem(props: PropType) {
  const n = props.notification;
  const iconPath = mdiAlertCircleOutline; // TODO:
  const iconColor = "green"; // TODO:
  const selectedClass = props.isSelected ? ` ${css.current}` : "";
  return (
    <li onClick={props.onClick} className={css.item + selectedClass}>
      <div className={css.head}>
        <Icon path={iconPath} size="24px" color={iconColor} />
      </div>
      <div className={css.title}>{n.title}</div>
      <div className={css.subtitle}>{subtitle(n.subjectIdentifier)}</div>
    </li>
  );
}
