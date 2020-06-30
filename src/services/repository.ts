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

const authorQuery = () => `
author {
  avatarUrl
  login
}
`;

const commentsQuery = (per: number) => `
comments(first: ${per}) {
  nodes {
    id
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

async function query(base: string, token: string, q: string) {
  const result = await graphql<TQueryResult>(q, {
    baseUrl: base,
    headers: {
      authorization: `token ${token}`,
    },
  });
  return result.repository;
}

function parseDate(datestr: string) {
  return new Date(Date.parse(datestr));
}

function mapAuthorData(actor: Actor | null | undefined): App.Author {
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
          id: raw.id,
          author: mapAuthorData(raw.author),
          body: raw.bodyHTML as string,
          publishedAt: parseDate(raw.publishedAt),
        } as App.Comment)
    ),
    nextCommentCursor: page.hasNextPage ? page.endCursor || null : null,
  };
}

export async function fetchRepository(
  apiBase: string,
  apiToken: string,
  { owner, name }: App.Identifier
): Promise<App.Repository> {
  const q = `
    query {
      repository(owner: "${owner}", name: "${name}") {
        id
        name
        owner {
          avatarUrl
          login
        }
        url
      }
    }
  `;
  const raw = await query(apiBase, apiToken, q);
  if (!raw) {
    console.debug(raw);
    throw Error("request repository failed");
  }

  return {
    type: "Repository",
    id: raw.id,
    identifier: { owner, name, number: null },
    name: raw.name,
    owner: mapAuthorData(raw.owner),
    url: raw.url,
  };
}

export async function fetchIssue(
  apiBase: string,
  apiToken: string,
  { owner, name, number }: App.Identifier
): Promise<App.Issue> {
  const per = 5;
  const q = `
    query {
      repository(owner: "${owner}", name: "${name}") {
        issue(number: ${number}) {
          id
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
  `;
  const raw = (await query(apiBase, apiToken, q)).issue;
  if (!raw) {
    console.debug(raw);
    throw Error("request issue failed");
  }

  return {
    type: "Issue",
    id: raw.id,
    identifier: { owner, name, number },
    title: raw.title,
    status: raw.closed ? "closed" : "open",
    author: mapAuthorData(raw.author),
    body: raw.bodyHTML,
    publishedAt: parseDate(raw.publishedAt),
    ...mapCommentsData(raw.comments),
  };
}

export async function fetchPullRequest(
  apiBase: string,
  apiToken: string,
  { owner, name, number }: App.Identifier
): Promise<App.PullRequest> {
  const per = 5;
  const q = `
    query {
      repository(owner: "${owner}", name: "${name}") {
        pullRequest(number: ${number}) {
          id
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
  `;
  const raw = (await query(apiBase, apiToken, q)).pullRequest;
  if (!raw) {
    console.debug(raw);
    throw Error("request pullrequest failed");
  }

  return {
    type: "PullRequest",
    id: raw.id,
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
    author: mapAuthorData(raw.author),
    body: raw.bodyHTML,
    publishedAt: parseDate(raw.publishedAt),
    ...mapCommentsData(raw.comments),
  };
}
