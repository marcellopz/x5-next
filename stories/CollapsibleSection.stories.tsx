// eslint-disable-next-line storybook/no-renderer-packages
import type { Meta, StoryObj } from "@storybook/react";
import { CollapsibleSection } from "@/components/ui/collapsible-section";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useState } from "react";

const meta = {
  title: "UI/CollapsibleSection",
  component: CollapsibleSection,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof CollapsibleSection>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample content components
const SampleCards = () => (
  <div className="grid gap-4 md:grid-cols-3">
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Card 1</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Sample content for card 1
        </p>
      </CardContent>
    </Card>
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Card 2</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Sample content for card 2
        </p>
      </CardContent>
    </Card>
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Card 3</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Sample content for card 3
        </p>
      </CardContent>
    </Card>
  </div>
);

const SampleList = () => (
  <div className="space-y-2">
    <div className="p-4 bg-accent rounded-md">Item 1</div>
    <div className="p-4 bg-accent rounded-md">Item 2</div>
    <div className="p-4 bg-accent rounded-md">Item 3</div>
    <div className="p-4 bg-accent rounded-md">Item 4</div>
  </div>
);

// Default expanded
export const Default: Story = {
  args: {
    title: "Section Title",
    children: <SampleCards />,
  },
};

// Default collapsed
export const DefaultCollapsed: Story = {
  args: {
    title: "Collapsed Section",
    defaultExpanded: false,
    children: <SampleCards />,
  },
};

// With list content
export const WithListContent: Story = {
  args: {
    title: "List Section",
    children: <SampleList />,
  },
};

// With text content
export const WithTextContent: Story = {
  args: {
    title: "Text Section",
    children: (
      <div className="prose prose-sm max-w-none">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris.
        </p>
        <p>
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
          dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
          proident.
        </p>
      </div>
    ),
  },
};

// Controlled component
export const Controlled: Story = {
  args: {
    title: "Controlled Section",
    children: <SampleCards />,
  },
  render: () => {
    const [expanded, setExpanded] = useState(true);

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-accent rounded-md">
          <span className="text-sm font-medium">
            External Control: {expanded ? "Expanded" : "Collapsed"}
          </span>
          <button
            onClick={() => setExpanded(!expanded)}
            className="px-3 py-1 text-xs bg-primary text-primary-foreground rounded"
          >
            Toggle
          </button>
        </div>
        <CollapsibleSection
          title="Controlled Section"
          expanded={expanded}
          onExpandedChange={setExpanded}
        >
          <SampleCards />
        </CollapsibleSection>
      </div>
    );
  },
};

// Multiple sections
export const MultipleSections: Story = {
  render: () => (
    <div className="space-y-8">
      <CollapsibleSection title="Player Statistics">
        <SampleCards />
      </CollapsibleSection>
      <CollapsibleSection title="Recent Matches" defaultExpanded={false}>
        <SampleList />
      </CollapsibleSection>
      <CollapsibleSection title="Achievements">
        <div className="grid gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <p className="text-sm text-center">Achievement {i}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </CollapsibleSection>
    </div>
  ),
};

// Long content
export const LongContent: Story = {
  args: {
    title: "Long Content Section",
    children: (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 12 }, (_, i) => (
          <Card key={i}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">
                Item {i + 1}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Content for item {i + 1}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    ),
  },
};

// Empty state
export const EmptyState: Story = {
  args: {
    title: "Empty Section",
    children: (
      <div className="text-center py-8 text-muted-foreground">
        No content available
      </div>
    ),
  },
};
