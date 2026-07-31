import { Award, Briefcase, GraduationCap, ShieldCheck } from 'lucide-react'
import { certifications, timeline, type TimelineEntry } from '@/data/content'
import {
  Reveal,
  RevealGroup,
  RevealItem,
  Section,
  SectionHead,
  SketchCard,
  TapeTag,
} from '@/components/ui/primitives'

const kindMeta: Record<TimelineEntry['kind'], { icon: typeof Briefcase; label: string }> = {
  trabajo: { icon: Briefcase, label: 'Experiencia' },
  formación: { icon: GraduationCap, label: 'Formación' },
  certificación: { icon: Award, label: 'Certificación' },
}

export function Experience() {
  return (
    <Section id="trayectoria">
      <SectionHead
        eyebrow="// SECTION_05: TIMELINE"
        title="Trayectoria & Formación"
        intro="El recorrido, en orden cronológico inverso. Cada hito dejó algo en la caja de herramientas."
      />

      {/* ------------------------------------------------------ Línea temporal */}
      <div className="relative">
        {/* Renglón vertical que atraviesa toda la sección */}
        <div
          className="border-rule absolute top-2 bottom-2 left-[19px] border-l-2 border-dashed md:left-1/2 md:-translate-x-1/2"
          aria-hidden="true"
        />

        <ol className="space-y-10">
          {timeline.map((entry, i) => {
            const { icon: Icon, label } = kindMeta[entry.kind]
            const isLeft = i % 2 === 0

            return (
              <li key={`${entry.title}-${entry.period}`} className="relative">
                <Reveal from={isLeft ? 'left' : 'right'}>
                  {/* Una sola celda por hito: se coloca en la columna 1 o 2
                      para que la línea central quede zigzagueando entre ambas. */}
                  <div className="md:grid md:grid-cols-2 md:gap-12">
                    <div className={isLeft ? 'md:text-right' : 'md:col-start-2'}>
                      {/* Marca sobre la línea */}
                      <span
                        className="bg-paper border-ink text-ink absolute left-0 grid h-10 w-10 place-items-center rounded-full border-2 md:left-1/2 md:-translate-x-1/2"
                        aria-hidden="true"
                      >
                        <Icon size={17} />
                      </span>

                      <div className="pl-16 md:pl-0">
                        <SketchCard tilt={isLeft ? -0.7 : 0.7} className="p-5">
                          <div
                            className={
                              'mb-3 flex flex-wrap items-center gap-2 ' +
                              (isLeft ? 'md:justify-end' : '')
                            }
                          >
                            <TapeTag>{entry.period}</TapeTag>
                            <span className="text-micro text-blueprint uppercase">{label}</span>
                          </div>

                          <h3 className="text-headline-sm">{entry.title}</h3>
                          <p className="font-code text-code text-blueprint mt-1">{entry.org}</p>
                          <p className="text-ink-soft mt-3 text-sm">{entry.body}</p>

                          <ul
                            className={
                              'mt-4 flex flex-wrap gap-1.5 ' + (isLeft ? 'md:justify-end' : '')
                            }
                          >
                            {entry.tags.map((tag) => (
                              <li
                                key={tag}
                                className="border-rule-soft text-micro text-ink-faint border px-2 py-0.5 uppercase"
                              >
                                {tag}
                              </li>
                            ))}
                          </ul>
                        </SketchCard>
                      </div>
                    </div>
                  </div>
                </Reveal>
              </li>
            )
          })}
        </ol>
      </div>

      {/* Certificaciones: el bloque entero desaparece mientras no haya ninguna,
          para no dejar un titular colgando sobre una rejilla vacía. */}
      {certifications.length > 0 && (
        <>
          <Reveal className="mt-20">
            <h3 className="text-headline mb-2 flex items-center gap-2">
              <ShieldCheck size={24} className="text-blueprint" />
              Certificaciones
            </h3>
            <p className="text-ink-soft mb-8 text-sm">
              Credenciales verificables, con su identificador.
            </p>
          </Reveal>

          <RevealGroup className="grid gap-4 sm:grid-cols-2">
            {certifications.map((cert, i) => (
              <RevealItem key={cert.id}>
                <SketchCard tilt={i % 2 === 0 ? -0.5 : 0.5} className="flex items-start gap-4 p-5">
                  <span className="border-ink bg-highlighter text-on-highlighter grid h-11 w-11 shrink-0 place-items-center border-2">
                    <Award size={20} />
                  </span>
                  <div className="min-w-0">
                    <h4 className="text-sm leading-snug font-bold">{cert.title}</h4>
                    <p className="text-ink-soft mt-1 text-sm">{cert.org}</p>
                    <p className="font-code text-micro text-ink-faint mt-2">
                      {cert.year} · {cert.id}
                    </p>
                  </div>
                </SketchCard>
              </RevealItem>
            ))}
          </RevealGroup>
        </>
      )}
    </Section>
  )
}
