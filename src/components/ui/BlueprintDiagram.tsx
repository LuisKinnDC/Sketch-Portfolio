import { useId } from 'react'
import type { Project } from '@/data/content'

/**
 * Diagramas de arquitectura dibujados como planos técnicos. Cada proyecto
 * elige una de las tres variantes según lo que quiera contar.
 */
export function BlueprintDiagram({ variant }: { variant: Project['diagram'] }) {
  const gridId = useId()

  return (
    <div className="border-ink bg-paper-sunken relative h-56 overflow-hidden border-2">
      <svg viewBox="0 0 400 200" className="h-full w-full" role="img" aria-label="Diagrama de arquitectura del proyecto">
        <defs>
          <pattern id={gridId} width="20" height="20" patternUnits="userSpaceOnUse">
            <path
              d="M20 0 L0 0 0 20"
              fill="none"
              stroke="var(--color-blueprint)"
              strokeWidth="0.5"
              opacity="0.35"
            />
          </pattern>
        </defs>
        <rect width="400" height="200" fill={`url(#${gridId})`} />

        {variant === 'stack' && <StackDiagram />}
        {variant === 'flow' && <FlowDiagram />}
        {variant === 'grid' && <GridDiagram />}
      </svg>

      <span className="tape text-micro text-ink-soft absolute right-2 bottom-2 px-2 py-0.5 uppercase">
        Systems Architecture
      </span>
    </div>
  )
}

const box = {
  fill: 'none',
  stroke: 'var(--color-blueprint)',
  strokeWidth: 2,
} as const

const label = {
  fill: 'var(--color-blueprint)',
  fontFamily: 'Space Mono, monospace',
  fontSize: 10,
} as const

const dashed = {
  stroke: 'var(--color-blueprint)',
  strokeWidth: 2,
  strokeDasharray: '5 5',
} as const

/** Cliente → servicio → base de datos. */
function StackDiagram() {
  return (
    <g>
      <rect x="30" y="70" width="80" height="60" {...box} />
      <text x="45" y="105" {...label}>
        REACT UI
      </text>

      <path d="M110 100 L170 100" {...dashed} />

      <rect x="170" y="70" width="80" height="60" {...box} />
      <text x="184" y="105" {...label}>
        NODE.JS
      </text>

      <path d="M250 100 L305 100" {...dashed} />

      <ellipse cx="340" cy="100" rx="32" ry="42" {...box} />
      <text x="322" y="104" {...label}>
        PSQL
      </text>

      <text
        x="122"
        y="88"
        fill="var(--color-ink-soft)"
        fontFamily="Space Mono, monospace"
        fontSize="8"
        transform="rotate(-9 122 88)"
      >
        Auth middleware
      </text>
    </g>
  )
}

/** Petición → validación → persistencia + observabilidad. */
function FlowDiagram() {
  return (
    <g>
      <rect x="18" y="26" width="76" height="34" {...box} strokeDasharray="4 4" />
      <text x="28" y="47" {...label}>
        REQUEST
      </text>

      <rect x="152" y="20" width="96" height="46" {...box} strokeWidth="3" />
      <text x="176" y="48" {...label} fontSize="13">
        FASTAPI
      </text>

      <rect x="306" y="26" width="80" height="34" {...box} strokeDasharray="4 4" />
      <text x="314" y="47" {...label}>
        VALIDATION
      </text>

      <path d="M94 43 L152 43" {...dashed} />
      <path d="M248 43 L306 43" {...dashed} />
      <path d="M200 66 L200 104" {...dashed} />
      <path d="M194 98 L200 108 L206 98" fill="none" stroke="var(--color-blueprint)" strokeWidth="2" />

      <circle cx="110" cy="146" r="28" {...box} />
      <text x="88" y="150" {...label}>
        MONGODB
      </text>

      <path d="M138 146 L262 146" {...dashed} />
      <text
        x="168"
        y="138"
        fill="var(--color-ink-soft)"
        fontFamily="Space Mono, monospace"
        fontSize="8"
      >
        async flow
      </text>

      <rect x="266" y="122" width="48" height="48" {...box} transform="rotate(45 290 146)" />
      <text x="330" y="150" {...label}>
        LOGS
      </text>
    </g>
  )
}

/** Retícula de componentes: la metáfora de un design system. */
function GridDiagram() {
  const cells = [
    { x: 30, y: 34, w: 96, h: 44 },
    { x: 140, y: 34, w: 60, h: 44 },
    { x: 214, y: 34, w: 156, h: 44 },
    { x: 30, y: 92, w: 60, h: 74 },
    { x: 104, y: 92, w: 96, h: 34 },
    { x: 104, y: 140, w: 96, h: 26 },
    { x: 214, y: 92, w: 156, h: 74 },
  ]

  return (
    <g>
      {cells.map((c, i) => (
        <rect key={i} {...c} width={c.w} height={c.h} {...box} strokeWidth={i === 2 ? 3 : 2} />
      ))}
      <text x="40" y="60" {...label}>
        TOKENS
      </text>
      <text x="150" y="60" {...label}>
        BASE
      </text>
      <text x="224" y="60" {...label}>
        COMPONENTS
      </text>
      <text x="224" y="134" {...label}>
        DOCS / STORYBOOK
      </text>
      <path d="M126 56 L140 56" {...dashed} />
      <path d="M200 56 L214 56" {...dashed} />
    </g>
  )
}
