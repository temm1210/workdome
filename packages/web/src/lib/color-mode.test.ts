import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  applyDocumentColorMode,
  getColorModeState,
  saveColorModeChoice,
  subscribeColorMode,
} from "./color-mode";
import type { ColorMode } from "./color-mode";

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

// Color mode saved from the last visit
function setSavedColorModeChoice(value: string) {
  localStorage.setItem("color-mode", value);
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

beforeEach(() => {
  localStorage.clear();
  document.documentElement.classList.remove("dark");
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("getColorModeState", () => {
  describe("저장된 값이 없으면", () => {
    it("OS가 light면 light를 돌려준다", () => {
      fakeOsColorScheme("light");
      expect(getColorModeState()).toEqual({
        colorModeChoice: "system",
        colorMode: "light",
      });
    });

    it("OS가 dark면 dark를 돌려준다", () => {
      fakeOsColorScheme("dark");
      expect(getColorModeState()).toEqual({
        colorModeChoice: "system",
        colorMode: "dark",
      });
    });
  });

  it("저장된 값이 system이면 OS 설정대로 돌려준다", () => {
    setSavedColorModeChoice("system");
    fakeOsColorScheme("dark");
    expect(getColorModeState()).toEqual({
      colorModeChoice: "system",
      colorMode: "dark",
    });
  });

  it("저장된 값이 잘못됐으면 OS 설정대로 돌려준다", () => {
    setSavedColorModeChoice("blue");
    fakeOsColorScheme("dark");
    expect(getColorModeState()).toEqual({
      colorModeChoice: "system",
      colorMode: "dark",
    });
  });

  it("저장된 값이 light면 OS와 상관없이 light를 돌려준다", () => {
    setSavedColorModeChoice("light");
    fakeOsColorScheme("dark");
    expect(getColorModeState()).toEqual({
      colorModeChoice: "light",
      colorMode: "light",
    });
  });

  it("저장된 값이 dark면 OS와 상관없이 dark를 돌려준다", () => {
    setSavedColorModeChoice("dark");
    fakeOsColorScheme("light");
    expect(getColorModeState()).toEqual({
      colorModeChoice: "dark",
      colorMode: "dark",
    });
  });
});

describe("saveColorModeChoice", () => {
  it("dark를 저장하면 다음에 dark로 읽힌다", () => {
    fakeOsColorScheme("light");
    saveColorModeChoice("dark");
    expect(getColorModeState()).toEqual({
      colorModeChoice: "dark",
      colorMode: "dark",
    });
  });

  it("system을 저장하면 다음에 OS 설정대로 읽힌다", () => {
    fakeOsColorScheme("dark");
    saveColorModeChoice("light");
    saveColorModeChoice("system");
    expect(getColorModeState()).toEqual({
      colorModeChoice: "system",
      colorMode: "dark",
    });
  });
});

describe("applyDocumentColorMode", () => {
  it("dark를 적용하면 페이지가 dark가 된다", () => {
    applyDocumentColorMode("dark");
    expect(isPageDark()).toBe(true);
  });

  it("light를 적용하면 dark였던 페이지가 light가 된다", () => {
    applyDocumentColorMode("dark");
    expect(isPageDark()).toBe(true);
    applyDocumentColorMode("light");
    expect(isPageDark()).toBe(false);
  });
});

describe("subscribeColorMode", () => {
  it("OS 설정이 바뀌면 알려준다", () => {
    const changeOsColorScheme = fakeOsColorScheme("light");
    const listener = vi.fn();
    subscribeColorMode(listener);
    changeOsColorScheme("dark");
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("다른 창에서 색 모드를 바꾸면 알려준다", () => {
    fakeOsColorScheme("light");
    const listener = vi.fn();
    subscribeColorMode(listener);
    saveInOtherWindow("dark");
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("다른 창에서 저장된 값을 모두 지우면 알려준다", () => {
    fakeOsColorScheme("light");
    const listener = vi.fn();
    subscribeColorMode(listener);
    clearInOtherWindow();
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("다른 창에서 색 모드가 아닌 값을 바꾸면 알려주지 않는다", () => {
    fakeOsColorScheme("light");
    const listener = vi.fn();
    subscribeColorMode(listener);
    window.dispatchEvent(new StorageEvent("storage", { key: "other-key" }));
    expect(listener).not.toHaveBeenCalled();
  });

  it("구독을 끊으면 더는 알려주지 않는다", () => {
    const changeOsColorScheme = fakeOsColorScheme("light");
    const listener = vi.fn();
    const unsubscribe = subscribeColorMode(listener);
    unsubscribe();
    changeOsColorScheme("dark");
    saveInOtherWindow("dark");
    expect(listener).not.toHaveBeenCalled();
  });
});
