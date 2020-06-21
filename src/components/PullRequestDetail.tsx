import React from "react";
import type { PullRequest } from "../services/issue";

type PropType = {
  pullrequest: PullRequest;
};

type StateType = {};

export default class extends React.Component<PropType, StateType> {
  constructor(props: PropType) {
    super(props);
  }

  render() {
    const pr = this.props.pullrequest;
    return (
      <article>
        <header>{pr.title}</header>
        <div>{pr.body}</div>
      </article>
    );
  }
}
