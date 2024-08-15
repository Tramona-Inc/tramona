import { env } from "@/env";
import { WebClient } from "@slack/web-api";

const slack = new WebClient(env.SLACK_TOKEN);

type Channel = "superhog-bot" | "tramona-bot" | "host-bot";

const channelIdMap = {
  "superhog-bot": "C07HT5B0FKJ",
  "tramona-bot": "C06MW57TU6N",
  "host-bot": "C07H794S24U",
};

export async function sendSlackMessage({
  channel = "tramona-bot",
  text,
}: {
  channel?: Channel;
  text: string;
}) {
  await slack.conversations.join({ channel: channelIdMap[channel] });
  await slack.chat.postMessage({
    text: text,
    channel: channel,
  });
}
