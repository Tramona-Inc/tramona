export default function CashbackBalanceDetails() {
  return (
    <div className="flex flex-col space-y-6 rounded-xl bg-white px-10 py-6 shadow-md">
      <h1 className="text-4xl font-bold">
        Cash Back Balance: <span className="text-primary">$112</span>
      </h1>

      <div>
        <p className="text-xl font-semibold">{"You're getting paid!"}</p>
        <p className="text-xl font-medium text-primary">
          Your next $90 check will be sent by 02/15/2024
        </p>
      </div>
    </div>
  );
}
