import { cn } from '@/lib/cn'

type DoodleProps = { className?: string; strokeWidth?: number }

/** Flecha curva de anotación, la que usarías para señalar algo en un margen. */
export function ArrowDoodle({ className, strokeWidth = 2 }: DoodleProps) {
  return (
    <svg viewBox="0 0 120 80" className={cn('h-20 w-30', className)} fill="none" aria-hidden="true">
      <path
        d="M6 8C34 4 66 14 84 38c6 8 9 17 9 26"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <path
        d="M82 52l11 14 12-12"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Estrella de cinco puntas trazada de un tirón. */
export function StarDoodle({ className, strokeWidth = 2 }: DoodleProps) {
  return (
    <svg viewBox="0 0 48 48" className={cn('h-10 w-10', className)} fill="none" aria-hidden="true">
      <path
        d="M24 5l6 13 14 1.5-10.5 9.5L37 43l-13-7.5L11 43l3.5-14L4 19.5 18 18z"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Garabato de subrayado enfático. */
export function SquiggleDoodle({ className, strokeWidth = 3 }: DoodleProps) {
  return (
    <svg viewBox="0 0 200 16" className={cn('h-4 w-50', className)} fill="none" aria-hidden="true" preserveAspectRatio="none">
      <path
        d="M2 10c22-9 44 5 66-2s44 6 66-1 44 4 64-1"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Chincheta para clavar tarjetas al tablero. */
export function PinDoodle({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 32 32" className={cn('h-8 w-8', className)} fill="none" aria-hidden="true">
      <circle cx="16" cy="12" r="8" fill="currentColor" opacity="0.9" />
      <circle cx="13" cy="9" r="2.5" fill="white" opacity="0.6" />
      <path d="M16 20v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

/** Compás/diana técnica que se usa como marca de agua en los márgenes. */
export function CompassDoodle({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 120 120" className={cn('h-30 w-30', className)} fill="none" aria-hidden="true">
      <circle cx="60" cy="60" r="42" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
      <circle cx="60" cy="60" r="24" stroke="currentColor" strokeWidth="1" />
      <path d="M14 60h92M60 14v92" stroke="currentColor" strokeWidth="1" />
      <circle cx="60" cy="60" r="3" fill="currentColor" />
    </svg>
  )
}

/** Clip sujetapapeles. */
export function ClipDoodle({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 24 48" className={cn('h-12 w-6', className)} fill="none" aria-hidden="true">
      <path
        d="M17 14v20a7 7 0 01-14 0V12a5 5 0 0110 0v20a3 3 0 01-6 0V15"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Retrato de reserva cuando no hay foto: un boceto a lápiz genérico. */
export function PortraitSketch({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 300 300" className={cn('h-full w-full', className)} fill="none" aria-hidden="true">
      <defs>
        <pattern id="hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="8" stroke="currentColor" strokeWidth="1" opacity="0.25" />
        </pattern>
      </defs>

      {/* Hombros */}
      <path
        d="M52 300c0-46 30-74 98-74s98 28 98 74"
        stroke="currentColor"
        strokeWidth="3"
        fill="url(#hatch)"
      />
      {/* Cuello */}
      <path d="M126 200v30M174 200v30" stroke="currentColor" strokeWidth="3" />
      {/* Cabeza */}
      <ellipse cx="150" cy="132" rx="62" ry="74" stroke="currentColor" strokeWidth="3" fill="none" />
      {/* Pelo */}
      <path
        d="M88 118c4-40 30-58 62-58s58 18 62 58c-14-18-34-26-62-26s-48 8-62 26z"
        stroke="currentColor"
        strokeWidth="3"
        fill="url(#hatch)"
      />
      {/* Gafas */}
      <circle cx="126" cy="132" r="19" stroke="currentColor" strokeWidth="3" fill="none" />
      <circle cx="174" cy="132" r="19" stroke="currentColor" strokeWidth="3" fill="none" />
      <path d="M145 132h10M88 128l19 4M212 128l-19 4" stroke="currentColor" strokeWidth="3" />
      {/* Pupilas y sonrisa */}
      <circle cx="126" cy="133" r="3.5" fill="currentColor" />
      <circle cx="174" cy="133" r="3.5" fill="currentColor" />
      <path d="M132 170c8 8 28 8 36 0" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M150 142v14h-7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}
