import React from "react";

import MarkdownContent from "../components/MarkdownContent";

type PropType = {
  comment: App.Comment;
};

export default function IssueComment(props: PropType) {
  const c = props.comment;
  return (
    <li
      className="relative p-3 border-gray-400"
      style={{ paddingLeft: "56px" }}
    >
      <img
        className="w-10 h-10 absolute left-0"
        src={c.author.avatarUrl}
        alt={c.author.login}
      />
      <div className="text-gray-600 text-sm mb-2">
        <span className="font-bold mr-1">{c.author.login}</span>
        <span>commented at {c.publishedAt.toLocaleString()}</span>
      </div>
      <MarkdownContent content={c.body}></MarkdownContent>
    </li>
  );
}
