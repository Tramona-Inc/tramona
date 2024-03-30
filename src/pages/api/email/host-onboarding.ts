import {
  EmailTemplate,
  type EmailTemplateProps,
} from "@/components/HostSignUp/EmailTemplate";
import type { NextApiRequest, NextApiResponse } from "next";
import { sendEmail } from "@/server/server-utils";

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const bodyData = req.body as EmailTemplateProps;

    const to = "info@tramona.com";
    const subject = "New Ambassador Program Application";
    const content = EmailTemplate(bodyData);

    const response = await sendEmail({ to, subject, content });

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).send({ error: "Interal Server Error!" });
  }
};
