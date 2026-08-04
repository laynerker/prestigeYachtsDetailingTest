# Rediseño "Antes/Después" — Plan de Implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rediseñar Prestige Yachts Detailing alrededor del slider antes/después existente (`ImageComparison.tsx`): paleta oscura desaturada, tipografía Archivo + Source Serif 4, secciones que alternan en inversión total, hero de revelación, y limpieza de assets/componentes muertos — siguiendo `~/Documents/Plans-ia/prestigeYachtsDetailing/plan-mejora-diseno.md` (referenciado abajo como "el spec").

**Architecture:** Next.js 16 App Router con `output: 'export'` estático (sin rutas dinámicas de servidor). Los cambios son: (1) assets estáticos comprimidos en `public/`, (2) tokens de diseño centralizados en `src/app/globals.css` y en el layout de locale, (3) componentes cliente existentes reestilizados in-place, (4) un componente nuevo (`RecentWork.tsx`) que reemplaza el placeholder "Fleet — Coming Soon" reutilizando `ImageComparison.tsx`. No hay suite de tests; la verificación de cada tarea es `npm run lint`, `npx tsc --noEmit`, `npm run build`, y comprobación visual en `npm run dev` vía el navegador.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS 4 (sin `tailwind.config.js`, tokens vía `@theme inline`), next-intl (en/es), Framer Motion, lucide-react, sharp (ya presente como dependencia transitiva de `next`, usado solo por un script de build-time, no se añade como dependencia de producción).

## Global Constraints

- `output: 'export'` es la restricción central (`next.config.mjs`) — cualquier componente nuevo debe renderizar sin `next/image` optimization (`images.unoptimized: true`) y sin server actions/route handlers.
- Cada segmento de ruta ya tiene `generateStaticParams`; no crear rutas nuevas sin replicarlo.
- Locales `en`/`es` deben mantenerse sincronizados en `messages/en.json` y `messages/es.json` — toda clave nueva va en ambos archivos, en el mismo commit.
- Alias `@/*` → `src/*`.
- Paleta nueva (§2 del spec), verbatim:
  - `slipway` `#0B1614`, `bilge` `#16211F`, `chalk` `#8B9793`, `gelcoat` `#F2F4F3`, `teak` `#C08A4A`, `teak-deep` `#8A5A2B`.
- Tipografía nueva (§3 del spec): Archivo (variable, display+UI) + Source Serif 4 (cuerpo). Se elimina Playfair Display + Inter. No hay tercera familia (no monoespaciada).
- `chalk` no se usa para texto por debajo de 14px ni sobre `bilge` sin re-verificar contraste.
- Objetivo de compresión de imágenes: < ~400 KB por archivo en `public/assets/images/services/`, sin pérdida visible.
- `prefers-reduced-motion`: el hero debe aparecer con el divisor ya al 55%, sin barrido, y seguir siendo arrastrable (§6 del spec).
- Bilingüe: tamaños de titular con `clamp()`, nunca saltos fijos por breakpoint (§9 del spec).
- Commits siguen Conventional Commits (`.agents/skills/commiter/SKILL.md`): `<type>(scope): <description>`, título ≤ 50 caracteres, cuerpo obligatorio. Actualizar `CHANGELOG.md` bajo `[Unreleased]` en cada commit de feature/fix (crearlo si no existe, per `.agents/skills/changelog/SKILL.md`).

---

## Task 1: Comprimir imágenes de servicio

**Files:**
- Create: `scripts/compress-service-images.mjs` (script de build-time, no se importa desde la app)
- Modify (in place, mismo nombre de archivo): `public/assets/images/services/Detailing_antes.webp`, `Detailing_despues.webp`, `Teak_antes.webp`, `Teak_despues.webp`, `engine_room_antes.webp`, `engine_room_despues.webp`, `metal_polish_antes.webp`, `metal_polish_despues.webp`, `wash_down_antes.webp`, `wash_down_despues.webp`

**Interfaces:**
- Consumes: nada (script standalone).
- Produces: los mismos 10 archivos `.webp` en la misma ruta, mismo nombre, cada uno < 400 KB. Ningún componente cambia — todas las referencias (`src/app/[locale]/services/page.tsx`) siguen apuntando a las mismas rutas.

- [ ] **Step 1: Escribir el script de compresión**

```javascript
// scripts/compress-service-images.mjs
import sharp from 'sharp';
import { readdir, stat } from 'node:fs/promises';
import path from 'node:path';

const DIR = path.resolve('public/assets/images/services');
const TARGET_BYTES = 400 * 1024;
const SKIP = new Set(['yateClear.png', 'yateError.png']);

async function compressOne(filePath) {
  const before = (await stat(filePath)).size;
  let quality = 82;
  let buffer;

  while (quality >= 40) {
    buffer = await sharp(filePath).webp({ quality }).toBuffer();
    if (buffer.length <= TARGET_BYTES || quality <= 40) break;
    quality -= 8;
  }

  await sharp(buffer).toFile(filePath + '.tmp');
  await sharp(filePath + '.tmp').toFile(filePath); // overwrite via temp to avoid read/write same file
  const { unlink } = await import('node:fs/promises');
  await unlink(filePath + '.tmp');

  const after = (await stat(filePath)).size;
  console.log(
    `${path.basename(filePath)}: ${(before / 1024).toFixed(0)}KB -> ${(after / 1024).toFixed(0)}KB (q=${quality})`
  );
}

const files = (await readdir(DIR)).filter(
  (f) => f.endsWith('.webp') && !SKIP.has(f)
);

for (const f of files) {
  await compressOne(path.join(DIR, f));
}
```

- [ ] **Step 2: Ejecutar el script**

Run: `node scripts/compress-service-images.mjs`
Expected: 10 líneas de log, cada una con el tamaño "after" por debajo de ~400KB (metal_polish ya estaba por debajo — confirmar que no creció).

- [ ] **Step 3: Verificar visualmente que no hay pérdida perceptible**

Run: `npx next dev` y abrir `http://localhost:3000/en/services` (o `es`) — comparar cada slider antes/después contra el estado previo a la compresión. Si algún par muestra artefactos visibles, volver a Step 1 y bajar el `quality` inicial de ese archivo específico manualmente o subir `TARGET_BYTES` para ese caso.

- [ ] **Step 4: Confirmar tamaños finales por CLI**

Run: `du -sh public/assets/images/services/*.webp`
Expected: cada archivo de servicio (excepto los que se borran en Task 2) por debajo de ~400KB.

- [ ] **Step 5: Commit**

```bash
git add public/assets/images/services/*.webp scripts/compress-service-images.mjs
git commit -m "$(cat <<'EOF'
perf(images): compress service before/after photos under 400KB

Service images ranged up to 11.4MB, which delays first paint on the
hero and service sections. Recompressed all pairs with sharp to keep
the reveal effect (plan-mejora-diseno.md §5) usable on load — this is
a hard dependency of the redesigned hero, not routine maintenance.
EOF
)"
```

---

## Task 2: Borrar assets y componentes muertos

**Files:**
- Delete: `public/assets/images/services/yateClear.png`, `public/assets/images/services/yateError.png`
- Delete: `public/file.svg`, `public/globe.svg`, `public/next.svg`, `public/vercel.svg`, `public/window.svg`
- Delete: `src/components/Stats.tsx`
- Modify: `src/app/globals.css:76-80` (eliminar bloque `.text-gradient-gold`)

