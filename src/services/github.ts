import { fetchIssue, fetchPullRequest } from "./issue";
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

function createClient() {
  const { apiBase, apiToken } = JSON.parse(
    localStorage.getItem("hubook-settings") || "{}"
  );

  const issueCache = new Cache<App.Issue>((issue: App.Issue) =>
    identifierKey(issue.identifier)
  );
  const issuePullReq = new Cache<App.PullRequest>((pullreq: App.PullRequest) =>
    identifierKey(pullreq.identifier)
  );

  return {
    fetchNotifications(since?: Date) {
      if (!apiBase || !apiToken) return null;
      return fetchNotifications(apiBase, apiToken, since);
    },
    fetchIssue(identifier: App.Identifier, force?: boolean) {
      if (!apiBase || !apiToken) return null;
      return issueCache.fetch(identifierKey(identifier), !!force, async () =>
        fetchIssue(apiBase, apiToken, identifier)
      );
    },
    fetchPullRequest(identifier: App.Identifier, force?: boolean) {
      if (!apiBase || !apiToken) return null;
      return issuePullReq.fetch(identifierKey(identifier), !!force, async () =>
        fetchPullRequest(apiBase, apiToken, identifier)
      );
    },
  };
}

let client: ReturnType<typeof createClient>;

export default function UseGithubClient() {
  if (!client) {
    client = createClient();
  }
  return client;
}
