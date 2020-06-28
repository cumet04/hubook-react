import React from "react";
import css from "./IssueComment.module.css";

import MarkdownContent from "../components/MarkdownContent";

type PropType = {
  comment: App.Comment;
};

export default function IssueComment(props: PropType) {
  const c = props.comment;
  return (
    <li className={css.item}>
      <div className={css.icon}>
        <img
          className={css.img}
          src={c.author.avatarUrl}
          alt={c.author.login}
        />
      </div>
      <div className={css.info}>
        <span className={css.author}>{c.author.login}</span>
        <span>commented at {c.publishedAt.toLocaleString()}</span>
      </div>
      <MarkdownContent content={c.body}></MarkdownContent>
    </li>
  );
}
