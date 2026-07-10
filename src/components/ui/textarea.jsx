import * as React from "react";
import { cn } from "@/lib/utils";

const Textarea = React.forwardRef(({ className, ...props }, ref) => (
  <textarea
    className={cn(
      "flex min-h-28 w-full rounded-[8px] border border-border bg-white px-3 py-2 text-sm text-foreground shadow-sm placeholder:text-muted focus:border-primary disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    ref={ref}
    {...props}
  />
));

Textarea.displayName = "Textarea";

export { Textarea };
