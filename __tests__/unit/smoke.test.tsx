import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

function HelloWorld() {
  return <h1>Hello, SnackStack!</h1>;
}

describe("Smoke Test", () => {
  it("should render a React component with RTL", () => {
    render(<HelloWorld />);
    expect(screen.getByText("Hello, SnackStack!")).toBeInTheDocument();
  });

  it("should run basic Jest assertions", () => {
    expect(1 + 1).toBe(2);
    expect("snackstack").toContain("stack");
  });
});
