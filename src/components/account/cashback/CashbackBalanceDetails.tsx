import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { formatCurrency } from "@/utils/utils";

export default function CashbackBalanceDetails({
  balance,
}: {
  balance: number;
}) {
  return (
    <div className="space-y-2">
      <h1 className="text-xl font-bold lg:text-2xl">Cash Back</h1>
      <div className="rounded-lg border p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 ">
          <div className="lg:block">
            <div className="flex items-baseline justify-between lg:block">
              <h1 className="font-semibold">Current balance</h1>
              <p className="text-2xl font-bold lg:text-3xl">
                {formatCurrency(balance)}
              </p>
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="link"
                  className="px-0 text-muted-foreground underline"
                >
                  Manage payout account
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader className="border-b pb-2 text-center font-bold">
                  Coming Soon!
                </DialogHeader>
                <p>
                  If you need cash now, send a message through the help center
                  and we can manually pay you. If not, we will have this feature
                  up soon!
                </p>
              </DialogContent>
            </Dialog>
          </div>
          <div className="mt-4 lg:mt-0 lg:text-end">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="secondary"
                  className="w-full font-bold lg:w-auto"
                >
                  Setup Cashback Account
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader className="border-b pb-2 text-center font-bold">
                  Coming Soon!
                </DialogHeader>
                <p>
                  If you need cash now, send a message through the help center
                  and we can manually pay you. If not, we will have this feature
                  up soon!
                </p>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        {/*<div>
         <p className="text-md font-medium text-primary lg:text-xl">
          Your next $90 check will be sent by 02/15/2024
        </p> 
      </div>*/}
      </div>
    </div>
  );
}
