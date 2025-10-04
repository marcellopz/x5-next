// eslint-disable-next-line storybook/no-renderer-packages
import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "../components/ui/badge";

const meta: Meta<typeof Badge> = {
  title: "UI/Badge",
  component: Badge,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["default", "secondary", "destructive", "outline"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Badge",
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "Secondary",
  },
};

export const Destructive: Story = {
  args: {
    variant: "destructive",
    children: "Destructive",
  },
};

export const Outline: Story = {
  args: {
    variant: "outline",
    children: "Outline",
  },
};

export const WithIcon: Story = {
  args: {
    children: (
      <>
        <span className="w-2 h-2 bg-current rounded-full mr-1" />
        Online
      </>
    ),
  },
};

export const Numbers: Story = {
  render: () => (
    <div className="flex gap-2">
      <Badge>1</Badge>
      <Badge variant="secondary">23</Badge>
      <Badge variant="outline">456</Badge>
      <Badge variant="destructive">99+</Badge>
    </div>
  ),
};

export const StatusBadges: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <Badge className="bg-green-500 hover:bg-green-500/80">Active</Badge>
        <Badge className="bg-yellow-500 hover:bg-yellow-500/80">Pending</Badge>
        <Badge variant="destructive">Inactive</Badge>
      </div>
      <div className="flex gap-2">
        <Badge variant="outline">Draft</Badge>
        <Badge variant="secondary">Published</Badge>
        <Badge>Featured</Badge>
      </div>
    </div>
  ),
};
