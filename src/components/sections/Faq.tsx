import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Plus } from 'lucide-react'
import { faqs } from '@/data/content'
import { Reveal, Section, SectionHead } from '@/components/ui/primitives'
import { cn } from '@/lib/cn'

export function Faq() {
  // Acordeón de apertura única: mantiene la sección legible de un vistazo.
  const [open, setOpen] = useState<number | null>(0)

  return (
    <Section id="faq">
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <SectionHead
            eyebrow="// SECTION_08: FAQ"
            title="Preguntas frecuentes"
            intro="Lo que suelen preguntarme antes de empezar a trabajar juntos."
            className="mb-0 lg:sticky lg:top-28"
          />
        </div>

        <div className="lg:col-span-8">
          <ul className="border-ink border-t-2">
            {faqs.map((faq, i) => {
              const isOpen = open === i
              const panelId = `faq-panel-${i}`
              const buttonId = `faq-button-${i}`

              return (
                <li key={faq.q} className="border-ink border-b-2">
                  <Reveal delay={i * 0.05}>
                    <h3>
                      <button
                        id={buttonId}
                        type="button"
                        onClick={() => setOpen(isOpen ? null : i)}
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        className="group flex w-full items-start justify-between gap-5 py-5 text-left"
                      >
                        <span className="flex items-start gap-4">
                          <span className="font-code text-code text-blueprint mt-1 shrink-0">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <span
                            className={cn(
                              'text-headline-sm font-display transition-colors',
                              isOpen ? 'text-ink' : 'text-ink-soft group-hover:text-ink',
                            )}
                          >
                            {faq.q}
                          </span>
                        </span>

                        <span
                          className={cn(
                            'border-ink mt-0.5 grid h-8 w-8 shrink-0 place-items-center border-2 transition-all',
                            isOpen
                              ? 'bg-highlighter text-on-highlighter rotate-135'
                              : 'bg-paper-raised text-ink group-hover:-rotate-6',
                          )}
                          aria-hidden="true"
                        >
                          <Plus size={16} />
                        </span>
                      </button>
                    </h3>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          id={panelId}
                          role="region"
                          aria-labelledby={buttonId}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.28, ease: 'easeOut' }}
                          className="overflow-hidden"
                        >
                          <p className="border-blueprint text-ink-soft mb-6 ml-9 border-l-2 py-1 pl-5 text-sm">
                            {faq.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Reveal>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </Section>
  )
}
