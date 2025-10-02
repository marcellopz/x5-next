// eslint-disable-next-line storybook/no-renderer-packages
import type { Meta, StoryObj } from "@storybook/react";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  useTableData,
} from "../components/ui/table";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";

const meta: Meta<typeof Table> = {
  title: "UI/Table",
  component: Table,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    className: {
      control: "text",
      description: "Additional CSS classes",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Sample data for stories
const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    totalAmountValue: 250,
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    totalAmountValue: 150,
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    totalAmountValue: 350,
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV004",
    paymentStatus: "Paid",
    totalAmount: "$450.00",
    totalAmountValue: 450,
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV005",
    paymentStatus: "Paid",
    totalAmount: "$550.00",
    totalAmountValue: 550,
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV006",
    paymentStatus: "Pending",
    totalAmount: "$200.00",
    totalAmountValue: 200,
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV007",
    paymentStatus: "Unpaid",
    totalAmount: "$300.00",
    totalAmountValue: 300,
    paymentMethod: "Credit Card",
  },
];

const players = [
  {
    name: "Grilha",
    rank: "Diamond IV",
    wins: 45,
    losses: 32,
    winRate: 58.4,
    winRateDisplay: "58.4%",
    status: "Online",
  },
  {
    name: "Pedro",
    rank: "Platinum II",
    wins: 38,
    losses: 29,
    winRate: 56.7,
    winRateDisplay: "56.7%",
    status: "Offline",
  },
  {
    name: "João",
    rank: "Gold I",
    wins: 52,
    losses: 41,
    winRate: 55.9,
    winRateDisplay: "55.9%",
    status: "In Game",
  },
  {
    name: "Miguel",
    rank: "Silver III",
    wins: 29,
    losses: 35,
    winRate: 45.3,
    winRateDisplay: "45.3%",
    status: "Online",
  },
];

