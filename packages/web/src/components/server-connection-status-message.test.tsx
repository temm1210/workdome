import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ServerConnectionStatusMessage } from "./server-connection-status-message";

describe("ServerConnectionStatusMessage", () => {
  it("connected에서 connecting으로 바뀌면 원래 있던 알림 영역에 글이 나타난다", () => {
    const { rerender } = render(
      <ServerConnectionStatusMessage status="connected" />,
    );
    const region = screen.getByRole("status");
    expect(region).toBeEmptyDOMElement();
    rerender(<ServerConnectionStatusMessage status="connecting" />);
    expect(region).toHaveTextContent("서버에 연결하는 중");
  });
});
