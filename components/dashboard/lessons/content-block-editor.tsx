"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { BlockType, type ContentBlock, type HtmlUploadResult } from "@/lib/api"
import { HtmlUploader } from "./html-uploader"
import {
  Plus,
  Trash2,
  GripVertical,
  Type,
  Play,
  Code,
  Image,
  FileDown,
  Globe,
  HelpCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react"

/* ===== Types ===== */
interface ContentBlockEditorProps {
  blocks: ContentBlock[]
  onChange: (blocks: ContentBlock[]) => void
  className?: string
}

interface BlockEditorProps {
  block: ContentBlock
  index: number
  onChange: (block: ContentBlock) => void
  onDelete: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  isFirst: boolean
  isLast: boolean
}

/* ===== Block Type Config ===== */
const blockTypeConfig: Record<
  BlockType,
  { icon: typeof Type; label: string; color: string; bgColor: string }
> = {
  [BlockType.TEXT]: {
    icon: Type,
    label: "Texto",
    color: "text-blue-400",
    bgColor: "bg-blue-600/10 border-blue-600/20",
  },
  [BlockType.VIDEO]: {
    icon: Play,
    label: "Video",
    color: "text-red-400",
    bgColor: "bg-red-600/10 border-red-600/20",
  },
  [BlockType.IFRAME]: {
    icon: Globe,
    label: "Iframe",
    color: "text-purple-400",
    bgColor: "bg-purple-600/10 border-purple-600/20",
  },
  [BlockType.FILE]: {
    icon: FileDown,
    label: "Archivo",
    color: "text-amber-400",
    bgColor: "bg-amber-600/10 border-amber-600/20",
  },
  [BlockType.QUIZ]: {
    icon: HelpCircle,
    label: "Quiz",
    color: "text-green-400",
    bgColor: "bg-green-600/10 border-green-600/20",
  },
  [BlockType.CODE]: {
    icon: Code,
    label: "Código",
    color: "text-cyan-400",
    bgColor: "bg-cyan-600/10 border-cyan-600/20",
  },
  [BlockType.IMAGE]: {
    icon: Image,
    label: "Imagen",
    color: "text-pink-400",
    bgColor: "bg-pink-600/10 border-pink-600/20",
  },
}

/* ===== Single Block Editor ===== */
function BlockEditor({
  block,
  index,
  onChange,
  onDelete,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}: BlockEditorProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const config = blockTypeConfig[block.type]
  const Icon = config.icon

  const handleFieldChange = (field: keyof ContentBlock, value: unknown) => {
    onChange({ ...block, [field]: value })
  }

  const handleSettingsChange = (
    field: string,
    value: string | boolean | undefined
  ) => {
    onChange({
      ...block,
      settings: { ...block.settings, [field]: value },
    })
  }

  const renderBlockFields = () => {
    switch (block.type) {
      case BlockType.TEXT:
        return (
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase">
              Contenido HTML
            </label>
            <textarea
              value={block.content || ""}
              onChange={(e) => handleFieldChange("content", e.target.value)}
              rows={6}
              className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-slate-300 font-mono text-sm outline-none focus:ring-2 focus:ring-emerald-600 transition-all resize-none"
              placeholder="<p>Escribe tu contenido aquí...</p>"
            />
          </div>
        )

      case BlockType.VIDEO:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">
                URL del Video
              </label>
              <input
                type="url"
                value={block.mediaUrl || ""}
                onChange={(e) => handleFieldChange("mediaUrl", e.target.value)}
                className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:ring-2 focus:ring-emerald-600 transition-all"
                placeholder="https://youtube.com/watch?v=... o https://vimeo.com/..."
              />
            </div>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={block.settings?.autoPlay || false}
                  onChange={(e) =>
                    handleSettingsChange("autoPlay", e.target.checked)
                  }
                  className="rounded bg-white/10 border-white/20"
                />
                <span className="text-sm text-slate-400">Autoplay</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={block.settings?.allowFullScreen !== false}
                  onChange={(e) =>
                    handleSettingsChange("allowFullScreen", e.target.checked)
                  }
                  className="rounded bg-white/10 border-white/20"
                />
                <span className="text-sm text-slate-400">Pantalla completa</span>
              </label>
            </div>
          </div>
        )

      case BlockType.IFRAME:
        return (
          <div className="space-y-4">
            {/* Subir HTML o pegar URL */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">
                Contenido HTML
              </label>
              <HtmlUploader
                currentUrl={
                  block.iframeSrc?.includes("res.cloudinary.com")
                    ? block.iframeSrc
                    : undefined
                }
                onUploadComplete={(result: HtmlUploadResult) => {
                  handleFieldChange("iframeSrc", result.url)
                }}
                onDelete={() => {
                  handleFieldChange("iframeSrc", "")
                }}
              />
            </div>

            {/* URL manual (alternativa) */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">
                O pegar URL del Iframe
              </label>
              <input
                type="url"
                value={block.iframeSrc || ""}
                onChange={(e) => handleFieldChange("iframeSrc", e.target.value)}
                className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:ring-2 focus:ring-emerald-600 transition-all"
                placeholder="https://ejemplo.com/contenido-embebido"
              />
            </div>

            {/* Altura */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">
                Altura (px o %)
              </label>
              <input
                type="text"
                value={block.settings?.height || ""}
                onChange={(e) => handleSettingsChange("height", e.target.value)}
                className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:ring-2 focus:ring-emerald-600 transition-all"
                placeholder="600px o 100%"
              />
            </div>
          </div>
        )

      case BlockType.IMAGE:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">
                URL de la Imagen
              </label>
              <input
                type="url"
                value={block.mediaUrl || ""}
                onChange={(e) => handleFieldChange("mediaUrl", e.target.value)}
                className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:ring-2 focus:ring-emerald-600 transition-all"
                placeholder="https://ejemplo.com/imagen.jpg"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">
                Pie de imagen (opcional)
              </label>
              <input
                type="text"
                value={block.settings?.caption || ""}
                onChange={(e) => handleSettingsChange("caption", e.target.value)}
                className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:ring-2 focus:ring-emerald-600 transition-all"
                placeholder="Descripción de la imagen"
              />
            </div>
            {block.mediaUrl && (
              <div className="p-4 bg-black/30 rounded-lg">
                <img
                  src={block.mediaUrl}
                  alt={block.settings?.caption || "Preview"}
                  className="max-h-48 rounded-lg mx-auto"
                />
              </div>
            )}
          </div>
        )

      case BlockType.FILE:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">
                URL del Archivo
              </label>
              <input
                type="url"
                value={block.mediaUrl || ""}
                onChange={(e) => handleFieldChange("mediaUrl", e.target.value)}
                className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:ring-2 focus:ring-emerald-600 transition-all"
                placeholder="https://ejemplo.com/archivo.pdf"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">
                  Nombre del archivo
                </label>
                <input
                  type="text"
                  value={block.settings?.fileName || ""}
                  onChange={(e) =>
                    handleSettingsChange("fileName", e.target.value)
                  }
                  className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:ring-2 focus:ring-emerald-600 transition-all"
                  placeholder="documento.pdf"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">
                  Tamaño
                </label>
                <input
                  type="text"
                  value={block.settings?.fileSize || ""}
                  onChange={(e) =>
                    handleSettingsChange("fileSize", e.target.value)
                  }
                  className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:ring-2 focus:ring-emerald-600 transition-all"
                  placeholder="2.5 MB"
                />
              </div>
            </div>
          </div>
        )

      case BlockType.CODE:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">
                Lenguaje
              </label>
              <select
                value={block.settings?.language || "javascript"}
                onChange={(e) =>
                  handleSettingsChange("language", e.target.value)
                }
                className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:ring-2 focus:ring-emerald-600 transition-all"
              >
                <option value="javascript">JavaScript</option>
                <option value="typescript">TypeScript</option>
                <option value="python">Python</option>
                <option value="html">HTML</option>
                <option value="css">CSS</option>
                <option value="json">JSON</option>
                <option value="bash">Bash</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">
                Código
              </label>
              <textarea
                value={block.content || ""}
                onChange={(e) => handleFieldChange("content", e.target.value)}
                rows={8}
                className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-slate-300 font-mono text-sm outline-none focus:ring-2 focus:ring-emerald-600 transition-all resize-none"
                placeholder="// Tu código aquí..."
              />
            </div>
          </div>
        )

      case BlockType.QUIZ:
        return (
          <div className="p-4 bg-amber-600/10 border border-amber-600/20 rounded-lg">
            <p className="text-amber-400 text-sm">
              Los quizzes se configuran desde el editor de Quiz dedicado.
              Este bloque indica dónde se mostrará el quiz dentro de la lección.
            </p>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div
      className={cn(
        "border rounded-xl overflow-hidden transition-all",
        config.bgColor
      )}
    >
      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 py-3 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <GripVertical className="w-4 h-4 text-slate-500 cursor-grab" />
          <div
            className={cn(
              "size-8 rounded-lg flex items-center justify-center",
              config.bgColor
            )}
          >
            <Icon className={cn("w-4 h-4", config.color)} />
          </div>
          <span className="font-bold text-white">
            {config.label} #{index + 1}
          </span>
        </div>

        <div className="flex-1" />

        {/* Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onMoveUp()
            }}
            disabled={isFirst}
            className="p-1.5 hover:bg-white/10 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronUp className="w-4 h-4 text-slate-400" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onMoveDown()
            }}
            disabled={isLast}
            className="p-1.5 hover:bg-white/10 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
            className="p-1.5 hover:bg-red-600/20 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4 text-red-400" />
          </button>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </div>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="px-4 pb-4 pt-2 border-t border-white/5">
          {renderBlockFields()}
        </div>
      )}
    </div>
  )
}

/* ===== Add Block Menu ===== */
function AddBlockMenu({
  onAdd,
}: {
  onAdd: (type: BlockType) => void
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-center gap-2 py-4 border-2 border-dashed border-white/10 hover:border-emerald-600/50 rounded-xl text-slate-400 hover:text-emerald-400 transition-all"
      >
        <Plus className="w-5 h-5" />
        <span className="font-medium">Agregar Bloque de Contenido</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 right-0 mt-2 p-2 bg-slate-900 border border-white/10 rounded-xl shadow-xl z-20 grid grid-cols-2 gap-2">
            {Object.entries(blockTypeConfig).map(([type, config]) => {
              const Icon = config.icon
              return (
                <button
                  key={type}
                  onClick={() => {
                    onAdd(type as BlockType)
                    setIsOpen(false)
                  }}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg transition-all hover:bg-white/5",
                    config.bgColor
                  )}
                >
                  <Icon className={cn("w-5 h-5", config.color)} />
                  <span className="font-medium text-white">{config.label}</span>
                </button>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

/* ===== Main Component ===== */
export function ContentBlockEditor({
  blocks,
  onChange,
  className,
}: ContentBlockEditorProps) {
  const handleAddBlock = (type: BlockType) => {
    const newBlock: ContentBlock = {
      type,
      order: blocks.length,
      content: type === BlockType.TEXT || type === BlockType.CODE ? "" : undefined,
      mediaUrl: undefined,
      iframeSrc: type === BlockType.IFRAME ? "" : undefined,
      settings: {},
    }
    onChange([...blocks, newBlock])
  }

  const handleUpdateBlock = (index: number, updatedBlock: ContentBlock) => {
    const newBlocks = [...blocks]
    newBlocks[index] = updatedBlock
    onChange(newBlocks)
  }

  const handleDeleteBlock = (index: number) => {
    const newBlocks = blocks.filter((_, i) => i !== index)
    // Reordenar
    onChange(newBlocks.map((block, i) => ({ ...block, order: i })))
  }

  const handleMoveUp = (index: number) => {
    if (index === 0) return
    const newBlocks = [...blocks]
    ;[newBlocks[index - 1], newBlocks[index]] = [
      newBlocks[index],
      newBlocks[index - 1],
    ]
    onChange(newBlocks.map((block, i) => ({ ...block, order: i })))
  }

  const handleMoveDown = (index: number) => {
    if (index === blocks.length - 1) return
    const newBlocks = [...blocks]
    ;[newBlocks[index], newBlocks[index + 1]] = [
      newBlocks[index + 1],
      newBlocks[index],
    ]
    onChange(newBlocks.map((block, i) => ({ ...block, order: i })))
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-xl bg-purple-600/10 flex items-center justify-center border border-purple-600/20">
          <Code className="w-5 h-5 text-purple-400" />
        </div>
        <div>
          <h4 className="text-xl font-bold text-white">Contenido de la Lección</h4>
          <p className="text-xs text-slate-400">
            {blocks.length} {blocks.length === 1 ? "bloque" : "bloques"} de contenido
          </p>
        </div>
      </div>

      {/* Blocks List */}
      <div className="space-y-4">
        {blocks.map((block, index) => (
          <BlockEditor
            key={`${block.type}-${index}`}
            block={block}
            index={index}
            onChange={(updated) => handleUpdateBlock(index, updated)}
            onDelete={() => handleDeleteBlock(index)}
            onMoveUp={() => handleMoveUp(index)}
            onMoveDown={() => handleMoveDown(index)}
            isFirst={index === 0}
            isLast={index === blocks.length - 1}
          />
        ))}

        {/* Add Block Button */}
        <AddBlockMenu onAdd={handleAddBlock} />
      </div>
    </div>
  )
}
