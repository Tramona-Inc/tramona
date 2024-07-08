import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function HostCard() {
  return (
    <div>
      <h2 className="mb-4 text-[18px] font-bold lg:text-[24px]">
        Meet your host
      </h2>
      <Card className="w-[100%] h-[185px] flex justify-center border border-[#DDDDDD] lg:h-auto shadow-none lg:max-w-sm lg:shadow-md">
        <CardContent className="grid grid-cols-2 gap-2 p-6 lg:gap-0">
          <div className="flex flex-col items-center space-y-2">
            <Avatar className="h-[106px] w-[106px]">
              <AvatarImage src="/path-to-host-image.jpg" alt="Elizabeth" />
              <AvatarFallback>EL</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold">Elizabeth</h3>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="text-center">
              <strong>38</strong>
              <br />
              Reviews
            </div>
            <hr className="h-px w-[80px] border-0 bg-[#DDDDDD]" />
            <div className="text-center">
              <strong>4.95</strong>
              <br />
              Rating
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="hidden lg:block">
        <h2 className="mb-6 mt-10 text-[24px] font-bold">
          Have questions about the stay?
        </h2>
        <Button className="h-[50px] w-[258px] bg-primaryGreen text-[20px]">
          Message host
        </Button>
      </div>

      <div className="lg:hidden">
        <h2 className="mb-2 mt-6 text-[18px] font-bold">Questions?</h2>
        <Button className="h-[44px] w-full border border-primaryGreen bg-transparent text-[16px] font-bold text-primaryGreen hover:bg-inherit hover:opacity-80">
          Message host
        </Button>
      </div>
    </div>
  );
}
