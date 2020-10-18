import React from "react";

import MarkdownContent from "../components/MarkdownContent";
import styled from "styled-components";

type PropType = {
  comment: App.Comment;
};

export default function IssueComment(props: PropType) {
  const c = props.comment;
  return (
    <Item>
      <Icon>
        <IconImg src={c.author.avatarUrl} alt={c.author.login} />
      </Icon>
      <Info>
        <Author>{c.author.login}</Author>
        <span>commented at {c.publishedAt.toLocaleString()}</span>
      </Info>
      <MarkdownContent content={c.body}></MarkdownContent>
    </Item>
  );
}

const Item = styled.li`
  position: relative;
  padding: 12px 16px 20px 56px;

  &:not(:first-of-type) {
    border-top: solid 1px lightgray;
  }
`;

const Icon = styled.div`
  width: 40px;
  height: 40px;
  position: absolute;
  left: 0;
`;

const IconImg = styled.img`
  width: 100%;
  height: 100%;
`;

const Info = styled.div`
  color: gray;
  font-size: 1.4rem;
  margin-bottom: 4px;
`;

const Author = styled.span`
  font-weight: bold;
  margin-right: 0.5rem;
`;
