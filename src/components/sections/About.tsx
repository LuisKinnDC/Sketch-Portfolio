import { BookOpen, Brain, Layers, Users } from 'lucide-react'
import { aboutParagraphs, traits } from '@/data/content'
import { profile } from '@/data/site'
import {
  Reveal,
  RevealGroup,
  RevealItem,
  Section,
  SectionHead,
  SketchCard,
} from '@/components/ui/primitives'
import { ClipDoodle, PortraitSketch } from '@/components/ui/Doodles'

const icons = { brain: Brain, layers: Layers, book: BookOpen, users: Users } as const

/** Convierte el **negrita** de los párrafos en un trazo de marcador. */
function renderEmphasis(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((chunk, i) =>
    chunk.startsWith('**') && chunk.endsWith('**') ? (
      <strong key={i} className="marker-swipe text-on-highlighter font-bold">
        {chunk.slice(2, -2)}
      </strong>
    ) : (
      <span key={i}>{chunk}</span>
    ),
  )
}

export function About() {
  return (
    <Section id="sobre-mi">
      <SectionHead
        eyebrow="// SECTION_01: IDENTITY"
        title="Sobre mí"
        intro="Quién hay detrás del lápiz, y cómo pienso los sistemas antes de construirlos."
      />

      <div className="grid gap-12 lg:grid-cols-12">
        {/* --------------------------------------------------------- Narrativa */}
        <div className="lg:col-span-7">
          <div className="space-y-5">
            {aboutParagraphs.map((p, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <p className="text-ink-soft leading-relaxed">{renderEmphasis(p)}</p>
              </Reveal>
            ))}
          </div>

          <RevealGroup className="mt-10 grid gap-5 sm:grid-cols-2">
            {traits.map((trait, i) => {
              const Icon = icons[trait.icon as keyof typeof icons]
              const tilt = [-1, 1, -0.6, 0.8][i % 4]

              return (
                <RevealItem key={trait.title}>
                  <SketchCard tilt={tilt} className="h-full p-5">
                    <Icon size={24} className="text-blueprint mb-3" />
                    <h3 className="text-label mb-2 uppercase">{trait.title}</h3>
                    <p className="font-code text-code text-ink-soft">{trait.body}</p>
                  </SketchCard>
                </RevealItem>
              )
            })}
          </RevealGroup>
        </div>

        {/* ------------------------------------------------------ Ficha lateral */}
        <div className="lg:col-span-5">
          <Reveal from="right">
            <div className="relative mx-auto max-w-sm">
              <ClipDoodle className="text-ink-faint absolute -top-7 left-1/2 z-10 -translate-x-1/2" />

              <div className="sketch-frame bg-paper-raised rotate-[1.5deg] p-5">
                <div className="paper-dots border-rule-soft text-ink aspect-square border-2 border-dashed p-5">
                  {profile.photoUrl ? (
                    <img
                      src={profile.photoUrl}
                      alt={`Retrato de ${profile.name}`}
                      width={900}
                      height={1598}
                      loading="lazy"
                      decoding="async"
                      style={{ objectPosition: profile.photoPosition }}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <PortraitSketch />
                  )}
                </div>

                <dl className="mt-5 space-y-2.5">
                  <FichaRow label="Engineer" value={profile.shortName} />
                  <FichaRow label="Rol" value="Ingeniero de Sistemas" />
                  <FichaRow label="Base" value={profile.location} />
                  <FichaRow label="ID" value="2026-SKETCHBOOK" mono />
                </dl>
              </div>

              {/* Cinta decorativa en la esquina */}
              <div className="bg-blueprint/20 border-blueprint/30 pointer-events-none absolute -top-3 -right-5 h-10 w-24 rotate-12 border backdrop-blur-sm" />
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  )
}

function FichaRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="border-rule-soft flex items-baseline justify-between gap-3 border-b border-dashed pb-2">
      <dt className="text-micro text-ink-faint shrink-0 uppercase">{label}</dt>
      <dd className={mono ? 'font-code text-code text-ink-soft' : 'truncate text-sm font-bold'}>
        {value}
      </dd>
    </div>
  )
}
