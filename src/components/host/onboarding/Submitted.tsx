import OnboardingFooter from "./OnboardingFooter";

export default function Submitted() {
  return (
    <>
      <div className="container my-10 flex flex-grow flex-col justify-center">
        <div className="flex-grow">You have successfully added your first Property </div>
      </div>
      <OnboardingFooter isForm={false} />
    </>
  );
}
