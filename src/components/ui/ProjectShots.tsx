import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'motion/react'
import { Maximize2, X } from 'lucide-react'
import type { ProjectShot } from '@/data/content'
import { useLockBodyScroll, usePrefersReducedMotion } from '@/lib/hooks'
import { cn } from '@/lib/cn'

/**
 * Capturas reales de un proyecto, montadas como fotos pegadas al cuaderno.
 * Ocupa el mismo hueco que `BlueprintDiagram` para que las tarjetas con
 * captura y las que sólo tienen diagrama mantengan la misma altura.
 *
 * A tamaño de tarjeta una captura de escritorio no se lee, así que al pulsarla
 * se amplía a pantalla completa.
 */
export function ProjectShots({ shots, title }: { shots: ProjectShot[]; title: string }) {
  const [index, setIndex] = useState(0)
  const [zoomed, setZoomed] = useState(false)

  // Si cambian las capturas, un índice viejo podría quedar fuera de rango.
  const active = shots[index] ?? shots[0]

  if (!active) return null

  return (
    <div>
      <button
        type="button"
        onClick={() => setZoomed(true)}
        className="border-ink bg-paper-sunken group relative block h-56 w-full overflow-hidden border-2"
        aria-label={`Ampliar captura de ${title}`}
      >
        <img
          src={active.src}
          alt={active.alt}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.03]"
        />

        <span
          className="border-ink bg-highlighter text-on-highlighter absolute top-2 right-2 grid h-8 w-8 place-items-center border-2 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
          aria-hidden="true"
        >
          <Maximize2 size={14} />
        </span>

        <span className="tape text-micro text-ink-soft absolute right-2 bottom-2 px-2 py-0.5 uppercase">
          {shots.length > 1 ? `Captura ${index + 1}/${shots.length}` : 'Captura de pantalla'}
        </span>
      </button>

      {/* Miniaturas: sólo tienen sentido cuando hay más de una captura. */}
      {shots.length > 1 && (
        <div className="mt-2.5 flex flex-wrap gap-2" role="group" aria-label="Elegir captura">
          {shots.map((shot, i) => (
            <button
              key={shot.src}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Ver captura ${i + 1}`}
              aria-pressed={i === index}
              className={cn(
                'bg-paper-sunken h-12 w-16 shrink-0 overflow-hidden border-2 transition-all',
                i === index
                  ? 'border-ink -rotate-2'
                  : 'border-rule-soft opacity-60 hover:opacity-100',
              )}
            >
              <img src={shot.src} alt="" loading="lazy" className="h-full w-full object-cover object-top" />
            </button>
          ))}
        </div>
      )}

      <Lightbox shot={active} open={zoomed} onClose={() => setZoomed(false)} />
    </div>
  )
}

/**
 * Se monta en `document.body` a propósito: la tarjeta se inclina al pasar el
 * cursor y `motion` le aplica transformaciones, y cualquier `transform` en un
 * ancestro convierte `position: fixed` en `absolute`. Fuera del árbol de la
 * tarjeta, la ampliación siempre cubre la ventana.
 */
function Lightbox({
  shot,
  open,
  onClose,
}: {
  shot: ProjectShot
  open: boolean
  onClose: () => void
}) {
  const reduced = usePrefersReducedMotion()
  useLockBodyScroll(open)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (typeof document === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="bg-ink/85 fixed inset-0 z-100 grid place-items-center p-4 backdrop-blur-sm md:p-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0 : 0.2 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={shot.alt}
        >
          <motion.img
            src={shot.src}
            alt={shot.alt}
            initial={{ scale: reduced ? 1 : 0.96 }}
            animate={{ scale: 1 }}
            exit={{ scale: reduced ? 1 : 0.96 }}
            transition={{ duration: reduced ? 0 : 0.2 }}
            // Evita que un clic sobre la propia imagen cierre la ampliación.
            onClick={(e) => e.stopPropagation()}
            // Se topa con el viewport (no con `max-h-full`): dentro de un grid el
            // ítem tiene `min-height: auto` y toma como suelo su altura intrínseca,
            // así que una captura muy alta ignoraría `max-h-full` y desbordaría.
            className="border-paper max-h-[88dvh] max-w-[92vw] border-4 object-contain shadow-[10px_10px_0_0_rgba(0,0,0,0.35)]"
          />

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar la ampliación"
            className="border-paper bg-ink text-paper hover:bg-highlighter hover:text-on-highlighter fixed top-4 right-4 grid h-11 w-11 place-items-center border-2 transition-colors"
          >
            <X size={18} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