**Interfaces:**
- Consumes: confirmación previa (ya verificada por grep) de que `Stats.tsx` no se importa en ningún archivo y `.text-gradient-gold` no se usa en ningún componente.
- Produces: nada que otras tareas consuman — es limpieza pura.

- [ ] **Step 1: Confirmar que nada referencia estos archivos (doble check antes de borrar)**

Run: `grep -rn "Stats\b\|text-gradient-gold\|yateClear\|yateError\|file.svg\|globe.svg\|next.svg\|vercel.svg\|window.svg" src/`
Expected: ninguna coincidencia fuera de la propia definición en `Stats.tsx` y `globals.css` (que se van a borrar en este mismo task).

- [ ] **Step 2: Borrar los archivos**

```bash
git rm public/assets/images/services/yateClear.png public/assets/images/services/yateError.png
git rm public/file.svg public/globe.svg public/next.svg public/vercel.svg public/window.svg
git rm src/components/Stats.tsx
```

- [ ] **Step 3: Eliminar el bloque `.text-gradient-gold` de `globals.css`**

En `src/app/globals.css`, borrar las líneas:
```css
.text-gradient-gold {
  background: linear-gradient(135deg, var(--color-gold-light) 0%, var(--color-gold) 50%, var(--color-gold-dark) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

- [ ] **Step 4: Verificar que el proyecto sigue compilando**

Run: `npx tsc --noEmit && npm run lint`
Expected: sin errores relacionados con `Stats` o assets faltantes.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "$(cat <<'EOF'
chore: remove dead assets and unused Stats component

yateClear.png/yateError.png (18MB, no references), the create-next-app
boilerplate SVGs, the never-imported Stats.tsx, and .text-gradient-gold
(gold accent is being removed from the palette in the redesign) are
confirmed unused via grep. Per plan-mejora-diseno.md §11.
EOF
)"
```

---

## Task 3: Tokens de color

**Files:**
- Modify: `src/app/globals.css:1-49` (bloques `:root` y `@theme inline`)

**Interfaces:**
- Produces: utilidades Tailwind nuevas — `bg-slipway`, `bg-bilge`, `text-chalk`, `bg-gelcoat`, `text-teak`, `bg-teak`, `bg-teak-deep`, etc. — consumidas por Tasks 4-8. El mapeo `--background`/`--foreground`/`--primary`/`--secondary`/`--muted` se actualiza para apuntar a los nuevos tokens en vez de navy/gold, así los componentes que ya usan `bg-primary`, `text-secondary`, etc. heredan la paleta nueva sin tocarlos (los que usan clases literales como `bg-navy` o `text-gold` se migran en Tasks 5-7, uno por componente).

- [ ] **Step 1: Reemplazar el bloque `:root`**

En `src/app/globals.css`, reemplazar líneas 1-25:

```css
@import "tailwindcss";

:root {
  /* Brand Colors — plan-mejora-diseno.md §2 */
  --color-slipway: #0B1614;
  --color-bilge: #16211F;
  --color-chalk: #8B9793;
  --color-gelcoat: #F2F4F3;
  --color-teak: #C08A4A;
  --color-teak-deep: #8A5A2B;

  /* Theme mapping */
  --background: var(--color-gelcoat);
  --foreground: var(--color-slipway);

  --primary: var(--color-slipway);
  --primary-foreground: var(--color-gelcoat);

  --secondary: var(--color-teak);
  --secondary-foreground: var(--color-slipway);

  --muted: var(--color-bilge);
  --muted-foreground: var(--color-chalk);
}
```

- [ ] **Step 2: Reemplazar el bloque `@theme inline`**

Reemplazar las líneas 27-49 (el bloque `@theme inline` completo, incluyendo el comentario de fuentes que se actualizará en Task 4):

```css
@theme inline {
  --color-slipway: var(--color-slipway);
  --color-bilge: var(--color-bilge);
  --color-chalk: var(--color-chalk);
  --color-gelcoat: var(--color-gelcoat);
  --color-teak: var(--color-teak);
  --color-teak-deep: var(--color-teak-deep);

  --color-background: var(--background);
  --color-foreground: var(--foreground);

  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);

  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);

  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);

  /* Fonts rely on CSS variables set in layout (Task 4) */
  --font-sans: var(--font-archivo);
  --font-serif: var(--font-source-serif);
}
```

- [ ] **Step 3: Verificar que Tailwind genera las clases**

Run: `npm run dev` en background, luego en el navegador abrir cualquier página y en devtools ejecutar `getComputedStyle(document.body).getPropertyValue('--color-teak')`.
Expected: devuelve `#C08A4A` (o el valor resuelto).

Nota: en este punto del plan los componentes todavía usan clases `bg-navy`/`text-gold` que ya no existen — es esperado que la página se vea rota visualmente hasta Task 5-7. No es una regresión de este task; los tokens crudos (`bg-slipway`, `text-teak`, etc.) ya están disponibles para las tareas siguientes.

- [ ] **Step 4: Compilar**

Run: `npx tsc --noEmit`
Expected: sin errores (CSS no participa en el typecheck, esto solo confirma que no se rompió nada de TS al tocar el archivo).

- [ ] **Step 5: Commit**

```bash
git add src/app/globals.css
git commit -m "$(cat <<'EOF'
feat(design): replace navy/gold palette with slipway/teak tokens

Introduces the desaturated dark palette from plan-mejora-diseno.md §2
(slipway, bilge, chalk, gelcoat, teak, teak-deep) in :root and
@theme inline, replacing navy/gold. Component classnames still
reference the old bg-navy/text-gold utilities and are migrated in
the following tasks — this task only lands the token layer.
EOF
)"
```

---

## Task 4: Tipografía — Archivo + Source Serif 4

**Files:**
- Modify: `src/app/[locale]/layout.tsx:1-9,43` (imports de fuente, `className` del `<html>`)
- Modify: `src/app/globals.css` (regla `h3,h4,h5,h6` y añadir escala nombrada)

**Interfaces:**
- Produces: variables CSS `--font-archivo` y `--font-source-serif`, ya consumidas por `--font-sans`/`--font-serif` definidos en Task 3. Clases utilitarias nuevas `.text-display`, `.text-heading-1`, `.text-heading-2`, `.text-heading-3`, `.text-eyebrow`, `.text-caption` consumidas por Tasks 5-7.

- [ ] **Step 1: Cambiar los imports de fuente en el layout**

En `src/app/[locale]/layout.tsx`, reemplazar:

```typescript
import { Inter, Playfair_Display } from "next/font/google";
```
por:
```typescript
import { Archivo, Source_Serif_4 } from "next/font/google";
```

Y reemplazar:
```typescript
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
```
por:
```typescript
const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  weight: ["500", "600", "700"],
});
const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-source-serif",
  weight: ["400", "600"],
  style: ["normal", "italic"],
});
```

- [ ] **Step 2: Actualizar el `className` del `<html>`**

En `src/app/[locale]/layout.tsx:43`, reemplazar:
```typescript
<html lang={locale} className={`${inter.variable} ${playfair.variable}`}>
```
por:
```typescript
<html lang={locale} className={`${archivo.variable} ${sourceSerif.variable}`}>
```

