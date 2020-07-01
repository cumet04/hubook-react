import { fetchRepository, fetchIssue, fetchPullRequest } from "./repository";
import { fetchNotifications } from "./notification";

class Cache<T> {
  cache: { [key: string]: T } = {};
  keygen: (o: T) => string;

  constructor(keygen: (o: T) => string) {
    this.keygen = keygen;
  }

  async fetch(key: string, force: boolean, f: () => Promise<T>) {
    if (!force) {
      const c = this.cache[key] || undefined;
      if (c) return c;
    }
    const value = await f();
    this.cache[this.keygen(value)] = value;
    return value;
  }
}

const identifierKey = (src: App.Identifier) =>
  `${src.owner}/${src.name}/${src.number}`;

export function CreateGithubClient() {
  const { apiBase, apiToken } = JSON.parse(
    localStorage.getItem("hubook-settings") || "{}"
  );
  if (!apiBase || !apiToken) return null;

  const issueRepository = new Cache<App.Repository>((repo: App.Repository) =>
    identifierKey(repo.identifier)
  );
  const issueCache = new Cache<App.Issue>((issue: App.Issue) =>
    identifierKey(issue.identifier)
  );
  const issuePullReq = new Cache<App.PullRequest>((pullreq: App.PullRequest) =>
    identifierKey(pullreq.identifier)
  );

  return {
    fetchNotifications(since?: Date) {
      return fetchNotifications(apiBase, apiToken, since);
    },
    fetchRepository(identifier: App.Identifier, force?: boolean) {
      return issueRepository.fetch(
        identifierKey(identifier),
        !!force,
        async () => fetchRepository(apiBase, apiToken, identifier)
      );
    },
    fetchIssue(identifier: App.Identifier, force?: boolean) {
      return issueCache.fetch(identifierKey(identifier), !!force, async () =>
        fetchIssue(apiBase, apiToken, identifier)
      );
    },
    fetchPullRequest(identifier: App.Identifier, force?: boolean) {
      return issuePullReq.fetch(identifierKey(identifier), !!force, async () =>
        fetchPullRequest(apiBase, apiToken, identifier)
      );
    },
  };
}

export type GithubClient = ReturnType<typeof CreateGithubClient>;
