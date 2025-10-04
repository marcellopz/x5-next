// eslint-disable-next-line storybook/no-renderer-packages
import type { Meta, StoryObj } from "@storybook/react";
import { PlayerCard } from "@/components/ui/player-card";
import type { Player } from "@/lib/types";

const meta = {
  title: "UI/PlayerCard",
  component: PlayerCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof PlayerCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample player data
const samplePlayer: Player = {
  account_id: 12345,
  name: "SamplePlayer",
  name_id: "sample_player",
  adc: 1200,
  jungle: 1350,
  mid: 1450,
  support: 1100,
  top: 1500,
};

const proPlayer: Player = {
  account_id: 67890,
  name: "ProGamer2024",
  name_id: "pro_gamer_2024",
  adc: 2500,
  jungle: 2400,
  mid: 2600,
  support: 2300,
  top: 2550,
};

const newPlayer: Player = {
  account_id: 11111,
  name: "NewbiePlayer",
  name_id: "newbie_player",
  adc: 800,
  jungle: 750,
  mid: 820,
  support: 790,
  top: 810,
};

const longNamePlayer: Player = {
  account_id: 22222,
  name: "ThisIsAVeryLongPlayerNameThatShouldTruncate",
  name_id: "long_name_player",
  adc: 1500,
  jungle: 1500,
  mid: 1500,
  support: 1500,
  top: 1500,
};

export const Default: Story = {
  args: {
    player: samplePlayer,
  },
};

export const ProPlayer: Story = {
  args: {
    player: proPlayer,
  },
};

export const NewPlayer: Story = {
  args: {
    player: newPlayer,
  },
};

export const LongName: Story = {
  args: {
    player: longNamePlayer,
  },
};

export const MultipleCards: Story = {
  args: {
    player: samplePlayer,
  },
  render: () => (
    <div className="flex gap-4 flex-wrap">
      <PlayerCard player={samplePlayer} />
      <PlayerCard player={proPlayer} />
      <PlayerCard player={newPlayer} />
    </div>
  ),
};

export const Grid: Story = {
  args: {
    player: samplePlayer,
  },
  render: () => (
    <div className="grid grid-cols-3 gap-4">
      <PlayerCard player={samplePlayer} />
      <PlayerCard player={proPlayer} />
      <PlayerCard player={newPlayer} />
      <PlayerCard player={longNamePlayer} />
      <PlayerCard player={{ ...samplePlayer, name: "Player 5" }} />
      <PlayerCard player={{ ...proPlayer, name: "Player 6" }} />
    </div>
  ),
};