- [ ] **Step 3: Reemplazar la regla de heading por defecto y añadir la escala nombrada**

En `src/app/globals.css`, reemplazar:
```css
h3,
h4,
h5,
h6 {
  font-family: var(--font-serif);
  color: var(--color-navy);
}
```
por (escala nombrada de §3 del spec — `clamp()` obligatorio por la restricción bilingüe de §9):
```css
.text-display {
  font-family: var(--font-sans);
  font-weight: 700;
  font-stretch: 125%;
  letter-spacing: -0.02em;
  font-size: clamp(2.5rem, 4vw + 1rem, 7rem);
  line-height: 1.05;
}

.text-heading-1 {
  font-family: var(--font-sans);
  font-weight: 700;
  font-stretch: 112%;
  font-size: clamp(2rem, 2.5vw + 1rem, 3.75rem);
  line-height: 1.1;
}

.text-heading-2 {
  font-family: var(--font-sans);
  font-weight: 600;
  font-stretch: 100%;
  font-size: clamp(1.5rem, 1.5vw + 1rem, 2.5rem);
  line-height: 1.15;
}

.text-heading-3 {
  font-family: var(--font-sans);
  font-weight: 600;
  font-stretch: 100%;
  font-size: clamp(1.25rem, 1vw + 0.75rem, 1.75rem);
  line-height: 1.2;
}

.text-eyebrow {
  font-family: var(--font-sans);
  font-weight: 600;
  font-stretch: 100%;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  font-size: 0.75rem;
  color: var(--color-chalk);
}

.text-body {
  font-family: var(--font-serif);
  font-weight: 400;
}

.text-caption {
  font-family: var(--font-sans);
  font-weight: 500;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
}
```

- [ ] **Step 4: Verificar tipografía en el navegador**

Run: `npm run dev`, abrir `http://localhost:3000/en/` en devtools, inspeccionar un `<h1>`/`<p>` y confirmar `font-family` computado incluye `Archivo` o `"Source Serif 4"` según corresponda.

- [ ] **Step 5: Typecheck y lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: sin errores.

- [ ] **Step 6: Commit**

```bash
git add src/app/[locale]/layout.tsx src/app/globals.css
git commit -m "$(cat <<'EOF'
feat(design): replace Playfair+Inter with Archivo + Source Serif 4

Single variable sans (Archivo) covers display and UI; Source Serif 4
carries body copy — the inverted pairing from plan-mejora-diseno.md
§3. Also lands the named type scale (.text-display, .text-heading-1/2/3,
.text-eyebrow, .text-body, .text-caption) with clamp() sizing so
components stop hand-picking font-serif/font-sans per element, and
Spanish headlines (20-25% longer, per §9) don't overflow.
EOF
)"
```

---

## Task 5: Reestilizar `ImageComparison.tsx` (base para el hero y servicios)

**Files:**
- Modify: `src/components/ImageComparison.tsx`

**Interfaces:**
- Consumes: props existentes `imageBefore: string`, `imageAfter: string`, `alt: string` — sin cambios de interfaz pública, así Task 6 (hero) y Task 7 (servicios) siguen instanciándolo igual.
- Produces: nueva prop opcional `initialPosition?: number` (default 50) y `revealOnMount?: boolean` (default false) — consumidas por Task 6 para el efecto de barrido inicial del hero. Añade soporte de teclado (flechas izquierda/derecha mueven el divisor 5% cada pulsación) para cumplir el piso de calidad §10.

- [ ] **Step 1: Añadir soporte de teclado y las props nuevas**

Reemplazar el contenido de `src/components/ImageComparison.tsx`:

```typescript
'use client';

import { useState, useRef, useEffect, TouchEvent, MouseEvent, KeyboardEvent } from 'react';
import Image from 'next/image';
import { ChevronsLeftRight } from 'lucide-react';

interface ImageComparisonProps {
    imageBefore: string;
    imageAfter: string;
    alt: string;
    initialPosition?: number;
    revealOnMount?: boolean;
}

export default function ImageComparison({
    imageBefore,
    imageAfter,
    alt,
    initialPosition = 50,
    revealOnMount = false,
}: ImageComparisonProps) {
    const [sliderPosition, setSliderPosition] = useState(revealOnMount ? 2 : initialPosition);
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const calculatePosition = (clientX: number) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const position = ((clientX - rect.left) / rect.width) * 100;
        setSliderPosition(Math.min(Math.max(position, 0), 100));
    };

    const handleMouseDown = (e: MouseEvent) => {
        setIsDragging(true);
        calculatePosition(e.clientX);
    };

    const handleTouchMove = (e: TouchEvent) => {
        calculatePosition(e.touches[0].clientX);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            setSliderPosition((p) => Math.max(p - 5, 0));
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            setSliderPosition((p) => Math.min(p + 5, 100));
        }
    };

    useEffect(() => {
        if (!revealOnMount) return;
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) {
            setSliderPosition(initialPosition);
            return;
        }
        const timeout = setTimeout(() => setSliderPosition(initialPosition), 150);
        return () => clearTimeout(timeout);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [revealOnMount]);

    useEffect(() => {
        const handleGlobalMouseMove = (e: globalThis.MouseEvent) => {
            if (!isDragging) return;
            calculatePosition(e.clientX);
        };

        const handleGlobalMouseUp = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            window.addEventListener('mousemove', handleGlobalMouseMove);
            window.addEventListener('mouseup', handleGlobalMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleGlobalMouseMove);
            window.removeEventListener('mouseup', handleGlobalMouseUp);
        };
    }, [isDragging]);

    return (
        <div
            ref={containerRef}
            role="slider"
            tabIndex={0}
            aria-valuenow={Math.round(sliderPosition)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Comparador antes/después: ${alt}`}
            className="relative w-full h-full overflow-hidden select-none cursor-ew-resize group focus:outline-none focus-visible:ring-2 focus-visible:ring-teak focus-visible:ring-offset-2 focus-visible:ring-offset-slipway"
            onMouseDown={handleMouseDown}
            onTouchMove={handleTouchMove}
            onKeyDown={handleKeyDown}
            style={{ transition: revealOnMount ? 'none' : undefined }}
        >
            <div className="absolute inset-0">
                <Image
                    src={imageAfter}
                    alt={`Después: ${alt}`}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute bottom-4 right-4 bg-slipway/80 text-gelcoat text-xs font-medium px-3 py-1.5 rounded-full backdrop-blur-sm z-10 pointer-events-none">
                    DESPUÉS
                </div>
            </div>

            <div
                className="absolute inset-0"
                style={{
                    clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
                    transition: revealOnMount ? 'clip-path 1.2s cubic-bezier(0.16, 1, 0.3, 1)' : undefined,
                }}
            >
                <Image
                    src={imageBefore}
                    alt={`Antes: ${alt}`}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute bottom-4 left-4 bg-slipway/80 text-gelcoat text-xs font-medium px-3 py-1.5 rounded-full backdrop-blur-sm z-10 pointer-events-none">
                    ANTES
                </div>
            </div>

            <div
                className="absolute top-0 bottom-0 w-1 bg-gelcoat cursor-ew-resize z-20"
                style={{
                    left: `${sliderPosition}%`,
                    transition: revealOnMount ? 'left 1.2s cubic-bezier(0.16, 1, 0.3, 1)' : undefined,
                }}
            >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-gelcoat rounded-full flex items-center justify-center shadow-lg text-slipway hover:scale-110 transition-transform">
                    <ChevronsLeftRight size={20} />
                </div>
            </div>
        </div>
    );
}
```

- [ ] **Step 2: Verificar visualmente arrastre, teclado y foco**

Run: `npm run dev`, abrir `http://localhost:3000/en/services`. Confirmar: (a) el slider se arrastra igual que antes, (b) al hacer Tab hasta el slider aparece un anillo `teak` visible, (c) con foco, las flechas izquierda/derecha mueven el divisor.

