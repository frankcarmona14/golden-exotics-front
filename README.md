# Carhive

> **Warning**
> This project is a work in progress and may not function consistently. It is primarily a testing demo created for educational purposes and to explore new technologies.

![carhive](https://github.com/user-attachments/assets/5e4cdffe-dcd0-44ee-957d-66fdb82b47ee)

## Features

- Dynamic Routing
- **Server Components** and **Server Actions**
- **Loading UI** and **Streaming with Suspense** for a smoother user experience
- SEO-friendly metadata
- Fully responsive design
- Styled with **Tailwind CSS**
- UI components built with **Shadcn/ui**
- Interactive maps using **Leaflet**
- **Medusa JS (v2.13+)** como backend de e-commerce (productos, regiones, auth, pagos)
- Datos mock para ver el frontend sin base de datos
- Image Management through **Cloudinary**
- **Stripe** integration for payment processing (también compatible con Medusa Payment)
- Written in **TypeScript**

## Requirements

- Node.js (v18+)
- `pnpm` as the package manager

## Prerequisites

- [Cloudinary](https://cloudinary.com/) para imágenes (opcional si usas solo mock)
- [Stripe](https://stripe.com/) para pagos en el storefront (opcional)
- **Medusa backend (v2.13+)** cuando quieras usar productos/regiones/auth desde Medusa

## Running the Project Locally

1. Install dependencies:

```bash
pnpm install
```

2. Set up environment variables:

- Copy `.env.example` to `.env` and fill in the variables you need.
- Para solo ver el frontend con **datos mock**, no hace falta base de datos ni Medusa.
- Para conectar con **Medusa**:
  - Crea un proyecto Medusa (ej. `npx create-medusa-app@latest`) y arranca el backend en `http://localhost:9000`.
  - En Medusa Admin → Settings → Publishable API Keys, crea una clave y ponla en `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`.
  - En `.env`: `NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000`.

3. Start the development server:

```bash
pnpm dev
```

El frontend usa **datos mock** (coches y ubicaciones en `data/mock-data.ts`) hasta que integres los datos desde Medusa en los repositorios (`db/queries/`).

## Medusa JS integration

- **SDK**: `@medusajs/js-sdk` y `@medusajs/types` (v2.13+).
- **Config**: `lib/medusa/sdk.ts` (baseUrl, publishableKey, auth tipo session).
- **Store**: `lib/medusa/store.ts` expone `getMedusaProducts`, `getMedusaProductById`, `getMedusaRegions`, e `isMedusaConfigured()`.
- Cuando tengas el backend Medusa listo, puedes hacer que `db/queries/car-repository.ts` y `location-repository.ts` usen estos métodos (mapeando Product → coche, Region → ubicación) en lugar de los datos mock.

## Docs

- [Medusa Docs](https://docs.medusajs.com/)
- [Storefront + Medusa](https://docs.medusajs.com/resources/storefront-development)
- [JS SDK](https://docs.medusajs.com/resources/js-sdk)
