import { Octokit } from "@octokit/rest";
import type { ActivityListNotificationsForAuthenticatedUserResponseData } from "@octokit/types";

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

// extract type of octokit().activity.listNotificationsForAuthenticatedUser().data
const _notificationTypeDataFunc = () =>
  ([] as ActivityListNotificationsForAuthenticatedUserResponseData)[0];
type NotificationData = ReturnType<typeof _notificationTypeDataFunc>;

function parseNotification(raw: NotificationData): App.Notification {
  // MEMO: I have no idea what notification type can have as value,
  // and these case are only what I have been seen.
  let number: number | null = null;
  switch (raw.subject.type) {
    case "Issue":
    case "PullRequest":
      number = parseInt(raw.subject.url.split("/").pop() || ""); // TODO: fix hack
    case "RepositoryInvitation":
      break;
    default:
      throw Error("notification subject type is unexpected");
  }

  return {
    id: raw.id,
    updatedAt: parseDate(raw.updated_at),
    title: raw.subject.title,
    type: raw.subject.type,
    subjectIdentifier: {
      owner: raw.repository.owner.login, // TODO: org?
      name: raw.repository.name,
      number: number,
    },
  };
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
    notifications: res.data.map((raw) => parseNotification(raw)),
  };
}
