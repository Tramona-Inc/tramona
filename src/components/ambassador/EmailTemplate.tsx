import * as React from "react";

export type EmailTemplateProps = {
  firstName: string;
  lastName: string;
  college: string;
  schoolName: string;
  phone: string;
  linkedInUrl: string;
  twitter: string;
  otherSocialMedia: string;
  question1: string;
  question2: string;
  question3: string;
  question4: string;
};

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  firstName,
  lastName,
  college,
  schoolName,
  phone,
  linkedInUrl,
  twitter,
  otherSocialMedia,
  question1,
  question2,
  question3,
  question4,
}) => (
  <div>
    <h1>
      Applicant Name: {firstName} {lastName}
    </h1>

    <h1>Personal Info</h1>
    <p>In School: {college}</p>
    <p>College: {college}</p>
    <p>School/University: {schoolName}</p>
    <p>Phone: {phone}</p>
    <p>
      Linked In: <a>{linkedInUrl}</a>
    </p>
    <p>Twitter: {twitter}</p>
    <p>Other social media: {otherSocialMedia}</p>

    <h1>Questions</h1>
    <h3>Why do you want Ambassador Status?</h3>
    <p>{question1}</p>

    <h3>What is your growth strategy?</h3>
    <p>{question2}</p>

    <h3>Where do you plan to post your code?</h3>
    <p>{question3}</p>

    <h3>Anything else you think we should know?</h3>
    <p>{question4}</p>
  </div>
);
