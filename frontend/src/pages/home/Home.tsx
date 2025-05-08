import { useEffect } from "react";

import { useTaskStore } from "../../store/taskStore";
import { BodyCard, Navbar } from "../../components/ui";
import { AddTask, TaskCard } from "../../components/Home";

const Home = () => {
  const { tasks, fetchTasks, completeTask } = useTaskStore();

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return (
    <div className="min-h-screen bg-gray-800">
      <Navbar />
      <div className="pt-8 flex items-center justify-center">
        <BodyCard title="Task Manager" className="!max-w-7xl">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="border-r border-gray-700 pr-8">
              <AddTask />
            </div>
            <div className="pl-8">
              <h3 className="text-lg font-semibold mb-6 text-gray-300">
                Tasks
              </h3>
              <div className="space-y-4">
                {tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    title={task.title}
                    description={task.description}
                    onComplete={() => completeTask(task.id)}
                  />
                ))}
              </div>
            </div>
          </div>
        </BodyCard>
      </div>
    </div>
  );
};

export default Home;
