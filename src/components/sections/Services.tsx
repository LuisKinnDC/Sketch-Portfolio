import { Code2, Database, Palette, Smartphone } from 'lucide-react'
import { processSteps, services } from '@/data/content'
import {
  Reveal,
  RevealGroup,
  RevealItem,
  Section,
  SectionHead,
  SketchCard,
} from '@/components/ui/primitives'
import { RoughBox } from '@/components/ui/RoughBox'

const icons = {
  code: Code2,
  smartphone: Smartphone,
  database: Database,
  palette: Palette,
} as const

export function Services() {
  return (
    <Section id="servicios">
      <SectionHead
        eyebrow="// SECTION_03: CAPABILITIES"
        title="En qué puedo ayudarte"
        intro="Cuatro frentes de trabajo, cada uno con entregables concretos y verificables."
      />

      <RevealGroup className="grid gap-6 md:grid-cols-2">
        {services.map((service, i) => {
          const Icon = icons[service.icon as keyof typeof icons]
          return (
            <RevealItem key={service.title}>
              <SketchCard tilt={i % 2 === 0 ? -0.6 : 0.6} className="group h-full p-6">
                <div className="flex items-start gap-4">
                  <span className="border-ink bg-paper-sunken group-hover:bg-highlighter group-hover:text-on-highlighter grid h-12 w-12 shrink-0 place-items-center border-2 transition-colors group-hover:-rotate-6">
                    <Icon size={22} />
                  </span>

                  <div className="min-w-0">
                    <h3 className="text-headline-sm">{service.title}</h3>
                    <p className="text-ink-soft mt-2 text-sm">{service.body}</p>
                  </div>
                </div>

                <div className="border-rule-soft mt-5 border-t-2 border-dashed pt-4">
                  <span className="text-micro text-ink-faint mb-2.5 block uppercase">
                    Entregables
                  </span>
                  <ul className="flex flex-wrap gap-2">
                    {service.deliverables.map((d) => (
                      <li
                        key={d}
                        className="tape text-micro text-ink-soft px-2.5 py-1 uppercase"
                      >
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              </SketchCard>
            </RevealItem>
          )
        })}
      </RevealGroup>

      {/* ------------------------------------------------------------- Proceso */}
      <Reveal className="mt-20">
        <h3 className="text-headline mb-2">Cómo trabajo</h3>
        <p className="text-ink-soft mb-10 max-w-xl text-sm">
          El mismo método en cada proyecto, del primer boceto a la métrica en producción.
        </p>
      </Reveal>

      <RevealGroup className="relative grid gap-8 md:grid-cols-4">
        {/* Renglón que hilvana los cuatro pasos */}
        <svg
          className="text-rule-soft pointer-events-none absolute inset-x-0 top-6 hidden h-3 w-full md:block"
          viewBox="0 0 1000 12"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M20 7C180 2 320 11 500 6C680 1 820 10 980 5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="8 6"
          />
        </svg>

        {processSteps.map((step, i) => (
          <RevealItem key={step.n}>
            <div className="relative">
              {/* Círculo trazado a pulso con roughjs: cada paso lleva una
                  semilla distinta, así ninguno sale igual que el anterior. */}
              <RoughBox
                shape="ellipse"
                roughness={2}
                strokeWidth={2}
                seed={11 + i * 13}
                padding={3}
                className="bg-paper text-ink relative z-10 grid h-13 w-13 place-items-center"
              >
                <span className="text-label relative">{step.n}</span>
              </RoughBox>

              <h4 className="text-headline-sm mt-4">{step.title}</h4>
              <p className="text-ink-soft mt-2 text-sm">{step.body}</p>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  )
}
