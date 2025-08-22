---
trigger: model_decision
description: Use this on backend related code when user asks for API, database and server side adjustments
---

Windsurf Backend Rules - Book A Smile

Project Overview
Next.js dental appointment booking application with TypeScript, Prisma, better-auth, and Hono for API routes.

Planning Approach

Before Starting Any Task
1. Understand the request - Read requirements carefully
2. Check existing patterns - Look at similar implementations in the codebase
3. Identify dependencies - What models, services, or components are affected
4. Plan the flow - Frontend → API → Service → Database or vice versa
5. Consider validation - Both client and server-side validation needs
6. Think about error handling - User feedback and error states

Reference Points in Codebase

For API Development
- Controllers: src/server/controllers/appointment.controller.ts - Follow this pattern for new endpoints
- Services: src/server/services/appointment.service.ts - Business logic structure
- Models: src/server/models/appointment.model.ts - Zod schemas and types
- Routes: src/server/routes/appointmentRoutes.ts - Route organization

For Frontend Development
- Pages: src/components/pages/new-appointment-page.tsx - Page component structure
- Organisms: src/components/organisms/upcoming-appointments-card.tsx - Complex component patterns
- Hooks: src/hooks/mutations/useAppointmentMutations.ts - TanStack Query patterns
- API Clients: src/lib/api/appointments.ts - Frontend API calling patterns

For Authentication
- Server Session: src/actions/get-server-session.ts - How to get user session
- Client Auth: src/lib/auth-client.ts - Client-side auth usage
- Auth Config: src/auth.ts - Main authentication setup

For Database Operations
- Prisma Usage: Check any service file for database interaction patterns
- Validation: All model files show Zod schema patterns
- Error Handling: Service files show consistent error response format

Key Principles

File Naming
- Components: PascalCase
- Pages: kebab-case
- Hooks: camelCase with 'use' prefix
- Services: PascalCase with '.service.ts'
- Controllers: kebab-case with '.controller.ts'
- Models: kebab-case with '.model.ts'

Architecture Flow
1. Frontend: Component → Hook → API Client
2. API: Route → Controller → Service → Database
3. Data: Zod Schema → TypeScript Type → Database Model

Consistency Rules
- Always follow existing patterns in similar files
- Use the same error response format across all APIs
- Maintain consistent naming conventions
- Follow the established authentication patterns
- Use TanStack Query for all server state management
- Keep business logic in services, not controllers
- Validate data with Zod schemas at API boundaries

When Adding New Features
1. Start with the data model (Zod schema)
2. Create or update database service methods
3. Build API controller endpoints
4. Create frontend API client functions
5. Build React hooks for data management
6. Create UI components
7. Wire everything together in pages

Reference Documentation
- Check existing implementations before creating new patterns
- Look at the appointment system as the primary reference
- Follow the authentication patterns established in auth files
- Use the same validation and error handling approaches
- Maintain consistency with existing UI component patterns