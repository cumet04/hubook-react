import React from "react";
import type { Issue } from "../services/issue";

type PropType = {
  issue: Issue;
};

type StateType = {};

export default class extends React.Component<PropType, StateType> {
  constructor(props: PropType) {
    super(props);
  }

  render() {
    const issue = this.props.issue;
    return (
      <article>
        <header>{issue.title}</header>
        <div>{issue.body}</div>
      </article>
    );
  }
}