- [ ] **Step 3: Typecheck y lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: sin errores.

- [ ] **Step 4: Commit**

```bash
git add src/components/ImageComparison.tsx
git commit -m "$(cat <<'EOF'
feat(image-comparison): add keyboard control and reveal-on-mount

Arrow keys move the divider 5% per press so the slider is operable
without a mouse (plan-mejora-diseno.md §10 quality floor). Adds
initialPosition/revealOnMount props consumed by the hero's reveal
animation in the next task — clipPath/left transitions only fire
when revealOnMount is set, dragging stays instant. Labels switch
to ANTES/DESPUÉS and colors move to the new slipway/gelcoat tokens.
EOF
)"
```

---

## Task 6: Hero de revelación

**Files:**
- Modify: `src/components/Hero.tsx`
- Modify: `messages/en.json` (namespace `Home`)
- Modify: `messages/es.json` (namespace `Home`)

**Interfaces:**
- Consumes: `ImageComparison` con `initialPosition={55}` y `revealOnMount` de Task 5; par de imágenes real (usa `wash_down_antes.webp`/`wash_down_despues.webp`, ya comprimidas en Task 1, como el par "hero" por ser el de mejor contraste visual antes/después).
- Produces: nada consumido por otras tareas — el hero es hoja del árbol de componentes.

- [ ] **Step 1: Añadir claves de alt-text descriptivo a los mensajes**

En `messages/en.json`, dentro de `"Home"`, añadir:
```json
"heroBeforeAlt": "Yacht hull before wash and polish, coated in salt residue and oxidation",
"heroAfterAlt": "Same yacht hull after wash and polish, restored to a mirror finish"
```

En `messages/es.json`, dentro de `"Home"`, añadir:
```json
"heroBeforeAlt": "Casco de yate antes del lavado y pulido, cubierto de residuo salino y oxidación",
"heroAfterAlt": "Mismo casco de yate después del lavado y pulido, restaurado a un acabado espejo"
```

- [ ] **Step 2: Reescribir `Hero.tsx`**

```typescript
'use client';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import ImageComparison from './ImageComparison';

export default function Hero() {
    const t = useTranslations('Home');
    const locale = useLocale();

    return (
        <section className="relative w-full bg-slipway overflow-hidden">
            <div className="relative h-[70vh] min-h-[480px] w-full">
                <ImageComparison
                    imageBefore="/assets/images/services/wash_down_antes.webp"
                    imageAfter="/assets/images/services/wash_down_despues.webp"
                    alt={t('heroBeforeAlt')}
                    initialPosition={55}
                    revealOnMount
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slipway via-slipway/10 to-transparent pointer-events-none" />
            </div>

            <div className="noise-overlay" />

            <div className="relative z-10 px-4 py-16 md:py-20 max-w-5xl mx-auto text-center">
                <span className="text-eyebrow block mb-6">
                    Prestige Yachts Detailing
                </span>
                <h1 className="text-display text-gelcoat mb-6">
                    {t('title')}
                </h1>
                <p className="text-body text-chalk text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
                    {t('subtitle')}
                </p>
                <Link
                    href={`/${locale}/services`}
                    className="inline-flex items-center justify-center px-10 py-5 bg-teak text-slipway font-medium tracking-[0.15em] uppercase text-sm hover:bg-teak-deep transition-colors duration-300 rounded-sm"
                >
                    {t('cta')}
                </Link>
            </div>
        </section>
    );
}
```

- [ ] **Step 3: Verificar el barrido de revelación**

Run: `npm run dev`, abrir `http://localhost:3000/en/` con cache/hard-reload. Confirmar: (a) al cargar, el divisor empieza cerca del 2% y barre hasta 55% en ~1.2s, (b) tras el barrido sigue siendo arrastrable, (c) en DevTools → Rendering → emulate `prefers-reduced-motion: reduce`, recargar y confirmar que el divisor aparece directo en 55% sin animación.

- [ ] **Step 4: Probar en 375px con texto en español**

Run: con el navegador en modo responsive a 375px de ancho, abrir `http://localhost:3000/es/`. Confirmar que el titular no desborda el contenedor (el `clamp()` de `.text-display` de Task 4 debe absorber la diferencia de longitud es/en, per spec §9).

- [ ] **Step 5: Typecheck y lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: sin errores.

- [ ] **Step 6: Commit**

```bash
git add src/components/Hero.tsx messages/en.json messages/es.json
git commit -m "$(cat <<'EOF'
feat(hero): replace parallax stock photo with before/after reveal

The hero now opens on the wash-down before/after pair and sweeps the
divider from 2% to 55% over 1.2s on load, then stays draggable —
plan-mejora-diseno.md §5's signature moment, built entirely from the
existing ImageComparison component and real client photos instead of
a stock image with a specular shimmer. Removes the scroll-parallax
(§6: it fought with the draggable divider). Respects
prefers-reduced-motion by skipping straight to the 55% position.
EOF
)"
```

---

## Task 7: Inversión de secciones — `PageHeader` fuera, banners repetidos retirados

**Files:**
- Modify: `src/app/[locale]/services/page.tsx`
- Modify: `src/app/[locale]/about/page.tsx`
- Modify: `src/app/[locale]/contact/page.tsx`
- Delete: `src/components/PageHeader.tsx` (tras confirmar que ningún archivo lo importa después de este task)

**Interfaces:**
- Consumes: tokens de Task 3 (`bg-slipway`, `bg-gelcoat`) y escala tipográfica de Task 4.
- Produces: cada página interior alterna oscuro/claro a sangre completa en vez de abrir con el banner `hero.png` repetido cuatro veces (§4, §7 del spec — dejar de reutilizar `hero.png`).

- [ ] **Step 1: Reescribir `services/page.tsx` sin `PageHeader`, con eyebrows por material**

Reemplazar el `return` de `src/app/[locale]/services/page.tsx` (mantener el array `itemsServices` y los imports de `ImageComparison`/`ServiceButton`/`Navigation`/`Footer`; quitar el import de `PageHeader` e `Image`):

