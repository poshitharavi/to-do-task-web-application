/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useAlertStore } from "../store/alertStore";
import { useTaskStore } from "../store/taskStore";
import { TasksService } from "../services/tasks.service";
import { AddTask } from "../components/Home";

vi.mock("../store/alertStore");
vi.mock("../store/taskStore");
vi.mock("../services/tasks.service");

describe("AddTask Component", () => {
  const user = userEvent.setup();

  const showAlertMock = vi.fn();
  const fetchTasksMock = vi.fn();
  const createTaskMock = vi.fn();

  beforeEach(() => {
    vi.resetAllMocks();

    vi.mocked(useAlertStore).mockReturnValue({
      showAlert: showAlertMock,
    } as any);

    vi.mocked(useTaskStore).mockReturnValue({
      fetchTasks: fetchTasksMock,
    } as any);

    vi.mocked(TasksService.createTask).mockImplementation(createTaskMock);
  });

  it("renders the form with all required elements", () => {
    render(<AddTask />);

    expect(screen.getByText("New Task")).toBeInTheDocument();

    expect(screen.getByLabelText("Title")).toBeInTheDocument();
    expect(screen.getByLabelText("Description")).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Add Task" })
    ).toBeInTheDocument();
  });

  it("displays validation errors when submitting empty form", async () => {
    render(<AddTask />);

    await user.click(screen.getByRole("button", { name: "Add Task" }));

    await waitFor(() => {
      expect(screen.getByText("Title is required")).toBeInTheDocument();
      expect(screen.getByText("Description is required")).toBeInTheDocument();
    });

    expect(createTaskMock).not.toHaveBeenCalled();
  });

  it("successfully submits the form with valid data", async () => {
    createTaskMock.mockResolvedValue({});

    render(<AddTask />);

    await user.type(screen.getByLabelText("Title"), "Test Task");
    await user.type(
      screen.getByLabelText("Description"),
      "This is a test task description"
    );

    await user.click(screen.getByRole("button", { name: "Add Task" }));

    await waitFor(() => {
      expect(createTaskMock).toHaveBeenCalledWith({
        title: "Test Task",
        description: "This is a test task description",
      });
    });

    expect(fetchTasksMock).toHaveBeenCalled();

    expect(showAlertMock).toHaveBeenCalledWith(
      "success",
      "Task created successfully!"
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Title")).toHaveValue("");
      expect(screen.getByLabelText("Description")).toHaveValue("");
    });
  });

  it("handles API error during task creation", async () => {
    const errorMessage = "API Error: Failed to create task";
    createTaskMock.mockRejectedValue(new Error(errorMessage));

    render(<AddTask />);

    await user.type(screen.getByLabelText("Title"), "Test Task");
    await user.type(
      screen.getByLabelText("Description"),
      "This is a test task description"
    );

    await user.click(screen.getByRole("button", { name: "Add Task" }));

    await waitFor(() => {
      expect(showAlertMock).toHaveBeenCalledWith("error", errorMessage);
    });

    expect(fetchTasksMock).not.toHaveBeenCalled();
  });

  it("handles string error during task creation", async () => {
    const errorMessage = "Network error";
    createTaskMock.mockRejectedValue(errorMessage);

    render(<AddTask />);

    await user.type(screen.getByLabelText("Title"), "Test Task");
    await user.type(
      screen.getByLabelText("Description"),
      "This is a test task description"
    );

    await user.click(screen.getByRole("button", { name: "Add Task" }));

    await waitFor(() => {
      expect(showAlertMock).toHaveBeenCalledWith("error", errorMessage);
    });
  });

  it("displays loading state during submission", async () => {
    let resolvePromise: (value: unknown) => void;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    createTaskMock.mockImplementation(() => promise);

    render(<AddTask />);

    await user.type(screen.getByLabelText("Title"), "Test Task");
    await user.type(
      screen.getByLabelText("Description"),
      "This is a test task description"
    );

    const submitPromise = user.click(
      screen.getByRole("button", { name: "Add Task" })
    );

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Adding Task..." })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Adding Task..." })
      ).toBeDisabled();
    });

    resolvePromise!({});
    await submitPromise;

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Add Task" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Add Task" })
      ).not.toBeDisabled();
    });
  });

  it("applies error styling to invalid fields", async () => {
    render(<AddTask />);

    await user.click(screen.getByRole("button", { name: "Add Task" }));

    await waitFor(() => {
      const titleInput = screen.getByLabelText("Title");
      expect(titleInput.className).toContain("border-red-500");
      expect(titleInput.className).toContain("focus:ring-red-500");
    });

    const descriptionInput = screen.getByLabelText("Description");
    expect(descriptionInput.className).toContain("border-red-500");
    expect(descriptionInput.className).toContain("focus:ring-red-500");
  });
});
