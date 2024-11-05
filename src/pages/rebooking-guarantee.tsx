import {
  Shield,
  Clock,
  AlertTriangle,
  PhoneCall,
  FileText,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import { ReactNode } from "react";

export default function RebookingGuarantee() {
  return (
    <DashboardLayout>
      <div className="mx-auto w-full space-y-12 rounded-lg bg-gray-50 p-8 shadow-lg">
        <HeaderSection />
        <CoverageSection />
        <CommitmentSection />
        <IssueResolutionSection />
        <ConfidenceSection />
      </div>
    </DashboardLayout>
  );
}

function HeaderSection() {
  return (
    <header className="space-y-3 text-center">
      <h1 className="text-4xl font-extrabold text-[#004236]">
        100% Re-booking Guarantee
      </h1>
      <p className="text-lg font-medium text-gray-600">
        Your Safety and Satisfaction Are Our #1 Priority
      </p>
    </header>
  );
}

function CoverageSection() {
  return (
    <Card className="rounded-lg border border-gray-200 bg-white shadow-sm">
      <CardHeader className="px-6 pb-4 pt-6">
        <CardTitle className="text-2xl font-semibold text-[#004236]">
          What You&apos;re Covered For
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-8 px-6 pb-6 md:grid-cols-3">
        <CoverageItem
          icon={<Shield />}
          title="Check-In Issues"
          description="Unable to access property or unresponsive hosts"
        />
        <CoverageItem
          icon={<Clock />}
          title="Last-Minute Host Cancellations"
          description="We'll find you a comparable or better accommodation at no additional cost"
        />
        <CoverageItem
          icon={<AlertTriangle />}
          title="Safety Concerns"
          description="Undisclosed issues, misrepresentations, or illegal activities on-site"
        />
      </CardContent>
    </Card>
  );
}

interface CoverageItemProps {
  icon: ReactNode;
  title: string;
  description: string;
}

function CoverageItem({ icon, title, description }: CoverageItemProps) {
  return (
    <div className="flex flex-col items-center space-y-3 text-center">
      <div className="h-12 w-12 text-[#004236]">{icon}</div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  );
}

function CommitmentSection() {
  return (
    <Card className="rounded-lg border border-gray-200 bg-white shadow-sm">
      <CardHeader className="px-6 pb-4 pt-6">
        <CardTitle className="text-2xl font-semibold text-[#004236]">
          Our Commitment to You
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-8 px-6 pb-6 md:grid-cols-2">
        <CommitmentItem
          icon={<PhoneCall />}
          title="24/7 Support"
          description="Our customer support team is available to assist you with any issues, any time of day."
        />
        <CommitmentItem
          icon={<Check />}
          title="No Extra Costs"
          description="We believe you shouldn't have to pay more due to circumstances beyond your control. Any additional costs for re-booking under our guarantee are covered by us."
        />
      </CardContent>
    </Card>
  );
}

interface CommitmentItemProps {
  icon: ReactNode;
  title: string;
  description: string;
}

function CommitmentItem({ icon, title, description }: CommitmentItemProps) {
  return (
    <div className="flex items-start space-x-4">
      <div className="h-8 w-8 flex-shrink-0 text-[#004236]">{icon}</div>
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
  );
}

function IssueResolutionSection() {
  return (
    <Card className="rounded-lg border border-gray-200 bg-white shadow-sm">
      <CardHeader className="px-6 pb-4 pt-6">
        <CardTitle className="text-2xl font-semibold text-[#004236]">
          What to Do If You Encounter an Issue
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-8 px-6 pb-6 md:grid-cols-2">
        <IssueResolutionItem
          icon={<PhoneCall />}
          title="Contact Us Immediately"
          description="Reach out to our support team as soon as possible. The sooner we know about the issue, the faster we can assist you."
        />
        <IssueResolutionItem
          icon={<FileText />}
          title="Provide Details"
          description="Share any relevant information or documentation that can help us understand and address the problem effectively."
        />
      </CardContent>
    </Card>
  );
}

interface IssueResolutionItemProps {
  icon: ReactNode;
  title: string;
  description: string;
}

function IssueResolutionItem({
  icon,
  title,
  description,
}: IssueResolutionItemProps) {
  return (
    <div className="flex items-start space-x-4">
      <div className="h-8 w-8 flex-shrink-0 text-[#004236]">{icon}</div>
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
  );
}

function ConfidenceSection() {
  return (
    <div className="space-y-4 text-center">
      <h2 className="text-2xl font-semibold text-[#004236]">
        Book with Confidence
      </h2>
      <p className="text-gray-600">
        Your safety and satisfaction are our top priorities. With our 100%
        Re-Booking Guarantee, you can focus on creating memorable experiences,
        knowing that we have you covered every step of the way.
      </p>
      <Button
        size="lg"
        className="rounded-lg bg-[#004236] px-6 py-3 font-semibold text-white hover:bg-[#005a4a]"
      >
        Book Your Stay Now
      </Button>
    </div>
  );
}
