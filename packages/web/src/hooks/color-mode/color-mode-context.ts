import { createContext } from "react";

import type { ColorMode, ColorModeChoice } from "@/lib/color-mode";

export type ColorModeContextValue = {
  colorMode: ColorMode;
  colorModeChoice: ColorModeChoice;
  setColorMode: (colorModeChoice: ColorModeChoice) => void;
};

export const ColorModeContext = createContext<ColorModeContextValue | null>(
  null,
);
