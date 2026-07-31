import { useEffect, useState } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { BackToTop } from '@/components/layout/BackToTop'
import { Hero } from '@/components/sections/Hero'
import { About } from '@/components/sections/About'
import { Skills } from '@/components/sections/Skills'
import { Services } from '@/components/sections/Services'
import { Projects } from '@/components/sections/Projects'
import { Experience } from '@/components/sections/Experience'
import { Faq } from '@/components/sections/Faq'
import { Contact } from '@/components/sections/Contact'
import { Cta } from '@/components/sections/Cta'
import { navItems } from '@/data/site'
import { useSectionRouting } from '@/lib/hooks'

const CURSOR_KEY = 'lk-pencil-cursor'
const sectionIds = navItems.map((n) => n.id)

export default function App() {
  // Rutas limpias (/proyectos en vez de #proyectos) sobre la página única.
  useSectionRouting(sectionIds)

  // El cursor lápiz es divertido pero invasivo: se recuerda apagado por defecto.
  const [pencilCursor, setPencilCursor] = useState(() => {
    try {
      return localStorage.getItem(CURSOR_KEY) === 'on'
    } catch {
      return false
    }
  })

  useEffect(() => {
    document.body.classList.toggle('cursor-pencil', pencilCursor)
    try {
      localStorage.setItem(CURSOR_KEY, pencilCursor ? 'on' : 'off')
    } catch {
      /* sin persistencia si localStorage está bloqueado */
    }
  }, [pencilCursor])

  return (
    <>
      <a
        href="#contenido"
        className="bg-highlighter text-on-highlighter text-label border-ink sr-only border-2 px-4 py-2 uppercase focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-100"
      >
        Saltar al contenido
      </a>

      <Header pencilCursor={pencilCursor} onTogglePencil={() => setPencilCursor((v) => !v)} />

      <main id="contenido">
        <Hero />
        <About />
        <Skills />
        <Services />
        <Projects />
        <Experience />
        <Faq />
        <Contact />
        <Cta />
      </main>

      <Footer />
      <BackToTop />
    </>
  )
}
