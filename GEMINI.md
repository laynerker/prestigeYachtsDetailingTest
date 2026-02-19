# Prestige Yachts Detailing - Web Project

## Project Overview
This is the web frontend for **Prestige Yachts Detailing**, a luxury yacht detailing and rental service based in Miami. The application is built with **Next.js 16** (App Router) and **React 19**, focusing on a premium, high-end aesthetic.

### Key Technologies
- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Internationalization:** [next-intl](https://next-intl-docs.vercel.app/) (Supports English `en` and Spanish `es`)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/) with PostCSS
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Deployment:** [Fly.io](https://fly.io/) via Docker

## Project Structure
- `src/app/[locale]/`: Contains the localized application routes.
- `src/components/`: Reusable UI components (Hero, Navigation, Footer, etc.).
- `src/i18n/`: Internationalization configuration.
- `messages/`: JSON translation files for `en` and `es`.
- `public/assets/`: Static assets including images and logos.

## Building and Running

### Development
To start the development server:
```bash
npm run dev
```
The application will be available at `http://localhost:3000`.

### Production Build
To create an optimized production build:
```bash
npm run build
```
Note: In production mode (`NODE_ENV=production`), the project is configured for **Static Site Generation (SSG)** via `output: 'export'` in `next.config.mjs`.

### Linting
To run ESLint:
```bash
npm run lint
```

## Development Conventions

### Internationalization (i18n)
- All user-facing text must be internationalized using `next-intl`.
- Messages are located in `messages/en.json` and `messages/es.json`.
- Use the `useTranslations` hook in client components and `getTranslations` in server components.

### Styling
- Use **Tailwind CSS 4** utility classes for styling.
- Follow the established design system:
  - **Colors:** `navy`, `gold`, `white`.
  - **Fonts:** `Inter` (sans-serif) and `Playfair Display` (serif).
- For complex class merging, use the `cn` utility pattern (combination of `clsx` and `tailwind-merge`).

### Components
- Prefer **Server Components** by default.
- Use `'use client'` only when necessary (state, effects, event listeners).
- Animations should be implemented using `framer-motion`.

### Static Exports
- The project uses `output: 'export'`. Ensure all dynamic routes have `generateStaticParams` defined.
- Images are currently `unoptimized: true` in `next.config.mjs` to support static export.

## Agent Skills

The following specialized skills are available in this project to enhance development and design workflows:

- **`brainstorming`**: MUST be used before any creative work, feature creation, or behavior modification to explore intent and requirements.
- **`interface-design`**: Used for designing high-quality, interactive products and dashboards (not for marketing landing pages).
- **`vercel-react-best-practices`**: Provides performance optimization guidelines for React and Next.js from Vercel Engineering.
