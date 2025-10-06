// eslint-disable-next-line storybook/no-renderer-packages
import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "@/components/ui/input";
import {
  Search,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Calendar,
  DollarSign,
  Phone,
  MapPin,
} from "lucide-react";
import { useState } from "react";

const meta = {
  title: "UI/Input",
  component: Input,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "select",
      options: ["text", "email", "password", "number", "tel", "url", "search"],
    },
    placeholder: {
      control: "text",
    },
    disabled: {
      control: "boolean",
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "Enter text...",
  },
};

export const WithStartIcon: Story = {
  args: {
    placeholder: "Search...",
    startIcon: <Search className="h-4 w-4" />,
  },
};

export const WithEndIcon: Story = {
  args: {
    placeholder: "Enter email...",
    type: "email",
    endIcon: <Mail className="h-4 w-4" />,
  },
};

export const WithBothIcons: Story = {
  args: {
    placeholder: "Search users...",
    startIcon: <Search className="h-4 w-4" />,
    endIcon: <User className="h-4 w-4" />,
  },
};

export const EmailInput: Story = {
  args: {
    type: "email",
    placeholder: "email@example.com",
    startIcon: <Mail className="h-4 w-4" />,
  },
};

export const PasswordInput: Story = {
  render: () => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className="w-[300px]">
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Enter password"
            startIcon={<Lock className="h-4 w-4" />}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    );
  },
};

export const SearchInput: Story = {
  args: {
    type: "search",
    placeholder: "Search...",
    startIcon: <Search className="h-4 w-4" />,
  },
};

export const DateInput: Story = {
  args: {
    type: "date",
    startIcon: <Calendar className="h-4 w-4" />,
  },
};

export const PriceInput: Story = {
  args: {
    type: "number",
    placeholder: "0.00",
    startIcon: <DollarSign className="h-4 w-4" />,
  },
};

export const PhoneInput: Story = {
  args: {
    type: "tel",
    placeholder: "+1 (555) 000-0000",
    startIcon: <Phone className="h-4 w-4" />,
  },
};

export const LocationInput: Story = {
  args: {
    type: "text",
    placeholder: "Enter location...",
    startIcon: <MapPin className="h-4 w-4" />,
  },
};

export const Disabled: Story = {
  args: {
    placeholder: "Disabled input",
    disabled: true,
    startIcon: <User className="h-4 w-4" />,
  },
};

export const WithValue: Story = {
  args: {
    value: "John Doe",
    startIcon: <User className="h-4 w-4" />,
  },
};

export const MultipleInputs: Story = {
  render: () => (
    <div className="w-[400px] space-y-4">
      <Input placeholder="Username" startIcon={<User className="h-4 w-4" />} />
      <Input
        type="email"
        placeholder="Email"
        startIcon={<Mail className="h-4 w-4" />}
      />
      <Input
        type="password"
        placeholder="Password"
        startIcon={<Lock className="h-4 w-4" />}
      />
      <Input
        type="search"
        placeholder="Search..."
        startIcon={<Search className="h-4 w-4" />}
      />
    </div>
  ),
};

export const FormExample: Story = {
  render: () => (
    <form className="w-[400px] space-y-4">
      <div>
        <label className="text-sm font-medium mb-2 block">Full Name</label>
        <Input
          placeholder="John Doe"
          startIcon={<User className="h-4 w-4" />}
        />
      </div>
      <div>
        <label className="text-sm font-medium mb-2 block">Email</label>
        <Input
          type="email"
          placeholder="john@example.com"
          startIcon={<Mail className="h-4 w-4" />}
        />
      </div>
      <div>
        <label className="text-sm font-medium mb-2 block">Phone</label>
        <Input
          type="tel"
          placeholder="+1 (555) 000-0000"
          startIcon={<Phone className="h-4 w-4" />}
        />
      </div>
      <div>
        <label className="text-sm font-medium mb-2 block">Location</label>
        <Input
          placeholder="New York, NY"
          startIcon={<MapPin className="h-4 w-4" />}
        />
      </div>
    </form>
  ),
};
