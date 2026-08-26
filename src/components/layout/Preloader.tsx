import { useEffect, useState } from 'react'
import { animate, motion, useMotionTemplate, useMotionValue } from 'motion/react'
import { profile } from '@/data/site'
import { usePrefersReducedMotion } from '@/lib/hooks'

/*
 * PANTALLA DE CARGA — "la hoja se dibuja sola"
 *
 * Cuenta en tres actos lo mismo que cuenta el resto del sitio: primero las
 * líneas de construcción en azul de plano, luego el lápiz entinta el marco y
 * el monograma encima de ellas, y al final un borrador barre la hoja y deja
 * ver el portafolio. Es el orden real en que se levanta un dibujo técnico.
 */

/** Lo que tarda el boceto en completarse; el velo no se va antes. */
const MIN_MS = 2000
/** Barrido del borrador. */
const WIPE_MS = 900
/** Hasta dónde llega la barra mientras la página aún no ha terminado de cargar. */
const STALL = 0.9

/* ------------------------------------------------------------------ Trazos */

/** Marco entintado. El lápiz recorre exactamente esta ruta. */
const BOX =
  'M24 20 C60 17 104 16 140 19 C143 56 143 98 141 133 C104 136 62 136 25 133 C22 96 22 58 24 20 L34 18.7'

/** Segunda pasada, un pelo desviada: el repasado que delata la mano. */
const BOX_PASS_2 =
  'M27 23 C62 20.5 105 19.5 137 22 C140 57 140 96 138 130 C103 132.5 63 132.5 28 130 C25 95 25 57 27 23'

/** Monograma, un trazo por gesto del lápiz. */
const LETTERS = [
  'M54 47 C53.5 68 53.6 90 54 104 C66 104.6 77 104.3 88 103.5',
  'M100 46 C99.6 68 99.8 88 100 105',
  'M128 47 C119 59 108 70 100 77 C110 85 120 95 130 106',
]

/** Líneas de construcción: caja, diagonales y ejes por el centro (82, 76). */
const GUIDES = [
  'M22 18 H142 V134 H22 Z',
  'M22 18 L142 134',
  'M142 18 L22 134',
  'M82 6 V146',
  'M8 76 H156',
]

const STEPS = [
  { until: 0.25, label: 'Tensando la hoja' },
  { until: 0.55, label: 'Trazando la retícula' },
  { until: 0.85, label: 'Entintando el monograma' },
  { until: 0.99, label: 'Revisando las cotas' },
  { until: Infinity, label: 'Listo' },
]

