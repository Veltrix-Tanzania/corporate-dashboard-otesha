import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "ghost" | "quiet";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-b from-[#2f5a3e] to-[#1d3c29] text-[#eef5ef] shadow-[0_6px_16px_-8px_rgba(20,50,40,.6)] hover:shadow-[0_10px_22px_-10px_rgba(20,50,40,.7)] border-transparent",
  ghost: "bg-card text-ink-2 border-line hover:bg-sage-2",
  quiet: "bg-transparent text-muted border-0 hover:text-ink",
};

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: "sm" | "md";
};

export function Button({ variant = "primary", size = "md", className, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full border font-semibold transition-[transform,box-shadow] active:translate-y-px",
        size === "sm" ? "px-3.5 py-1.5 text-[12.5px]" : "px-[18px] py-2.5 text-[13.5px]",
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
