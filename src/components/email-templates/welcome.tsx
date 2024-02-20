import {
  Container,
  Head,
  Hr,
  Html,
  Section,
  Tailwind,
  Text,
  Preview,
  Button,
  Link,
} from "@react-email/components";
import TramonaIcon from "../_icons/TramonaIcon";

export default function VerifyEmailLink({
  name,
  url,
}: {
  name: string | null;
  url: string;
}) {
  return (
    <Html lang="en">
      <Head>
        <title>Welcome</title>
      </Head>
      <Preview>Referal Amount</Preview>;
      <Tailwind>
        <Container className="bg-slate mx-auto my-[40px] w-[465px] rounded border border-solid border-[#eaeaea] bg-slate-200  p-10">
          <div className="flex flex-row items-center gap-x-4">
            <TramonaIcon />
            <h3>Tramona</h3>
          </div>
          <div className="mt-4 rounded bg-white p-8">
            <div>
              <h3>Welcome to Tramona!</h3>
              <Text>Hi {name},</Text>
              <Text>
                Your referral network is paying off. You just earned $() from a
                referral. Your total earned is now $().
              </Text>
              <Text>
                Thanks,
                <br />
                Tramona Team
              </Text>
            </div>

            <Button
              className="items-center rounded bg-[#2563EB] px-10 
              py-3 text-center text-sm text-white"
              href={url}
            >
              Check your cash back balance
            </Button>
            {url}
          </div>

          <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />
          <Text>
            Questions or faq? Contact us at <Link>info@tramona.com</Link> If
            you'd rather not receive this kind of email, Don't want any more
            emails from Tramona?
            <Link> Unsubcribe.</Link>
          </Text>
          <Text>© 2024 Tramona</Text>
        </Container>
      </Tailwind>
    </Html>
  );
}
