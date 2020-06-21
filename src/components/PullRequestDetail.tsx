import React from "react";
import type { Notification } from "../services/notification";
import { fetchPullRequest, PullRequest } from "../services/issue";

import MarkdownContent from "../components/MarkdownContent";

type PropType = {
  notification: Notification;
};

type StateType = {
  pullrequest: PullRequest | null;
};

export default class extends React.Component<PropType, StateType> {
  constructor(props: PropType) {
    super(props);
    this.state = { pullrequest: null };
  }

  componentDidMount() {
    const { apiBase, apiToken } = JSON.parse(
      localStorage.getItem("hubook-settings") || "{}"
    );
    fetchPullRequest(
      apiBase,
      apiToken,
      this.props.notification.subjectIdentifier
    ).then((pr) => {
      this.setState({
        pullrequest: pr,
      });
    });
  }

  render() {
    const pr = this.state.pullrequest;
    if (pr) {
      return (
        <article>
          <header>{pr.title}</header>
          <MarkdownContent content={pr.body}></MarkdownContent>
        </article>
      );
    } else return <article></article>;
  }
}
