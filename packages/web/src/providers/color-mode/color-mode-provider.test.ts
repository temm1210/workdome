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

  it("설정한 색 모드가 없으면 OS 설정을 따른다", () => {
    fakeOsColorScheme("dark");
    const { result } = renderUseColorMode();
    expect(result.current.colorMode).toBe("dark");
    expect(result.current.colorModeChoice).toBe("system");
    expect(isPageDark()).toBe(true);
  });

  it("마운트되면 설정한 색 모드를 setColorModeChoice에 넘긴다", async () => {
    fakeOsColorScheme("light");
    const { result, unmount } = renderUseColorMode();
    await act(async () => {
      result.current.setColorMode("dark");
    });
    unmount();
    const setColorModeChoice = vi.fn();
    vi.stubGlobal("workdome", { setColorModeChoice });
    renderUseColorMode();
    expect(setColorModeChoice).toHaveBeenCalledWith("dark");
  });

  describe("setColorMode", () => {
    it("dark로 설정하면 dark가 된다", async () => {
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

    it("설정한 값은 다시 마운트해도 그대로다", async () => {
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

    it("system으로 설정하면 setColorModeChoice에 system을 넘긴다", async () => {
      fakeOsColorScheme("dark");
      const setColorModeChoice = vi.fn();
      vi.stubGlobal("workdome", { setColorModeChoice });
      const { result } = renderUseColorMode();
      await act(async () => {
        result.current.setColorMode("light");
      });
      await act(async () => {
        result.current.setColorMode("system");
      });
      expect(setColorModeChoice).toHaveBeenLastCalledWith("system");
    });
  });

  it("설정한 색 모드가 없으면 OS 설정이 바뀔 때 따라 바뀐다", async () => {
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
