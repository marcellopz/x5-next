import type { Preview } from "@storybook/nextjs";
import "../app/globals.css";
import React from "react";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: "dark",
      values: [
        {
          name: "dark",
          value: "hsl(220, 60%, 7%)",
        },
        {
          name: "light",
          value: "#ffffff",
        },
      ],
    },
    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },
  },
  decorators: [
    (Story) => (
      <div
        className="font-sans antialiased"
        style={{ fontFeatureSettings: '"rlig" 1, "calt" 1' }}
      >
        <Story />
      </div>
    ),
  ],
};

export default preview;
