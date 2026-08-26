import { ArrowUp, Mail } from 'lucide-react'
import { navItems, profile, socials } from '@/data/site'
import { SketchRule } from '@/components/ui/primitives'
import { CompassDoodle } from '@/components/ui/Doodles'
import { GithubIcon, LinkedinIcon } from '@/components/ui/BrandIcons'
import { HOME_ID, sectionLinkProps } from '@/lib/routing'

const iconFor = {
  github: GithubIcon,
  linkedin: LinkedinIcon,
  mail: Mail,
} as const

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-ink bg-paper-sunken relative mt-8 overflow-hidden border-t-2">
      <div className="text-ink pointer-events-none absolute -right-12 -bottom-16 opacity-[0.07]">
        <CompassDoodle className="h-72 w-72" />
      </div>

      <div className="relative mx-auto w-full max-w-[var(--container-page)] px-4 py-16 md:px-10 lg:px-16">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="min-w-0 md:col-span-5">
            <h2 className="text-headline">{profile.shortName}</h2>
            <SketchRule className="mt-1 max-w-[180px]" width={180} />
            <p className="text-ink-soft mt-4 max-w-sm text-sm">{profile.role}</p>
            <p className="font-code text-code text-ink-faint mt-4">
              {profile.location} · {profile.available ? 'Disponible' : 'Agenda completa'}
            </p>
          </div>

          <nav className="min-w-0 md:col-span-3" aria-label="Navegación del pie">
            <h3 className="text-label text-ink-faint mb-4 uppercase">Secciones</h3>
            <ul className="space-y-2.5">
              {navItems.map((item) => (
                <li key={item.id}>
                  <a
                    {...sectionLinkProps(item.id)}
                    className="text-ink-soft hover:text-blueprint hover:wavy-link text-sm transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="min-w-0 md:col-span-4">
            <h3 className="text-label text-ink-faint mb-4 uppercase">Encuéntrame</h3>
            <ul className="space-y-3">
              {socials.map((s) => {
                const Icon = iconFor[s.icon]
                return (
                  <li key={s.label}>
                    <a
                      href={s.url}
                      target={s.url.startsWith('http') ? '_blank' : undefined}
                      rel={s.url.startsWith('http') ? 'noreferrer noopener' : undefined}
                      className="group text-ink-soft hover:text-ink flex items-center gap-3 text-sm transition-colors"
                    >
                      <span className="border-rule group-hover:border-ink group-hover:bg-highlighter group-hover:text-on-highlighter grid h-9 w-9 place-items-center border-2 transition-all group-hover:-rotate-6">
                        <Icon size={16} />
                      </span>
                      <span className="group-hover:wavy-link truncate">{s.handle}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>

        <div className="border-rule-soft mt-14 flex flex-col items-center justify-between gap-4 border-t-2 border-dashed pt-8 md:flex-row">
          <p className="text-micro text-ink-faint text-center uppercase md:text-left">
            © {year} {profile.name} · Engineer's Sketchbook
          </p>

          <a
            {...sectionLinkProps(HOME_ID)}
            className="text-label text-ink-soft hover:text-ink group inline-flex items-center gap-2 uppercase"
          >
            Volver arriba
            <ArrowUp size={14} className="transition-transform group-hover:-translate-y-1" />
          </a>
        </div>
      </div>
    </footer>
  )
}