export function Preloader() {
  const reduced = usePrefersReducedMotion()
  const [progress, setProgress] = useState(0)
  const [leaving, setLeaving] = useState(false)
  const [gone, setGone] = useState(false)

  /** 0 = hoja intacta, 118 = barrida del todo. La leen la máscara y el borrador. */
  const wipe = useMotionValue(0)
  const mask = useMotionTemplate`linear-gradient(90deg, transparent 0%, transparent calc(${wipe}% - 9%), #000 ${wipe}%, #000 100%)`
  const eraserX = useMotionTemplate`${wipe}%`

  /*
   * La barra sube con el reloj pero se planta en el 90 % hasta que la página
   * está de verdad lista. Se espera también a las fuentes: la identidad del
   * sitio es tipográfica y un cambio de fuente a la vista arruina la entrada.
   */
  useEffect(() => {
    let ready = false
    let raf = 0
    const start = performance.now()

    const loaded =
      document.readyState === 'complete'
        ? Promise.resolve()
        : new Promise<void>((resolve) => {
            window.addEventListener('load', () => resolve(), { once: true })
          })

    void Promise.all([loaded, document.fonts?.ready ?? Promise.resolve()]).then(() => {
      ready = true
    })

    const tick = (now: number) => {
      const timed = Math.min(1, (now - start) / MIN_MS)
      const value = ready ? timed : Math.min(timed, STALL)

      setProgress(value)
      if (value >= 1) setLeaving(true)
      else raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  // Salida: el borrador cruza la hoja; con movimiento reducido, un fundido seco.
  useEffect(() => {
    if (!leaving) return

    const controls = animate(wipe, 118, {
      duration: reduced ? 0.2 : WIPE_MS / 1000,
      ease: reduced ? 'linear' : [0.66, 0, 0.34, 1],
    })

    void controls.finished.then(() => setGone(true))
    return () => controls.stop()
  }, [leaving, reduced, wipe])

  if (gone) return null

  const pct = Math.round(progress * 100)
  const label = STEPS.find((s) => progress < s.until)?.label ?? 'Listo'

  /*
   * Con movimiento reducido el dibujo aparece ya terminado, sin trazarse.
   *
   * La opacidad entra de golpe justo al arrancar cada trazo: con `pathLength`
   * a 0 y remate redondo el navegador pinta igualmente un punto, y sin esto se
   * ven lunares sueltos flotando antes de que el lápiz llegue a ellos.
   */
  const draw = (delay: number, duration: number, opacity = 1) =>
    reduced
      ? { initial: { pathLength: 1, opacity }, animate: { pathLength: 1, opacity } }
      : {
          initial: { pathLength: 0, opacity: 0 },
          animate: { pathLength: 1, opacity },
          transition: {
            pathLength: { delay, duration, ease: 'easeInOut' as const },
            opacity: { delay, duration: 0.001 },
          },
        }

  return (
    <div
      className="fixed inset-0 z-200"
      style={{ pointerEvents: leaving ? 'none' : 'auto' }}
      role="status"
      aria-live="polite"
      aria-label="Cargando el portafolio"
    >
      {/*
        La hoja: es lo que el borrador va comiendo de izquierda a derecha.

        Las separaciones y la marca se miden contra el alto de la ventana, no
        sólo contra el ancho: en un móvil apaisado sobran unos 300 px de alto y
        con medidas fijas el bloque quedaba pegado a los bordes.
      */}
      <motion.div
        className="bg-paper paper-grid absolute inset-0 flex flex-col items-center justify-center gap-[clamp(0.75rem,4vh,1.75rem)] px-6"
        style={{ maskImage: mask, WebkitMaskImage: mask }}
      >
        <CornerMarks />

        <svg
          viewBox="0 0 164 152"
          className="text-ink max-h-[26vh] w-36 md:w-44"
          fill="none"
          aria-hidden="true"
        >
          {/* Líneas de construcción: entran de golpe y se retiran al final. */}
          <motion.g
            className="stroke-blueprint"
            strokeWidth="1"
            strokeDasharray="4 5"
            initial={{ opacity: 0 }}
            animate={{ opacity: reduced ? 0.35 : [0, 0.55, 0.55, 0.18] }}
            transition={{ duration: 1.9, times: [0, 0.08, 0.72, 1], ease: 'linear' }}
          >
            {GUIDES.map((d) => (
              <path key={d} d={d} />
            ))}
            <circle cx="82" cy="76" r="3" strokeDasharray="0" />
          </motion.g>

          {/* Marco entintado: la pasada buena y el repasado encima. */}
          <motion.path
            d={BOX}
            stroke="currentColor"
            strokeWidth="3.2"
            strokeLinecap="round"
            {...draw(0.12, 1.05)}
          />
          <motion.path
            d={BOX_PASS_2}
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            {...draw(0.5, 0.85, 0.4)}
          />

          {/* Monograma: un trazo por letra, jotados en cuanto cierra el marco. */}
          {LETTERS.map((d, i) => (
            <motion.path
              key={d}
              d={d}
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              {...draw(1.02 + i * 0.16, 0.3)}
            />
          ))}

          {!reduced && <Pencil />}
        </svg>

        <div className="flex flex-col items-center gap-1 text-center">
          <motion.p
            className="font-display text-headline-sm font-extrabold"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: reduced ? 0 : 1.45, duration: 0.4 }}
          >
            {profile.shortName}
          </motion.p>
          <motion.p
            className="text-micro text-ink-soft uppercase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: reduced ? 0 : 1.6, duration: 0.4 }}
          >
            {profile.badge}
          </motion.p>
        </div>

        <Ruler pct={pct} label={label} />
      </motion.div>

      {/* El borrador va fuera de la máscara: dentro, se borraría a sí mismo. */}
      {leaving && !reduced && <Eraser x={eraserX} />}
    </div>
  )
}

/* ----------------------------------------------------------------- Piezas */

/** Marcas de registro en las esquinas, como en una plancha de dibujo. */
const CORNERS = [
  'top-5 left-5 border-t-2 border-l-2',
  'top-5 right-5 border-t-2 border-r-2',
  'bottom-5 left-5 border-b-2 border-l-2',
  'bottom-5 right-5 border-b-2 border-r-2',
]

function CornerMarks() {
  return (
    <>
      {CORNERS.map((c) => (
        <span
          key={c}
          className={`border-blueprint/45 absolute h-7 w-7 md:h-10 md:w-10 ${c}`}
          aria-hidden="true"
        />
      ))}
    </>
  )
}

/**
 * Lápiz clavado a la punta del trazo con `offset-path`: recorre la misma ruta
 * que el marco, así que la mina siempre coincide con la tinta que va saliendo.
 * `offset-rotate: 0deg` lo mantiene inclinado como lo sostendría una mano, en
 * lugar de girar siguiendo la curva.
 */
function Pencil() {
  return (
    <motion.g
      style={{ offsetPath: `path("${BOX}")`, offsetRotate: '0deg' }}
      initial={{ offsetDistance: '0%' }}
      animate={{ offsetDistance: '100%' }}
      transition={{ delay: 0.12, duration: 1.05, ease: 'easeInOut' }}
    >
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 1, 0], y: [3, 0, 0, -7] }}
        transition={{ duration: 1.35, times: [0, 0.09, 0.84, 1], ease: 'linear' }}
      >
        {/* Punta de grafito, con el vértice justo en el origen del recorrido. */}
        <path d="M0 0 L6.4 -2.1 L2.1 -6.4 Z" className="fill-ink" />
        <path
          d="M2.1 -6.4 L16.3 -20.5 L20.5 -16.3 L6.4 -2.1 Z"
          className="fill-highlighter stroke-ink"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        <path
          d="M16.3 -20.5 L20.5 -24.7 L24.7 -20.5 L20.5 -16.3 Z"
          className="fill-paper-deep stroke-ink"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      </motion.g>
    </motion.g>
  )
}

