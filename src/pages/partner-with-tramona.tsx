import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  CheckCircle2,
  Globe2,
  BarChart3,
  TrendingUp,
  Users,
  ArrowUpRight,
} from "lucide-react";

export default function PartnerWithTramona() {
  return (
    <DashboardLayout>
      <div className="mx-auto w-full space-y-16 rounded-lg bg-gray-50 p-10 shadow-lg">
        <div className="min-h-screen bg-white">
          <div className="container mx-auto space-y-20 px-6 py-16">
            <PartnerIntro />
            <GrowthHighlights />
            <WhyPartnerSection />
            <TangiblePartnerBenefits />
            <WinWinPartnership />
            <PartnerConnectSection />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function PartnerIntro() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 text-center">
      <h1 className="text-3xl font-bold leading-tight text-[#004236] sm:text-4xl md:text-5xl lg:text-4xl xl:text-5xl">
        Partner with Tramona: Maximize Your Impact in the STR Industry
      </h1>
      <p className="text-lg leading-relaxed text-gray-600">
        Are you a property manager, a company offering STR technology, a service
        provider in the STR space, or a community leader? Tramona provides
        unique opportunities to grow your impact.
      </p>
    </div>
  );
}

function GrowthHighlights() {
  const metrics = [
    { title: "10K+", subtitle: "Monthly Active Travelers", icon: Users },
    { title: "50%", subtitle: "Month-over-Month Growth", icon: ArrowUpRight },
  ];

  return (
    <div className="mx-auto max-w-4xl rounded-2xl bg-[#F5F9F8] p-10 shadow-md">
      <h2 className="mb-6 text-center text-2xl font-bold text-[#004236]">
        Growing Rapidly
      </h2>
      <p className="mb-8 text-center text-lg text-gray-600">
        Join Tramona&apos;s expanding network and tap into our fast-growing
        community of travelers and hosts
      </p>
      <div className="grid gap-8 md:grid-cols-2">
        {metrics.map((metric, index) => (
          <GrowthMetricCard
            key={index}
            title={metric.title}
            subtitle={metric.subtitle}
            Icon={metric.icon}
          />
        ))}
      </div>
    </div>
  );
}

function GrowthMetricCard({
  title,
  subtitle,
  Icon,
}: {
  title: string;
  subtitle: string;
  Icon: React.ElementType;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-xl bg-white p-6 text-center shadow">
      <div className="flex items-center justify-center rounded-full bg-[#E6F0EE] p-4">
        <Icon className="h-10 w-10 text-[#004236]" />
      </div>
      <div>
        <div className="flex items-center justify-center gap-2">
          <span className="text-3xl font-bold text-[#004236]">{title}</span>
          <TrendingUp className="h-6 w-6 text-[#004236]" />
        </div>
        <p className="text-gray-600">{subtitle}</p>
      </div>
    </div>
  );
}

function PartnerBenefitItem({
  title,
  description,
  Icon,
}: {
  title: string;
  description: string;
  Icon: React.ElementType;
}) {
  return (
    <li className="flex items-start gap-4">
      <Icon className="mt-1 h-6 w-6 text-[#004236]" />
      <div>
        <h4 className="text-base font-semibold text-[#004236] sm:text-lg">
          {title}
        </h4>
        <p className="text-sm text-gray-600 sm:text-base">{description}</p>
      </div>
    </li>
  );
}

