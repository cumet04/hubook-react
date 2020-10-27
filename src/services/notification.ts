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

function parseNotification(raw: NotificationData): App.Notification | null {
  // MEMO: I have no idea what notification type can have as value,
  // and these case are only what I have been seen.
  let number: number | null = null;
  switch (raw.subject.type) {
    case "Issue":
    case "PullRequest":
      number = parseInt(raw.subject.url.split("/").pop() || ""); // TODO: fix hack
    case "RepositoryInvitation":
      break;
    // case "Release":
    //   break;
    // case "CheckSuite":
    //   break;
    default:
      console.error(
        `unsupported notification subject type: ${raw.subject.type}`
      );
      return null;
  }

  return {
    // Mark as Read API require notification id (thread_id) as number,
    // so this `id` may has value of number.
    id: parseInt(raw.id),
    updatedAt: parseDate(raw.updated_at),
    title: raw.subject.title,
    type: raw.subject.type,
    subjectIdentifier: {
      owner: raw.repository.owner.login,
      name: raw.repository.name,
      number: number,
    },
    unread: raw.unread,
  };
}

export async function fetchNotifications(
  apiBase: string,
  apiToken: string,
  since?: Date
) {
  const op = Object.assign(
    { all: true },
    since ? { since: since.toISOString() } : {}
  );
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
    notifications: res.data
      .map((raw) => parseNotification(raw))
      .filter<App.Notification>((n): n is App.Notification => !!n),
  };
}

export async function markReadNotification(
  apiBase: string,
  apiToken: string,
  targetId: number
) {
  const res = await octokit(apiBase, apiToken).activity.markThreadAsRead({
    thread_id: targetId,
  });
  if (res.status != 205) {
    console.debug(res);
    throw Error("mark as read notification failed");
  }
}

// MEMO: Currently, GitHub provides no API to mark as unread, mark/unmark as Done/Save.
// https://github.com/octokit/rest.js/issues/1232
// https://github.community/t/notification-save-for-later-via-rest-api/13944
