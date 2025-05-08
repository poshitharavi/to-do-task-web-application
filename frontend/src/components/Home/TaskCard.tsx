interface TaskCardProps {
  title: string;
  description: string;
  onComplete: () => void;
}

const TaskCard = ({ title, description, onComplete }: TaskCardProps) => {
  return (
    <div className="p-4 bg-gray-800 rounded-lg shadow-sm border border-gray-700 hover:border-gray-600 transition-colors">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-lg font-medium text-gray-100 mb-2">{title}</h3>
          <p className="text-sm text-gray-400">{description}</p>
        </div>
        <button
          onClick={onComplete}
          className="ml-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-sm font-medium rounded-md transition-colors"
        >
          Complete
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
