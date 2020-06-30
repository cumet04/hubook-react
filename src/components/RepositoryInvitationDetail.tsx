import React, { useState, useEffect } from "react";
import css from "./RepositoryInvitationDetail.module.css";
import UseGithubClient from "../services/github";

const GithubClient = UseGithubClient();

type PropType = {
  notification: App.Notification;
};

export default function IssueDetail(props: PropType) {
  const [repo, setRepo] = useState<App.Repository | null>(null);

  useEffect(() => {
    GithubClient.fetchRepository(
      props.notification.subjectIdentifier
    )?.then((repo) => setRepo(repo));
  }, [props.notification.id]);

  if (repo) {
    return (
      <article className={css.root}>
        <p className={css.text}>
          {repo.owner.login} invited you to collaborate
        </p>
        <a
          href={`${repo.url}/invitations`}
          target="_blank"
          className={css.link}
        >
          Go to invitation page
        </a>
      </article>
    );
  } else return <article></article>;
}