```typescript
const MATERIAL_EYEBROW: Record<string, string> = {
    washDown: 'CASCO',
    premiumDetailedWash: 'GELCOAT',
    teakCleaning: 'TECA',
    metalPolish: 'ACERO',
    engineRoomCare: 'SALA DE MÁQUINAS',
};

return (
    <main className="flex min-h-screen flex-col">
        <Navigation locale={locale} />

        <section className="bg-slipway pt-40 pb-16 px-4 text-center">
            <h1 className="text-heading-1 text-gelcoat">{t('headerTitle')}</h1>
        </section>

        {itemsServices.map((item, index) => (
            <section
                key={index}
                id={item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}
                className={index % 2 === 0 ? 'bg-gelcoat' : 'bg-slipway'}
            >
                <div className="container mx-auto px-4 py-20 scroll-mt-32">
                    <div className="flex flex-col md:flex-row gap-12 items-center">
                        {index % 2 === 0 ? (
                            <>
                                <div className="w-full md:w-1/2 h-[400px] relative overflow-hidden shadow-xl">
                                    <ImageComparison
                                        imageBefore={item.imageBefore}
                                        imageAfter={item.imageAfter}
                                        alt={item.title}
                                    />
                                </div>
                                <div className="w-full md:w-1/2">
                                    <span className="text-eyebrow block mb-3">{MATERIAL_EYEBROW[item.id]}</span>
                                    <h2 className="text-heading-2 text-slipway mb-4">{item.title}</h2>
                                    <h3 className="text-heading-3 text-teak-deep mb-4">{t(`items.${item.id}.description`)}</h3>
                                    <p className="text-body text-slipway/70 mb-6 leading-relaxed">
                                        {t('pricingNote')}
                                    </p>
                                    <ul className="space-y-3 mb-8">
                                        {Array.from({ length: item.itemCount }).map((_, i) => (
                                            <li key={i} className="flex items-center gap-3 text-slipway/80">
                                                <span className="w-2 h-2 rounded-full bg-teak"></span>
                                                {t(`items.${item.id}.items.${i}`)}
                                            </li>
                                        ))}
                                    </ul>
                                    <ServiceButton
                                        serviceTitle={item.title}
                                        whatsappText={encodeURIComponent(tContact('defaultMessage', { service: item.title }))}
                                        buttonText={t('requestAppointment')}
                                        locale={locale}
                                    />
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="w-full md:w-1/2">
                                    <span className="text-eyebrow block mb-3">{MATERIAL_EYEBROW[item.id]}</span>
                                    <h2 className="text-heading-2 text-gelcoat mb-4">{item.title}</h2>
                                    <h3 className="text-heading-3 text-teak mb-4">{t(`items.${item.id}.description`)}</h3>
                                    <p className="text-body text-chalk mb-6 leading-relaxed">
                                        {t('pricingNote')}
                                    </p>
                                    <ul className="space-y-3 mb-8">
                                        {Array.from({ length: item.itemCount }).map((_, i) => (
                                            <li key={i} className="flex items-center gap-3 text-gelcoat/90">
                                                <span className="w-2 h-2 rounded-full bg-teak"></span>
                                                {t(`items.${item.id}.items.${i}`)}
                                            </li>
                                        ))}
                                    </ul>
                                    <ServiceButton
                                        serviceTitle={item.title}
                                        whatsappText={encodeURIComponent(tContact('defaultMessage', { service: item.title }))}
                                        buttonText={t('requestAppointment')}
                                        locale={locale}
                                    />
                                </div>
                                <div className="w-full md:w-1/2 h-[400px] relative overflow-hidden shadow-xl">
                                    <ImageComparison
                                        imageBefore={item.imageBefore}
                                        imageAfter={item.imageAfter}
                                        alt={item.title}
                                    />
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </section>
        ))}
        <Footer locale={locale} />
    </main>
);
```

Nota: `ServiceButton` puede seguir usando sus propios colores internos (no listado en los files de este task); si al verificar visualmente en Step 4 se ve con los colores navy/gold viejos, es un hallazgo a corregir en Task 8 (copy/QA), no bloquea este task.

- [ ] **Step 2: Reescribir `about/page.tsx` sin `PageHeader`**

Reemplazar el `return` de `src/app/[locale]/about/page.tsx` (quitar import de `PageHeader`):

```typescript
return (
    <main className="flex min-h-screen flex-col">
        <Navigation locale={locale} />

        <section className="bg-slipway pt-40 pb-16 px-4 text-center">
            <h1 className="text-heading-1 text-gelcoat">{t('title')}</h1>
        </section>

        <section className="bg-gelcoat py-20 px-4">
            <div className="container mx-auto max-w-4xl">
                <p className="text-body text-slipway/80 text-lg leading-relaxed mb-6">
                    {t('p1')}
                </p>
                <p className="text-body text-slipway/80 text-lg leading-relaxed mb-6">
                    {t('p2')}
                </p>
            </div>
        </section>

        <section className="bg-slipway py-20 px-4">
            <div className="container mx-auto max-w-3xl text-center">
                <blockquote className="text-heading-3 text-gelcoat italic">
                    &ldquo;{t('quote')}&rdquo;
                </blockquote>
            </div>
        </section>

        <Footer locale={locale} />
    </main>
);
```

- [ ] **Step 3: Reescribir `contact/page.tsx` sin `PageHeader`**

En `src/app/[locale]/contact/page.tsx`, quitar el import de `PageHeader` y reemplazar el bloque de apertura:

```typescript
<main className="flex min-h-screen flex-col">
    <Navigation locale={locale} />

    <section className="bg-slipway pt-40 pb-16 px-4 text-center">
        <h1 className="text-heading-1 text-gelcoat">{t('headerTitle')}</h1>
    </section>

    <section className="bg-gelcoat">
        <div className="container mx-auto px-4 py-20">
```

(mantener el resto del JSX de la sección de contacto sin cambios de estructura; solo asegurar que el `</section>` de cierre correspondiente se añade al final de este bloque, antes de `<Footer locale={locale} />`).

- [ ] **Step 4: Verificar visualmente las tres páginas**

Run: `npm run dev`, abrir `/en/services`, `/en/about`, `/en/contact`. Confirmar que ninguna usa ya `hero.png` como banner y que cada una alterna slipway/gelcoat.

- [ ] **Step 5: Confirmar que `PageHeader` ya no se importa en ningún lado, y borrarlo**

Run: `grep -rn "PageHeader" src/`
Expected: cero resultados. Entonces:
```bash
git rm src/components/PageHeader.tsx
```

- [ ] **Step 6: Typecheck, lint y build de export**

Run: `npx tsc --noEmit && npm run lint && npm run build:publish`
Expected: build estático completo sin errores (confirma que `generateStaticParams` sigue intacto en las tres rutas).

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "$(cat <<'EOF'
feat(design): invert sections full-bleed, drop repeated hero banner

Services/About/Contact no longer open with the same hero.png banner
(plan-mejora-diseno.md §7 flagged this as reading like a placeholder).
Each page now alternates slipway/gelcoat full-bleed sections instead,
echoing the before/after gesture at page scale (§4). PageHeader.tsx
is now unused everywhere and is removed.
EOF
)"
```

---

## Task 8: Reemplazar "Fleet — Coming Soon" por "Trabajos recientes"; retirar `FeaturedServices` del gold/navy antiguo

**Files:**
- Create: `src/components/RecentWork.tsx`
- Modify: `src/app/[locale]/page.tsx`
- Modify: `src/components/FeaturedServices.tsx`
- Modify: `messages/en.json` (nuevo namespace `RecentWork`, sección `Home.inviteTitle`/`inviteText` sin tocar wording aún — eso es Task 9)
- Modify: `messages/es.json` (ídem)

**Interfaces:**
- Consumes: `ImageComparison` (Task 5), tokens (Task 3), tipografía (Task 4). Usa los mismos 5 pares antes/después ya definidos en `services/page.tsx` — no se duplica la lista, se define una constante compartida.
- Produces: nada consumido por tareas posteriores.

- [ ] **Step 1: Extraer la lista de servicios a un módulo compartido**

Create: `src/data/services.ts`

```typescript
export interface ServiceItem {
    title: string;
    id: string;
    imageBefore: string;
    imageAfter: string;
    itemCount: number;
    material: string;
}

