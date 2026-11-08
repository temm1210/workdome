import { SegmentedControl } from "@workdome/ui";
import type { SegmentedControlProps } from "@workdome/ui";

import { useColorMode } from "@/providers/color-mode";
import type { ColorModeChoice } from "@/providers/color-mode";

const colorModeOptions: SegmentedControlProps<ColorModeChoice>["options"] = [
  { value: "light", label: "라이트" },
  { value: "dark", label: "다크" },
  { value: "system", label: "시스템" },
];

export function ColorModeSwitcher() {
  const { colorModeChoice, setColorMode } = useColorMode();
  return (
    <SegmentedControl
      aria-label="색 모드"
      value={colorModeChoice}
      options={colorModeOptions}
      onValueChange={setColorMode}
    />
  );
}
