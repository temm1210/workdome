import { describe, expect, it } from "vitest";

import { createEventBus } from "./event-bus.ts";

describe("createEventBus", () => {
  it("subscribe하는 동안 publish한 이벤트를 순서대로 받는다", async () => {
    const bus = createEventBus<string>();
    const events = bus.subscribe(new AbortController().signal);
    const first = events.next();
    bus.publish("a");
    bus.publish("b");
    expect(await first).toEqual({ value: "a", done: false });
    expect(await events.next()).toEqual({ value: "b", done: false });
  });

  it("subscribe가 둘이면 둘 다 같은 이벤트를 받는다", async () => {
    const bus = createEventBus<string>();
    const left = bus.subscribe(new AbortController().signal).next();
    const right = bus.subscribe(new AbortController().signal).next();
    bus.publish("a");
    expect(await left).toEqual({ value: "a", done: false });
    expect(await right).toEqual({ value: "a", done: false });
  });

  it("subscribe를 시작하기 전에 publish한 이벤트는 받지 않는다", async () => {
    const bus = createEventBus<string>();
    const events = bus.subscribe(new AbortController().signal);
    bus.publish("before");
    const next = events.next();
    bus.publish("after");
    expect(await next).toEqual({ value: "after", done: false });
  });

  it("signal을 abort하면 에러 없이 subscribe가 끝난다", async () => {
    const bus = createEventBus<string>();
    const controller = new AbortController();
    const next = bus.subscribe(controller.signal).next();
    controller.abort();
    expect(await next).toEqual({ value: undefined, done: true });
  });

  it("subscribe가 없어도 publish는 에러를 내지 않는다", () => {
    const bus = createEventBus<string>();
    expect(() => bus.publish("a")).not.toThrow();
  });

  it("이미 abort된 signal로 subscribe하면 바로 끝난다", async () => {
    const bus = createEventBus<string>();
    const controller = new AbortController();
    controller.abort();
    const next = bus.subscribe(controller.signal).next();
    bus.publish("a");
    expect(await next).toEqual({ value: undefined, done: true });
  });

  it("한 subscribe를 abort해도 다른 subscribe는 계속 받는다", async () => {
    const bus = createEventBus<string>();
    const stopped = new AbortController();
    const stoppedNext = bus.subscribe(stopped.signal).next();
    const running = bus.subscribe(new AbortController().signal);
    const runningNext = running.next();
    stopped.abort();
    bus.publish("a");
    expect(await stoppedNext).toEqual({ value: undefined, done: true });
    expect(await runningNext).toEqual({ value: "a", done: false });
  });
});
