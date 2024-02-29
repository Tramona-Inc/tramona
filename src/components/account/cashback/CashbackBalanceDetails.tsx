import { formatCurrency } from "@/utils/utils";

export default function CashbackBalanceDetails({
  balance,
}: {
  balance: number;
}) {
  return (
    <div className="flex flex-col space-y-6 rounded-xl bg-zinc-50 px-5 py-6 shadow-md lg:px-10">
      <h1 className="text-3xl font-bold lg:text-4xl">
        Cash Back Balance:{" "}
        <span className="text-primary">{formatCurrency(balance)}</span>
      </h1>

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
