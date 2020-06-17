import { graphql } from "@octokit/graphql";
import type {
  Repository,
  IssueCommentConnection,
  IssueComment,
  Actor,
} from "./github-v4";

interface TQueryResult {
  repository: Repository;
}

export type Identifier = {
  owner: string;
  name: string;
  number: number;
};

export type Author = {
  avatarUrl: string;
  login: string;
};

export type Comment = {
  author: Author;
  body: string;
  publishedAt: Date;
};

const authorQuery = () => `
author {
  avatarUrl
  login
}
`;

const commentsQuery = (per: number) => `
comments(first: ${per}) {
  nodes {
    ${authorQuery()}
    bodyHTML
    publishedAt
  }
  pageInfo {
    hasNextPage
    endCursor
  }
}
`;

function parseDate(datestr: string) {
  return new Date(Date.parse(datestr));
}

function mapAuthorData(actor: Actor | null | undefined): Author {
  if (!actor) {
    console.debug(actor);
    throw Error("author is empty");
  }

  return {
    avatarUrl: actor.avatarUrl,
    login: actor.login,
  };
}

function mapCommentsData(comments: IssueCommentConnection) {
  const page = comments.pageInfo;
  const raws: IssueComment[] =
    comments.nodes?.filter((raw): raw is IssueComment => raw !== null) || [];
  return {
    comments: raws.map(
      (raw) =>
        ({
          author: mapAuthorData(raw.author),
          body: raw.bodyHTML,
          publishedAt: parseDate(raw.publishedAt),
        } as Comment)
    ),
    nextCommentCursor: page.hasNextPage ? page.endCursor || null : null,
  };
}

// ---------- issue ----------

type Issue = {
  identifier: Identifier;
  title: string;
  status: "open" | "closed";
  author: Author;
  body: string;
  publishedAt: Date;
  comments: Comment[];
  nextCommentCursor: string | null;
};

export async function fetchIssue(
  apiBase: string,
  apiToken: string,
  { owner, name, number }: Identifier
): Promise<Issue> {
  const per = 5;
  const raw = (
    await graphql<TQueryResult>(
      `
        query {
          repository(owner: "${owner}", name: "${name}") {
            issue(number: ${number}) {
              number
              title
              closed
              publishedAt
              ${authorQuery()}
              bodyHTML
              ${commentsQuery(per)}
            }
          }
        }
      `,
      {
        baseUrl: apiBase,
        headers: {
          authorization: `token ${apiToken}`,
        },
      }
    )
  ).repository.issue;
  if (!raw) {
    console.debug(raw);
    throw Error("request issue failed");
  }
  if (!raw.author) {
    console.debug(raw);
    throw Error("issue author is empty");
  }

  return {
    identifier: { owner, name, number },
    title: raw.title,
    status: raw.closed ? "closed" : "open",
    author: raw.author,
    body: raw.bodyHTML,
    publishedAt: parseDate(raw.publishedAt),
    ...mapCommentsData(raw.comments),
  };
}

// ---------- pull-request ----------

type PullRequest = {
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

export async function fetchPullRequest(
  apiBase: string,
  apiToken: string,
  { owner, name, number }: Identifier
): Promise<PullRequest> {
  const per = 5;
  const raw = (
    await graphql<TQueryResult>(
      `
        query {
          repository(owner: "${owner}", name: "${name}") {
            pullRequest(number: ${number}) {
              number
              title
              baseRefName
              headRefName
              merged
              closed
              isDraft
              publishedAt
              ${authorQuery()}
              bodyHTML
              ${commentsQuery(per)}
            }
          }
        }
      `,
      {
        baseUrl: apiBase,
        headers: {
          authorization: `token ${apiToken}`,
        },
      }
    )
  ).repository.pullRequest;
  if (!raw) {
    console.debug(raw);
    throw Error("request pullrequest failed");
  }
  if (!raw.author) {
    console.debug(raw);
    throw Error("issue author is empty");
  }

  return {
    identifier: { owner, name, number },
    title: raw.title,
    baseRefName: raw.baseRefName,
    headRefName: raw.headRefName,
    status: (() => {
      if (raw.merged) return "merged";
      if (raw.isDraft) return "draft";
      if (raw.closed) return "closed";
      return "open";
    })(),
    author: raw.author,
    body: raw.bodyHTML,
    publishedAt: parseDate(raw.publishedAt),
    ...mapCommentsData(raw.comments),
  };
}
