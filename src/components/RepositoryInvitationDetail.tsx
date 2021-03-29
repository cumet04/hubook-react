import React, {useState, useEffect, useContext} from 'react';
import {GithubClientContext} from '../contexts';

type PropType = {
  notification: App.Notification;
};

// MEMO: style not tested

export default function IssueDetail(props: PropType) {
  const [repo, setRepo] = useState<App.Repository | null>(null);

  const ghClient = useContext(GithubClientContext).value;
  useEffect(() => {
    ghClient
      ?.fetchRepository(props.notification.subjectIdentifier)
      ?.then(repo => setRepo(repo));
  }, [props.notification.id]);

  return repo ? (
    <article className="flex flex-column items-center">
      <p className="text-lg mb-6">
        {repo.owner.login} invited you to collaborate
      </p>
      <a
        className="text-white bg-green-500 px-3 py-1 rounded"
        href={`${repo.url}/invitations`}
        target="_blank"
        rel="noreferrer"
      >
        Go to invitation page
      </a>
    </article>
  ) : (
    <article></article>
  );
}
