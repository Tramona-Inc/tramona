import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Globe2, BarChart3, TrendingUp, Users, ArrowUpRight } from "lucide-react";

export default function PartnerWithTramona() {
  return (
    <DashboardLayout>
      <div className="mx-auto w-full space-y-16 rounded-lg bg-gray-50 p-10 shadow-lg">
        <div className="min-h-screen bg-white">
          <div className="container mx-auto px-6 py-16 space-y-20">
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
    <div className="text-center space-y-6 max-w-3xl mx-auto">
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-4xl xl:text-5xl font-bold text-[#004236] leading-tight">
        Partner with Tramona: Maximize Your Impact in the STR Industry
      </h1>
      <p className="text-lg text-gray-600 leading-relaxed">
        Are you a property manager, a company offering STR technology, a service provider in the STR space, or a community leader? Tramona provides unique opportunities to grow your impact.
      </p>
    </div>
  );
}

function GrowthHighlights() {
  const metrics = [
    { title: "10K+", subtitle: "Monthly Active Travelers", icon: Users },
    { title: "50%", subtitle: "Month-over-Month Growth", icon: ArrowUpRight }
  ];

  return (
    <div className="bg-[#F5F9F8] rounded-2xl p-10 max-w-4xl mx-auto shadow-md">
      <h2 className="text-2xl font-bold text-[#004236] mb-6 text-center">Growing Rapidly</h2>
      <p className="text-lg text-gray-600 mb-8 text-center">Join Tramona's expanding network and tap into our fast-growing community of travelers and hosts</p>
      <div className="grid md:grid-cols-2 gap-8">
        {metrics.map((metric, index) => (
          <GrowthMetricCard key={index} title={metric.title} subtitle={metric.subtitle} Icon={metric.icon} />
        ))}
      </div>
    </div>
  );
}

function GrowthMetricCard({ title, subtitle, Icon }) {
  return (
    <div className="flex items-center gap-6 p-6 bg-white rounded-xl shadow">
      <div className="p-4 bg-[#E6F0EE] rounded-full">
        <Icon className="w-10 h-10 text-[#004236]" />
      </div>
      <div>
        <div className="flex items-center gap-2">
          <span className="text-3xl font-bold text-[#004236]">{title}</span>
          <TrendingUp className="w-6 h-6 text-[#004236]" />
        </div>
        <p className="text-gray-600">{subtitle}</p>
      </div>
    </div>
  );
}

function PartnerBenefitItem({ title, description, Icon }) {
  return (
    <li className="flex items-start gap-4">
      <Icon className="w-7 h-7 text-[#004236] flex-shrink-0 mt-1" />
      <div>
        <p className="font-medium text-[#004236] text-lg">{title}</p>
        <p className="text-gray-600 text-base">{description}</p>
      </div>
    </li>
  );
}

function TangiblePartnerBenefits() {
  const benefits = [
    { title: "Increase Host Acquisition", description: "Attract new hosts interested in filling vacancies and boosting their earnings.", icon: Globe2 },
    { title: "Co-Branding & Joint Marketing", description: "Opportunities for co-branded campaigns and joint events.", icon: CheckCircle2 },
    { title: "Data-Driven Results", description: "Gain insights into host success, including occupancy rates and booking performance.", icon: BarChart3 }
  ];

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-[#004236] text-center">Tangible Benefits for Your Company</h2>
      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {benefits.map((benefit, index) => (
          <Card key={index} className="rounded-lg shadow">
            <CardContent className="p-6 space-y-4">
              <benefit.icon className="w-12 h-12 text-[#004236]" />
              <h3 className="text-xl font-semibold text-[#004236]">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function PartnerConnectSection() {
  return (
    <div className="text-center space-y-8 max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-[#004236]">Let's Connect</h2>
      <p className="text-lg text-gray-600">
        Ready to give your hosts more opportunities to succeed and add value to your company? We'd love to discuss a partnership tailored to your needs.
      </p>
      <div className="flex gap-4 justify-center">
        <Button 
          className="bg-[#004236] hover:bg-[#003228] text-white px-10 py-3 rounded-md text-lg font-semibold"
          onClick={() => window.open("https://calendly.com/tramona", "_blank")}
        >
          Book a Call
        </Button>
        <Button 
          variant="outline" 
          className="border-[#004236] text-[#004236] hover:bg-[#E6F0EE] px-10 py-3 rounded-md text-lg font-semibold"
          onClick={() => window.location.href = "mailto:info@tramona.com"}
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
          { title: "Fill Empty Nights", description: "Turn empty days into bookings, boosting income.", icon: CheckCircle2 },
          { title: "Direct Access to Travelers", description: "Gain exposure to travelers, filling hard-to-book dates.", icon: CheckCircle2 },
          { title: "Free Promotion", description: "Your properties are featured for free on our platform.", icon: CheckCircle2 }
        ]
      },
      {
        title: "For STR Technology Companies",
        benefits: [
          { title: "Expand Your Reach", description: "Position your products in front of thousands of active hosts.", icon: CheckCircle2 },
          { title: "Co-Marketing Opportunities", description: "Engage in joint campaigns, webinars, and events.", icon: CheckCircle2 },
          { title: "Data-Driven Results", description: "Gain insights into occupancy rates and performance.", icon: CheckCircle2 }
        ]
      },
    ];
  
    return (
      <div className="space-y-12">
        <h2 className="text-3xl font-bold text-[#004236] text-center">Why Partner with Tramona?</h2>
        <div className="grid md:grid-cols-2 gap-12">
          {partnerTypes.map((type, index) => (
            <div key={index} className="space-y-6">
              <h3 className="text-2xl font-semibold text-[#004236] border-b-2 border-[#004236]/10 pb-3">
                {type.title}
              </h3>
              <ul className="space-y-5">
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
      "Enjoy Easy Referral Tracking: Track referrals effortlessly with our streamlined system."
    ];
  
    return (
      <div className="space-y-8">
        <h2 className="text-3xl font-bold text-[#004236] text-center">A Win-Win Partnership</h2>
        <p className="text-center text-lg text-gray-600 max-w-3xl mx-auto">
          Our mission is simple: create a win-win for hosts and the partners that support them. As a Tramona partner, you'll:
        </p>
        <ul className="space-y-4 max-w-3xl mx-auto">
          {partnershipBenefits.map((benefit, index) => (
            <li key={index} className="flex gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#004236] flex-shrink-0 mt-1" />
              <span className="text-gray-600">{benefit}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }
