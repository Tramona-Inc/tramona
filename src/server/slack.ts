import { env } from "@/env";
import { WebClient } from "@slack/web-api";

const slack = new WebClient(env.SLACK_TOKEN);

type Channel = "superhog-bot" | "tramona-bot" | "host-bot";

const channelIdMap = {
  "superhog-bot": "C07HT5B0FKJ",
  "tramona-bot": "C06MW57TU6N",
  "host-bot": "C07H794S24U",
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
