import { useEffect, useRef } from 'react'
import { annotate } from 'rough-notation'
import type { RoughAnnotation, RoughAnnotationType } from 'rough-notation/lib/model'
import { usePrefersReducedMotion, useThemeObserver } from '@/lib/hooks'

type AnnotateProps = {
  children: React.ReactNode
  type?: RoughAnnotationType
  color?: string
  strokeWidth?: number
  /** Retrasa el trazo para encadenar anotaciones en una misma frase. */
  delay?: number
  multiline?: boolean
  iterations?: number
  padding?: number
  /** Si es false, la anotación espera; útil para dispararla al entrar en vista. */
  show?: boolean
}

/**
 * Envuelve texto con una anotación de rough-notation (subrayado, círculo,
 * marcador…). El trazo se dibuja cuando `show` pasa a true.
 */
export function Annotate({
  children,
  type = 'underline',
  color,
  strokeWidth = 2,
  delay = 0,
  multiline = true,
  iterations = 2,
  padding = 2,
  show = true,
}: AnnotateProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const annotationRef = useRef<RoughAnnotation | null>(null)
  const reduced = usePrefersReducedMotion()
  const theme = useThemeObserver()

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Sin color explícito tomamos el azul blueprint del tema activo, para que
    // la anotación cambie sola entre claro y oscuro.
    const resolved =
      color ??
      (getComputedStyle(document.documentElement).getPropertyValue('--raw-blueprint').trim() ||
        '#487ef8')

    const a = annotate(el, {
      type,
      color: resolved,
      strokeWidth,
      multiline,
      iterations,
      padding,
      animationDuration: reduced ? 0 : 800,
    })
    annotationRef.current = a

    return () => {
      a.remove()
      annotationRef.current = null
    }
    // Al cambiar de tema se recrea la anotación para tomar el azul del tema nuevo.
  }, [type, color, strokeWidth, multiline, iterations, padding, reduced, theme])

  useEffect(() => {
    const a = annotationRef.current
    if (!a) return

    if (!show) {
      a.hide()
      return
    }

    const timer = setTimeout(() => a.show(), reduced ? 0 : delay)
    return () => clearTimeout(timer)
    // `theme` es necesario aquí: al recrearse la anotación nace oculta y hay
    // que volver a mostrarla, o el trazo desaparecería al conmutar el tema.
  }, [show, delay, reduced, theme])

  return (
    <span ref={ref} className="relative inline">
      {children}
    </span>
  )
}
