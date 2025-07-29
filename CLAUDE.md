# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Nuxt.js 3 application using TypeScript, Tailwind CSS, and shadcn/ui components. The project follows Vue 3 Composition API patterns and uses pnpm as the package manager.

## Development Commands

- **Start development server**: `pnpm dev` (runs on http://localhost:3000)
- **Build for production**: `pnpm build`
- **Preview production build**: `pnpm preview`
- **Generate static site**: `pnpm generate`
- **Lint code**: `pnpm lint`
- **Fix lint issues**: `pnpm lint:fix`
- **Format code**: `pnpm format`
- **Install dependencies**: `pnpm install`

## Architecture

### Framework Stack

- **Nuxt 3**: Vue.js framework with server-side rendering
- **Vue 3**: Frontend framework using Composition API
- **TypeScript**: Type safety throughout the application
- **Tailwind CSS v4**: Utility-first CSS framework via Vite plugin
- **shadcn/ui**: Component library integrated via shadcn-nuxt module

### Project Structure

- `app.vue`: Root application component using NuxtLayout and NuxtPage
- `pages/`: File-based routing (currently has index.vue)
- `components/`: Vue components (shadcn/ui components go in `components/ui/`)
- `assets/css/`: Global styles (tailwind.css imports)
- `server/`: Server-side code with separate tsconfig.json
- `public/`: Static assets

### Configuration

- `nuxt.config.ts`: Main Nuxt configuration with shadcn module and Tailwind Vite plugin
- `eslint.config.js`: ESLint with Nuxt config, Prettier integration, and TypeScript support
- `tsconfig.json`: Extends .nuxt/tsconfig.json for auto-generated types

### Code Quality

- ESLint configured with @nuxt/eslint-config and Prettier integration
- Prettier configured with Tailwind CSS plugin for class sorting
- TypeScript strict mode enabled through Nuxt's configuration
