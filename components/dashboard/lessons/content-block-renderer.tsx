"use client"

import { cn } from "@/lib/utils"
import { Play, Code, FileText, Image as ImageIcon, HelpCircle, Download, ExternalLink } from "lucide-react"
import { BlockType, type ContentBlock } from "@/lib/api"

/* ===== Types ===== */
interface ContentBlockRendererProps {
  blocks: ContentBlock[]
  className?: string
}

// Sandbox amplio para HTML legacy (evita romper contenido)
const IFRAME_SANDBOX = "allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-modals allow-downloads allow-top-navigation-by-user-activation"

function resolveIframeSrc(src: string): string {
  if (src.startsWith("https://res.cloudinary.com/") && src.includes("/raw/upload/")) {
    return `/api/iframe-proxy?url=${encodeURIComponent(src)}`
  }

  return src
}

/* ===== Individual Block Components ===== */

// 📝 Text Block (HTML Rico)
function TextBlock({ content }: { content: string }) {
  return (
    <div
      className="prose prose-invert prose-lg max-w-none"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}

// 🎬 Video Block
function VideoBlock({ mediaUrl, settings }: { mediaUrl: string; settings?: ContentBlock["settings"] }) {
  // Detectar si es YouTube, Vimeo o video directo
  const isYouTube = mediaUrl.includes("youtube.com") || mediaUrl.includes("youtu.be")
  const isVimeo = mediaUrl.includes("vimeo.com")

  if (isYouTube || isVimeo) {
    const embedUrl = isYouTube
      ? mediaUrl.replace("watch?v=", "embed/").replace("youtu.be/", "youtube.com/embed/")
      : mediaUrl.replace("vimeo.com/", "player.vimeo.com/video/")

    return (
      <div className="relative aspect-video rounded-2xl overflow-hidden bg-black/50">
        <iframe
          src={embedUrl}
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen={settings?.allowFullScreen ?? true}
        />
      </div>
    )
  }

  // Video directo
  return (
    <div className="relative aspect-video rounded-2xl overflow-hidden bg-black/50">
      <video
        src={mediaUrl}
        className="w-full h-full object-contain"
        controls
        autoPlay={settings?.autoPlay}
      />
    </div>
  )
}

// 🖼️ Iframe Block (HTML Externo / Contenido Legacy / Quizzes Interactivos)
function IframeBlock({ iframeSrc, settings }: { iframeSrc: string; settings?: ContentBlock["settings"] }) {
  const resolvedSrc = resolveIframeSrc(iframeSrc)

  // El HTML legacy controla su propia altura, usamos min-height como fallback
  return (
    <div className="relative w-full">
      <iframe
        src={resolvedSrc}
        className="w-full border-0"
        style={{
          minHeight: settings?.height || "800px",
          height: settings?.height || "800px"
        }}
        allowFullScreen={settings?.allowFullScreen ?? true}
        sandbox={IFRAME_SANDBOX}
      />
      {/* Botón para abrir en nueva pestaña */}
      <a
        href={resolvedSrc}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-lg transition-colors"
        title="Abrir en nueva pestaña"
      >
        <ExternalLink className="w-4 h-4 text-white" />
      </a>
    </div>
  )
}

// 🖼️ Image Block
function ImageBlock({ mediaUrl, settings }: { mediaUrl: string; settings?: ContentBlock["settings"] }) {
  return (
    <figure className="my-8">
      <div className="relative rounded-2xl overflow-hidden bg-black/20">
        <img
          src={mediaUrl}
          alt={settings?.caption || "Imagen de la lección"}
          className="w-full h-auto object-cover"
        />
      </div>
      {settings?.caption && (
        <figcaption className="text-center text-sm text-slate-400 mt-3">
          {settings.caption}
        </figcaption>
      )}
    </figure>
  )
}

// 💻 Code Block
function CodeBlock({ content, settings }: { content: string; settings?: ContentBlock["settings"] }) {
  return (
    <div className="relative rounded-2xl overflow-hidden bg-[#1e1e2e] border border-white/10">
      {settings?.language && (
        <div className="absolute top-3 right-3 px-2 py-1 bg-white/10 rounded text-xs text-slate-400">
          {settings.language}
        </div>
      )}
      <pre className="p-6 overflow-x-auto">
        <code className="text-sm text-slate-200 font-mono">{content}</code>
      </pre>
    </div>
  )
}

// 📄 File Block (Descargable)
function FileBlock({ mediaUrl, settings }: { mediaUrl: string; settings?: ContentBlock["settings"] }) {
  return (
    <a
      href={mediaUrl}
      download
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/50 transition-all group"
    >
      <div className="size-14 rounded-xl bg-red-500/10 flex items-center justify-center">
        <FileText className="size-7 text-red-500" />
      </div>
      <div className="flex-1">
        <p className="font-bold text-white">{settings?.fileName || "Archivo descargable"}</p>
        <p className="text-sm text-slate-400">{settings?.fileSize || "Descargar"}</p>
      </div>
      <span className="px-4 py-2 rounded-lg bg-white/5 text-sm font-medium group-hover:bg-emerald-600 group-hover:text-white transition-all flex items-center gap-2">
        <Download className="w-4 h-4" />
        Descargar
      </span>
    </a>
  )
}

// ❓ Quiz Block (Placeholder)
function QuizBlock() {
  return (
    <div className="p-8 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center">
      <HelpCircle className="w-12 h-12 text-amber-400 mx-auto mb-4" />
      <p className="text-amber-400 font-medium">
        Quiz interactivo - Se mostrará aquí cuando esté configurado
      </p>
    </div>
  )
}

/* ===== Main Renderer Component ===== */
export function ContentBlockRenderer({ blocks, className }: ContentBlockRendererProps) {
  // Ordenar bloques por order
  const sortedBlocks = [...blocks].sort((a, b) => a.order - b.order)

  if (sortedBlocks.length === 0) {
    return (
      <div className={cn("text-center py-16", className)}>
        <p className="text-slate-500">Esta lección no tiene contenido aún</p>
      </div>
    )
  }

  return (
    <div className={cn("space-y-8", className)}>
      {sortedBlocks.map((block, index) => (
        <div key={`block-${index}-${block.type}`} className="content-block">
          {block.type === BlockType.TEXT && block.content && (
            <TextBlock content={block.content} />
          )}

          {block.type === BlockType.VIDEO && block.mediaUrl && (
            <VideoBlock mediaUrl={block.mediaUrl} settings={block.settings} />
          )}

          {block.type === BlockType.IFRAME && block.iframeSrc && (
            <IframeBlock iframeSrc={block.iframeSrc} settings={block.settings} />
          )}

          {block.type === BlockType.IMAGE && block.mediaUrl && (
            <ImageBlock mediaUrl={block.mediaUrl} settings={block.settings} />
          )}

          {block.type === BlockType.CODE && block.content && (
            <CodeBlock content={block.content} settings={block.settings} />
          )}

          {block.type === BlockType.FILE && block.mediaUrl && (
            <FileBlock mediaUrl={block.mediaUrl} settings={block.settings} />
          )}

          {block.type === BlockType.QUIZ && (
            <QuizBlock />
          )}
        </div>
      ))}
    </div>
  )
}
