"use client"

import { useState, useRef, useCallback } from "react"
import { cn } from "@/lib/utils"
import {
  Upload,
  FileCode2,
  X,
  RefreshCw,
  Trash2,
  CheckCircle,
  AlertCircle,
  Loader2,
  ExternalLink,
} from "lucide-react"
import { lessonsService, type HtmlUploadResult } from "@/lib/api"

/* ===== Types ===== */
interface HtmlUploaderProps {
  /** URL actual del HTML en Cloudinary (si ya existe) */
  currentUrl?: string
  /** Callback cuando se sube o actualiza el HTML */
  onUploadComplete: (result: HtmlUploadResult) => void
  /** Callback cuando se elimina el HTML */
  onDelete?: () => void
  className?: string
}

type UploadStatus = "idle" | "uploading" | "success" | "error"

/* ===== Utilidades ===== */
function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

function extractFileName(url: string): string {
  try {
    const parsed = new URL(url)
    const parts = parsed.pathname.split("/")
    return parts[parts.length - 1] || "archivo.html"
  } catch {
    return "archivo.html"
  }
}

/* ===== Componente Principal ===== */
export function HtmlUploader({
  currentUrl,
  onUploadComplete,
  onDelete,
  className,
}: HtmlUploaderProps) {
  const [status, setStatus] = useState<UploadStatus>("idle")
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState<string>("")
  const [isDragging, setIsDragging] = useState(false)
  const [lastResult, setLastResult] = useState<HtmlUploadResult | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Validar archivo antes de subir
  const validateFile = (file: File): string | null => {
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return `El archivo excede 10MB (${formatBytes(file.size)})`
    }
    if (!file.name.endsWith(".html") && !file.name.endsWith(".htm")) {
      return "Solo se permiten archivos .html o .htm"
    }
    return null
  }

  // Subir archivo
  const handleUpload = useCallback(
    async (file: File) => {
      const validationError = validateFile(file)
      if (validationError) {
        setError(validationError)
        setStatus("error")
        return
      }

      setStatus("uploading")
      setError(null)
      setProgress(`Subiendo ${file.name}...`)

      try {
        let result: HtmlUploadResult

        if (currentUrl) {
          // Actualizar: eliminar anterior y subir nuevo
          setProgress(`Reemplazando HTML anterior...`)
          result = await lessonsService.updateHtml(file, currentUrl)
        } else {
          // Nuevo upload
          result = await lessonsService.uploadHtml(file)
        }

        setLastResult(result)
        setStatus("success")
        setProgress("")
        onUploadComplete(result)
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Error al subir el archivo"
        setError(message)
        setStatus("error")
        setProgress("")
      }
    },
    [currentUrl, onUploadComplete]
  )

  // Eliminar HTML de Cloudinary
  const handleDelete = useCallback(async () => {
    const urlToDelete = currentUrl || lastResult?.url
    if (!urlToDelete) return

    setStatus("uploading")
    setProgress("Eliminando HTML...")

    try {
      await lessonsService.deleteHtml(urlToDelete)
      setLastResult(null)
      setStatus("idle")
      setProgress("")
      onDelete?.()
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Error al eliminar"
      setError(message)
      setStatus("error")
      setProgress("")
    }
  }, [currentUrl, lastResult, onDelete])

  // Handlers de drag & drop
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleUpload(files[0])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleUpload(files[0])
    }
    // Resetear input para permitir re-seleccionar el mismo archivo
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const activeUrl = currentUrl || lastResult?.url

  // Si hay URL actual → mostrar estado con opciones
  if (activeUrl && status !== "uploading") {
    return (
      <div className={cn("space-y-3", className)}>
        {/* Archivo actual */}
        <div className="flex items-center gap-3 p-4 bg-emerald-600/10 border border-emerald-600/20 rounded-xl">
          <div className="size-10 rounded-lg bg-emerald-600/20 flex items-center justify-center shrink-0">
            <FileCode2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {extractFileName(activeUrl)}
            </p>
            <p className="text-xs text-slate-400 truncate">{activeUrl}</p>
            {lastResult && (
              <p className="text-xs text-emerald-400 mt-0.5">
                {formatBytes(lastResult.bytes)}
              </p>
            )}
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {/* Ver en nueva pestaña */}
            <a
              href={activeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              title="Ver HTML"
            >
              <ExternalLink className="w-4 h-4 text-slate-400" />
            </a>
            {/* Reemplazar */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              title="Reemplazar HTML"
            >
              <RefreshCw className="w-4 h-4 text-amber-400" />
            </button>
            {/* Eliminar */}
            <button
              onClick={handleDelete}
              className="p-2 hover:bg-red-600/20 rounded-lg transition-colors"
              title="Eliminar HTML"
            >
              <Trash2 className="w-4 h-4 text-red-400" />
            </button>
          </div>
        </div>

        {/* Status */}
        {status === "success" && (
          <div className="flex items-center gap-2 text-emerald-400 text-xs">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>HTML subido correctamente</span>
          </div>
        )}

        {status === "error" && error && (
          <div className="flex items-center gap-2 text-red-400 text-xs">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Input oculto para reemplazar */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".html,.htm"
          className="hidden"
          onChange={handleFileSelect}
        />
      </div>
    )
  }

  // Estado de carga
  if (status === "uploading") {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed border-purple-600/30 rounded-xl bg-purple-600/5",
          className
        )}
      >
        <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
        <p className="text-sm text-purple-300">{progress || "Procesando..."}</p>
      </div>
    )
  }

  // Zona de drop / selección de archivo (sin URL actual)
  return (
    <div className={cn("space-y-2", className)}>
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed rounded-xl cursor-pointer transition-all",
          isDragging
            ? "border-purple-500 bg-purple-600/10 scale-[1.02]"
            : "border-white/10 hover:border-purple-600/50 hover:bg-purple-600/5"
        )}
      >
        <div
          className={cn(
            "size-12 rounded-xl flex items-center justify-center transition-colors",
            isDragging ? "bg-purple-600/20" : "bg-white/5"
          )}
        >
          <Upload
            className={cn(
              "w-6 h-6 transition-colors",
              isDragging ? "text-purple-400" : "text-slate-400"
            )}
          />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-slate-300">
            {isDragging
              ? "Suelta el archivo aquí"
              : "Arrastra un archivo HTML o haz clic para seleccionar"}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Solo archivos .html o .htm (máx. 10MB)
          </p>
        </div>
      </div>

      {/* Error */}
      {status === "error" && error && (
        <div className="flex items-center gap-2 p-3 bg-red-600/10 border border-red-600/20 rounded-lg">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <p className="text-xs text-red-300">{error}</p>
          <button
            onClick={() => {
              setStatus("idle")
              setError(null)
            }}
            className="ml-auto p-1 hover:bg-white/10 rounded"
          >
            <X className="w-3 h-3 text-red-400" />
          </button>
        </div>
      )}

      {/* Input oculto */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".html,.htm"
        className="hidden"
        onChange={handleFileSelect}
      />
    </div>
  )
}
