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

  it("disabled인 항목을 누르면 onValueChange를 부르지 않는다", async () => {
    const options = [
      { value: "a", label: "첫째" },
      { value: "b", label: "둘째", disabled: true },
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
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("disabled인 항목만 꺼지고 나머지 항목은 누를 수 있다", async () => {
    const options = [
      { value: "a", label: "첫째" },
      { value: "b", label: "둘째", disabled: true },
      { value: "c", label: "셋째" },
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
    expect(screen.getByRole("radio", { name: "둘째" })).toBeDisabled();
    expect(screen.getByRole("radio", { name: "셋째" })).toBeEnabled();
    await userEvent.click(screen.getByRole("radio", { name: "셋째" }));
    expect(onValueChange).toHaveBeenCalledWith("c");
  });

  it("화살표 키로 옮기면 disabled인 항목을 건너뛴다", async () => {
    const options = [
      { value: "a", label: "첫째" },
      { value: "b", label: "둘째", disabled: true },
      { value: "c", label: "셋째" },
    ];
    render(
      <SegmentedControl
        aria-label="선택"
        value="a"
        options={options}
        onValueChange={vi.fn()}
      />,
    );
    await userEvent.tab();
    await userEvent.keyboard("{ArrowRight}");
    expect(screen.getByRole("radio", { name: "셋째" })).toHaveFocus();
  });

  it("선택된 항목이 disabled여도 선택되어 보이고 다른 항목을 누를 수 있다", async () => {
    const options = [
      { value: "a", label: "첫째", disabled: true },
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
    expect(screen.getByRole("radio", { name: "첫째" })).toBeChecked();
    await userEvent.click(screen.getByRole("radio", { name: "둘째" }));
    expect(onValueChange).toHaveBeenCalledWith("b");
  });

  it("모든 항목이 disabled면 어느 항목을 눌러도 onValueChange를 부르지 않는다", async () => {
    const options = [
      { value: "a", label: "첫째", disabled: true },
      { value: "b", label: "둘째", disabled: true },
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
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("컨트롤이 disabled면 disabled: false인 항목도 꺼진다", () => {
    const options = [
      { value: "a", label: "첫째" },
      { value: "b", label: "둘째", disabled: false },
    ];
    render(
      <SegmentedControl
        aria-label="선택"
        value="a"
        options={options}
        onValueChange={vi.fn()}
        disabled
      />,
    );
    expect(screen.getByRole("radio", { name: "둘째" })).toBeDisabled();
  });

  it("disabled를 주지 않은 항목은 켜져 있다", () => {
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
    expect(screen.getByRole("radio", { name: "둘째" })).toBeEnabled();
  });
});
