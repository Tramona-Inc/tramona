import { Button } from "../ui/button";

export default function UnclaimedHeader() {
  return (
    <div className="flex w-5/6 flex-col items-center justify-center">
      <div className=" flex flex-col items-center justify-center gap-y-1 text-center ">
        <h1 className="text-4xl font-extrabold">Un-claimed Matches</h1>
        <p className="mt-2 text-lg">
          Have a friend thinking of traveling? Share a deal with them and earn a
          30% revenue split
        </p>
        <div className="text-xs">
          Once they book, the money will be deposited directly to your referral
          dashboard
        </div>
      </div>
      <div className="flex w-full flex-row justify-between">
        <Button variant="outlineLight">How these deals work</Button>
        <div>
          {" "}
          Want an unclaimed match directly sent to you?
          <p>These are bookable now and they go fast </p>
        </div>
      </div>
    </div>
  );
}
