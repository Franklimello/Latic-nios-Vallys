import { cn } from "@/lib/utils";

export function Badge({ className, variant = "default", ...props }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
        variant === "default" && "bg-primary/10 text-primary",
        variant === "accent" && "bg-accent/10 text-accent",
        variant === "outline" && "border border-border bg-white text-muted",
        className,
      )}
      {...props}
    />
  );
}
