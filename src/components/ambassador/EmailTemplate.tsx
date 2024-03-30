import { type User } from "@/server/db/schema";
import * as React from "react";

export type EmailTemplateProps = {
  values: {
    firstName: string;
    lastName: string;
    college: string;
    schoolName: string;
    phone: string;
    linkedInUrl: string;
    instagram: string;
    twitter: string;
    otherSocialMedia: string;
    question1: string;
    question2: string;
    question3: string;
    question4: string;
  };
  user: User;
};

export function EmailTemplate({ values, user }: EmailTemplateProps) {
  return (
    <div>
      <h1>
        Applicant Name: {values.firstName} {values.lastName}
      </h1>

      <h1>Personal Info</h1>
      <p>In School: {values.college}</p>
      <p>College: {values.college}</p>
      <p>School/University: {values.schoolName}</p>
      <p>Phone: {values.phone}</p>
      <p>
        Linked In: <a>{values.linkedInUrl}</a>
      </p>
      <p>Instagram: {values.instagram !== "" ? values.instagram : "none"}</p>
      <p>Twitter: {values.twitter !== "" ? values.twitter : "none"}</p>
      <p>
        Other social media:{" "}
        {values.otherSocialMedia !== "" ? values.otherSocialMedia : "none"}
      </p>

      <h1>Questions</h1>
      <h3>Why do you want Ambassador Status?</h3>
      <p>{values.question1}</p>

      <h3>What is your growth strategy?</h3>
      <p>{values.question2}</p>

      <h3>Where do you plan to post your code?</h3>
      <p>{values.question3}</p>

      <h3>Anything else you think we should know?</h3>
      <p>{values.question4 !== "" ? values.question4 : "none"}</p>

      <h1>User Session info</h1>
      <p>{user.id}</p>
      <p>{user.email}</p>
      <p>{user.name}</p>
      <p>{user.phoneNumber}</p>
      <p>{user.role}</p>
      <p>{user.referralCodeUsed}</p>
    </div>
  );
}
