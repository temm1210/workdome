import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { SegmentedControl } from "./segmented-control";

describe("SegmentedControl", () => {
  it("value로 준 항목이 선택되어 보인다", () => {
    const options = [
      { value: "a", label: "첫째" },
      { value: "b", label: "둘째" },
    ];
    render(
      <SegmentedControl
        aria-label="선택"
        value="a"
        options={options}
        onValueChange={vi.fn()}
      />,
    );
    expect(screen.getByRole("radio", { name: "첫째" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "둘째" })).not.toBeChecked();
  });

  it("다른 항목을 누르면 그 항목의 값을 onValueChange로 넘긴다", async () => {
    const options = [
      { value: "a", label: "첫째" },
      { value: "b", label: "둘째" },
    ];
    const onValueChange = vi.fn();
    render(
      <SegmentedControl
        aria-label="선택"
        value="a"
        options={options}
        onValueChange={onValueChange}
      />,
    );
    await userEvent.click(screen.getByRole("radio", { name: "둘째" }));
    expect(onValueChange).toHaveBeenCalledWith("b");
  });

  it("선택된 항목을 다시 누르면 onValueChange를 부르지 않는다", async () => {
    const options = [
      { value: "a", label: "첫째" },
      { value: "b", label: "둘째" },
    ];
    const onValueChange = vi.fn();
    render(
      <SegmentedControl
        aria-label="선택"
        value="a"
        options={options}
        onValueChange={onValueChange}
      />,
    );
    await userEvent.click(screen.getByRole("radio", { name: "첫째" }));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("aria-label을 화면 낭독기가 묶음 이름으로 읽는다", () => {
    const options = [{ value: "a", label: "첫째" }];
    render(
      <SegmentedControl
        aria-label="선택"
        value="a"
        options={options}
        onValueChange={vi.fn()}
      />,
    );
    expect(
      screen.getByRole("radiogroup", { name: "선택" }),
    ).toBeInTheDocument();
  });

  it("options가 비어 있으면 고를 항목이 없다", () => {
    render(
      <SegmentedControl
        aria-label="선택"
        value="a"
        options={[]}
        onValueChange={vi.fn()}
      />,
    );
    expect(screen.queryAllByRole("radio")).toHaveLength(0);
  });

  it("항목이 하나면 눌러도 onValueChange를 부르지 않는다", async () => {
    const options = [{ value: "a", label: "첫째" }];
    const onValueChange = vi.fn();
    render(
      <SegmentedControl
        aria-label="선택"
        value="a"
        options={options}
        onValueChange={onValueChange}
      />,
    );
    await userEvent.click(screen.getByRole("radio", { name: "첫째" }));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("value가 options에 없으면 아무 항목도 선택되어 보이지 않는다", () => {
    const options = [
      { value: "a", label: "첫째" },
      { value: "b", label: "둘째" },
    ];
    render(
      <SegmentedControl
        aria-label="선택"
        value="z"
        options={options}
        onValueChange={vi.fn()}
      />,
    );
    expect(screen.getByRole("radio", { name: "첫째" })).not.toBeChecked();
    expect(screen.getByRole("radio", { name: "둘째" })).not.toBeChecked();
  });

  it("disabled면 다른 항목을 눌러도 onValueChange를 부르지 않는다", async () => {
    const options = [
      { value: "a", label: "첫째" },
      { value: "b", label: "둘째" },
    ];
    const onValueChange = vi.fn();
    render(
      <SegmentedControl
        aria-label="선택"
        value="a"
        options={options}
        onValueChange={onValueChange}
        disabled
      />,
    );
    await userEvent.click(screen.getByRole("radio", { name: "둘째" }));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("Space 키로 다른 항목을 고르면 그 항목의 값을 onValueChange로 넘긴다", async () => {
    const options = [
      { value: "a", label: "첫째" },
      { value: "b", label: "둘째" },
    ];
    const onValueChange = vi.fn();
    render(
      <SegmentedControl
        aria-label="선택"
        value="a"
        options={options}
        onValueChange={onValueChange}
      />,
    );
    screen.getByRole("radio", { name: "둘째" }).focus();
    await userEvent.keyboard(" ");
    expect(onValueChange).toHaveBeenCalledWith("b");
  });

  it("label에 아이콘과 화면에 안 보이는 글자를 주면 그 글자를 항목 이름으로 읽는다", () => {
    const options = [
      {
        value: "a",
        label: (
          <>
            <svg aria-hidden="true" />
            <span className="sr-only">첫째</span>
          </>
        ),
      },
    ];
    render(
      <SegmentedControl
        aria-label="선택"
        value="a"
        options={options}
        onValueChange={vi.fn()}
      />,
    );
    expect(screen.getByRole("radio", { name: "첫째" })).toBeInTheDocument();
  });
});
