import { ConnectAccountOnboarding } from "@stripe/react-connect-js";
import { useRouter } from "next/router";
import { Card, CardContent } from "@/components/ui/card";
export default function CurrentlyDueBeforePayout() {
  const router = useRouter();
  return (
    <Card>
      <CardContent>
        <ConnectAccountOnboarding
          onExit={() => router.push("/host/finances")}
        />
      </CardContent>
    </Card>
  );
}
