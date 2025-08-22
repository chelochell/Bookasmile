---
trigger: model_decision
description: Apply this rule when coding on frontend components, hooks, styling, and client side code
---

Windsurf Frontend Rules - Book A Smile

General Code Style & Formatting
- Follow the Airbnb Style Guide for code formatting
- Use PascalCase for React component file names (e.g., UserCard.tsx, not user-card.tsx)
- Prefer named exports for components

Project Structure & Architecture
- Follow Next.js patterns and use the App Router
- Correctly determine when to use server vs. client components in Next.js

Component Organization & Frontend Modularization
- Use atomic design organization for component structure (atoms → organisms → pages)
- Break down complex frontend features into smaller, reusable, modular components
- Keep components focused on single responsibilities
- Organize by feature when components become domain-specific

Styling & UI
- Use Tailwind CSS for styling
- Use Shadcn UI for components

Data Fetching & Forms
- Use TanStack Query (react-query) for frontend data fetching
- Use React Hook Form for form handling
- Use Zod for validation

State Management & Logic
- Use React Context for state management

Backend & Database
- Use Prisma for database access