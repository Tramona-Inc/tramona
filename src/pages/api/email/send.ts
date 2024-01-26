import { EmailTemplateProps } from "@/components/ambassador/EmailTemplate";
import type { NextApiRequest, NextApiResponse } from "next";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const bodyData = req.body as EmailTemplateProps;

    console.log("API", bodyData);

    // const { data, error } = await resend.emails.send({
    //   from: "Ambassador Form <onboarding@resend.dev>",
    //   to: ["info@tramona.com"],
    //   subject: "New Ambassador Program Application",
    //   text: "Applications",
    //   react: EmailTemplate(bodyData),
    // });

    // if (error) {
    //   return res.status(400).json(error);
    // }

    // res.status(200).json(data);
    res.status(200);
  } catch (error) {
    // console.error(error);
    // res.status(500).json({ error: "Internal Server Error" });
  }
};
