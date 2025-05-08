import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { TaskCard } from "../components/Home";

describe("TaskCard Component", () => {
  const defaultProps = {
    title: "Test Task",
    description: "This is a test task description",
    onComplete: vi.fn(),
  };

  it("renders with the correct title and description", () => {
    render(<TaskCard {...defaultProps} />);

    expect(screen.getByText("Test Task")).toBeInTheDocument();
    expect(
      screen.getByText("This is a test task description")
    ).toBeInTheDocument();
  });

  it("displays the complete button", () => {
    render(<TaskCard {...defaultProps} />);

    const completeButton = screen.getByRole("button", { name: /complete/i });
    expect(completeButton).toBeInTheDocument();
  });

  it("calls onComplete handler when the complete button is clicked", () => {
    const mockOnComplete = vi.fn();
    render(<TaskCard {...defaultProps} onComplete={mockOnComplete} />);

    const completeButton = screen.getByRole("button", { name: /complete/i });
    fireEvent.click(completeButton);

    expect(mockOnComplete).toHaveBeenCalledTimes(1);
  });

  it("renders correctly with different props", () => {
    const newProps = {
      title: "Another Task",
      description: "Different description here",
      onComplete: vi.fn(),
    };

    render(<TaskCard {...newProps} />);

    expect(screen.getByText("Another Task")).toBeInTheDocument();
    expect(screen.getByText("Different description here")).toBeInTheDocument();
  });
});