function TangiblePartnerBenefits() {
  const benefits = [
    {
      title: "Increase Host Acquisition",
      description:
        "Attract new hosts interested in filling vacancies and boosting their earnings.",
      icon: Globe2,
    },
    {
      title: "Co-Branding & Joint Marketing",
      description: "Opportunities for co-branded campaigns and joint events.",
      icon: CheckCircle2,
    },
    {
      title: "Data-Driven Results",
      description:
        "Gain insights into host success, including occupancy rates and booking performance.",
      icon: BarChart3,
    },
  ];

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <h2 className="text-center text-2xl font-bold text-[#004236] sm:text-3xl">
        Tangible Benefits for Your Company
      </h2>
      <div className="mx-auto grid max-w-3xl gap-6 sm:max-w-5xl sm:gap-8 md:grid-cols-3">
        {benefits.map((benefit, index) => (
          <Card
            key={index}
            className="flex flex-col items-center space-y-4 rounded-lg p-6 text-center shadow"
          >
            <benefit.icon className="h-12 w-12 text-[#004236]" />
            <h3 className="text-lg font-semibold text-[#004236] sm:text-xl">
              {benefit.title}
            </h3>
            <p className="text-sm text-gray-600 sm:text-base">
              {benefit.description}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}

function PartnerConnectSection() {
  return (
    <div className="mx-auto max-w-2xl space-y-8 rounded-lg bg-white p-6 text-center shadow-md">
      <h2 className="text-3xl font-bold text-[#004236]">Let&apos;s Connect</h2>
      <p className="text-lg text-gray-600">
        Ready to give your hosts more opportunities to succeed and add value to
        your company? We&apos;d love to discuss a partnership tailored to your
        needs.
      </p>
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <Button
          className="rounded-md bg-[#004236] px-10 py-3 text-lg font-semibold text-white hover:bg-[#003228]"
          onClick={() => window.open("https://calendly.com/tramona", "_blank")}
        >
          Book a Call
        </Button>
        <Button
          variant="outline"
          className="rounded-md border-[#004236] px-10 py-3 text-lg font-semibold text-[#004236] hover:bg-[#E6F0EE]"
          onClick={() => (window.location.href = "mailto:info@tramona.com")}
        >
          Email Us
        </Button>
      </div>
    </div>
  );
}

function WhyPartnerSection() {
  const partnerTypes = [
    {
      title: "For Property Managers",
      benefits: [
        {
          title: "Fill Empty Nights",
          description: "Turn empty days into bookings, boosting income.",
          icon: CheckCircle2,
        },
        {
          title: "Direct Access to Travelers",
          description:
            "Gain exposure to travelers, filling hard-to-book dates.",
          icon: CheckCircle2,
        },
        {
          title: "Free Promotion",
          description: "Your properties are featured for free on our platform.",
          icon: CheckCircle2,
        },
      ],
    },
    {
      title: "For STR Technology Companies",
      benefits: [
        {
          title: "Expand Your Reach",
          description:
            "Position your products in front of thousands of active hosts.",
          icon: CheckCircle2,
        },
        {
          title: "Co-Marketing Opportunities",
          description: "Engage in joint campaigns, webinars, and events.",
          icon: CheckCircle2,
        },
        {
          title: "Data-Driven Results",
          description: "Gain insights into occupancy rates and performance.",
          icon: CheckCircle2,
        },
      ],
    },
  ];

  return (
    <div className="space-y-8 p-4 sm:p-6">
      <h2 className="text-center text-2xl font-bold text-[#004236] sm:text-3xl">
        Why Partner with Tramona?
      </h2>
      <div className="mx-auto grid gap-8 sm:max-w-xl sm:gap-12 md:grid-cols-2 lg:max-w-5xl">
        {partnerTypes.map((type, index) => (
          <div key={index} className="space-y-6">
            <h3 className="border-b-2 border-[#004236]/10 pb-3 text-xl font-semibold text-[#004236] sm:text-2xl">
              {type.title}
            </h3>
            <ul className="space-y-4">
              {type.benefits.map((benefit, i) => (
                <PartnerBenefitItem
                  key={i}
                  title={benefit.title}
                  description={benefit.description}
                  Icon={benefit.icon}
                />
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

function WinWinPartnership() {
  const partnershipBenefits = [
    "Expand Your Service Offerings: Provide your hosts with tools to fill vacancies and succeed.",
    "Receive Co-Branding Opportunities: Joint marketing to showcase our partnership and benefits.",
    "Enjoy Easy Referral Tracking: Track referrals effortlessly with our streamlined system.",
  ];

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <h2 className="text-center text-2xl font-bold text-[#004236] sm:text-3xl">
        A Win-Win Partnership
      </h2>
      <p className="mx-auto max-w-xl text-center text-base text-gray-600 sm:text-lg">
        Our mission is simple: create a win-win for hosts and the partners that
        support them. As a Tramona partner, you&apos;ll:
      </p>
      <ul className="mx-auto max-w-xl space-y-4">
        {partnershipBenefits.map((benefit, index) => (
          <li
            key={index}
            className="flex items-start gap-3 text-sm text-gray-600 sm:text-base"
          >
            <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-[#004236]" />
            <span>{benefit}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
