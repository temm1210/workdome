import { useEffect, useState } from "react";
import type { ReactNode } from "react";

import { ColorModeContext } from "@/hooks/color-mode/color-mode-context";
import {
  applyDocumentColorMode,
  getColorModeState,
  saveColorModeChoice,
  subscribeColorMode,
} from "@/lib/color-mode";
import type { ColorModeChoice } from "@/lib/color-mode";

export type ColorModeProviderProps = { children: ReactNode };

export function ColorModeProvider({ children }: ColorModeProviderProps) {
  const [state, setState] = useState(getColorModeState);

  useEffect(() => subscribeColorMode(() => setState(getColorModeState())), []);

  useEffect(() => {
    applyDocumentColorMode(state.colorMode);
  }, [state.colorMode]);

  const setColorMode = (colorModeChoice: ColorModeChoice) => {
    saveColorModeChoice(colorModeChoice);
    setState(getColorModeState());
  };

  return (
    <ColorModeContext
      value={{
        colorMode: state.colorMode,
        colorModeChoice: state.colorModeChoice,
        setColorMode,
      }}
    >
      {children}
    </ColorModeContext>
  );
}
