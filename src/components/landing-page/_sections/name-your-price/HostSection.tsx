import React from "react";
import { cn } from "@/utils/utils";
import Image from "next/image";
import {
  CalendarIcon,
  CheckCircle,
  Headset,
  Shield,
  LockIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HostSection({
  className,
}: {
  className: string | undefined;
}) {
  return (
    <div className={cn(className)}>
      {/* Host-Specific Section
      <section className="w-full bg-gray-50 py-12">
        <div className="mx-8 grid items-center gap-4 lg:grid-cols-5">
          <div className="flex justify-center lg:col-span-2 lg:justify-start">
            <Image
              src="/assets/images/why-list/secure.png"
              alt="Host using laptop"
              width={700}
              height={500}
              className="h-auto w-5/6 rounded-lg object-cover"
            />
          </div>
          <div className="w-full lg:col-span-3">
            <h2 className="mb-2 text-xl font-bold md:text-3xl">
              Hosts: Fill Your Empty Nights and Earn More
            </h2>
            <p className="mb-4 text-lg md:text-xl">
              The Only Booking Platform Built to Fill Your Vacancies
            </p>
            <p className="text-wrap mb-6">
              Tramona lets you maximize earnings by listing your property at
              full price while maintaining the option to offer exclusive
              discounts when you choose. Unlike other platforms, Tramona gives
              you full control over pricing and flexibility to accept, reject,
              or counter traveler requests. Keep your rates the same on Airbnb
              and Vrbo while filling your empty nights with Tramona&apos;s
              direct requests.
            </p>
            <div className="mb-6 grid gap-4 sm:grid-cols-2">
              <div className="flex items-start">
                <Shield className="mr-2 h-6 w-6 flex-shrink-0 text-[#004236]" />
                <p>$50K protection per booking</p>
              </div>
              <div className="flex items-start">
                <CheckCircle className="mr-2 h-6 w-6 flex-shrink-0 text-[#004236]" />
                <p>3 levels of traveler verification</p>
              </div>
              <div className="flex items-start">
                <CalendarIcon className="mr-2 h-6 w-6 flex-shrink-0 text-[#004236]" />
                <p>Easy calendar syncing</p>
              </div>
              <div className="flex items-start">
                <Headset className="mr-2 h-6 w-6 flex-shrink-0 text-[#004236]" />
                <p>24/7 support</p>
              </div>
            </div>
            <Button className="bg-[#004236] text-white hover:bg-[#005a4b]">
              List Your Property
            </Button>
            <p className="mt-4 text-sm">
              Hosts can expect to make 10-15% more when using Tramona to book
              their empty nights.
            </p>
          </div>
        </div>
      </section>

      Protection Section */}
      <section className="bg-white py-12">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-3xl text-center">
            
            <h2 className="mb-8 text-3xl font-bold">
             Feel Safer When Booking Through Tramona
            </h2>
            <div className="grid gap-6 text-left md:grid-cols-2">
              <div className="flex items-start">
                <Shield className="mr-2 h-6 w-6 flex-shrink-0 text-[#004236]" />
                <div>
                  <h3 className="mb-1 font-semibold">
                    $50,000 Property Protection
                  </h3>
                  <p>
                    Every booking on Tramona is backed by up to $50,000 in
                    property protection, providing hosts with added security and
                    peace of mind.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="mr-2 h-6 w-6 flex-shrink-0 text-[#004236]" />
                <div>
                  <h3 className="mb-1 font-semibold">Verified Travelers and Hosts</h3>
                  <p>
                    Tramona has three levels of traveler verification, and all hosts sign up via their Airbnb account. This adds an extra layer of protection for both hosts and travelers.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <LockIcon className="mr-2 h-6 w-6 flex-shrink-0 text-[#004236]" />
                <div>
                  <h3 className="mb-1 font-semibold">Secure Payments</h3>
                  <p>
                    All transactions are securely processed and money is held until check-in it complete, protecting both travelers and hosts from fraud and ensuring reliable payment processing..
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <Headset className="mr-2 h-6 w-6 flex-shrink-0 text-[#004236]" />
                <div>
                  <h3 className="mb-1 font-semibold">24/7 Support</h3>
                  <p>
                    Our dedicated support team is available around the clock to
                    assist with any issues, providing support from booking to
                    checkout.
                  </p>
                </div>
              </div>
            </div>
            <Button 
              className="mt-8 bg-[#004236] text-white hover:bg-[#005a4b]"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              Book Now
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