// Component to render sorted invoice data
const SortableInvoiceTable = () => {
  const sortedInvoices = useTableData() as typeof invoices;

  return (
    <>
      <TableHeader>
        <TableRow>
          <TableHead sortable sortKey="invoice" className="w-[100px]">
            Invoice
          </TableHead>
          <TableHead sortable sortKey="paymentStatus">
            Status
          </TableHead>
          <TableHead sortable sortKey="paymentMethod">
            Method
          </TableHead>
          <TableHead sortable sortKey="totalAmountValue" className="text-right">
            Amount
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedInvoices.map((invoice) => (
          <TableRow key={invoice.invoice}>
            <TableCell className="font-medium">{invoice.invoice}</TableCell>
            <TableCell>{invoice.paymentStatus}</TableCell>
            <TableCell>{invoice.paymentMethod}</TableCell>
            <TableCell className="text-right">{invoice.totalAmount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </>
  );
};

// Component to render sorted player data
const SortablePlayerTable = () => {
  const sortedPlayers = useTableData() as typeof players;

  return (
    <>
      <TableHeader>
        <TableRow>
          <TableHead sortable sortKey="name">
            Player
          </TableHead>
          <TableHead sortable sortKey="rank">
            Rank
          </TableHead>
          <TableHead sortable sortKey="wins">
            Wins
          </TableHead>
          <TableHead sortable sortKey="losses">
            Losses
          </TableHead>
          <TableHead sortable sortKey="winRate">
            Win Rate
          </TableHead>
          <TableHead sortable sortKey="status">
            Status
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedPlayers.map((player) => (
          <TableRow key={player.name}>
            <TableCell className="font-medium">{player.name}</TableCell>
            <TableCell>{player.rank}</TableCell>
            <TableCell>{player.wins}</TableCell>
            <TableCell>{player.losses}</TableCell>
            <TableCell>{player.winRateDisplay}</TableCell>
            <TableCell>
              <Badge
                variant={
                  player.status === "Online"
                    ? "default"
                    : player.status === "In Game"
                    ? "secondary"
                    : "outline"
                }
              >
                {player.status}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </>
  );
};

export const Default: Story = {
  render: (args) => (
    <Table {...args}>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.invoice}>
            <TableCell className="font-medium">{invoice.invoice}</TableCell>
            <TableCell>{invoice.paymentStatus}</TableCell>
            <TableCell>{invoice.paymentMethod}</TableCell>
            <TableCell className="text-right">{invoice.totalAmount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

export const WithBadges: Story = {
  render: (args) => (
    <Table {...args}>
      <TableHeader>
        <TableRow>
          <TableHead>Player</TableHead>
          <TableHead>Rank</TableHead>
          <TableHead>W/L</TableHead>
          <TableHead>Win Rate</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {players.map((player) => (
          <TableRow key={player.name}>
            <TableCell className="font-medium">{player.name}</TableCell>
            <TableCell>{player.rank}</TableCell>
            <TableCell>
              {player.wins}/{player.losses}
            </TableCell>
            <TableCell>{player.winRateDisplay}</TableCell>
            <TableCell>
              <Badge
                variant={
                  player.status === "Online"
                    ? "default"
                    : player.status === "In Game"
                    ? "secondary"
                    : "outline"
                }
              >
                {player.status}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

export const SortableInvoices: Story = {
  render: (args) => (
    <Table
      {...args}
      data={invoices}
      sortConfig={{
        invoice: (item: unknown) => (item as (typeof invoices)[0]).invoice,
        paymentStatus: (item: unknown) =>
          (item as (typeof invoices)[0]).paymentStatus,
        paymentMethod: (item: unknown) =>
          (item as (typeof invoices)[0]).paymentMethod,
        totalAmountValue: (item: unknown) =>
          (item as (typeof invoices)[0]).totalAmountValue,
      }}
    >
      <SortableInvoiceTable />
    </Table>
  ),
};

export const SortablePlayers: Story = {
  render: (args) => (
    <Table
      {...args}
      data={players}
      sortConfig={{
        name: (item: unknown) => (item as (typeof players)[0]).name,
        rank: (item: unknown) => (item as (typeof players)[0]).rank,
        wins: (item: unknown) => (item as (typeof players)[0]).wins,
        losses: (item: unknown) => (item as (typeof players)[0]).losses,
        winRate: (item: unknown) => (item as (typeof players)[0]).winRate,
        status: (item: unknown) => (item as (typeof players)[0]).status,
      }}
    >
      <SortablePlayerTable />
    </Table>
  ),
};

export const WithFooter: Story = {
  render: (args) => (
    <Table {...args}>
      <TableHeader>
        <TableRow>
          <TableHead>Month</TableHead>
          <TableHead>Revenue</TableHead>
          <TableHead>Growth</TableHead>
          <TableHead className="text-right">Total</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">January</TableCell>
          <TableCell>$2,500.00</TableCell>
          <TableCell>+12%</TableCell>
          <TableCell className="text-right">$2,500.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">February</TableCell>
          <TableCell>$3,200.00</TableCell>
          <TableCell>+28%</TableCell>
          <TableCell className="text-right">$5,700.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">March</TableCell>
          <TableCell>$2,800.00</TableCell>
          <TableCell>-12.5%</TableCell>
          <TableCell className="text-right">$8,500.00</TableCell>
        </TableRow>
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">$8,500.00</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
};

export const WithActions: Story = {
  render: (args) => (
    <Table {...args}>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">John Doe</TableCell>
          <TableCell>john@example.com</TableCell>
          <TableCell>Admin</TableCell>
          <TableCell>
            <Badge variant="default">Active</Badge>
          </TableCell>
          <TableCell className="text-right">
            <div className="flex gap-2 justify-end">
              <Button variant="outline" size="sm">
                Edit
              </Button>
              <Button variant="destructive" size="sm">
                Delete
              </Button>
            </div>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Jane Smith</TableCell>
          <TableCell>jane@example.com</TableCell>
          <TableCell>User</TableCell>
          <TableCell>
            <Badge variant="secondary">Inactive</Badge>
          </TableCell>
          <TableCell className="text-right">
            <div className="flex gap-2 justify-end">
              <Button variant="outline" size="sm">
                Edit
              </Button>
              <Button variant="destructive" size="sm">
                Delete
              </Button>
            </div>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Bob Johnson</TableCell>
          <TableCell>bob@example.com</TableCell>
          <TableCell>Moderator</TableCell>
          <TableCell>
            <Badge variant="default">Active</Badge>
          </TableCell>
          <TableCell className="text-right">
            <div className="flex gap-2 justify-end">
              <Button variant="outline" size="sm">
                Edit
              </Button>
              <Button variant="destructive" size="sm">
                Delete
              </Button>
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

export const Minimal: Story = {
  render: (args) => (
    <Table {...args}>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Value</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Setting 1</TableCell>
          <TableCell>Enabled</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Setting 2</TableCell>
          <TableCell>Disabled</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Setting 3</TableCell>
          <TableCell>Auto</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

export const Empty: Story = {
  render: (args) => (
    <Table {...args}>
      <TableHeader>
        <TableRow>
          <TableHead>Column 1</TableHead>
          <TableHead>Column 2</TableHead>
          <TableHead>Column 3</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell colSpan={3} className="h-24 text-center">
            No results found.
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

export const Compact: Story = {
  render: (args) => (
    <Table {...args} compact>
      <TableHeader>
        <TableRow>
          <TableHead>Player</TableHead>
          <TableHead>Rank</TableHead>
          <TableHead>W/L</TableHead>
          <TableHead>Win Rate</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {players.map((player) => (
          <TableRow key={player.name}>
            <TableCell className="font-medium">{player.name}</TableCell>
            <TableCell>{player.rank}</TableCell>
            <TableCell>
              {player.wins}/{player.losses}
            </TableCell>
            <TableCell>{player.winRateDisplay}</TableCell>
            <TableCell>
              <Badge
                variant={
                  player.status === "Online"
                    ? "default"
                    : player.status === "In Game"
                    ? "secondary"
                    : "outline"
                }
              >
                {player.status}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

export const CompactSortable: Story = {
  render: (args) => (
    <Table
      {...args}
      compact
      data={players}
      sortConfig={{
        name: (item: unknown) => (item as (typeof players)[0]).name,
        rank: (item: unknown) => (item as (typeof players)[0]).rank,
        wins: (item: unknown) => (item as (typeof players)[0]).wins,
        losses: (item: unknown) => (item as (typeof players)[0]).losses,
        winRate: (item: unknown) => (item as (typeof players)[0]).winRate,
        status: (item: unknown) => (item as (typeof players)[0]).status,
      }}
    >
      <SortablePlayerTable />
    </Table>
  ),
};