export const SERVICES: ServiceItem[] = [
    {
        title: 'Wash Down',
        id: 'washDown',
        imageBefore: '/assets/images/services/wash_down_antes.webp',
        imageAfter: '/assets/images/services/wash_down_despues.webp',
        itemCount: 4,
        material: 'CASCO',
    },
    {
        title: 'Premium Detailed Wash',
        id: 'premiumDetailedWash',
        imageBefore: '/assets/images/services/Detailing_antes.webp',
        imageAfter: '/assets/images/services/Detailing_despues.webp',
        itemCount: 6,
        material: 'GELCOAT',
    },
    {
        title: 'Teak Cleaning & Treatment',
        id: 'teakCleaning',
        imageBefore: '/assets/images/services/Teak_antes.webp',
        imageAfter: '/assets/images/services/Teak_despues.webp',
        itemCount: 3,
        material: 'TECA',
    },
    {
        title: 'Metal Polish',
        id: 'metalPolish',
        imageBefore: '/assets/images/services/metal_polish_antes.webp',
        imageAfter: '/assets/images/services/metal_polish_despues.webp',
        itemCount: 3,
        material: 'ACERO',
    },
    {
        title: 'Engine Room Care',
        id: 'engineRoomCare',
        imageBefore: '/assets/images/services/engine_room_antes.webp',
        imageAfter: '/assets/images/services/engine_room_despues.webp',
        itemCount: 3,
        material: 'SALA DE MÁQUINAS',
    },
];
```

- [ ] **Step 2: Actualizar `services/page.tsx` para usar el módulo compartido**

En `src/app/[locale]/services/page.tsx`, quitar la declaración local `const itemsServices = [...]` y el objeto `MATERIAL_EYEBROW` (creado en Task 7), y en su lugar:
```typescript
import { SERVICES } from '@/data/services';
```
Reemplazar toda referencia a `itemsServices` por `SERVICES`, y `MATERIAL_EYEBROW[item.id]` por `item.material`.

- [ ] **Step 3: Crear `RecentWork.tsx`**

```typescript
'use client';
import { useTranslations } from 'next-intl';
import { SERVICES } from '@/data/services';
import ImageComparison from './ImageComparison';

