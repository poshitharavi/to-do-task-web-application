/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { TasksService } from "../services/tasks.service";
import { useAlertStore } from "./alertStore";

export interface Task {
  id: number;
  title: string;
  status: "NOT_DONE" | "DONE";
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;

  completeTask: (taskId: number) => Promise<void>;
  fetchTasks: () => Promise<void>;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,

  fetchTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await TasksService.getRecentFiveTasks();
      set({
        tasks: response.body.tasks,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || "Failed to fetch tasks",
        isLoading: false,
      });
    }
  },

  completeTask: async (taskId) => {
    try {
      await TasksService.completeTask(taskId);
      useAlertStore
        .getState()
        .showAlert("success", "Successfully updated the status of task");
    } catch (error: any) {
      useAlertStore
        .getState()
        .showAlert(
          "error",
          error.response?.data?.message || "Failed to update task status"
        );
    } finally {
      get().fetchTasks();
    }
  },
}));
