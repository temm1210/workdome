import { cn } from "../../lib/utils";

export type SpinnerProps = { className?: string };

export function Spinner({ className }: SpinnerProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className={cn("size-4 animate-spin", className)}
    >
      <circle
        cx="8"
        cy="8"
        r="7"
        stroke="currentColor"
        strokeOpacity="0.25"
        strokeWidth="2"
      />
      <path
        d="M15 8a7 7 0 0 0-7-7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
