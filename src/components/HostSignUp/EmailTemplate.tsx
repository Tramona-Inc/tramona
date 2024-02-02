import type { User } from "@/server/db/schema";
import * as React from "react";

export type EmailTemplateProps = {
  listings:
    | {
        type: string;
        details: string;
        url: string;
      }[]
    | undefined;
  email: string;
  phone_num: string;
  user: User;
};

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  listings,
  email,
  phone_num,
  user,
}) => (
  <div>
    <h1>Host onboarding application</h1>
    <h2>Applicant Name: {user.name}</h2>

    <h3>Personal Info</h3>
    <p>Email: {email}</p>
    <p>Phone: {phone_num}</p>

    <h3>Listings</h3>
    {listings ? (
      <>
        {listings.map((listing) => (
          <div key={listing.url}>
            <strong>Type: {listing.type}</strong>
            <p>{listing.details}</p>
            <p>
              Link:{" "}
              <a href={listing.url} target="_blank" rel="noreferrer">
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