/** Barra de progreso con pinta de escalímetro: marcas cada 10 %. */
function Ruler({ pct, label }: { pct: number; label: string }) {
  return (
    <div className="w-[min(22rem,78vw)]">
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <span className="text-micro text-ink-soft truncate uppercase">{label}</span>
        {/* Ancho fijo: si no, el número baila al pasar de una cifra a otra. */}
        <span className="font-code text-code text-ink w-14 shrink-0 text-right tabular-nums">
          {pct}%
        </span>
      </div>

      <div
        className="border-ink bg-paper-raised relative h-6 w-full overflow-hidden border-2"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Progreso de carga"
      >
        <div
          className="bg-highlighter absolute inset-y-0 left-0 transition-[width] duration-200 ease-linear"
          style={{ width: `${pct}%` }}
        />
        {Array.from({ length: 9 }, (_, i) => (
          <span
            key={i}
            className="bg-ink/30 absolute top-0 w-px"
            style={{ left: `${(i + 1) * 10}%`, height: i === 4 ? '100%' : '7px' }}
            aria-hidden="true"
          />
        ))}
      </div>
    </div>
  )
}

/** Goma que encabeza el barrido, con su lluvia de migas de grafito. */
function Eraser({ x }: { x: ReturnType<typeof useMotionTemplate> }) {
  return (
    <motion.div
      className="absolute top-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
      style={{ left: x }}
    >
      {/* Rastro de goma: lo que queda recién frotado justo detrás. */}
      <span className="absolute top-1/2 right-full mr-1 flex -translate-y-1/2 flex-col gap-1.5">
        {[28, 44, 20].map((w, i) => (
          <span
            key={w}
            className="bg-ink-soft block h-0.5"
            style={{ width: w, opacity: 0.35 - i * 0.1 }}
            aria-hidden="true"
          />
        ))}
      </span>

      <svg viewBox="0 0 48 38" className="h-11 w-14 -rotate-6" aria-hidden="true">
        <rect
          x="3"
          y="7"
          width="42"
          height="24"
          rx="2"
          className="fill-paper-raised stroke-ink"
          strokeWidth="2.5"
        />
        <rect x="4.5" y="8.5" width="39" height="9" className="fill-blueprint-pale" />
        <path d="M3 19 H45" className="stroke-ink" strokeWidth="2.5" />
      </svg>

      {Array.from({ length: 6 }, (_, i) => (
        <motion.span
          key={i}
          className="bg-ink-soft absolute top-1/2 left-2 h-1.5 w-2"
          initial={{ opacity: 0.9, x: 0, y: 0, rotate: 0 }}
          animate={{ opacity: 0, x: -20 - i * 6, y: 26 + i * 5, rotate: -60 - i * 20 }}
          transition={{ duration: 0.6, delay: i * 0.08, repeat: Infinity, ease: 'easeIn' }}
          aria-hidden="true"
        />
      ))}
    </motion.div>
  )
}
