import type { ColorModeChoice } from "@/lib/color-mode";

export function notifyColorModeChoice(choice: ColorModeChoice) {
  window.workdome?.setColorModeChoice(choice);
}
