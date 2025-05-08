import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  Logger,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  Res,
} from "@nestjs/common";
import { TaskService } from "./task.service";
import { NewTaskDto } from "./dtos/new-task.dto";
import { Response } from "express";
import { getReasonPhrase, StatusCodes } from "http-status-codes";

import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";

@ApiTags("task")
@Controller("task")
export class TaskController {
  private readonly logger = new Logger(TaskController.name);

  constructor(private readonly taskService: TaskService) {}

  @Post("new")
  @ApiOperation({ summary: "Add a new task" })
  @ApiBody({ type: NewTaskDto })
  @ApiCreatedResponse({
    description: "Successfully added a new task",
    schema: {
      example: {
        statusCode: StatusCodes.CREATED,
        message: "Successfully new task added",
        body: {
          newTask: {
            id: 2,
            title: "Sample Title",
            status: "NOT_DONE",
            description: "Sample Description",
            createdAt: "2025-04-04T16:40:39.337Z",
            updatedAt: "2025-04-04T16:40:39.337Z",
          },
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: "Invalid input for creating a new task",
  })
  @ApiInternalServerErrorResponse({
    description: "Something went wrong while adding a new task",
  })
  async addNewTask(
    @Res() response: Response,
    @Body() newTaskDto: NewTaskDto
  ): Promise<any> {
    try {
      const newTask = await this.taskService.addNewTask(newTaskDto);

      return response.status(StatusCodes.OK).json({
        statusCode: StatusCodes.CREATED,
        message: "Successfully new task added",
        body: {
          newTask,
        },
      });
    } catch (error) {
      this.logger.error(`Error at /task/new : ${error.message}`);

      return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Something went wrong",
        error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      });
    }
  }

  @Patch("complete-task/:id")
  @ApiOperation({
    summary: "Update the status as complete of a task by ID",
  })
  @ApiParam({
    name: "id",
    type: "number",
    description: "ID of the task to update status",
  })
  @ApiResponse({
    status: StatusCodes.OK,
    description: "Successfully updated task status",
    schema: {
      example: {
        statusCode: StatusCodes.OK,
        message: "Successfully updated task status 1",
        body: {},
      },
    },
  })
  @ApiNotFoundResponse({ description: "Task not found" })
  @ApiConflictResponse({
    description: "Conflict during status update (e.g., invalid status)",
  })
  @ApiInternalServerErrorResponse({
    description: "Something went wrong while updating the task status",
  })
  async updateCompleteStatus(
    @Param("id", ParseIntPipe) id: number,
    @Res() response: Response
  ): Promise<any> {
    try {
      await this.taskService.updateCompleteStatus(id);

      return response.status(StatusCodes.OK).json({
        statusCode: StatusCodes.OK,
        message: `Successfully updated task status ${id} as complete`,
        body: {},
      });
    } catch (error) {
      this.logger.error(`Error at /task/complete-task/${id}: ${error.message}`);

      if (error instanceof NotFoundException) {
        return response.status(StatusCodes.NOT_FOUND).json({
          message: error.message,
          error: getReasonPhrase(StatusCodes.NOT_FOUND),
          statusCode: StatusCodes.NOT_FOUND,
        });
      }

      if (error instanceof ConflictException) {
        return response.status(StatusCodes.CONFLICT).json({
          message: error.message,
          error: getReasonPhrase(StatusCodes.CONFLICT),
          statusCode: StatusCodes.CONFLICT,
        });
      }

      return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Something went wrong",
        error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      });
    }
  }

  @Get("recent-tasks")
  @ApiOperation({
    summary: "Take the recent added 5 pending tasks",
  })
  @ApiResponse({
    status: StatusCodes.OK,
    description: "Successfully retrieved recent pending tasks",
    schema: {
      example: {
        statusCode: StatusCodes.OK,
        message: "Successfully retrieved all tasks",
        body: [
          {
            id: 1,
            title: "Sample Title",
            status: "NOT_DONE",
            description: "Sample Description",
            createdAt: "2025-04-04T16:40:39.337Z",
            updatedAt: "2025-04-04T16:40:39.337Z",
          },
          {
            id: 2,
            title: "Sample Title",
            status: "NOT_DONE",
            description: "Sample Description",
            createdAt: "2025-04-04T16:40:39.337Z",
            updatedAt: "2025-04-04T16:40:39.337Z",
          },
        ],
      },
    },
  })
  @ApiNotFoundResponse({
    description: "No pending tasks found",
    schema: {
      properties: {
        message: { type: "string", example: "No pending tasks found" },
        error: { type: "string", example: "Not Found" },
        statusCode: { type: "number", example: 404 },
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: "Something went wrong while fetching recent tasks",
    schema: {
      properties: {
        message: { type: "string", example: "Something went wrong" },
        error: { type: "string", example: "Internal Server Error" },
        statusCode: { type: "number", example: 500 },
      },
    },
  })
  async getRecentFiveTodoTasks(@Res() response: Response): Promise<any> {
    try {
      const tasks = await this.taskService.getRecentFiveTodoTasks();

      return response.status(StatusCodes.OK).json({
        statusCode: StatusCodes.OK,
        body: {
          tasks,
        },
      });
    } catch (error) {
      this.logger.error(`Error at /task/recent-tasks: ${error.message}`);

      return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Something went wrong",
        error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
