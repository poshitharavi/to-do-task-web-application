import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { NewTaskDto } from "./dtos/new-task.dto";
import { Task } from "@prisma/client";

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  async addNewTask(newTaskDto: NewTaskDto): Promise<Task> {
    try {
      const newTask = await this.prisma.task.create({
        data: {
          title: newTaskDto.title,
          description: newTaskDto.description,
        },
      });

      return newTask;
    } catch (error) {
      throw error;
    }
  }

  async updateCompleteStatus(taskId: number): Promise<boolean> {
    try {
      await this.prisma.task.findUniqueOrThrow({
        where: {
          id: taskId,
          status: "NOT_DONE",
        },
      });

      await this.prisma.task.update({
        where: {
          id: taskId,
        },
        data: {
          status: "DONE",
        },
      });

      return true;
    } catch (error) {
      if (error.code === "P2025") {
        throw new NotFoundException(`Task with id ${taskId} not found`);
      }

      throw error;
    }
  }

  async getRecentFiveTodoTasks(): Promise<Task[]> {
    try {
      const tasks = await this.prisma.task.findMany({
        where: {
          status: "NOT_DONE",
        },
        take: 5,
        orderBy: {
          createdAt: "desc",
        },
      });

      return tasks;
    } catch (error) {
      throw error;
    }
  }
}
