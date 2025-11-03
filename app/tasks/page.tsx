"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { Topbar } from "@/components/topbar"
import { Button } from "@/components/ui/button"
import { TasksEmptyState } from "@/components/tasks-empty-state"
import { TasksTable } from "@/components/tasks-table"
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Columns3,
  Share2,
} from "lucide-react"

export default function TasksPage() {
  const [tasks, setTasks] = useState<any[]>([])

  useEffect(() => {
    // Завантажуємо реальні задачі (не example tasks - вони показуються тільки на Dashboard)
    // TODO: Завантажити реальні задачі з API або іншого джерела
    // const saved = localStorage.getItem("way2b1_tasks")
    // if (saved) {
    //   try {
    //     const tasks = JSON.parse(saved)
    //     setTasks(tasks)
    //   } catch (e) {
    //     console.error("Failed to parse tasks", e)
    //   }
    // }
  }, [])

  const handleTaskComplete = (taskId: string) => {
    // TODO: Реалізувати завершення задачі
    const updated = tasks.map((task) =>
      task.id === taskId ? { ...task, status: "completed" } : task,
    )
    setTasks(updated)
    // localStorage.setItem("way2b1_tasks", JSON.stringify(updated))
  }

  const handleCreateTask = () => {
    // TODO: Реалізувати модалку створення задачі
    console.log("Create new task")
  }

  const handleTaskClick = (task: any) => {
    // TODO: Обробка кліку на задачу
    console.log("Task clicked", task)
  }

  const hasTasks = tasks.length > 0

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar onStartTutorial={() => {}} onOpenTutorialCenter={() => {}} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-auto">
          <div className="flex h-full flex-col">
            {/* Top Bar */}
            <div className="border-b border-border bg-card px-6 py-4">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold text-foreground">Tasks</h1>
                <div className="flex items-center gap-4">
                  <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                    <Filter className="w-4 h-4" />
                    Filters
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                    <Columns3 className="w-4 h-4" />
                    5/5 columns
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                    <Search className="w-4 h-4" />
                    Search
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                    <Share2 className="w-4 h-4" />
                    Share
                  </Button>
                  <Button
                    onClick={handleCreateTask}
                    className="flex items-center gap-2 bg-[#4F7CFF] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#4F7CFF]/90 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    New Task
                  </Button>
                </div>
              </div>
            </div>

            {/* Table Header */}
            <div className="border-b border-border bg-secondary/30 px-6 py-3">
              <div className="grid grid-cols-12 gap-4 text-xs font-medium text-muted-foreground">
                <div className="col-span-1 flex items-center gap-2">
                  <MoreHorizontal className="w-4 h-4" />
                  STATUS
                </div>
                <div className="col-span-2 flex items-center gap-2">
                  ORGANIZATION
                  <MoreHorizontal className="w-4 h-4" />
                </div>
                <div className="col-span-4 flex items-center gap-2">
                  NAME
                  <MoreHorizontal className="w-4 h-4" />
                </div>
                <div className="col-span-2 flex items-center gap-2">
                  PRIORITY
                  <MoreHorizontal className="w-4 h-4" />
                </div>
                <div className="col-span-3 flex items-center gap-2">
                  DUE DATE
                  <MoreHorizontal className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
              {hasTasks ? (
                <div className="flex-1 overflow-auto">
                  <TasksTable
                    tasks={tasks}
                    onTaskComplete={handleTaskComplete}
                    onTaskClick={handleTaskClick}
                  />
                </div>
              ) : (
                <TasksEmptyState onCreateTask={handleCreateTask} />
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-border bg-card px-6 py-3">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Rows: {tasks.length}</span>
                <span>Filtered: {tasks.length}</span>
              </div>
            </div>
          </div>
        </main>
      </div>

    </div>
  )
}

