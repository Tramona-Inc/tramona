import MainLayout from "@/components/_common/Layout/MainLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { PhoneInput } from "@/components/ui/input-phone";

export default function onboarding() {
  return (
    <MainLayout
      type="auth"
      className="container flex flex-col items-center justify-center"
    >
      <h1 className="text-center text-4xl font-bold">
        First, let&apos;s setup your account!
      </h1>

      <Card className="my-5 flex min-w-[400px] flex-col gap-5">
        <CardHeader>
          <CardDescription className="text-2xl">
            Verify a mobile phone number
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <PhoneInput defaultCountry={"US"} />
        </CardContent>
        <CardFooter>
          <Button className="w-full">Send Verification Code</Button>
          <p className="text-center text-xs text-muted-foreground">
            We verify a phone number on account creation to ensure account
            security. SMS & data charges may apply.
          </p>
        </CardFooter>
      </Card>
    </MainLayout>
  );
}
