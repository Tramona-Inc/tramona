import { env } from "@/env";
import { WebClient } from "@slack/web-api";

const slack = new WebClient(env.SLACK_TOKEN);
const channel = "tramona-bot";

export function sendSlackMessage(...messageLines: string[]) {
  // dont await it, user shouldnt have to wait for our slack bot
  // if it doesnt work then oh well
  void slack.chat.postMessage({
    text: messageLines.join("\n"),
    channel,
  });
}
