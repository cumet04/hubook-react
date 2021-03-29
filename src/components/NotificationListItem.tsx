import React, {useState, useEffect, useContext} from 'react';
import {GithubClientContext} from '../contexts';
import Icon from '@mdi/react';
import {
  mdiAlertCircleOutline,
  mdiSourcePull,
  mdiSourceMerge,
  mdiEmailOutline,
} from '@mdi/js';

type PropType = {
  notification: App.Notification;
  isSelected: boolean;
  onClick: (event: React.MouseEvent<HTMLLIElement>) => void;
};

function subtitle(id: App.Identifier) {
  if (id.number !== null) {
    return `${id.owner}/${id.name} #${id.number}`;
  } else {
    return `${id.owner}/${id.name}`;
  }
}

export default function NotificationListItem(props: PropType) {
  const n = props.notification;
  const [subject, setSubject] = useState<
    App.Repository | App.Issue | App.PullRequest
  >();

  const ghClient = useContext(GithubClientContext).value;
  useEffect(() => {
    const id = props.notification.subjectIdentifier;
    if (!ghClient) return;
    switch (n.type) {
      case 'Issue':
        ghClient.fetchIssue(id)?.then(issue => setSubject(issue));
        break;
      case 'PullRequest':
        ghClient.fetchPullRequest(id)?.then(pullreq => setSubject(pullreq));
        break;
      case 'RepositoryInvitation':
        ghClient.fetchRepository(id)?.then(repo => setSubject(repo));
        break;
    }
  }, [props.notification.id]);

  const iconPath = (() => {
    switch (subject?.type) {
      case 'Issue':
        return mdiAlertCircleOutline;
      case 'PullRequest':
        return subject.status === 'merged' ? mdiSourceMerge : mdiSourcePull;
      case 'Repository':
        return mdiEmailOutline;
    }
  })();
  const iconColor = (() => {
    switch (subject?.type) {
      case 'Issue':
      case 'PullRequest':
        return {
          open: 'green',
          closed: 'red',
          draft: 'gray',
          merged: 'purple',
        }[subject.status];
      case 'Repository':
        return 'black';
    }
  })();

  const [unread, setUnread] = useState(n.unread);
  const onClick = (e: React.MouseEvent<HTMLLIElement>) => {
    props.onClick(e);
    ghClient?.markReadNotification(n).then(() => setUnread(false));
  };

  const sContainer =
    'grid grid-rows-2 p-3 leading-5 border-gray-400 cursor-pointer ' +
    (props.isSelected && 'bg-indigo-100');
  return (
    <li
      className={sContainer}
      style={{gridTemplateColumns: '40px 1fr'}}
      onClick={onClick}
    >
      <div className="row-span-2">
        {iconPath && <Icon path={iconPath} size="24px" color={iconColor} />}
      </div>
      <div className={`text-ellipsis ${unread && 'font-bold'}`} title={n.title}>
        {n.title}
      </div>
      <div className="text-gray-600 text-sm">
        {subtitle(n.subjectIdentifier)}
      </div>
    </li>
  );
}
