import { useEffect, useRef, useState } from 'react'
import rough from 'roughjs'
import { cn } from '@/lib/cn'
import { useThemeObserver } from '@/lib/hooks'

type Shape = 'rectangle' | 'ellipse' | 'underline' | 'bracket'

type RoughBoxProps = {
  children?: React.ReactNode
  className?: string
  /** Forma trazada detrás del contenido. */
  shape?: Shape
  /** Color del trazo. Por defecto la tinta del tema actual. */
  stroke?: string
  strokeWidth?: number
  /** Cuántas veces repasa el lápiz cada línea: más = más "a pulso". */
  roughness?: number
  /** Rayado interior opcional. */
  fill?: string
  fillStyle?: 'hachure' | 'cross-hatch' | 'zigzag' | 'solid'
  /** Semilla fija para que el trazo no cambie en cada render. */
  seed?: number
  padding?: number
}

/**
 * Dibuja una forma con roughjs detrás de sus hijos y la redibuja cuando el
 * contenedor cambia de tamaño. Es el recurso para bordes verdaderamente
 * irregulares, donde un `border` de CSS se ve demasiado perfecto.
 */
export function RoughBox({
  children,
  className,
  shape = 'rectangle',
  stroke,
  strokeWidth = 2,
  roughness = 1.6,
  fill,
  fillStyle = 'hachure',
  seed = 42,
  padding = 2,
}: RoughBoxProps) {
  const hostRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const [size, setSize] = useState({ w: 0, h: 0 })
  const theme = useThemeObserver()

  // Observa el tamaño real del contenedor: el trazo debe seguir al contenido.
  useEffect(() => {
    const host = hostRef.current
    if (!host) return

    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setSize({ w: Math.round(width), h: Math.round(height) })
    })
    ro.observe(host)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const svg = svgRef.current
    if (!svg || size.w === 0 || size.h === 0) return

    svg.replaceChildren()

    // `stroke` puede venir como var(--color-ink); roughjs necesita un color
    // resuelto, así que lo leemos del estilo computado del host.
    const resolved =
      stroke ?? (getComputedStyle(hostRef.current!).getPropertyValue('color').trim() || '#000')

    const rc = rough.svg(svg)
    const opts = {
      stroke: resolved,
      strokeWidth,
      roughness,
      seed,
      bowing: 1.2,
      ...(fill ? { fill, fillStyle, hachureGap: 6, fillWeight: 1.2 } : {}),
    }

    const p = padding
    const w = size.w - p * 2
    const h = size.h - p * 2
    if (w <= 0 || h <= 0) return

    let node: SVGGElement
    switch (shape) {
      case 'ellipse':
        node = rc.ellipse(size.w / 2, size.h / 2, w, h, opts)
        break
      case 'underline':
        node = rc.line(p, size.h - p, size.w - p, size.h - p, opts)
        break
      case 'bracket':
        node = rc.linearPath(
          [
            [p + w * 0.12, p],
            [p, p],
            [p, size.h - p],
            [p + w * 0.12, size.h - p],
          ],
          opts,
        )
        break
      default:
        node = rc.rectangle(p, p, w, h, opts)
    }

    svg.appendChild(node)
    // `theme` entra como dependencia para reponer el trazo con los colores
    // nuevos cuando se conmuta claro/oscuro.
  }, [size, shape, stroke, strokeWidth, roughness, fill, fillStyle, seed, padding, theme])

  return (
    <div ref={hostRef} className={cn('relative', className)}>
      <svg
        ref={svgRef}
        className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
        width={size.w}
        height={size.h}
        aria-hidden="true"
      />
      {children}
    </div>
  )
}
