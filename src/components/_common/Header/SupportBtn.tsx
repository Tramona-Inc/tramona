import { Button } from "@/components/ui/button";
import { useChatWithAdmin } from "@/utils/useChatWithAdmin";
import { cn } from "@/utils/utils";
import { useSession } from "next-auth/react";

export function SupportBtn() {
  const { status } = useSession();
  const chatWithAdmin = useChatWithAdmin();

  return (
    <Button
      variant="ghost"
      className={cn(
        "rounded-full",
        status !== "authenticated" && "pointer-events-none",
      )}
      onClick={() => chatWithAdmin()}
    >
      24/7 Support
    </Button>
  );
}
