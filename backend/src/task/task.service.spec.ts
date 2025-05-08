import { Test, TestingModule } from "@nestjs/testing";
import { TaskService } from "./task.service";
import { PrismaService } from "../prisma/prisma.service";
import { NewTaskDto } from "./dtos/new-task.dto";
import { NotFoundException } from "@nestjs/common";
import { Task } from "@prisma/client";

const mockPrismaService = {
  task: {
    create: jest.fn(),
    findUniqueOrThrow: jest.fn(),
    update: jest.fn(),
    findMany: jest.fn(),
  },
};

describe("TaskService", () => {
  let service: TaskService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
    prismaService = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
    expect(prismaService).toBeDefined();
  });

  describe("addNewTask", () => {
    it("should create a new task successfully", async () => {
      const newTaskDto: NewTaskDto = {
        title: "Test Task",
        description: "This is a test task",
      };

      const createdTask = {
        id: 1,
        title: "Test Task",
        description: "This is a test task",
        status: "NOT_DONE",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.task.create.mockResolvedValue(createdTask);

      const result = await service.addNewTask(newTaskDto);

      expect(result).toEqual(createdTask);
      expect(mockPrismaService.task.create).toHaveBeenCalledWith({
        data: {
          title: newTaskDto.title,
          description: newTaskDto.description,
        },
      });
      expect(mockPrismaService.task.create).toHaveBeenCalledTimes(1);
    });

    it("should throw an error if task creation fails", async () => {
      const newTaskDto: NewTaskDto = {
        title: "Test Task",
        description: "This is a test task",
      };

      const error = new Error("Database error");
      mockPrismaService.task.create.mockRejectedValue(error);

      await expect(service.addNewTask(newTaskDto)).rejects.toThrow(error);
      expect(mockPrismaService.task.create).toHaveBeenCalledTimes(1);
    });
  });

  describe("updateCompleteStatus", () => {
    it("should update task status to DONE successfully", async () => {
      const taskId = 1;
      const task: Task = {
        id: taskId,
        title: "Test Task",
        description: "This is a test task",
        status: "NOT_DONE",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.task.findUniqueOrThrow.mockResolvedValue(task);
      mockPrismaService.task.update.mockResolvedValue({
        ...task,
        status: "DONE",
      });

      const result = await service.updateCompleteStatus(taskId);

      expect(result).toBe(true);
      expect(mockPrismaService.task.findUniqueOrThrow).toHaveBeenCalledWith({
        where: {
          id: taskId,
          status: "NOT_DONE",
        },
      });
      expect(mockPrismaService.task.update).toHaveBeenCalledWith({
        where: {
          id: taskId,
        },
        data: {
          status: "DONE",
        },
      });
    });

    it("should throw NotFoundException if task not found", async () => {
      const taskId = 999;
      const prismaError = new Error("Record not found");
      prismaError["code"] = "P2025";

      mockPrismaService.task.findUniqueOrThrow.mockRejectedValue(prismaError);

      await expect(service.updateCompleteStatus(taskId)).rejects.toThrow(
        new NotFoundException(`Task with id ${taskId} not found`)
      );
      expect(mockPrismaService.task.findUniqueOrThrow).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.task.update).not.toHaveBeenCalled();
    });

    it("should propagate unknown errors", async () => {
      const taskId = 1;
      const error = new Error("Unknown error");

      mockPrismaService.task.findUniqueOrThrow.mockRejectedValue(error);

      await expect(service.updateCompleteStatus(taskId)).rejects.toThrow(error);
      expect(mockPrismaService.task.findUniqueOrThrow).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.task.update).not.toHaveBeenCalled();
    });
  });

  describe("getRecentFiveTodoTasks", () => {
    it("should return five most recent NOT_DONE tasks", async () => {
      const tasks: Task[] = Array.from({ length: 5 }, (_, i) => ({
        id: i + 1,
        title: `Task ${i + 1}`,
        description: `Description for task ${i + 1}`,
        status: "NOT_DONE",
        createdAt: new Date(Date.now() - i * 1000 * 60), // Decreasing dates
        updatedAt: new Date(),
      }));

      mockPrismaService.task.findMany.mockResolvedValue(tasks);

      const result = await service.getRecentFiveTodoTasks();

      expect(result).toEqual(tasks);
      expect(mockPrismaService.task.findMany).toHaveBeenCalledWith({
        where: {
          status: "NOT_DONE",
        },
        take: 5,
        orderBy: {
          createdAt: "desc",
        },
      });
    });

    it("should return empty array when no tasks are found", async () => {
      mockPrismaService.task.findMany.mockResolvedValue([]);

      const result = await service.getRecentFiveTodoTasks();

      expect(result).toEqual([]);
      expect(mockPrismaService.task.findMany).toHaveBeenCalledTimes(1);
    });

    it("should throw an error if finding tasks fails", async () => {
      const error = new Error("Database error");
      mockPrismaService.task.findMany.mockRejectedValue(error);

      await expect(service.getRecentFiveTodoTasks()).rejects.toThrow(error);
      expect(mockPrismaService.task.findMany).toHaveBeenCalledTimes(1);
    });
  });
});
