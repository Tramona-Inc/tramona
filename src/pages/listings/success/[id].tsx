import { api } from "@/utils/api";
import { type NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

const Success: NextPage = () => {
  const router = useRouter();
  const sessionId = useRouter().query.session_id as string;

  const session = api.stripe.getStripeSession.useQuery(
    { sessionId },
    {
      enabled: router.isReady,
    },
  );

  return (
    <>
      <Head>
        <title>Success!</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center">
        {session.data ? (
          <>
            {session.data.metadata ? (
              <>
                <h1>Payment Successful!</h1>
                <pre>{JSON.stringify(session.data.metadata, null, 2)}</pre>
              </>
            ) : (
              <h1>Validating payment...</h1>
            )}
          </>
        ) : (
          <h1>Loading...</h1>
        )}
      </main>
    </>
  );
};

export default Success;