export default function RecentWork() {
    const t = useTranslations('RecentWork');
    const tServices = useTranslations('Services');

    return (
        <section className="bg-slipway py-24 border-t border-gelcoat/5">
            <div className="container mx-auto px-4 max-w-7xl">
                <span className="text-eyebrow block mb-4">{t('eyebrow')}</span>
                <h2 className="text-heading-1 text-gelcoat mb-16 max-w-2xl">{t('title')}</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {SERVICES.map((item) => (
                        <div key={item.id} className="flex flex-col gap-4">
                            <div className="relative h-[280px] overflow-hidden">
                                <ImageComparison
                                    imageBefore={item.imageBefore}
                                    imageAfter={item.imageAfter}
                                    alt={item.title}
                                />
                            </div>
                            <div className="flex items-baseline gap-3">
                                <span className="text-eyebrow">{item.material}</span>
                                <h3 className="text-heading-3 text-gelcoat">
                                    {tServices(`items.${item.id}.description`)}
                                </h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
```

- [ ] **Step 4: Añadir el namespace `RecentWork` a los mensajes**

En `messages/en.json`, añadir un namespace nuevo al nivel raíz (junto a `Home`, `Footer`, etc.):
```json
"RecentWork": {
    "eyebrow": "Recent Work",
    "title": "Real vessels, real materials, treated this month."
}
```

En `messages/es.json`:
```json
"RecentWork": {
    "eyebrow": "Trabajos Recientes",
    "title": "Embarcaciones reales, materiales reales, tratados este mes."
}
```

- [ ] **Step 5: Reemplazar el placeholder Fleet en `page.tsx`**

En `src/app/[locale]/page.tsx`, quitar el bloque:
```typescript
{/* Placeholder for other sections */}
<div id="fleet" ...>...</div>
```
y el import no usado si aplica; añadir:
```typescript
import RecentWork from '@/components/RecentWork';
```
y en el JSX, entre `<FeaturedServices />` y `<Footer locale={locale} />`:
```typescript
<RecentWork />
```

- [ ] **Step 6: Reestilizar `FeaturedServices.tsx` a los tokens nuevos**

En `src/components/FeaturedServices.tsx`, reemplazar cada clase con `navy`/`gold` por su equivalente:
- `bg-navy` → `bg-gelcoat`, y `from-navy via-[#07101e] to-navy` (línea 13) → `from-gelcoat via-white to-gelcoat`
- `text-gold` → `text-teak`
- `text-white`, `text-white/70` → `text-slipway`, `text-slipway/70`
- `border-gold/50`/`border-gold/30` → `border-teak/40`
- `hover:bg-gold hover:text-navy` → `hover:bg-teak hover:text-gelcoat`
- El texto fijo `"Excellence"` (línea 27) reemplazarlo por `t('featuredEyebrow')` — añadir esa clave a `Home` en ambos JSON: `"featuredEyebrow": "Excellence"` (en) / `"featuredEyebrow": "Excelencia"` (es). (Esto también resuelve un hardcode de idioma preexistente que rompía la paridad en la versión `es`.)

Esta sección queda como la única en tema `gelcoat` (claro) dentro del home, completando la alternancia slipway → gelcoat → slipway de §4.

- [ ] **Step 7: Verificar visualmente el home completo**

Run: `npm run dev`, abrir `/en/` y `/es/`. Confirmar la alternancia Hero(oscuro) → FeaturedServices(claro) → RecentWork(oscuro) → Footer(oscuro), y que los 5 pares antes/después de `RecentWork` cargan y son arrastrables.

- [ ] **Step 8: Typecheck, lint, build**

Run: `npx tsc --noEmit && npm run lint && npm run build:publish`
Expected: sin errores.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "$(cat <<'EOF'
feat(home): replace Fleet placeholder with real recent-work gallery

"Fleet — Coming Soon" was off-message (the company services other
people's yachts, it doesn't have a fleet) and Stats.tsx's numbers
were unverifiable placeholders, so per plan-mejora-diseno.md §11 the
component stays deleted (Task 2) rather than being wired up. This
adds RecentWork.tsx instead, reusing the same 5 before/after pairs
already shown on the services page via a new shared src/data/services.ts
module. Also migrates FeaturedServices.tsx off the retired navy/gold
classes and fixes a hardcoded English "Excellence" eyebrow that had
no Spanish equivalent.
EOF
)"
```

---

## Task 9: Navigation y Footer al sistema nuevo

**Files:**
- Modify: `src/components/Navigation.tsx`
- Modify: `src/components/Footer.tsx`

**Interfaces:**
- Consumes: tokens de Task 3, tipografía de Task 4. Sin cambios de props/interfaz pública en ninguno de los dos componentes.

- [ ] **Step 1: Migrar clases de color en `Navigation.tsx`**

En `src/components/Navigation.tsx`, reemplazar:
- `bg-navy/85` → `bg-slipway/85`
- `from-navy/50` → `from-slipway/50`
- `bg-navy` (línea 72, menú móvil) → `bg-slipway`
- `bg-navy/98` (overlay móvil) → `bg-slipway/98`
- `hover:text-gold` (×3) → `hover:text-teak`
- `hover:border-gold/50` → `hover:border-teak/50`
- `bg-gold` (línea divisor activo) → `bg-teak`
- `border-gold/40` → `border-teak/40`
- `hover:bg-gold hover:text-navy` → `hover:bg-teak hover:text-slipway`
- `text-gold` (botón idioma móvil) → `text-teak`
- clases `font-serif` en los links del menú móvil (línea 135) → quitar (el sans Archivo ya es el default via `--font-sans`; per spec §3 no queda serif en UI/nav)

- [ ] **Step 2: Migrar clases de color en `Footer.tsx`**

En `src/components/Footer.tsx`, reemplazar:
- `bg-navy` → `bg-slipway`
- `border-gold/10` → `border-teak/10`
- `bg-gold/5` (glow) → `bg-teak/5`
- `via-gold/60`, `via-gold/30`, `from-gold/60` (divisor) → equivalentes con `teak`
- `text-gold/80` → `text-chalk`
- `border-gold/30` → `border-teak/30`
- `text-gold` (iconos) → `text-teak`
- `group-hover:bg-gold group-hover:text-navy group-hover:border-gold` → `group-hover:bg-teak group-hover:text-slipway group-hover:border-teak`
- `hover:shadow-[0_0_20px_rgba(212,175,55,0.3)]` → `hover:shadow-[0_0_20px_rgba(192,138,74,0.3)]` (mismo efecto, color teak)
- `drop-shadow-[0_0_20px_rgba(212,175,55,0.15)]` (logo) → `drop-shadow-[0_0_20px_rgba(192,138,74,0.15)]`
- `border-gold/30` (headers de columna) → `border-teak/30`
- `text-white/90` → `text-gelcoat/90`
- `hover:text-white` (links) → `hover:text-gelcoat`
- `text-white/40` (copyright) → `text-chalk/60`

- [ ] **Step 3: Verificar visualmente nav y footer en todas las páginas**

Run: `npm run dev`, recorrer `/en/`, `/en/about`, `/en/services`, `/en/contact` y confirmar que el nav (fijo, con scroll) y el footer usan consistentemente slipway/teak/gelcoat/chalk, sin restos de `navy`/`gold`.

- [ ] **Step 4: Grep de residuos de la paleta vieja**

Run: `grep -rn "bg-navy\|text-navy\|border-navy\|bg-gold\|text-gold\|border-gold\|navy-light\|gold-light\|gold-dark" src/`
Expected: cero resultados (fuera de comentarios, si los hay). Si aparece algo, corregirlo antes de continuar.

- [ ] **Step 5: Typecheck, lint, build**

Run: `npx tsc --noEmit && npm run lint && npm run build:publish`
Expected: sin errores.

- [ ] **Step 6: Commit**

```bash
git add src/components/Navigation.tsx src/components/Footer.tsx
git commit -m "$(cat <<'EOF'
feat(design): migrate Navigation and Footer to slipway/teak palette

Last two components still referencing the retired navy/gold classes.
Also drops font-serif from the mobile nav menu items — per
plan-mejora-diseno.md §3 nothing in UI/nav uses the serif family.
EOF
)"
```

---

## Task 10: Copy — titulares, alt-text de imágenes, y limpieza de placeholders de la sección de contacto

**Files:**
- Modify: `messages/en.json`
- Modify: `messages/es.json`
- Modify: `src/app/[locale]/contact/page.tsx` (headings hardcoded en inglés → traducidos)
- Modify: `src/app/[locale]/services/page.tsx` (alt de `ImageComparison` ya usa `item.title` en inglés — cambiar a texto localizado)

**Interfaces:**
- Consumes: namespaces `Home`, `About`, `Contact` existentes.

- [ ] **Step 1: Actualizar titulares de Home en `messages/en.json`**

Reemplazar:
```json
"title": "Luxury Yachting Redefined",
"subtitle": "Premium yacht maintenance in Miami",
```
por:
```json
"title": "Every Surface, Restored",
"subtitle": "Gelcoat, teak, steel, and engine rooms — each with its own process.",
```
Y reemplazar `"inviteText"`:
```json
"inviteText": "Experience the ultimate care for your yacht. Our team is dedicated to providing premium washing, detailing, and protection services that ensure your vessel maintains its flawless appearance.",
```
por:
```json
"inviteText": "Gelcoat, teak, steel, and engine rooms. Each surface gets its own process, not a one-size wash.",
```

- [ ] **Step 2: Mismos cambios en `messages/es.json`**

Reemplazar:
```json
"title": "Lujo Náutico Redefinido",
"subtitle": "Mantenimiento de yates premium en Miami",
```
por:
```json
"title": "Cada Superficie, Restaurada",
"subtitle": "Gelcoat, teca, acero y sala de máquinas — cada uno con su propio proceso.",
```
Y `"inviteText"`:
```json
"inviteText": "Experimente el cuidado definitivo para su yate. Nuestro equipo se dedica a proporcionar servicios premium de lavado, detallado y protección, asegurando que su embarcación mantenga una apariencia impecable.",
```
por:
```json
"inviteText": "Gelcoat, teca, acero y sala de máquinas. Cada superficie tiene su propio proceso, no un lavado genérico.",
```

- [ ] **Step 3: Reemplazar la cita de `About` (retirar el eslogan genérico, per spec §8)**

En `messages/en.json`, dentro de `"About"`, reemplazar:
```json
"quote": "Your satisfaction isn't just our goal—it's our promise."
```
por:
```json
"quote": "Every vessel we detail, the owner can inspect the difference themselves — before we ask for a review."
```

En `messages/es.json`:
```json
"quote": "Su satisfacción no es solo nuestro objetivo, es nuestra promesa."
```
por:
```json
"quote": "En cada embarcación que tratamos, el propietario puede verificar la diferencia por sí mismo — antes de pedirle una reseña."
```

- [ ] **Step 4: Añadir claves para los headings hardcoded de `Contact` y usarlas**

En `messages/en.json`, dentro de `"Contact"`, añadir:
```json
"formTitle": "Send Us a Message",
"infoTitle": "Contact Information",
"hoursLabel": "Mon-Sun, 9am - 8pm",
"phoneLabel": "Phone",
"emailLabel": "Email",
"locationLabel": "Location",
"locationValue": "South Florida",
"locationDetail": "Miami, Miami Beach, Fort Lauderdale"
```

En `messages/es.json`, dentro de `"Contact"`:
```json
"formTitle": "Envíanos un Mensaje",
"infoTitle": "Información de Contacto",
"hoursLabel": "Lun-Dom, 9am - 8pm",
"phoneLabel": "Teléfono",
"emailLabel": "Email",
"locationLabel": "Ubicación",
"locationValue": "South Florida",
"locationDetail": "Miami, Miami Beach, Fort Lauderdale"
```

En `src/app/[locale]/contact/page.tsx`, reemplazar los literales hardcoded:
- `"Send Us a Message"` → `{t('formTitle')}`
- `"Contact Information"` → `{t('infoTitle')}`
- `"Mon-Sun, 9am - 8pm"` → `{t('hoursLabel')}`
- `"Phone"` → `{t('phoneLabel')}`
- `"Email"` → `{t('emailLabel')}`
- `"Location"` → `{t('locationLabel')}`
- `"South Florida"` → `{t('locationValue')}`
- `"Miami, Miami Beach, Fort Lauderdale"` → `{t('locationDetail')}`

- [ ] **Step 5: Localizar el `alt` de `ImageComparison` en la página de servicios**

En `src/data/services.ts` (creado en Task 8), el campo `title` sigue en inglés a propósito (se usa como slug del `id` de sección vía `.toLowerCase()`). Para el `alt`, en `src/app/[locale]/services/page.tsx`, en vez de pasar `alt={item.title}` a `ImageComparison`, pasar `alt={t(\`items.${item.id}.description\`)}` (la descripción ya está traducida en ambos JSON y es más descriptiva que el título en inglés, cumpliendo el piso de calidad §10 sobre `alt` descriptivo real). Aplicar el mismo cambio en `src/components/RecentWork.tsx` (Task 8) si allí también se usaba `item.title`.

- [ ] **Step 6: Verificar en ambos idiomas**

Run: `npm run dev`, recorrer `/en/` y `/es/` completos (home, about, services, contact) confirmando que no queda texto hardcoded en un solo idioma.

Run: `grep -rn '"Send Us a Message"\|"Contact Information"\|"Mon-Sun\|"South Florida"' src/app/`
Expected: cero resultados (ya migrado a `t(...)`).

- [ ] **Step 7: Typecheck, lint, build**

Run: `npx tsc --noEmit && npm run lint && npm run build:publish`
Expected: sin errores.

- [ ] **Step 8: Commit**

```bash
git add messages/en.json messages/es.json src/app/[locale]/contact/page.tsx src/app/[locale]/services/page.tsx src/components/RecentWork.tsx
git commit -m "$(cat <<'EOF'
content: replace generic luxury copy with material-specific language

Per plan-mejora-diseno.md §8: headline and invite copy now name the
actual surfaces treated (gelcoat/teak/steel/engine room) instead of
interchangeable luxury adjectives, and the unverifiable satisfaction
slogan on About is replaced with a verifiable claim. Also localizes
four Contact page headings that were hardcoded in English only (no
Spanish equivalent existed), and switches ImageComparison alt text
from the English service title to the localized description so
screen reader users get real content in their own locale.
EOF
)"
```

---

## Task 11: Verificación final y actualización de `CHANGELOG.md`

**Files:**
- Create: `CHANGELOG.md` (no existe actualmente en el repo)

**Interfaces:**
- Consumes: nada.

- [ ] **Step 1: Build de producción completo**

Run: `npm run build:publish`
Expected: export estático completo en `out/`, sin errores ni warnings de rutas faltando `generateStaticParams`.

- [ ] **Step 2: Verificar tamaño total de `out/`**

Run: `du -sh out/`
Expected: sensiblemente menor que antes de Task 1 (10 imágenes de servicio pasaron de ~40MB combinados a <4MB, más ~18MB borrados en Task 2).

- [ ] **Step 3: Recorrido manual final en el navegador — checklist del piso de calidad (§10)**

Run: `npm run dev` y para cada página (`/en/` y `/es/`, `about`, `services`, `contact`):
- Responsive a 375px sin overflow horizontal.
- Foco de teclado visible (anillo `teak`) en nav, CTA del hero, y sliders.
- Sliders operables con flechas de teclado.
- `prefers-reduced-motion` respetado en el hero.
- Ningún `alt` genérico "before"/"after" — confirmado en Task 10.

- [ ] **Step 4: Crear `CHANGELOG.md`**

```markdown
# Changelog

All notable changes to this project are documented in this file.

## [Unreleased]

### Added
- Real before/after reveal hero replacing the parallax stock photo.
- `RecentWork` section on the home page, replacing the "Fleet — Coming Soon" placeholder.
- Keyboard control (arrow keys) and visible focus ring on the before/after slider.

### Changed
- Full color palette: `slipway`/`bilge`/`chalk`/`gelcoat`/`teak`/`teak-deep` replace `navy`/`gold`.
- Typography: Archivo (variable) + Source Serif 4 replace Playfair Display + Inter.
- Services, About, and Contact pages no longer open with the repeated `hero.png` banner; sections alternate full-bleed dark/light instead.
- Home and About copy rewritten to name actual materials/processes instead of generic luxury language.
- Contact page headings and slider alt text fully localized (en/es).

### Fixed
- `FeaturedServices` "Excellence" eyebrow was hardcoded in English on the Spanish site; now localized.

### Removed
- Unused `Stats.tsx` component (numbers were unverifiable placeholders).
- `.text-gradient-gold` utility (gold accent retired from the palette).
- `PageHeader.tsx` (superseded by full-bleed section headers).
- Orphaned assets: `yateClear.png`, `yateError.png`, and the `create-next-app` boilerplate SVGs.

### Performance
- Service before/after images compressed from up to 11.4MB to under ~400KB each.
```

- [ ] **Step 5: Commit**

```bash
git add CHANGELOG.md
git commit -m "$(cat <<'EOF'
docs: add CHANGELOG.md for the antes/después redesign

Per .agents/skills/changelog/SKILL.md — summarizes the full redesign
from plan-mejora-diseno.md under [Unreleased].
EOF
)"
```

---

## Self-Review Notes

- **Cobertura del spec:** §1 tesis → Tasks 6/8 (hero + RecentWork). §2 color → Task 3. §3 tipografía → Task 4. §4 estructura/inversión → Tasks 6/7/8. §5 revelación → Tasks 5/6. §6 motion → Tasks 5/6 (reduced-motion), eliminación de parallax en Task 6. §7 fotografía → Task 1 (compresión) + Task 7 (`hero.png` fuera de páginas interiores). §8 copy → Task 10. §9 bilingüe → `clamp()` en Task 4, prueba a 375px en Tasks 6 y 11. §10 piso de calidad → distribuido en Tasks 5 (teclado/foco), 10 (alt), 11 (checklist final). §11 inacabado → Tasks 2 (SVGs/assets/`.text-gradient-gold`), 8 (Fleet/Stats), 7 (`hero.png` en interiores).
- **Orden:** sigue literalmente la secuencia de §12 del spec (compresión → borrado → color → tipografía → inversión → hero → servicios → Fleet/Stats → copy), con Task 9 (nav/footer) insertada entre inversión y Fleet porque nav/footer aparecen en todas las páginas y conviene resolverlos antes de hacer el recorrido de QA final, y Task 11 (verificación + changelog) al cierre.
- **Riesgo no mitigable por este plan:** §13 nota que la dirección puede leerse "fría"; eso es una decisión de diseño ya tomada en el spec, no algo que este plan de implementación pueda resolver — si tras Task 11 se percibe demasiado austero, el ajuste (subir presencia de `teak`) es un task adicional fuera de este plan.
