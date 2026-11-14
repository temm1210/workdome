export type ColorMode = "light" | "dark";
export type ColorModeChoice = ColorMode | "system";

const STORAGE_KEY = "color-mode";
const DARK_SCHEME_QUERY = "(prefers-color-scheme: dark)";

// Saved choice and OS setting → choice and applied color mode
export function getColorModeState(): {
  colorModeChoice: ColorModeChoice;
  colorMode: ColorMode;
} {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === "light" || saved === "dark") {
    return { colorModeChoice: saved, colorMode: saved };
  }
  return {
    colorModeChoice: "system",
    colorMode: window.matchMedia(DARK_SCHEME_QUERY).matches ? "dark" : "light",
  };
}

export function applyDocumentColorMode(colorMode: ColorMode) {
  document.documentElement.classList.toggle("dark", colorMode === "dark");
}

export function saveColorModeChoice(colorModeChoice: ColorModeChoice) {
  localStorage.setItem(STORAGE_KEY, colorModeChoice);
}

// Saved choice from other windows and OS setting changes
export function subscribeColorMode(listener: () => void) {
  const systemScheme = window.matchMedia(DARK_SCHEME_QUERY);
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY || event.key === null) listener();
  };
  window.addEventListener("storage", onStorage);
  systemScheme.addEventListener("change", listener);
  return () => {
    window.removeEventListener("storage", onStorage);
    systemScheme.removeEventListener("change", listener);
  };
}
