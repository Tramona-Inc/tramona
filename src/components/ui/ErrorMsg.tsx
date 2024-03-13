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
        "text-xs font-medium text-destructive transition-all duration-150",
        !children || children === "" ? "h-0 opacity-0" : "h-4 opacity-100",
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
