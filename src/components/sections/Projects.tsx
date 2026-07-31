import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { BookText, Check, ExternalLink, FolderGit2, Star } from 'lucide-react'
import { projects, type Project } from '@/data/content'
import { Reveal, Section, SectionHead, SketchButton, TapeTag } from '@/components/ui/primitives'
import { BlueprintDiagram } from '@/components/ui/BlueprintDiagram'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/hooks'

const ALL = 'Todos'

export function Projects() {
  const [filter, setFilter] = useState<string>(ALL)
  const reduced = usePrefersReducedMotion()

  // Sólo aparecen las categorías que realmente tienen proyectos, así el filtro
  // nunca ofrece una opción que lleve a una rejilla vacía.
  const categories = useMemo(() => {
    const present = new Set(projects.map((p) => p.category))
    return [ALL, ...(['Web', 'App'] as const).filter((c) => present.has(c))]
  }, [])

  const visible = useMemo(
    () => (filter === ALL ? projects : projects.filter((p) => p.category === filter)),
    [filter],
  )

  return (
    <Section id="proyectos" className="paper-grid">
      <SectionHead
        eyebrow="// SECTION_04: ARCHITECTURAL_SKETCHES"
        title="Proyectos"
        intro="Una colección de borradores técnicos y arquitecturas. Cada proyecto es una fase del ciclo de ingeniería, del flujo de datos garabateado a la implementación en producción."
      />

      {/* --------------------------------------------------------- Filtros */}
      <Reveal className="mb-10">
        <div
          className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-2 md:mx-0 md:flex-wrap md:px-0"
          role="group"
          aria-label="Filtrar proyectos por categoría"
        >
          {categories.map((category) => {
            const isActive = filter === category
            return (
              <button
                key={category}
                type="button"
                onClick={() => setFilter(category)}
                aria-pressed={isActive}
                className={cn(
                  'text-label border-ink shrink-0 border-2 px-3.5 py-2 uppercase transition-all',
                  isActive
                    ? 'bg-ink text-paper -rotate-1'
                    : 'bg-paper-raised text-ink-soft hover:bg-highlighter hover:text-on-highlighter',
                )}
              >
                {category}
              </button>
            )
          })}
        </div>
      </Reveal>

      {/* ---------------------------------------------------------- Rejilla */}
      <motion.div layout={!reduced} className="grid gap-10 lg:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {visible.map((project, i) => (
            <motion.div
              key={project.id}
              layout={!reduced}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.35, delay: reduced ? 0 : i * 0.05 }}
            >
              <ProjectCard project={project} index={i} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {visible.length === 0 && (
        <p className="text-ink-faint font-code py-12 text-center">
          // Sin proyectos para "{filter}"
        </p>
      )}
    </Section>
  )
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <article
      className={cn(
        'sketch-frame bg-paper-raised flex h-full flex-col gap-5 p-5 transition-transform duration-300 sm:p-6',
        index % 2 === 0 ? 'hover:-rotate-[0.6deg]' : 'hover:rotate-[0.6deg]',
      )}
    >
      <header className="border-ink flex items-start justify-between gap-4 border-b-2 border-dashed pb-4">
        <div className="min-w-0">
          <span className="bg-blueprint-pale text-blueprint-deep text-micro mb-2 inline-block px-2 py-1 uppercase">
            {project.category}
          </span>
          <h3 className="text-headline flex items-start gap-2 leading-tight">
            {project.title}
            {project.featured && (
              <Star size={16} className="text-highlighter mt-1.5 shrink-0 fill-current" aria-label="Destacado" />
            )}
          </h3>
        </div>
        <span className="font-code text-code text-ink-faint shrink-0">{project.draft}</span>
      </header>

      <BlueprintDiagram variant={project.diagram} />

      <ul className="flex flex-wrap gap-2">
        {project.stack.map((tech) => (
          <li key={tech}>
            <TapeTag tilt={-1}>{tech}</TapeTag>
          </li>
        ))}
      </ul>

      <p className="text-ink-soft text-sm">{project.summary}</p>

      {/* Detalle plegable: mantiene la tarjeta corta sin esconder información */}
      <div>
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          className="text-label text-blueprint hover:wavy-link uppercase"
        >
          {expanded ? '− Ocultar detalle' : '+ Ver detalle técnico'}
        </button>

        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="pt-4">
                <p className="text-ink-soft text-sm">{project.description}</p>
                <ul className="mt-4 space-y-2">
                  {project.highlights.map((h) => (
                    <li key={h} className="font-code text-code text-ink-soft flex items-start gap-2">
                      <Check size={14} className="text-blueprint mt-1 shrink-0" />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <footer className="border-ink mt-auto flex flex-wrap gap-3 border-t border-dashed pt-4">
        {project.links.demo && (
          <SketchButton as="a" href={project.links.demo} variant="primary" className="px-4 py-2.5">
            <ExternalLink size={16} /> Demo
          </SketchButton>
        )}
        {project.links.docs && (
          <SketchButton as="a" href={project.links.docs} variant="primary" className="px-4 py-2.5">
            <BookText size={16} /> API Docs
          </SketchButton>
        )}
        {project.links.source && (
          <SketchButton as="a" href={project.links.source} variant="outline" className="px-4 py-2.5">
            <FolderGit2 size={16} /> Código
          </SketchButton>
        )}
      </footer>
    </article>
  )
}
