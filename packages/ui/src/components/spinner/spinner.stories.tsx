import type { Meta, StoryObj } from "@storybook/react-vite";

import { Spinner } from "./spinner";

const meta: Meta<typeof Spinner> = {
  component: Spinner,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Large: Story = {
  args: { className: "size-8" },
};

export const WithText: Story = {
  render: (args) => (
    <p className="flex items-center gap-2 text-sm text-muted-foreground">
      <Spinner {...args} />
      불러오는 중
    </p>
  ),
};
