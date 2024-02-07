import { appRouter } from "@/server/api/root";
import type { NextApiHandler } from "next";
import { nextHandler } from "trpc-playground/handlers/next";

const setupHandler = nextHandler({
  router: appRouter,
  trpcApiEndpoint: "/api/trpc",
  playgroundEndpoint: "/api/test/playground",
  request: {
    superjson: true,
  },
});

const handler: NextApiHandler = async (req, res) => {
  const playgroundHandler = await setupHandler;
  await playgroundHandler(req, res);
};

export default handler;
