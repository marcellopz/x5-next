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

export const WithGroups: Story = {
  render: () => {
    const [value, setValue] = useState("");

    return (
      <div className="w-[300px] space-y-4">
        <Select
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Select a fruit"
          groups={[
            {
              label: "Citrus Fruits",
              options: [
                { value: "orange", label: "Orange" },
                { value: "lemon", label: "Lemon" },
                { value: "lime", label: "Lime" },
                { value: "grapefruit", label: "Grapefruit" },
              ],
            },
            {
              label: "Berries",
              options: [
                { value: "strawberry", label: "Strawberry" },
                { value: "blueberry", label: "Blueberry" },
                { value: "raspberry", label: "Raspberry" },
                { value: "blackberry", label: "Blackberry" },
              ],
            },
            {
              label: "Tropical Fruits",
              options: [
                { value: "mango", label: "Mango" },
                { value: "pineapple", label: "Pineapple" },
                { value: "banana", label: "Banana" },
                { value: "papaya", label: "Papaya" },
              ],
            },
          ]}
        />
        <p className="text-sm text-muted-foreground">
          Selected: {value || "Nothing selected"}
        </p>
      </div>
    );
  },
};

export const WithOptionsAndGroups: Story = {
  render: () => {
    const [value, setValue] = useState("");

    return (
      <div className="w-[300px] space-y-4">
        <Select
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Select a country"
          options={[{ value: "all", label: "All Countries" }]}
          groups={[
            {
              label: "North America",
              options: [
                { value: "us", label: "United States" },
                { value: "ca", label: "Canada" },
                { value: "mx", label: "Mexico" },
              ],
            },
            {
              label: "Europe",
              options: [
                { value: "uk", label: "United Kingdom" },
                { value: "de", label: "Germany" },
                { value: "fr", label: "France" },
                { value: "es", label: "Spain" },
                { value: "it", label: "Italy" },
              ],
            },
            {
              label: "Asia",
              options: [
                { value: "jp", label: "Japan" },
                { value: "cn", label: "China" },
                { value: "kr", label: "South Korea" },
                { value: "in", label: "India" },
              ],
            },
          ]}
        />
        <p className="text-sm text-muted-foreground">
          Selected: {value || "Nothing selected"}
        </p>
      </div>
    );
  },
};

export const WithOptionsOnly: Story = {
  render: () => {
    const [value, setValue] = useState("");

    return (
      <div className="w-[300px] space-y-4">
        <Select
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Select a color"
          options={[
            { value: "red", label: "Red" },
            { value: "blue", label: "Blue" },
            { value: "green", label: "Green" },
            { value: "yellow", label: "Yellow" },
            { value: "purple", label: "Purple" },
            { value: "orange", label: "Orange" },
          ]}
        />
        <p className="text-sm text-muted-foreground">
          Selected: {value || "Nothing selected"}
        </p>
      </div>
    );
  },
};

export const RolePlayerStatsExample: Story = {
  render: () => {
    const [selectedRole, setSelectedRole] = useState("all");
    const [selectedStat, setSelectedStat] = useState("wins");

    return (
      <div className="w-[400px] space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Lane</label>
          <Select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            options={[{ value: "all", label: "All Roles" }]}
            groups={[
              {
                label: "Lanes",
                options: [
                  { value: "top", label: "Top Lane" },
                  { value: "jungle", label: "Jungle" },
                  { value: "mid", label: "Mid Lane" },
                  { value: "adc", label: "Bot Lane" },
                  { value: "support", label: "Support" },
                ],
              },
            ]}
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">Statistic</label>
          <Select
            value={selectedStat}
            onChange={(e) => setSelectedStat(e.target.value)}
            groups={[
              {
                label: "Performance",
                options: [
                  { value: "wins", label: "Wins" },
                  { value: "kda", label: "KDA" },
                  { value: "score", label: "Score" },
                ],
              },
              {
                label: "Damage",
                options: [
                  {
                    value: "totalDamageDealtToChampions",
                    label: "Total Damage",
                  },
                  { value: "damagePerMinute", label: "Damage Per Minute" },
                  { value: "damageShare", label: "Damage Share" },
                ],
              },
              {
                label: "Economy",
                options: [
                  { value: "goldEarned", label: "Gold Earned" },
                  { value: "goldPerMinute", label: "Gold Per Minute" },
                  { value: "csPerMinute", label: "CS Per Minute" },
                ],
              },
            ]}
          />
        </div>
        <div className="p-4 bg-muted rounded-md">
          <p className="text-sm">
            <span className="font-medium">Selected Role:</span> {selectedRole}
          </p>
          <p className="text-sm">
            <span className="font-medium">Selected Stat:</span> {selectedStat}
          </p>
        </div>
      </div>
    );
  },
};

export const WithDisabledOptions: Story = {
  render: () => {
    const [value, setValue] = useState("");

    return (
      <div className="w-[300px] space-y-4">
        <Select
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Select an option"
          groups={[
            {
              label: "Available Options",
              options: [
                { value: "opt1", label: "Option 1" },
                { value: "opt2", label: "Option 2" },
                { value: "opt3", label: "Option 3" },
              ],
            },
            {
              label: "Unavailable Options",
              options: [
                { value: "opt4", label: "Option 4 (Disabled)", disabled: true },
                { value: "opt5", label: "Option 5 (Disabled)", disabled: true },
              ],
            },
            {
              label: "More Options",
              options: [
                { value: "opt6", label: "Option 6" },
                { value: "opt7", label: "Option 7" },
              ],
            },
          ]}
        />
        <p className="text-sm text-muted-foreground">
          Selected: {value || "Nothing selected"}
        </p>
      </div>
    );
  },
};
