import { Send } from 'lucide-react'
import { Reveal, SketchButton } from '@/components/ui/primitives'
import { StarDoodle } from '@/components/ui/Doodles'
import { RoughBox } from '@/components/ui/RoughBox'
import { sectionLinkProps } from '@/lib/routing'

/** Cierre antes del pie: última llamada a la acción, enmarcada a pulso. */
export function Cta() {
  return (
    <div className="mx-auto w-full max-w-[var(--container-page)] px-4 md:px-10 lg:px-16">
      <Reveal>
        {/* Aquí el marco lo traza roughjs: a este tamaño un borde CSS se ve
            demasiado perfecto y rompe la ilusión del boceto. */}
        <RoughBox
          shape="rectangle"
          roughness={2.2}
          strokeWidth={2.5}
          seed={7}
          padding={6}
          className="text-ink relative"
        >
          <div className="relative flex flex-col items-center justify-between gap-8 px-6 py-14 md:flex-row md:px-12">
            <StarDoodle className="text-highlighter absolute -top-3 left-2 h-11 w-11 rotate-12 md:left-4" />

            <div className="space-y-2 text-center md:text-left">
              <h2 className="text-headline">¿Listo para construir el futuro?</h2>
              <p className="text-ink-soft">
                Hablemos sobre tu próximo gran proyecto de arquitectura.
              </p>
            </div>

            <SketchButton
              as="a"
              {...sectionLinkProps('contacto')}
              variant="primary"
              className="hover-jiggle shrink-0 px-8 py-4 tracking-widest"
            >
              Contactar ahora
              <Send size={18} />
            </SketchButton>
          </div>
        </RoughBox>
      </Reveal>
    </div>
  )
}
