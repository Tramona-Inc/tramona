import { ChevronDown } from "lucide-react";
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";

export function MobileHouseRules() {
  const houseRuleExample = {
    content: `Let's keep the noise down between 10:00 PM and 8:00 AM to be
    considerate of our neighbors, and feel free to enjoy yourselves
    responsibly during the rest of the day. While we're all for having a
    good time, please avoid hosting large parties without giving us a
    heads up first. Please be mindful of our space, report any
    accidental breakages, and let us know if you need anything
    rearranged. Keep the doors locked when you're out and conserve
    energy when you can. Most importantly, relax and make yourselves at
    home!`,
  };
  return (
    <div className="mt-4 w-full">
      <div className="flex flex-col">
        <div className="h-[185px]">
          <h3 className="mb-3 text-[18px] font-bold">Cancellation Policy</h3>
          <p className="line-clamp-4 overflow-hidden text-ellipsis text-[14px]">
            {houseRuleExample.content}
          </p>
          <div className="-mb-4 mt-2 flex justify-start">
            <Dialog>
              <DialogTrigger className="inline-flex items-center justify-center text-[14px] text-foreground underline underline-offset-2">
                Show more
                <ChevronDown className="ml-1 h-4 w-4" />
              </DialogTrigger>

              <DialogContent className="w-full p-8">
                <DialogHeader>
                  <DialogTitle>Cancellation Policy</DialogTitle>
                </DialogHeader>
                <p className="">{houseRuleExample.content}</p>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <hr className="mb-4 h-px border-0 bg-[#D9D9D9]" />

        <div className="h-[185px]">
          <h3 className="mb-3 text-[18px] font-bold">House Rules</h3>
          <p className="line-clamp-4 overflow-hidden text-ellipsis text-[14px]">
            {houseRuleExample.content}
          </p>
          <div className="-mb-4 mt-2 flex justify-start">
            <Dialog>
              <DialogTrigger className="inline-flex items-center justify-center text-[14px] text-foreground underline underline-offset-2">
                Show more
                <ChevronDown className="ml-1 h-4 w-4" />
              </DialogTrigger>

              <DialogContent className="w-full p-8">
                <DialogHeader>
                  <DialogTitle>House Rules</DialogTitle>
                </DialogHeader>
                <p className="">{houseRuleExample.content}</p>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <hr className="mb-4 h-px border-0 bg-[#D9D9D9]" />

        <div className="h-[185px]">
          <h3 className="mb-3 text-[18px] font-bold">Additional Rules</h3>
          <p className="line-clamp-4 overflow-hidden text-ellipsis text-[14px]">
            {houseRuleExample.content}
          </p>
          <div className="-mb-4 mt-2 flex justify-start">
            <Dialog>
              <DialogTrigger className="inline-flex items-center justify-center text-[14px] text-foreground underline underline-offset-2">
                Show more
                <ChevronDown className="ml-1 h-4 w-4" />
              </DialogTrigger>

              <DialogContent className="w-full p-8">
                <DialogHeader>
                  <DialogTitle>Additional Rules</DialogTitle>
                </DialogHeader>
                <p className="">{houseRuleExample.content}</p>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
}
