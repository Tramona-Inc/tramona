import { Card } from "@/components/ui/card";
import FeedLanding from "../FeedLanding";
// import DesktopSearchBar from '../../search-bar/desktop-search-bar';
// import MobileSearchBar from '@/common/components/search-bar/mobile-search-bar';
// import { useToast } from "../ui/use-toast";
// import type { NewRequest } from '/common/lib/new-request-utils';
// import { getSuccessfulRequestToast, makeRequest } from '/common/lib/new-request-utils';
// import { useUserInfo } from '@/hooks/useUserInfo';
// import { useEffect, useState } from 'react';
import dynamic from "next/dynamic";
import NewRequestForm from "@/components/requests/NewRequestForm";
import NewRequestDialog from "@/components/requests/NewRequestDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const LandingVideo = dynamic(
  () => import("@/components/landing-page/LandingVideo"),
  { ssr: false },
);

export default function MastHead() {
  //   const { toast } = useToast();

  //   const [user, setUser, isLoggedIn, setIsLoggedIn] = useUserInfo();
  //   const [referralCode, setReferralCode] = useState<string>("");
  //   const [isCopied, setIsCopied] = useState(false);

  //   useEffect(() => {
  //     const unsentRequest = localStorage.getItem('unsentRequest');

  //     if (unsentRequest && user) {
  //       const request = JSON.parse(unsentRequest) as NewRequest;
  //       request.checkIn = new Date(request.checkIn);
  //       request.checkOut = new Date(request.checkOut);
  //       // console.log(request.checkIn, request.checkIn instanceof Date);
  //       makeRequest(request, user?.id);
  //       toast(getSuccessfulRequestToast(request));
  //       localStorage.removeItem('unsentRequest');
  //     }
  //   }, [user]);

  //   useEffect(() => {
  //     if (user != null && isLoggedIn) {
  //       setReferralCode(user.referral?.referralCode || '');
  //     }
  //   }, [user, isLoggedIn]);

  // const handleShareButtonClick = () => {
  //   if (isLoggedIn) {
  //     navigator.clipboard
  //       .writeText('https://tramona.com/sign-up?code=' + referralCode)
  //       .then(() => {
  //         // console.log('Referral code copied to clipboard');
  //         setIsCopied(true);
  //         setTimeout(() => setIsCopied(false), 500);
  //         // You can also show a success message or perform other actions
  //       })
  //       .catch(error => {
  //         // console.error('Error copying to clipboard:', error);
  //         // Handle any errors that may occur during the copy
  //       });
  //   } else {
  //     // console.log('User is not logged in');
  //   }
  // };

  return (
    <>
      <section className="relative flex h-[calc(100vh-4rem)] flex-col">
        <LandingVideo />
        <div className="absolute inset-0 flex flex-col items-center justify-between transition-colors [transition-duration:300ms] focus-within:bg-black/50">
          <div className="flex h-full w-full flex-row justify-center lg:flex-row">
            {/* Left */}
            <div className="flex w-9/12 flex-col items-center justify-center">
              <div className="flex w-full flex-col items-center justify-center">
                {/* <div className="hidden w-full overflow-clip xl:block">
                  <DesktopSearchBar toast={toast} />
                </div>
                <div className="mx-auto overflow-clip xl:hidden">
                  <MobileSearchBar />
                </div> */}
                <div className="mx-auto flex max-w-3xl flex-col items-center justify-center space-y-5 py-16">
                  <div className=" p-1 text-3xl font-bold text-white md:text-4xl lg:text-5xl">
                    <h1 className="rounded bg-black/30 p-2 text-center text-2xl font-extrabold text-white backdrop-blur-md md:text-3xl lg:text-4xl">
                      Tramona is name your own price tool
                    </h1>
                  </div>
                  <div className="mx-10  w-fit rounded bg-black/30 p-2 text-center text-white backdrop-blur-md md:text-3xl lg:text-xl">
                    We match you with vacant dates from top performing Airbnb
                    hosts, so you get better travel deals
                  </div>
                </div>
              </div>
            </div>

            {/* Right */}
            {/* <div className="hidden h-full border-black/5 border-white bg-black/20 backdrop-blur-md xl:block xl:w-3/12">
              <FeedLanding />
            </div> */}
          </div>
        </div>
      </section>
      <section className="-translate-y-1/2">
        <Card className="mx-auto hidden max-w-2xl [box-shadow:0_0_30px_hsl(var(--blue-300))] md:block">
          <NewRequestForm />
        </Card>
        <div className="flex -translate-y-20 flex-col items-center md:hidden">
          <NewRequestDialog>
            <Button
              variant="white"
              size="lg"
              className="rounded-full pl-3 pr-5"
            >
              <Plus />
              Make a request
            </Button>
          </NewRequestDialog>
        </div>
      </section>
      <section className="h-[45vh] bg-blue-800 xl:hidden">
        <FeedLanding />
      </section>
    </>
  );
}
