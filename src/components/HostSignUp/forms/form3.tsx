import { Button } from "@/components/ui/button";

export default function Form1() {
  return (
    <div className="h-2/5">
      <h1 className="text-4xl font-bold">Thank you! You're all set!</h1>
      <h2 className="pt-20 text-2xl font-semibold">
        Welcome to Tramona, if you have any questions please send us an email
        directly at Info@tramona.com
      </h2>
      <div className="pt-16">
        <Button className="w-1/6">Finished</Button>
      </div>
    </div>
  );
}
