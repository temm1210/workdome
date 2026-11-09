import { describe, expect, it } from "vitest";

import { createEventBus } from "./event-bus.ts";

describe("createEventBus", () => {
  it("subscribe하는 동안 publish한 이벤트를 순서대로 받는다", async () => {
    const bus = createEventBus<string>();
    const subscription = bus.subscribe(new AbortController().signal);
    const firstResult = subscription.next();
    bus.publish("a");
    bus.publish("b");
    expect(await firstResult).toEqual({ value: "a", done: false });
    expect(await subscription.next()).toEqual({ value: "b", done: false });
  });

  it("subscribe가 둘이면 둘 다 같은 이벤트를 받는다", async () => {
    const bus = createEventBus<string>();
    const nextResults = [
      bus.subscribe(new AbortController().signal).next(),
      bus.subscribe(new AbortController().signal).next(),
    ];
    bus.publish("a");
    expect(await Promise.all(nextResults)).toEqual([
      { value: "a", done: false },
      { value: "a", done: false },
    ]);
  });

  it("next()를 부르기 전에 publish한 이벤트는 받지 않는다", async () => {
    const bus = createEventBus<string>();
    const subscription = bus.subscribe(new AbortController().signal);
    bus.publish("before");
    const nextResult = subscription.next();
    bus.publish("after");
    expect(await nextResult).toEqual({ value: "after", done: false });
  });

  it("signal을 abort하면 에러 없이 subscribe가 끝난다", async () => {
    const bus = createEventBus<string>();
    const connection = new AbortController();
    const nextResult = bus.subscribe(connection.signal).next();
    connection.abort();
    expect(await nextResult).toEqual({ value: undefined, done: true });
  });

  it("이미 abort된 signal로 subscribe하면 바로 끝난다", async () => {
    const bus = createEventBus<string>();
    const connection = new AbortController();
    connection.abort();
    const nextResult = bus.subscribe(connection.signal).next();
    bus.publish("a");
    expect(await nextResult).toEqual({ value: undefined, done: true });
  });

  it("한 subscribe의 signal을 abort해도 다른 subscribe는 계속 받는다", async () => {
    const bus = createEventBus<string>();
    const stoppedConnection = new AbortController();
    const stoppedNextResult = bus.subscribe(stoppedConnection.signal).next();
    const runningSubscription = bus.subscribe(new AbortController().signal);
    const runningNextResult = runningSubscription.next();
    stoppedConnection.abort();
    bus.publish("a");
    expect(await stoppedNextResult).toEqual({ value: undefined, done: true });
    expect(await runningNextResult).toEqual({ value: "a", done: false });
    const resultAfterStop = runningSubscription.next();
    bus.publish("b");
    expect(await resultAfterStop).toEqual({ value: "b", done: false });
  });
});
