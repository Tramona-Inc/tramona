import { env } from "@/env";
import { WebClient } from "@slack/web-api";

const slack = new WebClient(env.SLACK_TOKEN);

type Channel =
  | "superhog-bot"
  | "tramona-bot"
  | "host-bot"
  | "admin-messaging"
  | "chatbox"
  | "tramona-errors";

// prettier-ignore
const channelIdMap = {
  "superhog-bot": "C07HT5B0FKJ",
  "tramona-bot": "C06MW57TU6N",
  "host-bot": "C07H794S24U",
  "admin-messaging": "C07LZRBCUBX",
  "chatbox": "C07M339S811",
  "tramona-errors": "C08FFCSD16F",
};

const isProduction = process.env.NODE_ENV === "production";

export async function sendSlackMessage({
  channel = "tramona-bot",
  text,
  isProductionOnly = false,
}: {
  channel?: Channel;
  text: string;
  isProductionOnly?: boolean;
}) {
  await slack.conversations.join({ channel: channelIdMap[channel] });
  if (isProductionOnly && !isProduction) return;
  await slack.chat.postMessage({
    text: text,
    channel: channel,
  });
}
