// eslint-disable-next-line storybook/no-renderer-packages
import type { Meta, StoryObj } from "@storybook/react";
import { Carousel3D } from "@/components/ui/3d-carousel";
import { PlayerCard } from "@/components/ui/player-card";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Player } from "@/lib/types";

// Mock player data for stories
const mockPlayers: Player[] = [
  {
    account_id: 1,
    name: "Grilha",
    name_id: "grilha",
    adc: 1200,
    jungle: 1100,
    mid: 1300,
    support: 1000,
    top: 1150,
  },
  {
    account_id: 2,
    name: "Pedro",
    name_id: "pedro",
    adc: 1150,
    jungle: 1200,
    mid: 1250,
    support: 1100,
    top: 1050,
  },
  {
    account_id: 3,
    name: "João",
    name_id: "joao",
    adc: 1000,
    jungle: 1050,
    mid: 1100,
    support: 1200,
    top: 1150,
  },
  {
    account_id: 4,
    name: "Maria",
    name_id: "maria",
    adc: 1300,
    jungle: 1000,
    mid: 1200,
    support: 1150,
    top: 1100,
  },
  {
    account_id: 5,
    name: "Ana",
    name_id: "ana",
    adc: 1100,
    jungle: 1150,
    mid: 1000,
    support: 1300,
    top: 1200,
  },
];

const meta: Meta<typeof Carousel3D> = {
  title: "UI/Carousel3D",
  component: Carousel3D,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    autoRotate: {
      control: "boolean",
      description: "Enable automatic rotation",
    },
    autoRotateDelay: {
      control: { type: "number", min: 1000, max: 10000, step: 500 },
      description: "Delay between rotations in milliseconds",
    },
    initialIndex: {
      control: { type: "number", min: 0, max: 10, step: 1 },
      description: "Initial index to start the carousel",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic story with player cards
export const Default: Story = {
  args: {
    items: mockPlayers.map((player) => ({
      id: player.account_id,
      content: <PlayerCard player={player} />,
    })),
    autoRotate: true,
    autoRotateDelay: 3000,
    className: "w-full h-96",
  },
};

// Story with custom cards
export const CustomCards: Story = {
  args: {
    items: [
      {
        id: 1,
        content: (
          <Card className="w-64 h-40 flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-white">
            <div className="text-center">
              <h3 className="text-xl font-bold">Card 1</h3>
              <p className="text-sm opacity-90">Custom content</p>
            </div>
          </Card>
        ),
      },
      {
        id: 2,
        content: (
          <Card className="w-64 h-40 flex items-center justify-center bg-gradient-to-br from-green-500 to-teal-600 text-white">
            <div className="text-center">
              <h3 className="text-xl font-bold">Card 2</h3>
              <p className="text-sm opacity-90">Custom content</p>
            </div>
          </Card>
        ),
      },
      {
        id: 3,
        content: (
          <Card className="w-64 h-40 flex items-center justify-center bg-gradient-to-br from-orange-500 to-red-600 text-white">
            <div className="text-center">
              <h3 className="text-xl font-bold">Card 3</h3>
              <p className="text-sm opacity-90">Custom content</p>
            </div>
          </Card>
        ),
      },
      {
        id: 4,
        content: (
          <Card className="w-64 h-40 flex items-center justify-center bg-gradient-to-br from-pink-500 to-rose-600 text-white">
            <div className="text-center">
              <h3 className="text-xl font-bold">Card 4</h3>
              <p className="text-sm opacity-90">Custom content</p>
            </div>
          </Card>
        ),
      },
      {
        id: 5,
        content: (
          <Card className="w-64 h-40 flex items-center justify-center bg-gradient-to-br from-indigo-500 to-blue-600 text-white">
            <div className="text-center">
              <h3 className="text-xl font-bold">Card 5</h3>
              <p className="text-sm opacity-90">Custom content</p>
            </div>
          </Card>
        ),
      },
    ],
    autoRotate: true,
    autoRotateDelay: 2500,
    className: "w-full h-96",
  },
};

// Story with badges
export const BadgeItems: Story = {
  args: {
    items: [
      { id: "react", content: <Badge variant="default">React</Badge> },
      {
        id: "typescript",
        content: <Badge variant="secondary">TypeScript</Badge>,
      },
      { id: "nextjs", content: <Badge variant="outline">Next.js</Badge> },
      {
        id: "tailwind",
        content: <Badge variant="destructive">Tailwind</Badge>,
      },
      { id: "storybook", content: <Badge variant="default">Storybook</Badge> },
    ],
    autoRotate: true,
    autoRotateDelay: 2000,
    className: "w-full h-96",
  },
};

// Story with no auto-rotation
export const NoAutoRotate: Story = {
  args: {
    items: mockPlayers.slice(0, 3).map((player) => ({
      id: player.account_id,
      content: <PlayerCard player={player} />,
    })),
    autoRotate: false,
    className: "w-full h-96",
  },
};

// Story with fast rotation
export const FastRotation: Story = {
  args: {
    items: mockPlayers.map((player) => ({
      id: player.account_id,
      content: <PlayerCard player={player} />,
    })),
    autoRotate: true,
    autoRotateDelay: 1000,
    className: "w-full h-96",
  },
};

// Story with slow rotation
export const SlowRotation: Story = {
  args: {
    items: mockPlayers.map((player) => ({
      id: player.account_id,
      content: <PlayerCard player={player} />,
    })),
    autoRotate: true,
    autoRotateDelay: 6000,
    className: "w-full h-96",
  },
};

// Story with few items
export const FewItems: Story = {
  args: {
    items: mockPlayers.slice(0, 2).map((player) => ({
      id: player.account_id,
      content: <PlayerCard player={player} />,
    })),
    autoRotate: true,
    autoRotateDelay: 3000,
    className: "w-full h-96",
  },
};

// Story with many items
export const ManyItems: Story = {
  args: {
    items: [
      ...mockPlayers,
      ...mockPlayers.map((player, index) => ({
        ...player,
        account_id: Number(player.account_id) + 10,
        name: `${player.name} ${index + 1}`,
        name_id: `${player.name_id}_${index + 1}`,
      })),
    ].map((player) => ({
      id: player.account_id,
      content: <PlayerCard player={player} />,
    })),
    autoRotate: true,
    autoRotateDelay: 2000,
    className: "w-full h-96",
  },
};

// Story with 20 cards
export const TwentyCards: Story = {
  args: {
    items: Array.from({ length: 20 }, (_, index) => ({
      id: index + 1,
      content: (
        <Card className="w-64 h-40 flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-white">
          <div className="text-center">
            <h3 className="text-xl font-bold">Card {index + 1}</h3>
            <p className="text-sm opacity-90">Item {index + 1}</p>
          </div>
        </Card>
      ),
    })),
    autoRotate: true,
    autoRotateDelay: 1500,
    className: "w-full h-96",
  },
};

// Story with custom initial index
export const CustomInitialIndex: Story = {
  args: {
    items: mockPlayers.map((player) => ({
      id: player.account_id,
      content: <PlayerCard player={player} />,
    })),
    autoRotate: true,
    autoRotateDelay: 3000,
    className: "w-full h-96",
    initialIndex: 2,
  },
};
