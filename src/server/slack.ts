import { env } from "@/env";
import { WebClient } from "@slack/web-api";

const slack = new WebClient(env.SLACK_TOKEN);

export function sendSlackMessage(
  text: string,
  { channel = "tramona-bot" } = {},
) {
  void slack.chat.postMessage({ text, channel });
}
