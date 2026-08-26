import { ArrowDownRight, ArrowUpRight, Download, MapPin } from 'lucide-react'
import { motion } from 'motion/react'
import { profile } from '@/data/site'
import { FigureLabel, Reveal, SketchButton } from '@/components/ui/primitives'
import { Annotate } from '@/components/ui/Annotate'
import { ArrowDoodle, CompassDoodle, PortraitSketch } from '@/components/ui/Doodles'
import { useEnteredView, usePrefersReducedMotion } from '@/lib/hooks'
import { sectionLinkProps } from '@/lib/routing'

export function Hero() {
  const [ref, inView] = useEnteredView<HTMLDivElement>()
  const reduced = usePrefersReducedMotion()

  return (
    <section id="inicio" className="paper-grid border-ink relative overflow-hidden border-b-2">
      <div
        ref={ref}
        className="mx-auto grid w-full max-w-[var(--container-page)] items-center gap-12 px-4 py-16 md:px-10 md:py-24 lg:grid-cols-12 lg:px-16"
      >
        {/* ------------------------------------------------------- Columna texto */}
        <div className="min-w-0 lg:col-span-7">
          <Reveal from="left">
            <span className="bg-ink text-paper text-label inline-block -rotate-2 px-3 py-1.5 uppercase">
              {profile.badge}
            </span>
          </Reveal>

          <Reveal from="left" delay={0.08}>
            <h1 className="text-display-xl mt-6">
              ¡Hola! Soy
              <br />
              <Annotate type="underline" strokeWidth={3} delay={700} show={inView}>
                {profile.name}
              </Annotate>
            </h1>
          </Reveal>

          <Reveal from="left" delay={0.16}>
            <p className="border-ink text-headline text-ink-soft mt-8 rotate-[0.6deg] border-l-4 py-1 pl-5">
              {profile.role}
            </p>
          </Reveal>

          <Reveal from="left" delay={0.24}>
            <p className="text-ink-soft mt-7 max-w-xl text-balance">{profile.tagline}</p>
          </Reveal>

          <Reveal from="left" delay={0.32}>
            <div className="mt-9 flex flex-wrap gap-4">
              <SketchButton
                as="a"
                {...sectionLinkProps('proyectos')}
                variant="primary"
                className="hover-jiggle"
              >
                Ver proyectos
                <ArrowUpRight size={18} />
              </SketchButton>

              <SketchButton as="a" href={profile.cvUrl} download variant="ghost">
                Descargar CV
                <Download size={18} />
              </SketchButton>
            </div>
          </Reveal>

          <Reveal from="left" delay={0.4}>
            <div className="text-ink-soft mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
              <span className="font-code text-code inline-flex items-center gap-2">
                <MapPin size={15} className="text-blueprint" />
                {profile.location}
              </span>

              {profile.available && (
                <span className="font-code text-code inline-flex items-center gap-2">
                  <span className="relative grid h-2.5 w-2.5 place-items-center">
                    <span className="bg-blueprint absolute h-2.5 w-2.5 animate-ping rounded-full opacity-60" />
                    <span className="bg-blueprint h-2 w-2 rounded-full" />
                  </span>
                  {profile.availabilityNote}
                </span>
              )}
            </div>
          </Reveal>
        </div>

        {/* ------------------------------------------------------ Columna retrato */}
        <div className="relative min-w-0 lg:col-span-5">
          <Reveal from="right" delay={0.2}>
            <div className="group relative mx-auto max-w-md">
              <div className="sketch-frame bg-paper-raised relative aspect-square rotate-2 overflow-hidden shadow-[8px_8px_0_0_var(--color-ink)] transition-transform duration-500 group-hover:rotate-0">
                {profile.photoUrl ? (
                  <img
                    src={profile.photoUrl}
                    alt={`Retrato de ${profile.name}`}
                    width={900}
                    height={1598}
                    fetchPriority="high"
                    decoding="async"
                    style={{ objectPosition: profile.photoPosition }}
                    className="h-full w-full object-cover contrast-110 grayscale transition-[filter] duration-500 group-hover:grayscale-0"
                  />
                ) : (
                  <div className="paper-dots text-ink grid h-full w-full place-items-center p-6">
                    <PortraitSketch className="max-h-full max-w-full" />
                  </div>
                )}

                <FigureLabel className="absolute right-3 bottom-3">
                  Fig. 01 — Lead Developer
                </FigureLabel>
              </div>

              {/* Ficha de telemetría clavada a la esquina */}
              <motion.div
                className="bg-paper-raised sketch-frame absolute -top-6 -right-4 hidden -rotate-3 p-3.5 sm:block"
                animate={reduced ? undefined : { y: [0, -6, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <div className="mb-2 flex items-center gap-2">
                  <span className="bg-error h-2 w-2 rounded-full" />
                  <span className="font-code text-micro">RUNTIME: 12ms</span>
                </div>
                <div className="bg-rule-soft h-1.5 w-24 overflow-hidden">
                  <div className="bg-blueprint h-full w-3/4" />
                </div>
              </motion.div>

              {/* Commit al vuelo */}
              <motion.div
                className="bg-blueprint font-code text-micro absolute -bottom-5 -left-4 hidden rotate-6 px-3 py-2 text-white sm:block"
                animate={reduced ? undefined : { rotate: [6, 3, 6] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              >
                git commit -m "optimize core"
              </motion.div>

              <CompassDoodle className="text-ink pointer-events-none absolute -bottom-20 -left-24 hidden h-40 w-40 opacity-15 lg:block" />
            </div>
          </Reveal>
        </div>
      </div>

      {/* Indicador de scroll con anotación manuscrita */}
      <div className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 lg:block">
        <div className="text-ink-faint flex flex-col items-center gap-1">
          <ArrowDoodle className="h-12 w-16 rotate-12" />
          <span className="font-code text-micro uppercase">sigue bajando</span>
          <ArrowDownRight size={14} className="animate-bounce" />
        </div>
      </div>
    </section>
  )
}
