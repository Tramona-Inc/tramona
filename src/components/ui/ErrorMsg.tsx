import { cn } from "@/utils/utils";
import { forwardRef } from "react";

const ErrorMsg = forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn(
        "text-sm font-medium text-destructive transition-[height] duration-150",
        !children || children === "" ? "h-0" : "h-4",
        className,
      )}
      {...props}
    >
      {children}
    </p>
  );
});
ErrorMsg.displayName = "ErrorMsg";

export default ErrorMsg;
