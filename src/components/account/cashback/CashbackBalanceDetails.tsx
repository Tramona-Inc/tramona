export default function CashbackBalanceDetails() {
  return (
    <div className="flex flex-col space-y-6 rounded-xl bg-zinc-50 px-5 py-6 shadow-md lg:px-10">
      <h1 className="text-3xl font-bold lg:text-4xl">
        Cash Back Balance: <span className="text-primary">$112</span>
      </h1>

      <div>
        <p className="text-md font-semibold lg:text-xl">
          {"You're getting paid!"}
        </p>
        <p className="text-md font-medium text-primary lg:text-xl">
          Your next $90 check will be sent by 02/15/2024
        </p>
      </div>
    </div>
  );
}
