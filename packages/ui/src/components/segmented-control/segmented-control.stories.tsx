import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { fn } from "storybook/test";

import { SegmentedControl } from "./segmented-control";

const meta: Meta<typeof SegmentedControl> = {
  component: SegmentedControl,
  args: {
    "aria-label": "기간",
    value: "day",
    options: [
      { value: "day", label: "일" },
      { value: "week", label: "주" },
      { value: "month", label: "월" },
    ],
    onValueChange: fn(),
  },
  argTypes: { value: { control: false } },
  decorators: [
    (Story) => (
      <div className="w-100">
        <Story />
      </div>
    ),
  ],
  render: function Render(args) {
    const [value, setValue] = useState(args.value);
    return (
      <SegmentedControl
        {...args}
        value={value}
        onValueChange={(next) => {
          args.onValueChange(next);
          setValue(next);
        }}
      />
    );
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = {
  args: { disabled: true },
};

export const DisabledOption: Story = {
  args: {
    options: [
      { value: "day", label: "일" },
      { value: "week", label: "주" },
      { value: "month", label: "월", disabled: true },
    ],
  },
};

const manyOptions = Array.from({ length: 12 }, (_, index) => ({
  value: `option-${index + 1}`,
  label: `옵션 ${index + 1}`,
}));

export const Scroll: Story = {
  args: {
    value: "option-1",
    options: manyOptions,
    className: "overflow-x-auto",
  },
};

export const Wrap: Story = {
  args: { value: "option-1", options: manyOptions, className: "flex-wrap" },
};
