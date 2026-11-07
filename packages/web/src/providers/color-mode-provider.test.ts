import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useColorMode } from "@/hooks";

import { ColorModeProvider } from "./color-mode-provider";

// OS color scheme setting (jsdom has no matchMedia), returns an OS setting change
function fakeOsColorScheme(colorScheme: "light" | "dark") {
  const darkScheme = Object.assign(new EventTarget(), {
    matches: colorScheme === "dark",
  });
  vi.stubGlobal("matchMedia", (query: string) =>
    query === "(prefers-color-scheme: dark)"
      ? darkScheme
      : Object.assign(new EventTarget(), { matches: false }),
  );
  return (next: "light" | "dark") => {
    darkScheme.matches = next === "dark";
    darkScheme.dispatchEvent(new Event("change"));
  };
}

// Color mode saved from the last visit
function setSavedColorModeChoice(value: string) {
  localStorage.setItem("color-mode", value);
}

function getSavedColorModeChoice() {
  return localStorage.getItem("color-mode");
}

// Change from another window (storage event reaches only other windows)
function saveInOtherWindow(value: string) {
  localStorage.setItem("color-mode", value);
  window.dispatchEvent(new StorageEvent("storage", { key: "color-mode" }));
}

function clearInOtherWindow() {
  localStorage.clear();
  window.dispatchEvent(new StorageEvent("storage", { key: null }));
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
    vi.restoreAllMocks();
  });

  it("ColorModeProvider 밖에서 쓰면 에러를 던진다", () => {
    fakeOsColorScheme("light");
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => renderHook(() => useColorMode())).toThrow(
      "useColorMode must be used inside ColorModeProvider",
    );
  });

  describe("처음 값", () => {
    it("저장된 값이 없으면 OS 설정이 라이트일 때 light다", () => {
      fakeOsColorScheme("light");
      const { result } = renderUseColorMode();
      expect(result.current.colorMode).toBe("light");
      expect(result.current.colorModeChoice).toBe("system");
      expect(isPageDark()).toBe(false);
    });

    it("저장된 값이 없으면 OS 설정이 다크일 때 dark다", () => {
      fakeOsColorScheme("dark");
      const { result } = renderUseColorMode();
      expect(result.current.colorMode).toBe("dark");
      expect(result.current.colorModeChoice).toBe("system");
      expect(isPageDark()).toBe(true);
    });

    it("저장된 값이 system이면 OS 설정을 따른다", () => {
      setSavedColorModeChoice("system");
      fakeOsColorScheme("dark");
      const { result } = renderUseColorMode();
      expect(result.current.colorMode).toBe("dark");
      expect(result.current.colorModeChoice).toBe("system");
      expect(isPageDark()).toBe(true);
    });

    it("저장된 값이 light·dark·system이 아니면 OS 설정을 따른다", () => {
      setSavedColorModeChoice("blue");
      fakeOsColorScheme("dark");
      const { result } = renderUseColorMode();
      expect(result.current.colorMode).toBe("dark");
      expect(result.current.colorModeChoice).toBe("system");
      expect(isPageDark()).toBe(true);
    });

    it("저장된 값이 light면 OS 설정이 다크여도 light다", () => {
      setSavedColorModeChoice("light");
      fakeOsColorScheme("dark");
      const { result } = renderUseColorMode();
      expect(result.current.colorMode).toBe("light");
      expect(result.current.colorModeChoice).toBe("light");
      expect(isPageDark()).toBe(false);
    });

    it("저장된 값이 dark면 OS 설정이 라이트여도 dark다", () => {
      setSavedColorModeChoice("dark");
      fakeOsColorScheme("light");
      const { result } = renderUseColorMode();
      expect(result.current.colorMode).toBe("dark");
      expect(result.current.colorModeChoice).toBe("dark");
      expect(isPageDark()).toBe(true);
    });
  });

  describe("setColorMode", () => {
    it("dark를 고르면 화면이 dark로 바뀐다", async () => {
      fakeOsColorScheme("light");
      const { result } = renderUseColorMode();
      await act(async () => {
        result.current.setColorMode("dark");
      });
      expect(result.current.colorMode).toBe("dark");
      expect(result.current.colorModeChoice).toBe("dark");
      expect(isPageDark()).toBe(true);
    });

    it("고른 값은 다음에 열 때 쓰도록 저장된다", async () => {
      fakeOsColorScheme("light");
      const { result } = renderUseColorMode();
      await act(async () => {
        result.current.setColorMode("dark");
      });
      expect(getSavedColorModeChoice()).toBe("dark");
    });

    it("dark에서 light를 고르면 화면이 light로 바뀐다", async () => {
      fakeOsColorScheme("light");
      const { result } = renderUseColorMode();
      await act(async () => {
        result.current.setColorMode("dark");
      });
      await act(async () => {
        result.current.setColorMode("light");
      });
      expect(result.current.colorMode).toBe("light");
      expect(result.current.colorModeChoice).toBe("light");
      expect(isPageDark()).toBe(false);
    });

    it("light에서 system을 고르면 OS 설정을 따른다", async () => {
      fakeOsColorScheme("dark");
      const { result } = renderUseColorMode();
      await act(async () => {
        result.current.setColorMode("light");
      });
      await act(async () => {
        result.current.setColorMode("system");
      });
      expect(result.current.colorMode).toBe("dark");
      expect(result.current.colorModeChoice).toBe("system");
      expect(isPageDark()).toBe(true);
    });

    it("한 곳에서 바꾸면 useColorMode를 쓰는 다른 곳도 같은 값이 된다", async () => {
      fakeOsColorScheme("light");
      const { result } = renderHook(
        () => ({ first: useColorMode(), second: useColorMode() }),
        { wrapper: ColorModeProvider },
      );
      await act(async () => {
        result.current.first.setColorMode("dark");
      });
      expect(result.current.second.colorMode).toBe("dark");
    });
  });

  describe("OS 설정이 바뀔 때", () => {
    it("system이면 OS 설정이 다크로 바뀔 때 dark가 된다", async () => {
      const changeOsColorScheme = fakeOsColorScheme("light");
      const { result } = renderUseColorMode();
      await act(async () => {
        changeOsColorScheme("dark");
      });
      expect(result.current.colorMode).toBe("dark");
      expect(result.current.colorModeChoice).toBe("system");
      expect(isPageDark()).toBe(true);
    });

    it("light를 골랐으면 OS 설정이 다크로 바뀌어도 light다", async () => {
      setSavedColorModeChoice("light");
      const changeOsColorScheme = fakeOsColorScheme("light");
      const { result } = renderUseColorMode();
      await act(async () => {
        changeOsColorScheme("dark");
      });
      expect(result.current.colorMode).toBe("light");
      expect(result.current.colorModeChoice).toBe("light");
      expect(isPageDark()).toBe(false);
    });
  });

  describe("다른 창에서 바꿀 때", () => {
    it("다른 창에서 dark를 고르면 이 창도 dark가 된다", async () => {
      fakeOsColorScheme("light");
      const { result } = renderUseColorMode();
      await act(async () => {
        saveInOtherWindow("dark");
      });
      expect(result.current.colorMode).toBe("dark");
      expect(result.current.colorModeChoice).toBe("dark");
      expect(isPageDark()).toBe(true);
    });

    it("다른 창에서 저장된 값을 모두 지우면 OS 설정을 따른다", async () => {
      setSavedColorModeChoice("light");
      fakeOsColorScheme("dark");
      const { result } = renderUseColorMode();
      await act(async () => {
        clearInOtherWindow();
      });
      expect(result.current.colorMode).toBe("dark");
      expect(result.current.colorModeChoice).toBe("system");
      expect(isPageDark()).toBe(true);
    });
  });
});
