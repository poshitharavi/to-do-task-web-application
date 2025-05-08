/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "./api";

interface Task {
  id: number;
  title: string;
  status: "NOT_DONE" | "DONE";
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface TasksResponse {
  statusCode: number;
  message: string;
  body: {
    tasks: Task[];
    counts: {
      active: number;
      completed: number;
    };
  };
}

export const TasksService = {
  getRecentFiveTasks: async (): Promise<TasksResponse> => {
    try {
      const response = await api.get(`/task/recent-tasks`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: "Failed to fetch tasks" };
    }
  },
  createTask: async (taskData: {
    title: string;
    description: string;
  }): Promise<TasksResponse> => {
    try {
      const payload = { ...taskData };

      const response = await api.post("/task/new", payload);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: "Task creation failed" };
    }
  },
  completeTask: async (taskId: number): Promise<TasksResponse> => {
    try {
      const response = await api.patch(`/task/complete-task/${taskId}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: "Task update failed" };
    }
  },
};
