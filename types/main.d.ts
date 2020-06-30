declare namespace App {
  type Identifier = {
    owner: string;
    name: string;
    number: number | null;
  };

  type Author = {
    avatarUrl: string;
    login: string;
  };

  type Comment = {
    id: string;
    author: Author;
    body: string;
    publishedAt: Date;
  };

  type Repository = {
    type: "Repository";
    id: string;
    identifier: Identifier;
    name: string;
    owner: Author;
    url: string;
  };

  type Issue = {
    type: "Issue";
    id: string;
    identifier: Identifier;
    title: string;
    status: "open" | "closed";
    author: Author;
    body: string;
    publishedAt: Date;
    comments: Comment[];
    nextCommentCursor: string | null;
  };

  type PullRequest = {
    type: "PullRequest";
    id: string;
    identifier: Identifier;
    title: string;
    baseRefName: string;
    headRefName: string;
    status: "open" | "draft" | "merged" | "closed";
    author: Author;
    body: string;
    publishedAt: Date;
    comments: Comment[];
    nextCommentCursor: string | null;
  };

  type Notification = {
    id: string;
    updatedAt: Date;
    title: string;
    type: "Issue" | "PullRequest" | "RepositoryInvitation";
    subjectIdentifier: Identifier;
  };
}
