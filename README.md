# Portafolio — LuisKinnDC

Portafolio personal con estética **"Engineer's Sketchbook"**: boceto a mano sobre papel
milimetrado, tinta negra con sombra dura, marcador amarillo y azul de plano técnico.

## Stack

| Pieza | Elección | Por qué |
| --- | --- | --- |
| Build | Vite 8 + React 19 + TypeScript 6 | Arranque instantáneo y tipado estricto |
| Estilos | Tailwind CSS v4 (`@theme`) | Tokens en CSS puro, sin `tailwind.config.js` |
| Animación | `motion` (Framer Motion 12) | Entradas al hacer scroll y transiciones de layout |
| Trazo a mano | `roughjs` | Marcos y círculos con irregularidad real |
| Anotaciones | `rough-notation` | Subrayados y marcador que se dibujan solos |
| Iconos | `lucide-react` + SVG propios | Los de marca (GitHub/LinkedIn) son propios: lucide v1 los retiró |
| Tipografías | `@fontsource` | Bricolage Grotesque, Space Mono, JetBrains Mono autoalojadas |

## Comandos

```bash
pnpm install
pnpm dev        # servidor de desarrollo en http://localhost:5173
pnpm build      # comprobación de tipos + build de producción en dist/
pnpm preview    # sirve dist/ localmente
pnpm lint       # oxlint
```

## Dónde editar el contenido

Todo el texto vive en dos archivos. No hace falta tocar componentes.

- **`src/data/site.ts`** — nombre, rol, email, ubicación, redes, menú de navegación
  y la cinta de tecnologías.
- **`src/data/content.ts`** — el resto: sobre mí, métricas, skills, servicios,
  proyectos, trayectoria, certificaciones, testimonios, notas y FAQ.

Los componentes se adaptan a la cantidad de elementos de cada lista, así que puedes
añadir o quitar libremente.

### Cosas que querrás cambiar primero

1. **Tu foto** — colócala en `public/` y apunta `profile.photoUrl` en `site.ts`.
   Si lo dejas vacío se dibuja un retrato SVG a lápiz como reserva.
2. **Tu CV** — pon el PDF en `public/cv-luis-kinder.pdf` o cambia `profile.cvUrl`.
3. **Redes y email** — en `socials` y `profile.email` de `site.ts`.

## Sistema de diseño

Los tokens están en `src/styles/index.css`, dentro de `@theme inline`. El modo
oscuro funciona reescribiendo las variables `--raw-*` bajo `.dark`, así que
**una sola clase** (`bg-paper`, `text-ink`…) sirve para ambos temas: no hay
variantes `dark:` repartidas por los componentes.

Utilidades propias del sistema:

| Clase | Efecto |
| --- | --- |
| `paper-grid` / `paper-dots` | Fondo de cuadrícula o puntos |
| `sketch-frame` | Borde de tinta con sombra dura desplazada |
| `sketch-frame-lift` | Levanta la tarjeta al pasar el cursor |
| `tape` | Etiqueta con aspecto de cinta adhesiva |
| `marker-swipe` | Trazo de marcador fluorescente sobre texto |
| `node-blob` | Radio orgánico, como dibujado a pulso |
| `ruled-input` | Campo de formulario tipo renglón de cuaderno |
| `wavy-link` | Subrayado ondulado |
| `hover-jiggle` | Vibración al pasar el cursor |

## Rutas limpias

La página es una sola, pero la barra de direcciones muestra `/trayectoria` en vez
de `#trayectoria`. Los enlaces del menú son `<a href="/trayectoria">` de verdad
—se pueden copiar, compartir y abrir en una pestaña nueva—; el clic se intercepta
para desplazarse sin recargar y reescribir la URL con la History API
(`src/lib/routing.ts`).

La sección de inicio vive en `/`, no en `/inicio`. Al hacer scroll la URL se
actualiza con `replaceState`, así que el botón "atrás" no queda atrapado
recorriendo sección por sección.

> **Importante al desplegar.** Como `/trayectoria` no es un archivo real, el
> servidor debe devolver `index.html` para cualquier ruta. Si no, quien entre
> directo a ese enlace verá un 404.
>
> - **Netlify** — ya configurado en `public/_redirects`.
> - **Vercel** — ya configurado en `vercel.json`.
> - **nginx** — `location / { try_files $uri $uri/ /index.html; }`
> - **Apache** — un `.htaccess` con `FallbackResource /index.html`.
> - **GitHub Pages** — no admite reescrituras; necesitarías copiar `index.html`
>   como `404.html`, o volver a los anclas con `#`.

Las rutas desconocidas (`/cualquier-cosa`) no dan error: cargan el inicio y la
URL se normaliza a `/`.

## Formulario de contacto

Sin backend: al enviar se abre el cliente de correo con el mensaje ya redactado.
Para recibirlo en un servicio (Formspree, Resend, tu propia API), sustituye el
handler `onSubmit` de `src/components/sections/Contact.tsx` por un `fetch`.

## Accesibilidad

- Enlace de salto al contenido, navegación por teclado y `:focus-visible` visible.
- `prefers-reduced-motion` desactiva todas las animaciones decorativas.
- Acordeón de FAQ, carrusel de testimonios y menú móvil con los roles y estados ARIA
  correspondientes.
