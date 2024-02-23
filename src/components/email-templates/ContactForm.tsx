import {
  Body,
  Button,
  Container,
  Column,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";
import * as React from "react";
import TramonaIcon from "../_icons/TramonaIcon";

export type ContactFormProps = {
  name: string;
  email: string;
  message: string;
};

const ContactForm: React.FC<Readonly<ContactFormProps>> = ({
  name,
  email,
  message,
}) => (
  //   <Tailwind>
  //     <div className="mx-auto my-[40px] w-[465px] rounded border border-solid border-[#eaeaea] bg-white p-[20px]">
  //       {/* <div className="bg-slate mx-auto h-fit w-fit rounded border border-solid border-[#eaeaea] bg-slate-200  p-10"> */}
  //       <div>
  //         <span className="font-bold">From: </span>
  //         {name}
  //       </div>
  //       <hr />
  //       <div className="space-y-10">
  //         <span className="mb-5 font-bold">Message: </span>
  //         <br />
  //         <br />
  //         {message}
  //       </div>
  //       <hr />
  //       <div>
  //         <span className="font-bold">Contact: </span> {email}
  //       </div>
  //     </div>
  //   </Tailwind>

  <Html>
    <Head />
    <Preview>SUPPORT</Preview>
    <Tailwind>
      <Body className="mx-auto my-auto bg-white px-2 font-sans">
        <Container className="mx-auto my-[40px] max-w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]">
          <Section className="mt-[32px]">
            {/* <TramonaIcon /> */}
            <Img
              src={"https://www.tramona.com/assets/images/tramona-logo.jpeg"}
              width="80"
              height="77"
              alt="Vercel"
              className="mx-auto my-0"
            />
          </Section>
          <Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
            <strong>User Bug Report / Feature Request</strong>
          </Heading>
          <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />
          <Text className="text-[14px] leading-[24px] text-black">
            {/* <strong>From : {name},</strong> */}
            <strong>From {name},</strong>
            <br />
          </Text>
          <Text className="text-[14px] leading-[24px] text-black">
            {message}
          </Text>
          <Section></Section>

          <div className="text-[14px]">
            Contact Info: <br />
            <Link href={email} className="text-blue-600 no-underline">
              {email}
            </Link>
          </div>

          <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />
          <Text className="text-[12px] leading-[24px] text-[#666666]">
            This is a bug report / feature request from
            <span className="text-black">{name}</span> intended to tramona team
            to acknowledge.
          </Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

export default ContactForm;
