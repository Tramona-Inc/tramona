import { Shield, Clock, AlertTriangle, PhoneCall, FileText, Check } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardLayout from '@/components/_common/Layout/DashboardLayout';
import { ReactNode } from 'react';

export default function RebookingGuarantee() {
  return (
    <DashboardLayout>
      <div className="w-full mx-auto p-8 space-y-12 bg-gray-50 rounded-lg shadow-lg">        
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
    <header className="text-center space-y-3">
      <h1 className="text-4xl font-extrabold text-[#004236]">100% Re-booking Guarantee</h1>
      <p className="text-lg text-gray-600 font-medium">Your Safety and Satisfaction Are Our #1 Priority</p>
    </header>
  );
}

function CoverageSection() {
  return (
    <Card className="bg-white border border-gray-200 rounded-lg shadow-sm">
      <CardHeader className="px-6 pt-6 pb-4">
        <CardTitle className="text-2xl font-semibold text-[#004236]">What You're Covered For</CardTitle>
      </CardHeader>
      <CardContent className="grid md:grid-cols-3 gap-8 px-6 pb-6">
        <CoverageItem icon={<Shield />} title="Check-In Issues" description="Unable to access property or unresponsive hosts" />
        <CoverageItem icon={<Clock />} title="Last-Minute Host Cancellations" description="We'll find you a comparable or better accommodation at no additional cost" />
        <CoverageItem icon={<AlertTriangle />} title="Safety Concerns" description="Undisclosed issues, misrepresentations, or illegal activities on-site" />
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
    <div className="flex flex-col items-center text-center space-y-3">
      <div className="w-12 h-12 text-[#004236]">{icon}</div>
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  );
}

function CommitmentSection() {
  return (
    <Card className="bg-white border border-gray-200 rounded-lg shadow-sm">
      <CardHeader className="px-6 pt-6 pb-4">
        <CardTitle className="text-2xl font-semibold text-[#004236]">Our Commitment to You</CardTitle>
      </CardHeader>
      <CardContent className="grid md:grid-cols-2 gap-8 px-6 pb-6">
        <CommitmentItem icon={<PhoneCall />} title="24/7 Support" description="Our customer support team is available to assist you with any issues, any time of day." />
        <CommitmentItem icon={<Check />} title="No Extra Costs" description="We believe you shouldn't have to pay more due to circumstances beyond your control. Any additional costs for re-booking under our guarantee are covered by us." />
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
      <div className="w-8 h-8 text-[#004236] flex-shrink-0">{icon}</div>
      <div>
        <h3 className="font-semibold text-lg">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
  );
}

function IssueResolutionSection() {
  return (
    <Card className="bg-white border border-gray-200 rounded-lg shadow-sm">
      <CardHeader className="px-6 pt-6 pb-4">
        <CardTitle className="text-2xl font-semibold text-[#004236]">What to Do If You Encounter an Issue</CardTitle>
      </CardHeader>
      <CardContent className="grid md:grid-cols-2 gap-8 px-6 pb-6">
        <IssueResolutionItem icon={<PhoneCall />} title="Contact Us Immediately" description="Reach out to our support team as soon as possible. The sooner we know about the issue, the faster we can assist you." />
        <IssueResolutionItem icon={<FileText />} title="Provide Details" description="Share any relevant information or documentation that can help us understand and address the problem effectively." />
      </CardContent>
    </Card>
  );
}

interface IssueResolutionItemProps {
  icon: ReactNode;
  title: string;
  description: string;
}

function IssueResolutionItem({ icon, title, description }: IssueResolutionItemProps) {
  return (
    <div className="flex items-start space-x-4">
      <div className="w-8 h-8 text-[#004236] flex-shrink-0">{icon}</div>
      <div>
        <h3 className="font-semibold text-lg">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
  );
}

function ConfidenceSection() {
  return (
    <div className="text-center space-y-4">
      <h2 className="text-2xl font-semibold text-[#004236]">Book with Confidence</h2>
      <p className="text-gray-600">Your safety and satisfaction are our top priorities. With our 100% Re-Booking Guarantee, you can focus on creating memorable experiences, knowing that we have you covered every step of the way.</p>
      <Button size="lg" className="bg-[#004236] hover:bg-[#005a4a] text-white font-semibold px-6 py-3 rounded-lg">Book Your Stay Now</Button>
    </div>
  );
}
