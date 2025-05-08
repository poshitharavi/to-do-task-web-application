import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAlertStore } from "../../store/alertStore";
import { TasksService } from "../../services/tasks.service";
import { useTaskStore } from "../../store/taskStore";

const taskSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
});

type TaskFormData = z.infer<typeof taskSchema>;

const AddTask = () => {
  const { fetchTasks } = useTaskStore();
  const { showAlert } = useAlertStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
  });

  const onSubmit: SubmitHandler<TaskFormData> = async (data) => {
    try {
      await TasksService.createTask(data);
      await fetchTasks();

      showAlert("success", "Task created successfully!");
      reset();
    } catch (error) {
      let errorMessage = "Failed to create task";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      }
      showAlert("error", errorMessage);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-6 text-gray-300">New Task</h3>
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Title
          </label>
          <input
            id="title"
            type="text"
            {...register("title")}
            className={`w-full px-4 py-2 bg-gray-800 rounded-lg text-white
                          focus:ring-2 focus:border-transparent ${
                            errors.title
                              ? "border-red-500 focus:ring-red-500"
                              : "focus:ring-blue-500"
                          }`}
            placeholder="Enter task title"
          />

          {errors.title && (
            <p className="mt-1 text-sm text-red-400">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Description
          </label>
          <textarea
            id="description"
            {...register("description")}
            rows={4}
            className={`w-full px-4 py-2 bg-gray-800 rounded-lg text-white
                          focus:ring-2 focus:border-transparent ${
                            errors.description
                              ? "border-red-500 focus:ring-red-500"
                              : "focus:ring-blue-500"
                          }`}
            placeholder="Enter task description"
          />

          {errors.description && (
            <p className="mt-1 text-sm text-red-400">
              {errors.description.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold
                        py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Adding Task..." : "Add Task"}
        </button>
      </form>
    </div>
  );
};

export default AddTask;
