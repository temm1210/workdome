import { withThemeByClassName } from "@storybook/addon-themes";
import type { Preview } from "@storybook/react-vite";

import { UiProvider } from "../src/providers/ui-provider";
import "./preview.css";

const preview: Preview = {
  decorators: [
    withThemeByClassName({
      themes: { light: "", dark: "dark" },
      defaultTheme: "light",
    }),
    (Story) => (
      <UiProvider>
        <Story />
      </UiProvider>
    ),
  ],
};

export default preview;
