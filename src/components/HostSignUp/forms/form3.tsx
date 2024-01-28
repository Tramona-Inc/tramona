import { Button } from "@/components/ui/button";

export default function Form1() {
  return (
    <div>
      <h1 className="text-2xl font-bold md:text-4xl">
        Thank you! You're all set!
      </h1>
      <h2 className="pt-10 text-2xl font-semibold md:pt-20">
        Welcome to Tramona, if you have any questions please send us an email
        directly at Info@tramona.com
      </h2>
      <div className="pt-16">
        <Button className="w-3/6 md:w-1/6">Finished</Button>
      </div>
    </div>
  );
}
