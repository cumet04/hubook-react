import React, {useState, useEffect, useContext} from 'react';
import {GithubClientContext} from '../contexts';

import IssueComment from '../components/IssueComment';

type PropType = {
  notification: App.Notification;
};

export default function IssueDetail(props: PropType) {
  const [pullreq, setPullreq] = useState<App.PullRequest | null>(null);

  const ghClient = useContext(GithubClientContext).value;
  useEffect(() => {
    ghClient
      ?.fetchPullRequest(props.notification.subjectIdentifier)
      ?.then(pullreq => setPullreq(pullreq));
  }, [props.notification.id]);

  const statusText =
    pullreq?.status === 'merged' ? 'merged into' : 'wants to merge into';
  const timeText = pullreq?.publishedAt.toLocaleString();

  return pullreq ? (
    <article>
      <div className="text-gray-600 text-sm mb-2">
        <span className="font-bold mr-1">{pullreq.author.login}</span>
        <span> {statusText} </span>
        <span className={sCode}>{pullreq.baseRefName}</span>
        <span> from </span>
        <span className={sCode}>{pullreq.headRefName}</span>
        <span> {timeText}</span>
      </div>
      <ol className="divide-y">
        <IssueComment comment={pullreq}></IssueComment>
        {pullreq.comments.map(item => (
          <IssueComment comment={item} key={item.id}></IssueComment>
        ))}
      </ol>
    </article>
  ) : (
    <article></article>
  );
}

const sCode = 'font-mono text-blue-600 bg-indigo-100 rounded-sm';
