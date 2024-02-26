import {
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import TramonaIcon from "../_icons/TramonaIcon";

export function VerifyEmailLink({
  name,
  url,
}: {
  name: string | null;
  url: string;
}) {
  return (
    <Html lang="en">
      <Head>
        <title>Reset Password</title>
      </Head>
      <Tailwind>
        <Container className="mx-auto my-[40px] w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]">
          <Section className="mt-[32px]">
            <TramonaIcon />
          </Section>
          <Heading as="h1">{name && `Hi ${name},`}</Heading>
          <Text>
            {`Please click on the following link to verify your email`}
          </Text>
          <Text>
            <i>
              Please note that this link will expire in <strong>30 mins</strong>
              .
            </i>
          </Text>
          <Section className="mb-[32px] mt-[32px] text-center">
            {/* <Button
              className="rounded bg-[#7C3AED] text-center text-lg text-white no-underline"
              href={url}
            >
              Reset Password
            </Button> */}
            {url}
          </Section>
          <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />
          <Text>
            {`If you did not request this, please ignore this email and your password will remain unchanged.`}
          </Text>
          <Text>{`Thanks,`}</Text>
          <Text>
            <strong>{`Tramona Team`}</strong>
          </Text>
        </Container>
      </Tailwind>
    </Html>
  );
}
