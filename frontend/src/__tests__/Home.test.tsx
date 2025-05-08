/* eslint-disable @typescript-eslint/no-explicit-any */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Home from "../pages/home/Home";
import { useTaskStore } from "../store/taskStore";

vi.mock("../../src/components/ui", () => ({
  Navbar: () => <div data-testid="navbar">Navbar Component</div>,
  BodyCard: ({ title, className, children }: any) => (
    <div data-testid="body-card" className={className}>
      <h2>{title}</h2>
      <div>{children}</div>
    </div>
  ),
}));

vi.mock("../../src/components/Home", () => ({
  AddTask: () => <div data-testid="add-task">Add Task Component</div>,
  TaskCard: ({ title, description, onComplete }: any) => (
    <div data-testid="task-card">
      <h3>{title}</h3>
      <p>{description}</p>
      <button onClick={onComplete}>Complete</button>
    </div>
  ),
}));

vi.mock("../../src/store/taskStore", () => ({
  useTaskStore: vi.fn(),
}));

describe("Home Page", () => {
  const mockTasks = [
    {
      id: "1",
      title: "Task 1",
      description: "Description 1",
      completed: false,
    },
    {
      id: "2",
      title: "Task 2",
      description: "Description 2",
      completed: false,
    },
  ];

  const mockFetchTasks = vi.fn();
  const mockCompleteTask = vi.fn();

  beforeEach(() => {
    vi.resetAllMocks();

    (useTaskStore as any).mockReturnValue({
      tasks: mockTasks,
      fetchTasks: mockFetchTasks,
      completeTask: mockCompleteTask,
    });
  });

  it("calls fetchTasks on component mount", () => {
    render(<Home />);

    expect(mockFetchTasks).toHaveBeenCalledTimes(1);
  });

  it("renders the Navbar component", () => {
    render(<Home />);

    expect(screen.getByTestId("navbar")).toBeInTheDocument();
  });

  it("renders the BodyCard component with correct title", () => {
    render(<Home />);

    const bodyCard = screen.getByTestId("body-card");
    expect(bodyCard).toBeInTheDocument();
    expect(screen.getByText("Task Manager")).toBeInTheDocument();
  });

  it("renders the AddTask component", () => {
    render(<Home />);

    expect(screen.getByTestId("add-task")).toBeInTheDocument();
  });

  it("renders the correct number of TaskCard components", () => {
    render(<Home />);

    const taskCards = screen.getAllByTestId("task-card");
    expect(taskCards).toHaveLength(2);
  });

  it("renders each task with correct title and description", () => {
    render(<Home />);

    expect(screen.getByText("Task 1")).toBeInTheDocument();
    expect(screen.getByText("Description 1")).toBeInTheDocument();
    expect(screen.getByText("Task 2")).toBeInTheDocument();
    expect(screen.getByText("Description 2")).toBeInTheDocument();
  });

  it("calls completeTask with correct task id when Complete button is clicked", () => {
    render(<Home />);

    const completeButtons = screen.getAllByText("Complete");

    fireEvent.click(completeButtons[0]);

    expect(mockCompleteTask).toHaveBeenCalledTimes(1);
    expect(mockCompleteTask).toHaveBeenCalledWith("1");
  });

  it('renders "Tasks" heading in the task list section', () => {
    render(<Home />);

    expect(screen.getByText("Tasks")).toBeInTheDocument();
  });

  it("renders a message when no tasks are available", () => {
    (useTaskStore as any).mockReturnValue({
      tasks: [],
      fetchTasks: mockFetchTasks,
      completeTask: mockCompleteTask,
    });

    render(<Home />);

    const taskCards = screen.queryAllByTestId("task-card");
    expect(taskCards).toHaveLength(0);
  });

  it("applies the correct CSS classes for layout", () => {
    render(<Home />);

    const bodyCard = screen.getByTestId("body-card");
    expect(bodyCard).toHaveClass("!max-w-7xl");
  });
});
