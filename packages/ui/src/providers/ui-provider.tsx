import type { ReactNode } from "react";
import { MotionConfig } from "motion/react";

export type UiProviderProps = { children: ReactNode };

// App-wide settings for ui components (follows the OS reduced motion setting)
export function UiProvider({ children }: UiProviderProps) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
