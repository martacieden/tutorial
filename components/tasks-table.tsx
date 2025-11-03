"use client"

import { CheckCircle2, Circle, Info, Play } from "lucide-react"

interface Task {
  id: string
  status: "pending" | "completed" | string
  organization?: string
  name: string
  title?: string
  description?: string
  priority: string
  dueDate?: string
  hint?: string
  videoUrl?: string
  steps?: string[]
}

interface TasksTableProps {
  tasks: Task[]
  onTaskComplete?: (taskId: string) => void
  onTaskClick?: (task: Task) => void
}

export function TasksTable({ tasks, onTaskComplete, onTaskClick }: TasksTableProps) {
  if (tasks.length === 0) {
    return null
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
              STATUS
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
              ORGANIZATION
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
              NAME
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
              PRIORITY
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
              DUE DATE
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {tasks.map((task, index) => {
            const isExampleTask = "description" in task
            const isCompleted = isExampleTask && task.status === "completed"
            const taskName = isExampleTask ? task.title || task.name : task.name

            return (
              <tr
                key={isExampleTask ? task.id : index}
                className={`hover:bg-gray-50 ${isCompleted ? "opacity-60" : ""}`}
              >
                <td className="px-4 py-3 whitespace-nowrap">
                  {isExampleTask ? (
                    <button
                      onClick={() => !isCompleted && onTaskComplete && onTaskComplete(task.id)}
                      className="flex items-center gap-2"
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Circle className="w-4 h-4 text-gray-400 hover:text-primary transition-colors" />
                      )}
                      <span
                        className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                          isCompleted
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {isCompleted ? "Completed" : "Pending"}
                      </span>
                    </button>
                  ) : (
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                      {task.status}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                  {isExampleTask ? "Learning" : task.organization || "—"}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                  <div>
                    <div className={`flex items-center gap-2 ${isCompleted ? "line-through text-gray-500" : ""}`}>
                      <span>{taskName}</span>
                      {isExampleTask && !isCompleted && (
                        <>
                          {task.hint && (
                            <button
                              onClick={() => onTaskClick && onTaskClick(task)}
                              className="p-1 hover:bg-primary/10 rounded transition-colors text-primary"
                              title="View hints and instructions"
                            >
                              <Info className="w-4 h-4" />
                            </button>
                          )}
                          {task.videoUrl && (
                            <button
                              onClick={() => onTaskClick && onTaskClick(task)}
                              className="p-1 hover:bg-primary/10 rounded transition-colors text-purple-600"
                              title="Watch video tutorial"
                            >
                              <Play className="w-4 h-4" />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                    {isExampleTask && task.description && (
                      <div className="text-xs text-gray-500 mt-0.5">{task.description}</div>
                    )}
                    {isExampleTask && task.steps && task.steps.length > 0 && !isCompleted && (
                      <div className="flex items-center gap-1 mt-1">
                        {task.steps.slice(0, 3).map((step, idx) => (
                          <span
                            key={idx}
                            className="text-xs px-1.5 py-0.5 bg-secondary rounded text-muted-foreground"
                          >
                            {step}
                          </span>
                        ))}
                        {task.steps.length > 3 && (
                          <span className="text-xs text-muted-foreground">
                            +{task.steps.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 flex items-center gap-1">
                  <span className="text-gray-400">=</span>
                  <span>{task.priority}</span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                  {isExampleTask ? "—" : task.dueDate || "—"}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

