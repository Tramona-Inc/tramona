import type { NextApiRequest, NextApiResponse } from 'next';
import { env } from "@/env";
import { appRouter } from "@/server/api/root";
import { createTRPCContext } from "@/server/api/trpc";
import { TRPCError } from '@trpc/server';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("OwnerRez callback handler triggered");

  if (req.method !== 'GET') {
    console.log("Invalid method:", req.method);
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { code, state } = req.query;
  console.log("Received query parameters:", { code, state });

  if (!code || typeof code !== 'string') {
    console.log("Missing or invalid code parameter");
    return res.status(400).json({ message: 'Missing code parameter' });
  }

  try {
    console.log("Creating tRPC context");
    const ctx = await createTRPCContext({ req, res });

    // Create a caller
    const caller = appRouter.createCaller(ctx);

    console.log("Exchanging code for token");
    const tokenResponse = await caller.pms.exchangeOwnerRezCodeForToken({
      clientId: env.OWNERREZ_CLIENT_ID,
      clientSecret: env.OWNERREZ_CLIENT_SECRET,
      code,
      redirectUri: `${env.NEXTAUTH_URL}/api/ownerrez-callback`,
    });
    console.log("Token response received:", tokenResponse);

    console.log("Creating host profile");
    await caller.users.createHostProfile({
      ownerRezBearerToken: tokenResponse.access_token.toString(),
      ownerRezAccountId: tokenResponse.user_id.toString(),
    });
    console.log("Host profile created");

    console.log("Redirecting to success page");
    res.redirect('/host?integration=success');
  } catch (error) {
    console.error('Error in OwnerRez callback:', error);
    if (error instanceof TRPCError) {
      console.error('TRPC Error:', error.code, error.message);
    }
    console.log("Redirecting to error page");
    res.redirect('/host?integration=error');
  }
}