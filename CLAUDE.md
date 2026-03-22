# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CFW Headless Frontend - A headless eCommerce frontend built with Astro 5 and React 19. This is a static site that will connect to a ColdFusion backend API.

## Commands

```bash
npm run dev      # Start development server
npm run build    # Build static site to dist/
npm run preview  # Preview production build locally
```

## Architecture

- **Framework**: Astro 5 with React 19 integration
- **Output**: Static site generation (`output: "static"` in astro.config.mjs)
- **TypeScript**: Strict mode, React JSX transform

### Directory Structure

- `src/pages/` - Astro pages (file-based routing)
- `src/components/` - React components (use `client:load` directive for interactivity)

### React in Astro

React components are islands of interactivity. Import them in `.astro` files and add a client directive:
```astro
<ReactComponent client:load />
```

## Deployment

- **Server**: frontend.nucomwebhosting.com
- **Web Server**: Caddy (serves static files from `/var/www/frontend.nucomwebhosting.com/dist`)
- **SSL**: Cloudflare (Full mode, not Strict)
- **CI/CD**: GitHub Actions on push to `main` - builds and deploys via rsync

## Requirements

- Node.js 22+ (see `.nvmrc`)
