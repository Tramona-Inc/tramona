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
    <div className="flex flex-col space-y-1 rounded-lg border lg:p-4">
      <div>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold lg:text-lg">Current balance</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="rounded-full border-teal-900 font-bold text-teal-900"
              >
                Transfer
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader className="border-b pb-2 text-center font-bold">
                Coming Soon!
              </DialogHeader>
              <p>
                If you need cash now, send a message through the help center and
                we can manually pay you. If not, we will have this feature up
                soon!
              </p>
            </DialogContent>
          </Dialog>
        </div>

        <p className="text-3xl font-bold">{formatCurrency(balance)}</p>
      </div>
      <div>
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
              If you need cash now, send a message through the help center and
              we can manually pay you. If not, we will have this feature up
              soon!
            </p>
          </DialogContent>
        </Dialog>
      </div>

      {balance > 0 && (
        <p className="text-md font-semibold lg:text-xl">
          {"You're getting paid!🎉"}
        </p>
      )}
      {/*<div>
         <p className="text-md font-medium text-primary lg:text-xl">
          Your next $90 check will be sent by 02/15/2024
        </p> 
      </div>*/}
    </div>
  );
}
