import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";

export default function SaveAndExit() {
  const router = useRouter();

  return (
    <div className="container mt-5 flex w-full justify-end">
      <Button
        onClick={() => {
          void router.push("/host");
        }}
        variant={"outlineLight"}
      >
        Save & Exit
      </Button>
    </div>
  );
}
