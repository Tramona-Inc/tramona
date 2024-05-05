import {
  type EmailTemplateProps,
  EmailTemplate,
} from "@/components/ambassador/EmailTemplate";
import type { NextApiRequest, NextApiResponse } from "next";
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const bodyData = req.body as EmailTemplateProps;

    const { data, error } = await resend.emails.send({
      from: `${
        bodyData.values.firstName + " " + bodyData.values.lastName
      } - Ambassador Application <onboarding@resend.dev>`,
      to: ["info@tramona.com"],
      subject: "New Ambassador Program Application",
      text: "Applications",
      react: EmailTemplate(bodyData),
    });

    if (error) {
      return res.status(400).json(error);
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
