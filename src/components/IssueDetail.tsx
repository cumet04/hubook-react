import React, {useState, useEffect, useContext} from 'react';
import {GithubClientContext} from '../contexts';

import IssueComment from '../components/IssueComment';

type PropType = {
  notification: App.Notification;
};

export default function IssueDetail(props: PropType) {
  const [issue, setIssue] = useState<App.Issue | null>(null);

  const ghClient = useContext(GithubClientContext).value;
  useEffect(() => {
    ghClient
      ?.fetchIssue(props.notification.subjectIdentifier)
      ?.then(issue => setIssue(issue));
  }, [props.notification.id]);

  const statusText = 'opened this issue';
  const timeText = issue?.publishedAt.toLocaleString();

  return issue ? (
    <article>
      <div className="text-gray-600 text-sm mb-2">
        <span className="font-bold mr-1">{issue.author.login}</span>
        <span>{`${statusText} at ${timeText}`}</span>
      </div>
      <ol className="divide-y">
        <IssueComment comment={issue}></IssueComment>
        {issue.comments.map(item => (
          <IssueComment comment={item} key={item.id}></IssueComment>
        ))}
      </ol>
    </article>
  ) : (
    <article></article>
  );
}
