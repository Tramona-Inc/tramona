import type { User } from "@/server/db/schema";
import * as React from "react";
import { Form1Values } from "./forms/form1";
import { Form2Values } from "./forms/form2";

export type EmailTemplateProps = {
  values: Partial<Form1Values & Form2Values>;
  user: User;
};

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  values,
  user,
}) => (
  <div>
    <h1>Host onboarding application</h1>
    <h2>Applicant Name: {user.name}</h2>

    <h3>Personal Info</h3>
    <p>Email: {values.email}</p>
    <p>Phone: {values.phone_num}</p>

    <h3>Listings</h3>
    {values.listings ? (
      <>
        {values.listings.map((listing) => (
          <div key={listing.url}>
            <strong>Type: {listing.type}</strong>
            <p>{listing.details}</p>
            <p>
              Link:{" "}
              <a href={listing.url} target="_blank">
                {listing.url}
              </a>
            </p>
          </div>
        ))}
      </>
    ) : (
      <p>No listings entered.</p>
    )}

    <h1>User Session info</h1>
    <p>{user.id}</p>
    <p>{user.email}</p>
    <p>{user.name}</p>
    <p>{user.phoneNumber}</p>
    <p>{user.role}</p>
    <p>{user.referralCodeUsed}</p>
  </div>
);
