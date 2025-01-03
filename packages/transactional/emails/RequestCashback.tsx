import { Heading, Hr, Section, Text, Link } from "@react-email/components";
import TramonaIcon from "@/components/_icons/TramonaIcon";
import { type ReferralCashback } from "@/components/account/cashback/referrals";
import { formatCurrency } from "@/utils/utils";
import { formatDate } from "date-fns";
import { Layout } from "./EmailComponents";

export default function RequestCashback({
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
    <Layout title_preview="New cashback request">
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
            <Text className="text-sm text-muted-foreground">{`Payment of ${formatCurrency(transaction.offer.totalBasePriceBeforeFees!)} (${formatDate(transaction.createdAt, "MM/dd/yyyy")})`}</Text>

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
    </Layout>
  );
}
