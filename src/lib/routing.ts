import type { MouseEvent } from 'react'

/**
 * Rutas limpias sobre una página única.
 *
 * En vez de `#trayectoria` la barra de direcciones muestra `/trayectoria`: los
 * enlaces siguen siendo `<a href>` de verdad (se pueden abrir en una pestaña
 * nueva, copiar y compartir), pero el clic se intercepta para desplazarse en
 * la misma página y reescribir la URL con la History API.
 *
 * OJO AL DESPLEGAR: al entrar directamente a `/trayectoria` el servidor debe
 * devolver `index.html`. Ver `public/_redirects` y `vercel.json`.
 */

/** La sección de inicio vive en `/`, no en `/inicio`. */
export const HOME_ID = 'inicio'

export function pathForSection(id: string): string {
  return id === HOME_ID ? '/' : `/${id}`
}

/** Traduce una ruta a un id de sección; `null` si no corresponde a ninguna. */
export function sectionForPath(pathname: string, ids: readonly string[]): string | null {
  const slug = decodeURIComponent(pathname).replace(/^\/+|\/+$/g, '')
  if (!slug) return HOME_ID
  return ids.includes(slug) ? slug : null
}

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function scrollToSection(id: string, smooth = true) {
  const el = document.getElementById(id)
  if (!el) return

  const behavior: ScrollBehavior = smooth && !prefersReducedMotion() ? 'smooth' : 'auto'

  // La sección de inicio va al tope real: así no queda el header flotando
  // sobre un hueco por culpa del scroll-margin.
  if (id === HOME_ID) window.scrollTo({ top: 0, behavior })
  else el.scrollIntoView({ behavior, block: 'start' })
}

/**
 * Ventana durante la cual el scroll-spy no toca la URL. Sin esto, el
 * desplazamiento suave atravesaría las secciones intermedias y las iría
 * escribiendo una a una en la barra de direcciones.
 */
let suppressUntil = 0

export function isUrlSyncSuppressed(): boolean {
  return performance.now() < suppressUntil
}

/** Congela la sincronización de la URL durante `ms` milisegundos. */
export function suppressUrlSync(ms: number) {
  suppressUntil = Math.max(suppressUntil, performance.now() + ms)
}

export function navigateToSection(id: string) {
  const path = pathForSection(id)
  if (window.location.pathname !== path) window.history.pushState({ id }, '', path)

  suppressUrlSync(900)
  scrollToSection(id)
}

/** Mantiene la URL al día mientras se hace scroll, sin ensuciar el historial. */
export function syncUrlToSection(id: string) {
  if (isUrlSyncSuppressed()) return

  const path = pathForSection(id)
  if (window.location.pathname !== path) {
    window.history.replaceState({ id }, '', path + window.location.search)
  }
}

/**
 * Props para un enlace de sección. Respeta ctrl/cmd/shift y el clic con el
 * botón central, que deben seguir abriendo una pestaña nueva.
 */
export function sectionLinkProps(id: string) {
  return {
    href: pathForSection(id),
    onClick(event: MouseEvent<HTMLAnchorElement>) {
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

      event.preventDefault()
      navigateToSection(id)
    },
  }
}
