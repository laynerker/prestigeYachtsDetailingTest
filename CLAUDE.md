# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Marketing site for **Prestige Yachts Detailing** (Miami yacht detailing/rental). Next.js 16 App Router + React 19 + TypeScript, Tailwind CSS 4, next-intl (en/es), Framer Motion, lucide-react. There is no test suite.

## Commands

```bash
npm run dev            # dev server on :3000 (SSR, middleware active)
npm run build          # production build -> static export in out/
npm run build:publish  # same, with NODE_ENV=production forced
npm run lint           # eslint (flat config, no args — lints the whole project)
npx tsc --noEmit       # typecheck (tsconfig has noEmit; not wired to a script)
```

## Architecture

### Static export is the central constraint

`next.config.mjs` sets `output: 'export'` when `NODE_ENV === 'production'` and `trailingSlash: true`, `images.unoptimized: true`. Every consequence below follows from this:

- **`src/middleware.ts` does not run in production.** It only handles locale routing in `npm run dev`. `public/index.html` is a hand-written meta-refresh/JS redirect from `/` to `/en/` that substitutes for it in the exported site — if root-locale behavior changes, that file must change too.
- Every route segment must supply `generateStaticParams`. `src/app/[locale]/layout.tsx` returns `[{locale:'en'},{locale:'es'}]`; leaf pages inherit it.
- No server actions, no route handlers, no `next/image` optimization. The contact form POSTs to **`/api/contact.php`** (`api/contact.php`, PHPMailer via `api/composer.json`) — a PHP endpoint deployed alongside the static output, not a Next.js API route.
- Anything using `useSearchParams` must be wrapped in `<Suspense>` or the export fails (see `src/components/ContactForm.tsx`).

### i18n

- Locales `en` / `es`, default `en`, declared in **four** places that must stay in sync: `src/middleware.ts`, `src/i18n/request.ts`, `generateStaticParams` and the `notFound()` guard in `src/app/[locale]/layout.tsx`.
- Translations live in `messages/en.json` and `messages/es.json`, keyed by top-level namespace: `Navigation`, `Home`, `Footer`, `About`, `Services`, `Contact`. Both files must be updated together.
- Server pages: `const { locale } = await params; setRequestLocale(locale);` then `await getTranslations('Namespace')`. `setRequestLocale` is required for static rendering — omitting it breaks the export.
- Client components: `useTranslations('Namespace')`, and they receive `locale` as a prop (e.g. `<Navigation locale={locale} />`) since they can't await params.
- Repeated list content is stored as indexed keys (`items.<id>.items.0`, …) and read with a hardcoded `itemCount` in the page — see `src/app/[locale]/services/page.tsx`. Adding a bullet means bumping `itemCount` *and* adding the key in both JSON files.
- Links are built manually as `/${locale}/path`; the language toggle in `Navigation.tsx` rewrites the first path segment.

### Styling

Tailwind 4 via `@import "tailwindcss"` in `src/app/globals.css` — no `tailwind.config.js`. Brand tokens are CSS custom properties in `:root` re-exported through `@theme inline`, so `navy`, `navy-light`, `gold`, `gold-light`, `gold-dark`, `primary`, `secondary`, `muted` are available as Tailwind utilities (`bg-navy`, `border-gold`, …). Add new colors in both the `:root` block and the `@theme inline` block. Fonts: `Inter` (`font-sans`) and `Playfair Display` (`font-serif`) loaded via `next/font/google` in the locale layout. Helpers: `.noise-overlay`, `.text-gradient-gold`.

Path alias `@/*` → `src/*`. Prefer Server Components; `'use client'` only for state/effects/handlers.

## Deployment

Two paths exist:

- **GitHub Pages (active)** — `.github/workflows/nextjs.yml` on push to `master`: `next build` then uploads `./out`.
- **Fly.io** — `.github/workflows/fly-deploy.yml` on push to `main`, using `Dockerfile` + `fly.toml`. This is `fly launch` scaffolding for a *server* deployment (`next start`, `--experimental-build-mode compile/generate`) and is in tension with `output: 'export'`; treat GitHub Pages as the real target unless told otherwise.

## Git conventions

Git-flow style: work on `develop` or `feature/*`, release via `release/x.y.z`, merge to `master` (PRs are opened against `master`).

Commits follow **Conventional Commits** (`.agents/skills/commiter/SKILL.md`): `<type>(scope): <description>` with the title ≤ 50 chars and a **mandatory body** explaining what changed and why.

`.agents/skills/changelog/SKILL.md` asks that `CHANGELOG.md` be created/updated under `[Unreleased]` (`feat`→Added, `fix`→Fixed, `refactor`/`perf`→Changed) and staged with the commit. Note: `CHANGELOG.md` does not currently exist at the repo root.
