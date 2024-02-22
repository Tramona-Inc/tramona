import ContactForm, {
  type ContactFormProps,
} from "@/components/email-templates/ContactForm";
import type { NextApiRequest, NextApiResponse } from "next";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  // try {
  //   const bodyData = req.body as ContactFormProps;

  //   const { data, error } = await resend.emails.send({
  //     from: `${bodyData.values.name} - Contact Form <onboarding@resend.dev>`,
  //     to: "info@tramona.com",
  //     subject: "User needs Support",
  //     text: "Contact Form",
  //     react: ContactForm(bodyData),
  //   });

  //   if (error) {
  //     return res.status(400).json(error);
  //   }

  //   res.status(200).json(data);
  // } catch (error) {
  //   res.status(500).json({ error: "Internal Server Error" });
  // }

  try {
    const bodyData = req.body as ContactFormProps;
    // console.log(bodyData);

    const { data, error } = await resend.emails.send({
      from: bodyData.values.email,
      // from: `${bodyData.values.name} - Contact Form <onboarding@resend.dev>`,
      // from: bodyData.values.email,
      // from: "info@tramona.com",
      to: "info@tramona.com",
      subject: "User needs Support",
      text: "Contact Form",
      react: ContactForm(bodyData),
    });

    if (error) {
      return res.status(400).json(error);
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("Error:", error);
    console.log(req.body as ContactFormProps);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
