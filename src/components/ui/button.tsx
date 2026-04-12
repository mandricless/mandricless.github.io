import * as React from "react";

function cn(...classes: Array<string | undefined | null | false>) {
  return classes.filter(Boolean).join(" ");
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline";
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const variantClass =
      variant === "outline"
        ? "border bg-transparent hover:bg-white/10"
        : "bg-slate-900 text-white hover:bg-slate-800";

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition-colors",
          variantClass,
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";