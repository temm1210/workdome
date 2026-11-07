export type ColorMode = "light" | "dark";
export type ColorModeChoice = ColorMode | "system";

const storageKey = "color-mode";
const darkSchemeQuery = "(prefers-color-scheme: dark)";

// Saved choice and OS setting → choice and applied color mode
export function getColorModeState(): {
  colorModeChoice: ColorModeChoice;
  colorMode: ColorMode;
} {
  const saved = localStorage.getItem(storageKey);
  if (saved === "light" || saved === "dark") {
    return { colorModeChoice: saved, colorMode: saved };
  }
  return {
    colorModeChoice: "system",
    colorMode: window.matchMedia(darkSchemeQuery).matches ? "dark" : "light",
  };
}

export function applyDocumentColorMode(colorMode: ColorMode) {
  document.documentElement.classList.toggle("dark", colorMode === "dark");
}

export function saveColorModeChoice(colorModeChoice: ColorModeChoice) {
  localStorage.setItem(storageKey, colorModeChoice);
}

// Saved choice from other windows and OS setting changes
export function subscribeColorMode(listener: () => void) {
  const systemScheme = window.matchMedia(darkSchemeQuery);
  const onStorage = (event: StorageEvent) => {
    if (event.key === storageKey || event.key === null) listener();
  };
  window.addEventListener("storage", onStorage);
  systemScheme.addEventListener("change", listener);
  return () => {
    window.removeEventListener("storage", onStorage);
    systemScheme.removeEventListener("change", listener);
  };
}
