import { AnimatePresence, motion } from 'motion/react'
import { ArrowUp } from 'lucide-react'
import { useScrollProgress } from '@/lib/hooks'
import { HOME_ID, sectionLinkProps } from '@/lib/routing'

/** Botón flotante que aparece pasado el primer pliegue, con anillo de progreso. */
export function BackToTop() {
  const { progress } = useScrollProgress()
  const visible = progress > 0.12

  const radius = 22
  const circumference = 2 * Math.PI * radius

  return (
    <AnimatePresence>
      {visible && (
        <motion.a
          {...sectionLinkProps(HOME_ID)}
          aria-label="Volver al inicio"
          initial={{ opacity: 0, scale: 0.7, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.7, y: 12 }}
          transition={{ duration: 0.2 }}
          className="bg-paper-raised border-ink text-ink fixed right-5 bottom-5 z-40 grid h-13 w-13 place-items-center border-2 shadow-[4px_4px_0_0_var(--color-ink)] transition-transform hover:-translate-y-1 hover:shadow-[5px_6px_0_0_var(--color-ink)] active:translate-y-0"
        >
          <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 52 52" aria-hidden="true">
            <circle
              cx="26"
              cy="26"
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-rule-soft"
            />
            <circle
              cx="26"
              cy="26"
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              className="text-blueprint"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - progress)}
            />
          </svg>
          <ArrowUp size={18} className="relative" />
        </motion.a>
      )}
    </AnimatePresence>
  )
}
