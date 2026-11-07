import type { ComponentProps, ReactNode } from "react";
import { useId } from "react";
import { motion } from "motion/react";
import { ToggleGroup } from "radix-ui";

import { cn } from "../../lib/utils";

export type SegmentedControlProps<Value extends string> = Omit<
  ComponentProps<typeof ToggleGroup.Root>,
  "type" | "value" | "defaultValue" | "onValueChange"
> & {
  value: Value;
  options: { value: Value; label: ReactNode; disabled?: boolean }[];
  onValueChange: (value: Value) => void;
  "aria-label": string;
};

export function SegmentedControl<Value extends string>({
  value,
  options,
  onValueChange,
  className,
  ...props
}: SegmentedControlProps<Value>) {
  const id = useId();

  return (
    <ToggleGroup.Root
      {...props}
      type="single"
      value={value}
      onValueChange={(next) => {
        const option = options.find((candidate) => candidate.value === next);
        if (option) onValueChange(option.value);
      }}
      className={cn("flex rounded-md bg-muted p-0.5", className)}
    >
      {options.map((option) => (
        <ToggleGroup.Item
          key={option.value}
          value={option.value}
          disabled={option.disabled}
          className="relative flex-1 rounded px-2 py-1 text-xs whitespace-nowrap text-muted-foreground transition-colors enabled:cursor-pointer enabled:hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50 data-[state=off]:enabled:hover:bg-muted-hover data-[state=on]:text-foreground"
        >
          {option.value === value && (
            <motion.span
              layoutId={`selected-${id}`}
              className="absolute inset-0 rounded bg-surface shadow-sm"
              transition={{ type: "spring", bounce: 0, duration: 0.25 }}
            />
          )}
          <span className="relative">{option.label}</span>
        </ToggleGroup.Item>
      ))}
    </ToggleGroup.Root>
  );
}
