import { NextResponse } from "next/server"

// Hosts permitidos para proxying
const ALLOWED_HOSTS = new Set(["res.cloudinary.com"])

// Caché en memoria para evitar re-fetch constante (TTL: 5 min)
const cache = new Map<string, { html: string; timestamp: number }>()
const CACHE_TTL = 5 * 60 * 1000

function getBaseHref(url: URL): string {
  const path = url.pathname
  const lastSlash = path.lastIndexOf("/")
  const basePath = lastSlash >= 0 ? path.slice(0, lastSlash + 1) : "/"
  return `${url.origin}${basePath}`
}

/**
 * Inyecta tags necesarios en el HTML para renderizado correcto dentro de iframe:
 * - <base href> para resolver recursos relativos
 * - <meta viewport> si no existe
 * - Script de error-handling para suprimir errores de funciones legacy faltantes
 */
function prepareHtml(html: string, baseHref: string): string {
  if (!html) return html

  // 1. Inyectar <base> si no existe
  if (!html.match(/<base\s/i)) {
    const baseTag = `<base href="${baseHref}">`
    const headMatch = html.match(/<head[^>]*>/i)
    if (headMatch) {
      html = html.replace(headMatch[0], `${headMatch[0]}\n    ${baseTag}`)
    } else {
      html = `<head><base href="${baseHref}"></head>\n${html}`
    }
  }

  // 2. Inyectar viewport meta si no existe
  if (!html.match(/<meta[^>]*name=["']viewport["']/i)) {
    const viewportMeta = `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
    const headMatch = html.match(/<head[^>]*>/i)
    if (headMatch) {
      html = html.replace(headMatch[0], `${headMatch[0]}\n    ${viewportMeta}`)
    }
  }

  // 3. Inyectar error handler global para suprimir errores de funciones legacy faltantes
  const errorHandler = `
<script>
// WC Training: Supresor de errores para contenido HTML legacy
window.onerror = function(msg, src, line, col, err) {
  if (msg && typeof msg === 'string' && msg.includes('is not defined')) {
    console.warn('[WCT Legacy]', msg);
    return true; // Suprimir error
  }
  return false;
};
</script>`

  // Inyectar antes de </head> o al inicio
  const headCloseMatch = html.match(/<\/head>/i)
  if (headCloseMatch) {
    html = html.replace(headCloseMatch[0], `${errorHandler}\n${headCloseMatch[0]}`)
  } else {
    html = `${errorHandler}\n${html}`
  }

  return html
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const url = searchParams.get("url")

  if (!url) {
    return NextResponse.json({ error: "Missing url" }, { status: 400 })
  }

  let target: URL
  try {
    target = new URL(url)
  } catch {
    return NextResponse.json({ error: "Invalid url" }, { status: 400 })
  }

  // Validación de seguridad: solo Cloudinary raw uploads
  if (!ALLOWED_HOSTS.has(target.hostname) || !target.pathname.includes("/raw/upload/")) {
    return NextResponse.json({ error: "URL not allowed" }, { status: 403 })
  }

  const cacheKey = target.toString()

  // Revisar caché en memoria
  const cached = cache.get(cacheKey)
  const noCache = searchParams.get("nocache") === "1"
  if (cached && !noCache && Date.now() - cached.timestamp < CACHE_TTL) {
    return buildResponse(cached.html)
  }

  // Fetch desde Cloudinary
  try {
    const upstream = await fetch(target.toString(), {
      cache: "no-store",
      signal: AbortSignal.timeout(15000), // Timeout de 15s
    })

    if (!upstream.ok) {
      return NextResponse.json(
        { error: `Cloudinary respondió con ${upstream.status}` },
        { status: upstream.status }
      )
    }

    const rawHtml = await upstream.text()
    const baseHref = getBaseHref(target)
    const processedHtml = prepareHtml(rawHtml, baseHref)

    // Guardar en caché
    cache.set(cacheKey, { html: processedHtml, timestamp: Date.now() })

    // Limpiar entradas viejas del caché (máx 100 entradas)
    if (cache.size > 100) {
      const oldest = [...cache.entries()]
        .sort((a, b) => a[1].timestamp - b[1].timestamp)
        .slice(0, cache.size - 50)
      oldest.forEach(([key]) => cache.delete(key))
    }

    return buildResponse(processedHtml)
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error al obtener HTML"
    return NextResponse.json({ error: message }, { status: 502 })
  }
}

function buildResponse(html: string): Response {
  const headers = new Headers()
  headers.set("Content-Type", "text/html; charset=utf-8")
  headers.set("Content-Disposition", "inline")
  headers.set("X-Content-Type-Options", "nosniff")
  headers.set("Cache-Control", "public, max-age=300, stale-while-revalidate=60")
  headers.set("X-Frame-Options", "SAMEORIGIN")

  return new Response(html, { status: 200, headers })
}
