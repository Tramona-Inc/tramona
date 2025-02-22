import Image from "next/image";

type KeyFeatureItemProps = {
  title: string;
  description: string;
};

const KeyFeatureItem = ({ title, description }: KeyFeatureItemProps) => {
  return (
    <li className="flex flex-col">
      <h3 className="text-xl font-semibold">{title}</h3>
      <p
        className="text-base font-normal"
        dangerouslySetInnerHTML={{ __html: description }}
      ></p>
    </li>
  );
};

export const KeyFeatures = () => {
  return (
    <section className="mx-12 mb-8 flex flex-row flex-wrap justify-center gap-8">
      <Image
        src="/assets/images/why-list/key-features.png"
        className="my-16 h-auto w-full rounded-3xl object-cover md:my-0 md:h-[600px] md:w-[440px]"
        alt="mountain trail"
        width={512}
        height={699}
      />
      <div className="flex max-w-xl flex-grow flex-col justify-start">
        <h2 className="mb-4 text-4xl font-semibold">Key Features for Hosts</h2>
        {/* Feature List */}
        <ul className="mt-6 flex flex-col gap-4">
          <KeyFeatureItem
            title="Easy Sync with Airbnb"
            description="Import all your properties and preferences in <b>less than 1 minute</b>
      by syncing with Airbnb. This also syncs your calendar to ensure no double bookings."
          />
          <KeyFeatureItem
            title="Verified Travelers"
            description="All travelers are verified and undergo <b>3 levels of verification</b>."
          />
          <KeyFeatureItem
            title="Taxes Handled"
            description="We handle all taxes Airbnb and Vrbo handle."
          />
          <KeyFeatureItem
            title="Property Protection"
            description="We protect up to <b>50k of protection per booking</b> and also allow for
      security deposits."
          />
          <KeyFeatureItem
            title="Lowest Fees on the Market"
            description="Tramona charges the <b>lowest fees</b> on the market and is completely free to sign up. We only charge 2.5% for hosts, and 5.5% for travelers."
          />
          <KeyFeatureItem
            title="Co-hosting"
            description="Invite a co-host, choose which permissions to give them, and have them help run your listing."
          />
        </ul>
      </div>
    </section>
  );
};