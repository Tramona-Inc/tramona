import type { NextApiRequest, NextApiResponse } from 'next';
import { env } from "@/env";
import { prisma } from "@/server/db";
import { appRouter } from "@/server/api/root";
import { createTRPCContext } from "@/server/api/trpc";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { code, state } = req.query;

  if (!code || typeof code !== 'string') {
    return res.status(400).json({ message: 'Missing code parameter' });
  }

  try {
    // Create a context and caller for tRPC
    const ctx = await createTRPCContext({ req, res });
    const caller = appRouter.createCaller(ctx);

    // Exchange the code for an access token
    const tokenResponse = await caller.pms.exchangeOwnerRezCodeForToken({
      clientId: env.OWNERREZ_CLIENT_ID,
      clientSecret: env.OWNERREZ_CLIENT_SECRET,
      code,
      redirectUri: `${env.NEXTAUTH_URL}/api/ownerrez-callback`,
    });

    // Store the access token in your database
    // Note: You might need to adjust this based on your user authentication method
    const user = await prisma.user.update({
      where: { id: ctx.session?.user.id },
      data: {
        ownerRezAccessToken: tokenResponse.access_token,
        ownerRezUserId: tokenResponse.user_id.toString(),
      },
    });

    // Redirect the user to the appropriate page
    res.redirect('/host?integration=success');
  } catch (error) {
    console.error('Error in OwnerRez callback:', error);
    res.redirect('/host?integration=error');
  }
}