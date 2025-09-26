# Job Board AI - Copilot Instructions

## Architecture Overview

This is a **Next.js 15 App Router** job board application with AI-powered search, built with TypeScript and using PostgreSQL with Drizzle ORM.

### Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, Tailwind CSS, shadcn/ui
- **Authentication**: Clerk with middleware-based protection
- **Database**: PostgreSQL with Drizzle ORM (schema-first approach)
- **AI/Search**: Anthropic (Claude) and Google Gemini APIs
- **Background Jobs**: Inngest for async processing
- **Email**: Resend with React Email templates
- **File Uploads**: UploadThing
- **Forms**: React Hook Form with Zod validation

## Project Structure Patterns

### Feature-Based Organization

```
src/features/{feature}/
  ├── actions/          # Server actions with schemas
  ├── components/       # Feature-specific React components
  ├── db/              # Database queries and operations
  └── lib/             # Feature utilities and helpers
```

### Route Groups & Layouts

- `(clerk)/` - Authentication pages (sign-in, organizations)
- `(job-seeker)/` - Job seeker dashboard with parallel routing (`@sidebar`)
- `employer/` - Employer-specific pages

### Schema Organization

- `src/drizzle/schema/` - Split by entity (user.ts, jobListing.ts, etc.)
- `src/drizzle/schemaHelpers.ts` - Common fields (id, createdAt, updatedAt)
- All schemas export types and enums for consistent type safety

## Key Development Patterns

### Server Actions Convention

```typescript
// features/{feature}/actions/actions.ts
'use server';
// Always import schemas from same directory
import { featureSchema } from './schemas';
// Get current auth context
import {
  getCurrentUser,
  getCurrentOrganization,
} from '@/services/clerk/lib/getCurrentAuth';
```

### Database Operations

- Use feature-specific DB files: `features/{feature}/db/{feature}.ts`
- Leverage data caching with tags: `getGlobalTag()`, `getIdTag()`, `getOrganizationTag()`
- Common pattern: `insertFeature()`, `updateFeature()`, `deleteFeature()` functions

### Environment Variables

- Server vars in `src/data/env/server.ts` using `@t3-oss/env-nextjs`
- Client vars in `src/data/env/client.ts`
- Always use `env.VARIABLE_NAME` instead of `process.env`

### Authentication Integration

- Middleware in `src/middleware.ts` protects routes with `createRouteMatcher()`
- Public routes: `["/sign-in(.*)", "/", "/api(.*)", "/job-listings(.*)", "/ai-search"]`
- Use `getCurrentUser()` and `getCurrentOrganization()` in server actions

## Development Workflow

### Database Management

```bash
npm run db:generate    # Generate migrations from schema changes
npm run db:push       # Push schema to database (dev)
npm run db:migrate    # Run migrations (production)
npm run db:studio     # Open Drizzle Studio
```

### Background Jobs

```bash
npm run inngest       # Start Inngest dev server
```

### Email Development

```bash
npm run email         # Preview email templates at localhost:3001
```

### Dev Server

```bash
npm run dev          # Uses Turbopack for faster builds
```

## Component Patterns

### UI Components

- Use shadcn/ui components from `src/components/ui/`
- Custom components in `src/components/` (ActionButton, LoadingSpinner, etc.)
- Data tables use `@tanstack/react-table` with custom DataTable components

### Sidebar Navigation

- `AppSidebar` with `SidebarNavMenuGroup` for consistent navigation
- Route-specific sidebar content via parallel routing (`@sidebar`)

### Form Handling

- React Hook Form + Zod schemas for validation
- Server actions handle form submissions with automatic revalidation

## Integration Points

### Clerk Authentication

- Custom `ClerkProvider` wrapper supports dark mode theming
- Webhook handling for user/organization sync
- Middleware-based route protection

### AI Search Integration

- Anthropic and Gemini APIs for job search enhancement
- Background processing via Inngest for AI operations

### File Uploads

- UploadThing integration with SSR support
- Upload components wrapped in `UploadThingSSR`

## Common Gotchas

### Next.js 15 Specifics

- Uses `experimental.dynamicIO: true` in next.config.ts
- React 19 with new concurrent features
- App Router with parallel routes (`@sidebar`)

### Database Schema

- All tables use UUID primary keys with `defaultRandom()`
- Timestamps include timezone info and auto-update
- Enums defined in schema files with TypeScript union types

### Caching Strategy

- Data cache tags for granular invalidation
- Feature-specific tag functions in `src/lib/dataCache.ts`
- Server actions automatically revalidate relevant tags

When working on this codebase, always check existing patterns in similar features before creating new implementations.
