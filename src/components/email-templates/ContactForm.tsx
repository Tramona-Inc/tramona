import { type User } from "@/server/db/schema";
import * as React from "react";

export type ContactFormProps = {
  name: string;
  email: string;
  message: string;
  // user: User;
};

const ContactForm: React.FC<Readonly<ContactFormProps>> = ({
  name,
  email,
  message,
  // user,
}) => (
  <div>
    <h1>Applicant Name: {name}</h1>
    <p>Message: {message}</p>
    <p>email: {email}</p>

    <h1>User Session info</h1>
    {/* <p>{user.id}</p>
    <p>{user.email}</p>
    <p>{user.name}</p>
    <p>{user.phoneNumber}</p>
    <p>{user.role}</p>
    <p>{user.referralCodeUsed}</p> */}
  </div>
);

export default ContactForm;
