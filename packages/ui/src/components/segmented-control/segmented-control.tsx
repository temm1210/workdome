import type { ComponentProps, ReactNode } from "react";
import { ToggleGroup } from "radix-ui";

import { cn } from "../../lib/utils";

export type SegmentedControlProps<Value extends string> = Omit<
  ComponentProps<typeof ToggleGroup.Root>,
  "type" | "value" | "defaultValue" | "onValueChange"
> & {
  value: Value;
  options: { value: Value; label: ReactNode }[];
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
  return (
    <ToggleGroup.Root
      {...props}
      type="single"
      value={value}
      onValueChange={(next) => {
        const option = options.find((candidate) => candidate.value === next);
        if (option) onValueChange(option.value);
      }}
      className={cn("flex rounded-md border border-border p-0.5", className)}
    >
      {options.map((option) => (
        <ToggleGroup.Item
          key={option.value}
          value={option.value}
          className="flex-1 rounded px-2 py-1 text-xs text-muted-foreground enabled:cursor-pointer data-[state=on]:bg-muted data-[state=on]:text-foreground"
        >
          {option.label}
        </ToggleGroup.Item>
      ))}
    </ToggleGroup.Root>
  );
}
