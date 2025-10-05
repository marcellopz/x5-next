// eslint-disable-next-line storybook/no-renderer-packages
import type { Meta, StoryObj } from "@storybook/react";
import { CompactLeaderboard } from "@/components/ui/compact-leaderboard";
import type { LeaderboardItem } from "@/components/ui/compact-leaderboard";
import { useState } from "react";

const meta = {
  title: "UI/CompactLeaderboard",
  component: CompactLeaderboard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="w-[400px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CompactLeaderboard>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample data
const topPlayers: LeaderboardItem[] = [
  { id: "1", label: "ProPlayer123", value: "2,450", subtitle: "Diamond I" },
  { id: "2", label: "GamerKing", value: "2,380", subtitle: "Diamond II" },
  { id: "3", label: "SkillMaster", value: "2,310", subtitle: "Diamond III" },
  { id: "4", label: "NoobSlayer", value: "2,245", subtitle: "Platinum I" },
  { id: "5", label: "TeamPlayer", value: "2,180", subtitle: "Platinum I" },
  { id: "6", label: "SoloCarry", value: "2,120", subtitle: "Platinum II" },
  { id: "7", label: "SupportMain", value: "2,050", subtitle: "Platinum III" },
  { id: "8", label: "JungleKing", value: "1,980", subtitle: "Platinum III" },
];

const winRates: LeaderboardItem[] = [
  { id: "1", label: "WinMachine", value: "75.5%" },
  { id: "2", label: "ProPlayer123", value: "68.2%" },
  { id: "3", label: "Consistent", value: "62.8%" },
  { id: "4", label: "GoodPlayer", value: "58.4%" },
  { id: "5", label: "Average", value: "52.1%" },
];

const shortList: LeaderboardItem[] = [
  { id: "1", label: "First Place", value: "100" },
  { id: "2", label: "Second Place", value: "95" },
];

// Default story
export const Default: Story = {
  args: {
    items: topPlayers,
    title: "Top Players",
  },
};

// With title
export const WithTitle: Story = {
  args: {
    items: winRates,
    title: "Highest Win Rates",
  },
};

// Without title
export const WithoutTitle: Story = {
  args: {
    items: winRates,
  },
};

// Custom initial and max counts
export const CustomCounts: Story = {
  args: {
    items: topPlayers,
    title: "Top 5 Players",
    initialCount: 5,
    maxCount: 8,
  },
};

// With expanded action button
export const WithExpandedAction: Story = {
  args: {
    items: topPlayers,
    title: "Top Players",
    expandedAction: {
      label: "View Full Leaderboard",
      onClick: () => alert("Navigate to full leaderboard"),
    },
  },
};

// With collapsed action button (See All)
export const WithCollapsedAction: Story = {
  args: {
    items: topPlayers,
    title: "Top Players",
    collapsedAction: {
      label: "See All Players",
      onClick: () => alert("Navigate to all players page"),
    },
  },
};

// With both expanded and collapsed actions
export const WithBothActions: Story = {
  args: {
    items: topPlayers,
    title: "Top Players",
    expandedAction: {
      label: "View Full Leaderboard",
      onClick: () => alert("Navigate to full leaderboard"),
    },
    collapsedAction: {
      label: "See All Players",
      onClick: () => alert("Navigate to all players page"),
    },
  },
};

// Short list (no show more button)
export const ShortList: Story = {
  args: {
    items: shortList,
    title: "Limited Items",
  },
};

// Empty state
export const Empty: Story = {
  args: {
    items: [],
    title: "No Data",
  },
};

// Controlled component
export const Controlled: Story = {
  args: {
    items: topPlayers,
  },
  render: () => {
    const [expanded, setExpanded] = useState(false);

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
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
        <CompactLeaderboard
          items={topPlayers}
          title="Controlled Leaderboard"
          expanded={expanded}
          onExpandedChange={setExpanded}
        />
      </div>
    );
  },
};

// Custom render item
export const CustomRenderItem: Story = {
  args: {
    items: winRates,
    title: "Custom Styled Items",
    renderItem: (item, index) => (
      <div
        key={item.id}
        className="flex items-center justify-between py-3 px-4 rounded-lg bg-accent/50 hover:bg-accent transition-colors border border-border"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-sm font-bold text-primary">{index + 1}</span>
          </div>
          <span className="text-sm font-medium">{item.label}</span>
        </div>
        <span className="text-lg font-bold text-primary">{item.value}</span>
      </div>
    ),
  },
};

// Multiple leaderboards side by side
export const MultipleSideBySide: Story = {
  args: {
    items: topPlayers,
  },
  render: () => (
    <div className="grid grid-cols-2 gap-4 w-[800px]">
      <CompactLeaderboard items={topPlayers} title="Top Players" />
      <CompactLeaderboard
        items={winRates}
        title="Win Rates"
        expandedAction={{
          label: "View All Stats",
          onClick: () => alert("View all stats"),
        }}
      />
    </div>
  ),
};

// With subtitles
export const WithSubtitles: Story = {
  args: {
    items: topPlayers,
    title: "Players with Ranks",
  },
};

// Different data types
export const KDALeaderboard: Story = {
  args: {
    items: [
      { id: "1", label: "KDAMaster", value: "5.2", subtitle: "156 games" },
      { id: "2", label: "ProPlayer", value: "4.8", subtitle: "203 games" },
      { id: "3", label: "Skilled", value: "4.5", subtitle: "178 games" },
      { id: "4", label: "GoodPlayer", value: "3.9", subtitle: "145 games" },
      { id: "5", label: "Average", value: "3.2", subtitle: "198 games" },
      { id: "6", label: "Learning", value: "2.8", subtitle: "89 games" },
    ],
    title: "Average KDA",
  },
};
