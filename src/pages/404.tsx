import Head from "next/head";
import Link from "next/link";

export default function Page() {
  return (
    <>
      <Head>
        <title>404 | Tramona</title>
      </Head>
      <p className="px-8 pt-32 text-center">
        404 - page not found
        <br />
        <br />
        Please{" "}
        <Link href="/support" className="underline underline-offset-2">
          contact support
        </Link>{" "}
        if this was not expected
      </p>
    </>
  );
}
