import { Check, Clock, DollarSign, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function PriceCardInformation() {
  return (
    <div className="mt-6 space-y-3">
      {/* Payment Protection Card */}
      <Card className="shadow-sm">
        <CardHeader className="border-b border-[#00423620] pb-3 pt-3">
          <CardTitle className="flex items-center gap-2 text-base text-[#004236]">
            <Shield className="h-5 w-5" />
            Payment Protection
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-3 text-sm">
          <p className="text-black">
            All payments are held by Tramona until 24 hours after check-in{" "}
            <span className="font-bold text-[#004236]">
              to ensure your money is safe.
            </span>
          </p>
        </CardContent>
      </Card>

      {/* Why Tramona Card */}
      <Card className="shadow-sm">
        <CardHeader className="border-b border-[#00423620] pb-3 pt-3">
          <CardTitle className="flex items-center gap-2 text-base text-[#004236]">
            <DollarSign className="h-5 w-5" />
            Why Tramona?
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-3">
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#004236]" />
              <div>
                <p className="text-black">
                  <span className="font-bold">Lowest fees</span> out of all
                  major booking platforms
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Clock className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#004236]" />
              <div>
                <p className="text-black">
                  <span className="font-bold">
                    Best customer support on the market
                  </span>{" "}
                  - 24/7 assistance and rebooking or instant money back
                  guarantee
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Shield className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#004236]" />
              <div>
                <p className="text-black">
                  <span className="font-bold">Money back guarantee</span> and
                  urgent rebooking assistance
                </p>
              </div>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

export default PriceCardInformation;
