import { Test, TestingModule } from "@nestjs/testing";
import { TaskController } from "./task.controller";
import { TaskService } from "./task.service";
import { Response } from "express";
import { NewTaskDto } from "./dtos/new-task.dto";
import { StatusCodes } from "http-status-codes";
import { NotFoundException, ConflictException } from "@nestjs/common";

describe("TaskController", () => {
  let controller: TaskController;
  let taskService: TaskService;

  const mockResponse = () => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  const mockTaskService = {
    addNewTask: jest.fn(),
    updateCompleteStatus: jest.fn(),
    getRecentFiveTodoTasks: jest.fn(),
  };

  const mockTask = {
    id: 1,
    title: "Test Task",
    status: "NOT_DONE",
    description: "Test Description",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        {
          provide: TaskService,
          useValue: mockTaskService,
        },
      ],
    }).compile();

    controller = module.get<TaskController>(TaskController);
    taskService = module.get<TaskService>(TaskService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("addNewTask", () => {
    it("should successfully add a new task", async () => {
      const response = mockResponse();
      const newTaskDto: NewTaskDto = {
        title: "Test Task",
        description: "Test Description",
      };
      mockTaskService.addNewTask.mockResolvedValue(mockTask);

      await controller.addNewTask(response, newTaskDto);

      expect(taskService.addNewTask).toHaveBeenCalledWith(newTaskDto);
      expect(response.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(response.json).toHaveBeenCalledWith({
        statusCode: StatusCodes.CREATED,
        message: "Successfully new task added",
        body: {
          newTask: mockTask,
        },
      });
    });

    it("should handle errors when adding a new task", async () => {
      const response = mockResponse();
      const newTaskDto: NewTaskDto = {
        title: "Test Task",
        description: "Test Description",
      };
      const errorMessage = "Database connection error";
      mockTaskService.addNewTask.mockRejectedValue(new Error(errorMessage));

      await controller.addNewTask(response, newTaskDto);

      expect(taskService.addNewTask).toHaveBeenCalledWith(newTaskDto);
      expect(response.status).toHaveBeenCalledWith(
        StatusCodes.INTERNAL_SERVER_ERROR
      );
      expect(response.json).toHaveBeenCalledWith({
        message: "Something went wrong",
        error: "Internal Server Error",
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      });
    });
  });

  describe("updateCompleteStatus", () => {
    it("should successfully update task status to complete", async () => {
      const response = mockResponse();
      const taskId = 1;
      const request = {};
      mockTaskService.updateCompleteStatus.mockResolvedValue(undefined);

      await controller.updateCompleteStatus(taskId, request, response);

      expect(taskService.updateCompleteStatus).toHaveBeenCalledWith(taskId);
      expect(response.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(response.json).toHaveBeenCalledWith({
        statusCode: StatusCodes.OK,
        message: `Successfully updated task status ${taskId} as complete`,
        body: {},
      });
    });

    it("should handle not found error when updating task status", async () => {
      const response = mockResponse();
      const taskId = 999;
      const request = {};
      const errorMessage = "Task not found";
      mockTaskService.updateCompleteStatus.mockRejectedValue(
        new NotFoundException(errorMessage)
      );

      await controller.updateCompleteStatus(taskId, request, response);

      expect(taskService.updateCompleteStatus).toHaveBeenCalledWith(taskId);
      expect(response.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
      expect(response.json).toHaveBeenCalledWith({
        message: errorMessage,
        error: "Not Found",
        statusCode: StatusCodes.NOT_FOUND,
      });
    });

    it("should handle conflict error when updating task status", async () => {
      const response = mockResponse();
      const taskId = 1;
      const request = {};
      const errorMessage = "Task already completed";
      mockTaskService.updateCompleteStatus.mockRejectedValue(
        new ConflictException(errorMessage)
      );

      await controller.updateCompleteStatus(taskId, request, response);

      expect(taskService.updateCompleteStatus).toHaveBeenCalledWith(taskId);
      expect(response.status).toHaveBeenCalledWith(StatusCodes.CONFLICT);
      expect(response.json).toHaveBeenCalledWith({
        message: errorMessage,
        error: "Conflict",
        statusCode: StatusCodes.CONFLICT,
      });
    });

    it("should handle general errors when updating task status", async () => {
      const response = mockResponse();
      const taskId = 1;
      const request = {};
      const errorMessage = "Database connection error";
      mockTaskService.updateCompleteStatus.mockRejectedValue(
        new Error(errorMessage)
      );

      await controller.updateCompleteStatus(taskId, request, response);

      expect(taskService.updateCompleteStatus).toHaveBeenCalledWith(taskId);
      expect(response.status).toHaveBeenCalledWith(
        StatusCodes.INTERNAL_SERVER_ERROR
      );
      expect(response.json).toHaveBeenCalledWith({
        message: "Something went wrong",
        error: "Internal Server Error",
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      });
    });
  });

  describe("getRecentFiveTodoTasks", () => {
    it("should successfully retrieve recent pending tasks", async () => {
      const response = mockResponse();
      const mockTasks = [mockTask, { ...mockTask, id: 2 }];
      mockTaskService.getRecentFiveTodoTasks.mockResolvedValue(mockTasks);

      await controller.getRecentFiveTodoTasks(response);

      expect(taskService.getRecentFiveTodoTasks).toHaveBeenCalled();
      expect(response.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(response.json).toHaveBeenCalledWith({
        statusCode: StatusCodes.OK,
        body: {
          tasks: mockTasks,
        },
      });
    });

    it("should handle errors when retrieving recent tasks", async () => {
      const response = mockResponse();
      const errorMessage = "Database connection error";
      mockTaskService.getRecentFiveTodoTasks.mockRejectedValue(
        new Error(errorMessage)
      );

      await controller.getRecentFiveTodoTasks(response);

      expect(taskService.getRecentFiveTodoTasks).toHaveBeenCalled();
      expect(response.status).toHaveBeenCalledWith(
        StatusCodes.INTERNAL_SERVER_ERROR
      );
      expect(response.json).toHaveBeenCalledWith({
        message: "Something went wrong",
        error: "Internal Server Error",
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      });
    });
  });
});
