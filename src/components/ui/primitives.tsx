import { motion } from 'motion/react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/hooks'

/* ------------------------------------------------------------------ Reveal */

type RevealProps = {
  children: React.ReactNode
  className?: string
  delay?: number
  /** Dirección desde la que entra el bloque. */
  from?: 'bottom' | 'left' | 'right' | 'none'
  as?: 'div' | 'section' | 'li' | 'article'
}

const offsets = {
  bottom: { y: 28, x: 0 },
  left: { y: 0, x: -28 },
  right: { y: 0, x: 28 },
  none: { y: 0, x: 0 },
}

/** Aparición al entrar en viewport, una sola vez. */
export function Reveal({ children, className, delay = 0, from = 'bottom', as = 'div' }: RevealProps) {
  const reduced = usePrefersReducedMotion()
  const M = motion[as]
  const offset = offsets[from]

  if (reduced) {
    const Tag = as
    return <Tag className={className}>{children}</Tag>
  }

  return (
    <M
      className={className}
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </M>
  )
}

/** Igual que Reveal pero escalonando a los hijos directos. */
export function RevealGroup({
  children,
  className,
  stagger = 0.08,
}: {
  children: React.ReactNode
  className?: string
  stagger?: number
}) {
  const reduced = usePrefersReducedMotion()
  if (reduced) return <div className={className}>{children}</div>

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      variants={{ visible: { transition: { staggerChildren: stagger } } }}
    >
      {children}
    </motion.div>
  )
}

export function RevealItem({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const reduced = usePrefersReducedMotion()
  if (reduced) return <div className={className}>{children}</div>

  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 24 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
      }}
    >
      {children}
    </motion.div>
  )
}

/* ------------------------------------------------------------------ Section */

export function Section({
  id,
  className,
  children,
}: {
  id?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    // Sin scroll-mt: el desplazamiento lo compensa scroll-padding-top en html.
    <section id={id} className={cn('py-20 md:py-28', className)}>
      <div className="mx-auto w-full max-w-[var(--container-page)] px-4 md:px-10 lg:px-16">
        {children}
      </div>
    </section>
  )
}

/* ------------------------------------------------------------- SectionHead */

type SectionHeadProps = {
  /** Marca de agua tipo comentario de código: // SECTION_02: SKILLS */
  eyebrow: string
  title: string
  intro?: string
  align?: 'left' | 'center'
  className?: string
}

export function SectionHead({ eyebrow, title, intro, align = 'left', className }: SectionHeadProps) {
  const centered = align === 'center'

  return (
    <Reveal className={cn('mb-12 md:mb-16', centered && 'text-center', className)}>
      <span className="font-code text-code text-blueprint block tracking-tight uppercase opacity-80">
        {eyebrow}
      </span>

      <h2 className="text-display-lg mt-3 inline-block">
        {title}
        <SketchRule className={cn('mt-2', centered && 'mx-auto')} />
      </h2>

      {intro && (
        <p
          className={cn(
            'text-ink-soft mt-5 max-w-2xl text-balance',
            centered && 'mx-auto',
          )}
        >
          {intro}
        </p>
      )}
    </Reveal>
  )
}

/** Regla trazada a mano: el subrayado que acompaña a cada título. */
export function SketchRule({ className, width = 220 }: { className?: string; width?: number }) {
  return (
    <svg
      viewBox="0 0 220 10"
      width={width}
      height={10}
      preserveAspectRatio="none"
      className={cn('text-ink block w-full max-w-full', className)}
      aria-hidden="true"
    >
      <path
        d="M2 6C40 2 70 8 108 4.5C146 1.4 178 7.6 218 3.4"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  )
}

/* ------------------------------------------------------------------- Card */

export function SketchCard({
  children,
  className,
  tilt = 0,
  interactive = true,
  as: Tag = 'div',
}: {
  children: React.ReactNode
  className?: string
  /** Grados de rotación en reposo; al pasar el cursor vuelve a 0. */
  tilt?: number
  interactive?: boolean
  as?: 'div' | 'article' | 'li'
}) {
  return (
    <Tag
      className={cn(
        'bg-paper-raised sketch-frame relative',
        interactive && 'sketch-frame-lift hover:rotate-0',
        className,
      )}
      style={tilt ? { rotate: `${tilt}deg` } : undefined}
    >
      {children}
    </Tag>
  )
}

/* ----------------------------------------------------------------- Button */

type ButtonVariant = 'primary' | 'outline' | 'ghost'

type SketchButtonProps<T extends 'a' | 'button'> = {
  as?: T
  variant?: ButtonVariant
  className?: string
  children: React.ReactNode
} & Omit<React.ComponentPropsWithoutRef<T>, 'className' | 'children'>

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-highlighter text-on-highlighter sketch-frame sketch-frame-lift',
  outline: 'bg-paper-raised text-ink sketch-frame sketch-frame-lift',
  ghost: 'text-ink border-2 border-dashed border-rule hover:bg-paper-edge',
}

export function SketchButton<T extends 'a' | 'button' = 'button'>({
  as,
  variant = 'primary',
  className,
  children,
  ...rest
}: SketchButtonProps<T>) {
  const Tag = (as ?? 'button') as React.ElementType

  return (
    <Tag
      className={cn(
        'text-label inline-flex items-center justify-center gap-2 px-6 py-3.5 uppercase',
        'transition-all select-none',
        variantClasses[variant],
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  )
}

/* -------------------------------------------------------------------- Tape */

export function TapeTag({
  children,
  className,
  tilt,
}: {
  children: React.ReactNode
  className?: string
  tilt?: number
}) {
  return (
    <span
      className={cn('tape text-label text-ink-soft inline-block px-3 py-1', className)}
      style={{ rotate: `${tilt ?? -1}deg` }}
    >
      {children}
    </span>
  )
}

/* -------------------------------------------------------------- Etiqueta Fig */

/** Cartela de figura técnica, como en un plano: "Fig. 01 — …". */
export function FigureLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'bg-paper-raised border-ink text-micro text-ink border px-2 py-1 uppercase',
        className,
      )}
    >
      {children}
    </span>
  )
}
