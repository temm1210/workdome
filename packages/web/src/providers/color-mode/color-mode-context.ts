import type { ColorMode, ColorModeChoice } from "@/lib/color-mode";
import { createRequiredContext } from "@/utils/create-required-context";

export type { ColorMode, ColorModeChoice };

export type UseColorModeResult = {
  colorMode: ColorMode;
  colorModeChoice: ColorModeChoice;
  setColorMode: (colorModeChoice: ColorModeChoice) => void;
};

export const [ColorModeContext, useColorMode] =
  createRequiredContext<UseColorModeResult>({
    hookName: "useColorMode",
    providerName: "ColorModeProvider",
  });
