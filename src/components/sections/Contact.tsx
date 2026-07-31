import { useState } from 'react'
import { AlertCircle, Mail, MapPin, Send } from 'lucide-react'
import { GithubIcon, LinkedinIcon } from '@/components/ui/BrandIcons'
import { profile, socials } from '@/data/site'
import {
  Reveal,
  Section,
  SectionHead,
  SketchButton,
  SketchCard,
} from '@/components/ui/primitives'
import { Annotate } from '@/components/ui/Annotate'
import { useEnteredView } from '@/lib/hooks'
import { ArrowDoodle } from '@/components/ui/Doodles'

const iconFor = { github: GithubIcon, linkedin: LinkedinIcon, mail: Mail } as const

type Fields = { nombre: string; email: string; asunto: string; mensaje: string }
type Errors = Partial<Record<keyof Fields, string>>

const empty: Fields = { nombre: '', email: '', asunto: '', mensaje: '' }

function validate(values: Fields): Errors {
  const errors: Errors = {}
  if (values.nombre.trim().length < 2) errors.nombre = 'Escribe tu nombre.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email)) errors.email = 'Revisa el correo.'
  if (values.mensaje.trim().length < 10) errors.mensaje = 'Cuéntame algo más (mínimo 10 caracteres).'
  return errors
}

export function Contact() {
  const [values, setValues] = useState<Fields>(empty)
  const [errors, setErrors] = useState<Errors>({})
  const [sent, setSent] = useState(false)
  const [ref, inView] = useEnteredView<HTMLDivElement>()

  const update = (field: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues((v) => ({ ...v, [field]: e.target.value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  /**
   * Sin backend, el envío abre el cliente de correo con el mensaje ya redactado.
   * Para recibirlo en un servicio (Formspree, Resend…), sustituye este handler
   * por un fetch al endpoint correspondiente.
   */
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const found = validate(values)
    setErrors(found)
    if (Object.keys(found).length > 0) return

    const subject = values.asunto.trim() || `Propuesta de proyecto — ${values.nombre}`
    const body = `${values.mensaje}\n\n—\n${values.nombre}\n${values.email}`
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    setSent(true)
  }

  return (
    <Section id="contacto" className="paper-grid">
      <div ref={ref}>
        <SectionHead
          eyebrow="// SECTION_09: HANDSHAKE"
          title="¿Tienes un proyecto en mente?"
          intro="Cuéntame el reto técnico y te respondo en menos de 48 horas."
        />
      </div>

      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        {/* --------------------------------------------------------- Columna A */}
        <div className="lg:col-span-5">
          <Reveal from="left">
            <p className="text-headline text-ink-soft italic">
              "Escríbeme y{' '}
              <Annotate type="highlight" color="#FFD166" delay={400} show={inView}>
                <span className="text-ink not-italic">dibujemos</span>
              </Annotate>{' '}
              la solución juntos."
            </p>
          </Reveal>

          <Reveal from="left" delay={0.1}>
            <SketchCard tilt={0.8} className="mt-8 p-6">
              <h3 className="text-label text-blueprint mb-5 uppercase">Conecta conmigo</h3>

              <ul className="space-y-4">
                {socials.map((s) => {
                  const Icon = iconFor[s.icon]
                  return (
                    <li key={s.label}>
                      <a
                        href={s.url}
                        target={s.url.startsWith('http') ? '_blank' : undefined}
                        rel={s.url.startsWith('http') ? 'noreferrer noopener' : undefined}
                        className="group flex items-center gap-4"
                      >
                        <span className="border-ink bg-paper-raised group-hover:bg-blueprint grid h-11 w-11 shrink-0 place-items-center border-2 transition-colors group-hover:rotate-6 group-hover:text-white">
                          <Icon size={18} />
                        </span>
                        <span className="group-hover:wavy-link min-w-0 truncate text-sm">
                          {s.handle}
                        </span>
                      </a>
                    </li>
                  )
                })}
              </ul>

              <div className="border-rule-soft mt-6 space-y-2 border-t-2 border-dashed pt-5">
                <p className="font-code text-code text-ink-soft flex items-center gap-2">
                  <MapPin size={15} className="text-blueprint shrink-0" />
                  {profile.location}
                </p>
                {profile.available && (
                  <p className="font-code text-code text-ink-soft flex items-center gap-2">
                    <span className="bg-blueprint h-2 w-2 shrink-0 rounded-full" />
                    {profile.availabilityNote}
                  </p>
                )}
              </div>
            </SketchCard>
          </Reveal>

          <ArrowDoodle className="text-ink-faint mt-8 hidden h-20 w-28 -scale-x-100 opacity-50 lg:block" />
        </div>

        {/* --------------------------------------------------------- Columna B */}
        <div className="lg:col-span-7">
          <Reveal from="right">
            <form onSubmit={onSubmit} noValidate className="space-y-8">
              <div className="grid gap-8 sm:grid-cols-2">
                <Field
                  id="nombre"
                  label="Nombre completo"
                  placeholder="Tu nombre aquí..."
                  value={values.nombre}
                  onChange={update('nombre')}
                  error={errors.nombre}
                />
                <Field
                  id="email"
                  type="email"
                  label="Correo electrónico"
                  placeholder="email@ejemplo.com"
                  value={values.email}
                  onChange={update('email')}
                  error={errors.email}
                />
              </div>

              <Field
                id="asunto"
                label="Asunto"
                placeholder="Auditoría de arquitectura, MVP, integración..."
                value={values.asunto}
                onChange={update('asunto')}
                optional
              />

              <Field
                id="mensaje"
                label="Tu mensaje / idea"
                placeholder="Cuéntame sobre tu arquitectura o desafío técnico..."
                value={values.mensaje}
                onChange={update('mensaje')}
                error={errors.mensaje}
                textarea
              />

              <SketchButton type="submit" variant="primary" className="hover-jiggle w-full py-5">
                Enviar propuesta de proyecto
                <Send size={18} />
              </SketchButton>

              <p aria-live="polite" className="min-h-6">
                {sent && (
                  <span className="font-code text-code text-blueprint">
                    // Se abrió tu cliente de correo con el mensaje listo para enviar.
                  </span>
                )}
              </p>
            </form>
          </Reveal>
        </div>
      </div>
    </Section>
  )
}

function Field({
  id,
  label,
  placeholder,
  value,
  onChange,
  error,
  type = 'text',
  textarea,
  optional,
}: {
  id: keyof Fields
  label: string
  placeholder: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  error?: string
  type?: string
  textarea?: boolean
  optional?: boolean
}) {
  const errorId = `${id}-error`
  const shared = {
    id,
    name: id,
    value,
    onChange,
    placeholder,
    'aria-invalid': Boolean(error),
    'aria-describedby': error ? errorId : undefined,
    className: 'ruled-input w-full py-3',
  }

  return (
    <div>
      <label htmlFor={id} className="text-label text-ink-faint mb-2 block uppercase">
        {label}
        {optional && <span className="ml-2 normal-case opacity-60">(opcional)</span>}
      </label>

      {textarea ? (
        <textarea {...shared} rows={5} className="ruled-input w-full resize-none py-3" />
      ) : (
        <input {...shared} type={type} />
      )}

      {error && (
        <p id={errorId} className="text-error font-code text-code mt-2 flex items-center gap-1.5">
          <AlertCircle size={14} className="shrink-0" />
          {error}
        </p>
      )}
    </div>
  )
}
