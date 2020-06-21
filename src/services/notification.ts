import { Octokit } from "@octokit/rest";

function octokit(base: string, token: string) {
  const res = new Octokit({
    baseUrl: base,
    auth: token,
  });
  return res;
}

function parseDate(datestr: string) {
  return new Date(Date.parse(datestr));
}

export async function fetchNotifications(
  apiBase: string,
  apiToken: string,
  since?: Date
) {
  const op = since ? { since: since.toISOString() } : {};
  const res = await octokit(
    apiBase,
    apiToken
  ).activity.listNotificationsForAuthenticatedUser(op);
  if (res.status != 200) {
    console.debug(res);
    throw Error("get notifications failed");
  }

  const pollInterval = (() => {
    const raw = res.headers["x-poll-interval"];
    if (raw === undefined) throw Error("x-poll-interval is not found");
    return typeof raw === "number" ? raw : parseInt(raw);
  })();

  return {
    interval: pollInterval,
    notifications: res.data.map((raw) => {
      // MEMO: This application supposes that subject type is issue or pull-req.
      // I don't know the type can be except these...
      const type = raw.subject.type;
      if (type != "Issue" && type != "PullRequest") {
        console.debug(res);
        throw Error("subject type is not issue nor pull-req");
      }

      return {
        id: raw.id,
        updatedAt: parseDate(raw.updated_at),
        lastReadAt: parseDate(raw.last_read_at),
        title: raw.subject.title,
        type: raw.subject.type,
        subjectIdentifier: {
          owner: raw.repository.owner.login, // TODO: org?
          name: raw.repository.name,
          number: parseInt(raw.subject.url.split("/").pop() || ""), // TODO: fix hack
        },
      } as App.Notification;
    }),
  };
}
