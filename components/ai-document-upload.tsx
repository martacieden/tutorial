"use client"

import { useState, useRef } from "react"
import { Upload, Sparkles, CheckCircle2, X, FileText, Loader2 } from "lucide-react"

interface AIDocumentUploadProps {
  onUploadComplete?: (document: { name: string; category: string; structure: any }) => void
}

export function AIDocumentUpload({ onUploadComplete }: AIDocumentUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [aiResult, setAiResult] = useState<{ category: string; structure: any } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Симуляція AI обробки документа
  const simulateAIProcessing = (fileName: string): Promise<{ category: string; structure: any }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // AI "визначає" категорію на основі назви файлу
        const fileNameLower = fileName.toLowerCase()
        
        let category = "General"
        let structure = {}

        if (fileNameLower.includes("property") || fileNameLower.includes("real estate")) {
          category = "Properties"
          structure = {
            type: "Property Document",
            fields: ["Address", "Purchase Price", "Square Footage", "Property Type"],
            suggestedCategory: "Properties",
          }
        } else if (fileNameLower.includes("invoice") || fileNameLower.includes("bill")) {
          category = "Financial"
          structure = {
            type: "Invoice",
            fields: ["Amount", "Vendor", "Due Date", "Status"],
            suggestedCategory: "Financial",
          }
        } else if (fileNameLower.includes("legal") || fileNameLower.includes("contract")) {
          category = "Legal"
          structure = {
            type: "Legal Document",
            fields: ["Document Type", "Parties", "Effective Date", "Expiration Date"],
            suggestedCategory: "Legal",
          }
        } else {
          structure = {
            type: "Document",
            fields: ["Title", "Date", "Description"],
            suggestedCategory: "General",
          }
        }

        resolve({ category, structure })
      }, 2000) // Симулюємо 2 секунди обробки
    })
  }

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)

    // Симулюємо завантаження файлу
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsUploading(false)
    setIsProcessing(true)

    // AI обробка документа
    const result = await simulateAIProcessing(file.name)
    
    setAiResult(result)
    setIsProcessing(false)
    setShowResult(true)

    // Викликаємо callback з результатами
    if (onUploadComplete) {
      onUploadComplete({
        name: file.name,
        category: result.category,
        structure: result.structure,
      })
    }

    // Показуємо WOW момент
    setTimeout(() => {
      // Запускаємо подію для святкування
      window.dispatchEvent(
        new CustomEvent("milestone-reached", {
          detail: {
            title: "✨ AI автоматично створив структуру!",
            description: `Ваш документ "${file.name}" був проаналізований AI та автоматично віднесений до категорії "${result.category}". Структура створена!`,
            type: "ai-document-processed",
          },
        }),
      )
    }, 500)
  }

  if (showResult && aiResult) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
        <div className="bg-card rounded-2xl p-8 max-w-lg w-full shadow-2xl animate-in zoom-in duration-300">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">✨ AI автоматично створив структуру!</h3>
            <p className="text-muted-foreground leading-relaxed">
              Ваш документ був проаналізований AI та автоматично оброблений.
            </p>
          </div>

          <div className="bg-secondary/50 rounded-lg p-4 mb-6 space-y-3">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Категорія</div>
              <div className="font-semibold text-foreground">{aiResult.category}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Тип структури</div>
              <div className="font-semibold text-foreground">{aiResult.structure.type}</div>
            </div>
            {aiResult.structure.fields && (
              <div>
                <div className="text-sm text-muted-foreground mb-2">Визначені поля</div>
                <div className="flex flex-wrap gap-2">
                  {aiResult.structure.fields.map((field: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
                    >
                      {field}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                setShowResult(false)
                setAiResult(null)
                if (fileInputRef.current) {
                  fileInputRef.current.value = ""
                }
              }}
              className="flex-1 bg-secondary text-secondary-foreground px-6 py-3 rounded-lg font-medium hover:bg-secondary/80 transition-colors"
            >
              Закрити
            </button>
            <button
              onClick={() => {
                // Позначаємо завдання як виконане
                const progress = JSON.parse(localStorage.getItem("way2b1_module_progress") || "{}")
                progress["upload-document"] = true
                localStorage.setItem("way2b1_module_progress", JSON.stringify(progress))
                window.dispatchEvent(new CustomEvent("onboardingProgressUpdate"))

                setShowResult(false)
                setAiResult(null)
                if (fileInputRef.current) {
                  fileInputRef.current.value = ""
                }
              }}
              className="flex-1 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              Готово
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
        onChange={handleFileSelect}
        className="hidden"
        id="document-upload"
      />

      {isProcessing ? (
        <div className="border-2 border-dashed border-primary rounded-lg p-12 text-center">
          <Loader2 className="w-12 h-12 text-primary mx-auto mb-4 animate-spin" />
          <p className="text-lg font-semibold text-foreground mb-2">AI обробляє ваш документ...</p>
          <p className="text-sm text-muted-foreground">
            Аналізуємо структуру та автоматично створюємо категорії
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-sm text-primary font-medium">Магія AI працює...</span>
          </div>
        </div>
      ) : isUploading ? (
        <div className="border-2 border-dashed border-primary rounded-lg p-12 text-center">
          <Upload className="w-12 h-12 text-primary mx-auto mb-4 animate-bounce" />
          <p className="text-lg font-semibold text-foreground mb-2">Завантаження...</p>
        </div>
      ) : (
        <label
          htmlFor="document-upload"
          className="border-2 border-dashed border-border rounded-lg p-12 text-center cursor-pointer hover:border-primary transition-colors group"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            <div>
              <p className="text-lg font-semibold text-foreground mb-1">
                Перетягніть файл сюди або натисніть для вибору
              </p>
              <p className="text-sm text-muted-foreground">
                AI автоматично проаналізує та створить структуру
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-primary">
              <Sparkles className="w-4 h-4" />
              <span>AI-Powered Upload</span>
            </div>
          </div>
        </label>
      )}
    </div>
  )
}

