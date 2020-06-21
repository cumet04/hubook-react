import React from "react";
import type { Notification } from "../services/notification";
import { fetchIssue, Issue } from "../services/issue";

import MarkdownContent from "../components/MarkdownContent";

type PropType = {
  notification: Notification;
};

type StateType = {
  issue: Issue | null;
};

export default class extends React.Component<PropType, StateType> {
  constructor(props: PropType) {
    super(props);
    this.state = { issue: null };
  }

  componentDidMount() {
    const { apiBase, apiToken } = JSON.parse(
      localStorage.getItem("hubook-settings") || "{}"
    );
    fetchIssue(
      apiBase,
      apiToken,
      this.props.notification.subjectIdentifier
    ).then((issue) => {
      this.setState({
        issue: issue,
      });
    });
  }

  render() {
    const issue = this.state.issue;
    if (issue) {
      return (
        <article>
          <header>{issue.title}</header>
          <MarkdownContent content={issue.body}></MarkdownContent>
        </article>
      );
    } else return <article></article>;
  }
}
