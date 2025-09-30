import type { Meta, StoryObj } from "@storybook/react";
import { Navbar } from "../components/ui/navbar";

const meta: Meta<typeof Navbar> = {
  title: "UI/Navbar",
  component: Navbar,
  parameters: {
    layout: "fullscreen",
    backgrounds: {
      default: "dark",
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-foreground mb-4">
          Page Content
        </h1>
        <p className="text-muted-foreground">
          This is how the navbar looks on a typical page. The navbar is sticky
          and will stay at the top when scrolling.
        </p>
        <div className="mt-8 space-y-4">
          {Array.from({ length: 20 }, (_, i) => (
            <div
              key={i}
              className="p-4 border border-border rounded-lg bg-card"
            >
              <h3 className="font-semibold text-card-foreground">
                Content Block {i + 1}
              </h3>
              <p className="text-muted-foreground">
                Some example content to demonstrate scrolling behavior.
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
};

export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
  render: () => (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="px-4 py-8">
        <h1 className="text-xl font-bold text-foreground mb-4">Mobile View</h1>
        <p className="text-muted-foreground">
          On mobile, the navigation links are hidden and replaced with a
          hamburger menu button.
        </p>
      </div>
    </div>
  ),
};

export const Tablet: Story = {
  parameters: {
    viewport: {
      defaultViewport: "tablet",
    },
  },
  render: () => (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="px-4 py-8">
        <h1 className="text-xl font-bold text-foreground mb-4">Tablet View</h1>
        <p className="text-muted-foreground">
          On tablet, the navbar shows both desktop and mobile elements depending
          on the breakpoint.
        </p>
      </div>
    </div>
  ),
};

export const WithScrolling: Story = {
  render: () => (
    <div className="bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-foreground mb-4">
          Scrolling Demo
        </h1>
        <p className="text-muted-foreground mb-8">
          Scroll down to see the navbar's backdrop blur effect in action.
        </p>
        <div className="space-y-8">
          {Array.from({ length: 50 }, (_, i) => (
            <div
              key={i}
              className="p-6 border border-border rounded-lg bg-card"
            >
              <h3 className="font-semibold text-card-foreground mb-2">
                Section {i + 1}
              </h3>
              <p className="text-muted-foreground">
                This content demonstrates how the sticky navbar behaves when
                scrolling through a long page. The navbar maintains its position
                at the top with a backdrop blur effect.
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
};
