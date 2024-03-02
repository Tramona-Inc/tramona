import {
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Section,
  Tailwind,
  Text,
  Link,
} from "@react-email/components";
import TramonaIcon from "../_icons/TramonaIcon";
import { type ReferralCashback } from "../account/cashback/referrals";
import { formatCurrency } from "@/utils/utils";
import { formatDate } from "date-fns";

export function RequestCashback({
  name,
  email,
  phoneNumber,
  transactions,
}: {
  name: string | null;
  email: string;
  phoneNumber: string | null;
  transactions: ReferralCashback[];
}) {
  return (
    <Html lang="en">
      <Head>
        <title>Request for Cashback earnings</title>
      </Head>

      <Tailwind>
        <Container className="mx-auto my-[40px] w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]">
          <Section className="mt-[32px]">
            <TramonaIcon />
          </Section>
          <Heading as="h1">{name && `Cashback request from ${name},`}</Heading>

          <Text>
            {`${name} has requested for cashback payouts on the following referral earnings:`}
          </Text>
          <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />
          <Section className="mb-[32px] mt-[32px] text-center">
            {transactions.map((transaction) => (
              <Section key={transaction.id}>
                <Text className="text-sm text-muted-foreground">{`(ID: ${transaction.id})`}</Text>
                <Text>{`${formatCurrency(transaction.cashbackEarned)} cashback from ${transaction.referee.name}'s booking`}</Text>
                <Text className="text-sm text-muted-foreground">{`Payment of ${formatCurrency(transaction.offer.totalPrice!)} (${formatDate(transaction.createdAt, "MM/dd/yyyy")})`}</Text>

                <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />
              </Section>
            ))}
          </Section>

          <Section className="mt-[32px]">
            <Heading as="h3">{`Contact info`}</Heading>
            <Text>{`Email address:`}</Text>
            <Link href={`mailto:${email}`}>{email}</Link>

            {phoneNumber && (
              <>
                <Text>{`Contact:`}</Text>
                <Link href={`tel:${phoneNumber}`}>{phoneNumber}</Link>
              </>
            )}
          </Section>
        </Container>
      </Tailwind>
    </Html>
  );
}
