import { applyDocumentColorMode, getColorModeState } from "@/lib/color-mode";

// Color mode applied before first paint
applyDocumentColorMode(getColorModeState().colorMode);
