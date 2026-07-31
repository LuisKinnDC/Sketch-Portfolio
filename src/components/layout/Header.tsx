import { useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Menu, Moon, PencilLine, Sun, X } from 'lucide-react'
import { cn } from '@/lib/cn'
import { navItems, profile } from '@/data/site'
import { useLockBodyScroll, useScrollProgress, useScrollSpy, useTheme } from '@/lib/hooks'
import { HOME_ID, navigateToSection, pathForSection, sectionLinkProps } from '@/lib/routing'

const sectionIds = navItems.map((n) => n.id)

/** Duración del plegado del menú móvil; debe coincidir con la transición. */
const MENU_CLOSE_MS = 240

export function Header({
  pencilCursor,
  onTogglePencil,
}: {
  pencilCursor: boolean
  onTogglePencil: () => void
}) {
  const [open, setOpen] = useState(false)
  const { theme, toggle } = useTheme()
  const { progress, scrolled } = useScrollProgress()
  const active = useScrollSpy(sectionIds)
  const barRef = useRef<HTMLElement>(null)

  useLockBodyScroll(open)

  /**
   * Publica la altura de la barra en `--header-h`. De ahí beben el
   * `scroll-padding-top` del documento y la línea de lectura del scroll-spy,
   * así que aterrizaje y resaltado no pueden desincronizarse.
   *
   * Se mide la barra y no el <header>, porque al desplegar el menú móvil el
   * header crece y falsearía el cálculo.
   */
  useLayoutEffect(() => {
    const bar = barRef.current
    if (!bar) return

    const publish = () =>
      document.documentElement.style.setProperty('--header-h', `${bar.offsetHeight}px`)

    publish()
    const observer = new ResizeObserver(publish)
    observer.observe(bar)
    return () => observer.disconnect()
  }, [])

  return (
    <header
      className={cn(
        'bg-paper/95 border-ink sticky top-0 z-50 w-full border-b-2 backdrop-blur-sm transition-shadow',
        scrolled && 'shadow-[0_4px_0_0_var(--color-ink)]',
      )}
    >
      {/* Barra de progreso de lectura */}
      <div
        className="bg-blueprint absolute inset-x-0 bottom-0 h-[3px] origin-left"
        style={{ transform: `scaleX(${progress})` }}
        aria-hidden="true"
      />

      <nav
        ref={barRef}
        className="mx-auto flex w-full max-w-[var(--container-page)] items-center justify-between gap-4 px-4 py-3 md:px-10 lg:px-16"
        aria-label="Navegación principal"
      >
        <a
          {...sectionLinkProps(HOME_ID)}
          className="group flex min-w-0 items-center gap-2.5"
          aria-label="Ir al inicio"
        >
          <span className="bg-ink text-paper text-label grid h-9 w-9 shrink-0 place-items-center transition-transform group-hover:-rotate-6">
            LK
          </span>
          <span className="text-headline-sm truncate font-bold md:text-xl">
            {profile.shortName}
          </span>
        </a>

        {/* Navegación de escritorio */}
        <ul className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => {
            const isActive = active === item.id
            return (
              <li key={item.id}>
                <a
                  {...sectionLinkProps(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'text-label relative block px-3 py-2 uppercase transition-colors',
                    isActive ? 'text-ink' : 'text-ink-soft hover:text-ink',
                  )}
                >
                  {item.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-underline"
                      className="bg-blueprint absolute inset-x-2 -bottom-0.5 h-[3px]"
                      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                    />
                  )}
                </a>
              </li>
            )
          })}
        </ul>

        <div className="flex items-center gap-2">
          <IconButton
            label={pencilCursor ? 'Desactivar cursor lápiz' : 'Activar cursor lápiz'}
            onClick={onTogglePencil}
            active={pencilCursor}
            className="hidden sm:inline-grid"
          >
            <PencilLine size={17} />
          </IconButton>

          <IconButton
            label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            onClick={toggle}
          >
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </IconButton>

          <IconButton
            label={open ? 'Cerrar menú' : 'Abrir menú'}
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden"
            expanded={open}
          >
            {open ? <X size={19} /> : <Menu size={19} />}
          </IconButton>
        </div>
      </nav>

      {/* Menú móvil */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.24, ease: 'easeOut' }}
            className="border-ink bg-paper overflow-hidden border-t-2 lg:hidden"
          >
            <ul className="mx-auto flex w-full max-w-[var(--container-page)] flex-col px-4 py-4 md:px-10">
              {navItems.map((item, i) => (
                <li key={item.id}>
                  <a
                    href={pathForSection(item.id)}
                    onClick={(event) => {
                      setOpen(false)
                      if (
                        event.defaultPrevented ||
                        event.button !== 0 ||
                        event.metaKey ||
                        event.ctrlKey ||
                        event.shiftKey ||
                        event.altKey
                      ) {
                        return
                      }

                      // Mientras el menú está abierto el scroll del body está
                      // bloqueado, así que esperamos a que termine de plegarse
                      // antes de desplazarnos; si no, el salto no ocurriría.
                      event.preventDefault()
                      setTimeout(() => navigateToSection(item.id), MENU_CLOSE_MS)
                    }}
                    className={cn(
                      'border-rule-soft flex items-center gap-3 border-b border-dashed py-3.5 uppercase',
                      active === item.id ? 'text-blueprint font-bold' : 'text-ink-soft',
                    )}
                  >
                    <span className="text-micro text-ink-faint">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

function IconButton({
  children,
  label,
  onClick,
  className,
  active,
  expanded,
}: {
  children: React.ReactNode
  label: string
  onClick: () => void
  className?: string
  active?: boolean
  expanded?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      aria-pressed={active}
      aria-expanded={expanded}
      className={cn(
        'border-ink grid h-9 w-9 place-items-center border-2 transition-all',
        'hover:-translate-y-0.5 hover:shadow-[3px_3px_0_0_var(--color-ink)] active:translate-y-0 active:shadow-none',
        active ? 'bg-highlighter text-on-highlighter' : 'bg-paper-raised text-ink',
        className,
      )}
    >
      {children}
    </button>
  )
}
