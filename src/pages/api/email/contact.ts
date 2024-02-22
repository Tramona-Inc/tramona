import ContactForm, {
  type ContactFormProps,
} from "@/components/email-templates/ContactForm";
import type { NextApiRequest, NextApiResponse } from "next";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // from: `${bodyData.values.name} - Contact Form <onboarding@resend.dev>`,
    // from: bodyData.values.email,

    const bodyData = req.body as ContactFormData;
    console.log("RECEIVED DATA FROM CLIENT: ", bodyData);
    // if (!email) {
    //   return res.status(400).json({ error: "Invalid request body" });
    // }

    // console.log(values + " before " );

    // if (!values || typeof values !== "object" || !values.email) {
    //   return res.status(400).json({ error: "Invalid request body" });
    // }

    const { data, error } = await resend.emails.send({
      // from: bodyData.email,
      from: "onboarding@resend.dev",
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
