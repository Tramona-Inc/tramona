import { type User } from "@/server/db/schema";
import * as React from "react";

export type ContactFormProps = {
  values: {
    name: string;
    email: string;
    message: string;
  };
  user: User;
};

const ContactForm: React.FC<Readonly<ContactFormProps>> = ({
  values,
  user,
}) => (
  <div>
    <h1>Applicant Name: {values.name}</h1>
    <p>Message: {values.message}</p>
    <p>Message: {values.email}</p>

    <h1>User Session info</h1>
    <p>{user.id}</p>
    <p>{user.email}</p>
    <p>{user.name}</p>
    <p>{user.phoneNumber}</p>
    <p>{user.role}</p>
    <p>{user.referralCodeUsed}</p>
  </div>
);

export default ContactForm;
