// eslint-disable-next-line storybook/no-renderer-packages
import type { Meta, StoryObj } from "@storybook/react";
import { Select } from "@/components/ui/select";
import { useState } from "react";

const meta = {
  title: "UI/Select",
  component: Select,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    placeholder: {
      control: "text",
    },
    disabled: {
      control: "boolean",
    },
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="w-[300px]">
      <Select placeholder="Select an option">
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
        <option value="option3">Option 3</option>
      </Select>
    </div>
  ),
};

export const WithLabel: Story = {
  render: () => (
    <div className="w-[300px]">
      <label className="text-sm font-medium mb-2 block">Select Country</label>
      <Select placeholder="Choose a country">
        <option value="us">United States</option>
        <option value="uk">United Kingdom</option>
        <option value="ca">Canada</option>
        <option value="au">Australia</option>
        <option value="de">Germany</option>
        <option value="fr">France</option>
      </Select>
    </div>
  ),
};

export const WithValue: Story = {
  render: () => (
    <div className="w-[300px]">
      <Select value="option2">
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
        <option value="option3">Option 3</option>
      </Select>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="w-[300px]">
      <Select placeholder="Disabled select" disabled>
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
        <option value="option3">Option 3</option>
      </Select>
    </div>
  ),
};

export const WithManyOptions: Story = {
  render: () => (
    <div className="w-[300px]">
      <Select placeholder="Select a color">
        <option value="red">Red</option>
        <option value="blue">Blue</option>
        <option value="green">Green</option>
        <option value="yellow">Yellow</option>
        <option value="purple">Purple</option>
        <option value="orange">Orange</option>
        <option value="pink">Pink</option>
        <option value="black">Black</option>
        <option value="white">White</option>
        <option value="gray">Gray</option>
      </Select>
    </div>
  ),
};

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState("");

    return (
      <div className="w-[300px] space-y-4">
        <Select
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Select an option"
        >
          <option value="option1">Option 1</option>
          <option value="option2">Option 2</option>
          <option value="option3">Option 3</option>
        </Select>
        <p className="text-sm text-muted-foreground">
          Selected: {value || "Nothing selected"}
        </p>
      </div>
    );
  },
};

export const FormExample: Story = {
  render: () => {
    const [formData, setFormData] = useState({
      country: "",
      language: "",
      theme: "",
    });

    return (
      <form className="w-[400px] space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Country</label>
          <Select
            value={formData.country}
            onChange={(e) =>
              setFormData({ ...formData, country: e.target.value })
            }
            placeholder="Select a country"
          >
            <option value="us">United States</option>
            <option value="uk">United Kingdom</option>
            <option value="ca">Canada</option>
            <option value="au">Australia</option>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">Language</label>
          <Select
            value={formData.language}
            onChange={(e) =>
              setFormData({ ...formData, language: e.target.value })
            }
            placeholder="Select a language"
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">Theme</label>
          <Select
            value={formData.theme}
            onChange={(e) =>
              setFormData({ ...formData, theme: e.target.value })
            }
            placeholder="Select a theme"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="auto">Auto</option>
          </Select>
        </div>
      </form>
    );
  },
};

export const MultipleSelects: Story = {
  render: () => (
    <div className="w-[400px] space-y-4">
      <div>
        <label className="text-sm font-medium mb-2 block">Top Laner</label>
        <Select placeholder="Select a player">
          <option value="player1">Player 1</option>
          <option value="player2">Player 2</option>
          <option value="player3">Player 3</option>
        </Select>
      </div>
      <div>
        <label className="text-sm font-medium mb-2 block">Jungler</label>
        <Select placeholder="Select a player">
          <option value="player1">Player 1</option>
          <option value="player2">Player 2</option>
          <option value="player3">Player 3</option>
        </Select>
      </div>
      <div>
        <label className="text-sm font-medium mb-2 block">Mid Laner</label>
        <Select placeholder="Select a player">
          <option value="player1">Player 1</option>
          <option value="player2">Player 2</option>
          <option value="player3">Player 3</option>
        </Select>
      </div>
    </div>
  ),
};

export const Compact: Story = {
  render: () => (
    <div className="w-[200px]">
      <Select placeholder="Select" className="h-8">
        <option value="opt1">Option 1</option>
        <option value="opt2">Option 2</option>
        <option value="opt3">Option 3</option>
      </Select>
    </div>
  ),
};
