import { skillGroups } from '@/data/content'
import {
  Reveal,
  RevealGroup,
  RevealItem,
  Section,
  SectionHead,
  SketchCard,
} from '@/components/ui/primitives'
import { cn } from '@/lib/cn'

const VB = { w: 1000, h: 700 }

type NodePosition = { left: number; top: number }

/**
 * Reparte los grupos en una elipse alrededor del núcleo, en porcentaje del
 * contenedor. Se calcula en vez de escribirse a mano para que el mapa siga
 * funcionando si añades o quitas grupos en `content.ts`.
 *
 * Se arranca en -135° para que con cuatro grupos caigan en las esquinas, que
 * es donde mejor respiran.
 */
function nodePositions(count: number): NodePosition[] {
  return Array.from({ length: count }, (_, i) => {
    const angle = ((-135 + (360 / count) * i) * Math.PI) / 180
    return {
      left: 50 + Math.cos(angle) * 33,
      top: 50 + Math.sin(angle) * 33,
    }
  })
}

const toVB = (p: NodePosition) => ({
  x: (p.left / 100) * VB.w,
  y: (p.top / 100) * VB.h,
})

export function Skills() {
  const positions = nodePositions(skillGroups.length)

  return (
    <Section id="skills" className="paper-grid">
      <SectionHead
        eyebrow="// SECTION_02: STACK_OVERVIEW"
        title="Lo que manejo"
        intro="El stack visto como un sistema: un núcleo y los dominios que se alimentan entre sí."
        align="center"
      />

      {/* ------------------------------------------------- Mapa de nodos (lg+) */}
      <Reveal>
        <div className="sketch-frame bg-paper-sunken relative hidden aspect-[10/7] w-full overflow-hidden lg:block">
          <svg
            viewBox={`0 0 ${VB.w} ${VB.h}`}
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-0 h-full w-full"
            aria-hidden="true"
          >
            {positions.map((pos, i) => {
              const { x, y } = toVB(pos)
              const cx = (VB.w / 2 + x) / 2
              const cy = VB.h / 2
              return (
                <path
                  key={i}
                  d={`M${VB.w / 2},${VB.h / 2} Q${cx},${cy} ${x},${y}`}
                  fill="none"
                  stroke="var(--color-blueprint)"
                  strokeWidth="3"
                  strokeDasharray="10 6"
                  opacity="0.55"
                />
              )
            })}
          </svg>

          {/* Núcleo */}
          <div className="absolute top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2 animate-[var(--animate-drift)]">
            <div className="node-blob bg-highlighter border-ink border-4 px-10 py-5 text-center shadow-[6px_6px_0_0_var(--color-ink)]">
              <p className="text-headline text-on-highlighter leading-none">CORE</p>
              <p className="font-code text-micro text-on-highlighter mt-1 opacity-70">L.K. STACK</p>
            </div>
          </div>

          {/* Grupos */}
          {skillGroups.map((group, i) => {
            const pos = positions[i]
            return (
              <div
                key={group.id}
                className="absolute z-10 w-[260px] -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${pos.left}%`, top: `${pos.top}%` }}
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="node-blob bg-blueprint px-4 py-2 text-center text-white shadow-[4px_4px_0_0_var(--color-ink)]">
                    <span className="text-label">{group.title}</span>
                  </div>

                  <div className="flex flex-wrap justify-center gap-1.5">
                    {group.skills.map((skill) => (
                      <span
                        key={skill.name}
                        className="node-blob-alt bg-paper-raised border-ink hover:bg-highlighter hover:text-on-highlighter font-code text-micro cursor-default border-2 px-2.5 py-1 transition-colors"
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}

          <p className="text-blueprint absolute top-6 right-8 rotate-6 text-sm italic opacity-70">
            "Everything is a system."
          </p>
        </div>
      </Reveal>

      {/* ------------------------------------------ Detalle por grupo (siempre) */}
      <RevealGroup className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {skillGroups.map((group, i) => (
          <RevealItem key={group.id}>
            <SketchCard tilt={[-0.8, 0.7, -0.5, 0.9][i % 4]} className="h-full p-5">
              <div className="border-rule-soft mb-4 flex items-baseline justify-between gap-2 border-b-2 border-dashed pb-3">
                <h3 className="text-label uppercase">{group.title}</h3>
                <span className="font-code text-micro text-blueprint shrink-0">{group.note}</span>
              </div>

              <ul className="space-y-3.5">
                {group.skills.map((skill) => (
                  <li key={skill.name}>
                    <SkillMeter name={skill.name} level={skill.level} />
                  </li>
                ))}
              </ul>
            </SketchCard>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  )
}

/** Medidor con relleno rayado, como si estuviera coloreado a mano. */
function SkillMeter({ name, level }: { name: string; level: number }) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between gap-2">
        <span className="font-code text-code">{name}</span>
        <span className="text-micro text-ink-faint tabular-nums">{level}%</span>
      </div>

      <div
        className={cn('border-ink relative h-3 border-2')}
        role="meter"
        aria-valuenow={level}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Nivel de ${name}`}
      >
        <div
          className="bg-blueprint/25 absolute inset-y-0 left-0"
          style={{
            width: `${level}%`,
            backgroundImage:
              'repeating-linear-gradient(45deg, var(--color-blueprint) 0 2px, transparent 2px 6px)',
          }}
        />
        {/* Marca de tinta al final del trazo */}
        <span
          className="bg-ink absolute inset-y-0 w-[2px]"
          style={{ left: `calc(${level}% - 1px)` }}
          aria-hidden="true"
        />
      </div>
    </div>
  )
}
