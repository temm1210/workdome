import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ColorModeProvider, useColorMode } from ".";
import type { ColorMode } from ".";

// OS color scheme setting (jsdom has no matchMedia), returns an OS setting change
function fakeOsColorScheme(colorScheme: ColorMode) {
  const darkScheme = Object.assign(new EventTarget(), {
    matches: colorScheme === "dark",
  });
  vi.stubGlobal("matchMedia", (query: string) =>
    query === "(prefers-color-scheme: dark)"
      ? darkScheme
      : Object.assign(new EventTarget(), { matches: false }),
  );
  return (next: ColorMode) => {
    darkScheme.matches = next === "dark";
    darkScheme.dispatchEvent(new Event("change"));
  };
}

function isPageDark() {
  return document.documentElement.classList.contains("dark");
}

function renderUseColorMode() {
  return renderHook(() => useColorMode(), { wrapper: ColorModeProvider });
}

describe("ColorModeProvider", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("dark");
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("처음 열면 OS 설정대로 보인다", () => {
    fakeOsColorScheme("dark");
    const { result } = renderUseColorMode();
    expect(result.current.colorMode).toBe("dark");
    expect(result.current.colorModeChoice).toBe("system");
    expect(isPageDark()).toBe(true);
  });

  describe("setColorMode", () => {
    it("dark를 고르면 dark로 바뀐다", async () => {
      fakeOsColorScheme("light");
      const { result } = renderUseColorMode();
      expect(result.current.colorMode).toBe("light");
      expect(isPageDark()).toBe(false);
      await act(async () => {
        result.current.setColorMode("dark");
      });
      expect(result.current.colorMode).toBe("dark");
      expect(result.current.colorModeChoice).toBe("dark");
      expect(isPageDark()).toBe(true);
    });

    it("고른 모드는 다시 열어도 그대로다", async () => {
      fakeOsColorScheme("light");
      const { result, unmount } = renderUseColorMode();
      expect(result.current.colorMode).toBe("light");
      await act(async () => {
        result.current.setColorMode("dark");
      });
      unmount();
      expect(renderUseColorMode().result.current).toMatchObject({
        colorMode: "dark",
        colorModeChoice: "dark",
      });
    });

    it("한 곳에서 바꾸면 다른 곳도 같이 바뀐다", async () => {
      fakeOsColorScheme("light");
      const { result } = renderHook(
        () => ({ setter: useColorMode(), reader: useColorMode() }),
        { wrapper: ColorModeProvider },
      );
      expect(result.current.reader.colorMode).toBe("light");
      await act(async () => {
        result.current.setter.setColorMode("dark");
      });
      expect(result.current.reader.colorMode).toBe("dark");
    });
  });

  it("OS 설정이 바뀌면 따라 바뀐다", async () => {
    const changeOsColorScheme = fakeOsColorScheme("light");
    const { result } = renderUseColorMode();
    expect(result.current.colorMode).toBe("light");
    expect(isPageDark()).toBe(false);
    await act(async () => {
      changeOsColorScheme("dark");
    });
    expect(result.current.colorMode).toBe("dark");
    expect(isPageDark()).toBe(true);
  });
});
