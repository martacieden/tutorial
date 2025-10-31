"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ModuleChecklist } from "./module-checklist"
import { ArrowRight, ClipboardList, Workflow, CheckCircle2, Circle, Info, Play } from "lucide-react"
import { TaskHintModal } from "./task-hint-modal"

// Таблиці порожні - використовуємо empty states
const decisionsData: any[] = []
const tasksData: any[] = []

interface ExampleTask {
  id: string
  title: string
  description: string
  hint?: string
  videoUrl?: string
  illustrationUrl?: string
  steps?: string[]
  status: "pending" | "completed"
  priority: string
  createdAt: string
}

export function Dashboard() {
  const [exampleTasks, setExampleTasks] = useState<ExampleTask[]>([])
  const [showHintModal, setShowHintModal] = useState(false)
  const [selectedTask, setSelectedTask] = useState<ExampleTask | null>(null)

  useEffect(() => {
    // Завантажуємо приклади задач з localStorage
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("way2b1_example_tasks")
      if (saved) {
        try {
          const tasks = JSON.parse(saved)
          setExampleTasks(tasks)
        } catch (e) {
          console.error("Failed to parse example tasks", e)
        }
      }
    }
  }, [])

  const handleTaskComplete = (taskId: string) => {
    const updated = exampleTasks.map((task) =>
      task.id === taskId ? { ...task, status: "completed" as const } : task
    )
    setExampleTasks(updated)
    localStorage.setItem("way2b1_example_tasks", JSON.stringify(updated))

    // Перевіряємо, чи це перша завершена задача
    const completedTasks = updated.filter((t) => t.status === "completed")
    if (completedTasks.length === 1) {
      // Показуємо feedback для першої завершеної задачі
      window.dispatchEvent(
        new CustomEvent("learnByDoingFeedback", {
          detail: { actionType: "task", isFirstAction: true },
        })
      )
    }
  }

  // Об'єднуємо приклади задач з реальними (якщо вони є)
  const allTasks = [...exampleTasks, ...tasksData]

  return (
    <div className="space-y-8 p-8">
      {/* Checklist */}
      <div>
        <ModuleChecklist />
      </div>

      {/* Decisions assigned to me */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-gray-900">Decisions</h2>
          </div>
          <Button variant="outline" size="sm" className="text-sm">
            + New Decision
          </Button>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          {decisionsData.length === 0 ? (
            <div className="h-[240px] flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Workflow className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-1">Add your first decision</h3>
                <p className="text-sm text-gray-600">Create requests needing approval and record keeping</p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Organization</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Priority</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Due Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Current step</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Amount</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {decisionsData.map((decision, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                          {decision.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{decision.organization}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{decision.name}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 flex items-center gap-1">
                        <span className="text-gray-400">=</span>
                        <span>{decision.priority}</span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{decision.dueDate}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{decision.currentStep}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{decision.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* My tasks */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-gray-900">Tasks</h2>
          </div>
          <Button variant="outline" size="sm" className="text-sm">
            + New Task
          </Button>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          {allTasks.length === 0 ? (
            <div className="h-[240px] flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ClipboardList className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-1">Add your first task</h3>
                <p className="text-sm text-gray-600">Track action items and to-dos that need completion</p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Organization</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Priority</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Due Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {allTasks.map((task, index) => {
                    const isExampleTask = "description" in task
                    const isCompleted = isExampleTask && task.status === "completed"
                    
                    return (
                      <tr key={isExampleTask ? task.id : index} className={`hover:bg-gray-50 ${isCompleted ? "opacity-60" : ""}`}>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {isExampleTask ? (
                            <button
                              onClick={() => !isCompleted && handleTaskComplete(task.id)}
                              className="flex items-center gap-2"
                            >
                              {isCompleted ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              ) : (
                                <Circle className="w-4 h-4 text-gray-400 hover:text-primary transition-colors" />
                              )}
                              <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                                isCompleted
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-blue-100 text-blue-700"
                              }`}>
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
                          {isExampleTask ? "Learning" : task.organization}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          <div>
                            <div className={`flex items-center gap-2 ${isCompleted ? "line-through text-gray-500" : ""}`}>
                              <span>{isExampleTask ? task.title : task.name}</span>
                              {isExampleTask && !isCompleted && (
                                <button
                                  onClick={() => {
                                    setSelectedTask(task as ExampleTask)
                                    setShowHintModal(true)
                                  }}
                                  className="p-1 hover:bg-primary/10 rounded transition-colors text-primary"
                                  title="View hints and instructions"
                                >
                                  <Info className="w-4 h-4" />
                                </button>
                              )}
                              {isExampleTask && task.videoUrl && !isCompleted && (
                                <button
                                  onClick={() => {
                                    setSelectedTask(task as ExampleTask)
                                    setShowHintModal(true)
                                  }}
                                  className="p-1 hover:bg-primary/10 rounded transition-colors text-purple-600"
                                  title="Watch video tutorial"
                                >
                                  <Play className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                            {isExampleTask && task.description && (
                              <div className="text-xs text-gray-500 mt-0.5">{task.description}</div>
                            )}
                            {isExampleTask && task.steps && task.steps.length > 0 && !isCompleted && (
                              <div className="flex items-center gap-1 mt-1">
                                {task.steps.slice(0, 3).map((step, idx) => (
                                  <span key={idx} className="text-xs px-1.5 py-0.5 bg-secondary rounded text-muted-foreground">
                                    {step}
                                  </span>
                                ))}
                                {task.steps.length > 3 && (
                                  <span className="text-xs text-muted-foreground">+{task.steps.length - 3} more</span>
                                )}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 flex items-center gap-1">
                          <span className="text-gray-400">=</span>
                          <span>{isExampleTask ? task.priority : task.priority}</span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          {isExampleTask ? "—" : task.dueDate}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Task Hint Modal */}
      {selectedTask && (
        <TaskHintModal
          show={showHintModal}
          onClose={() => {
            setShowHintModal(false)
            setSelectedTask(null)
          }}
          task={selectedTask}
        />
      )}
    </div>
  )
}
