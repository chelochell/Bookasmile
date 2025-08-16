import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { swaggerUI } from '@hono/swagger-ui'
import { openApiSpec } from '@/docs/openapi'
import { AuthType } from '@/auth'
import authRoutes from '@/server/routes/authRoutes'
import testRoutes from '@/server/routes/testRoutes'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// Mount under /api so routes are available as /api/*
const app = new Hono<{ Variables: AuthType }>({
    strict: false,
}).basePath('/api')

// Middlewares
app.use('*', logger())
app.use('*', cors())

app.route('/', authRoutes)
app.route('/test', testRoutes)

// Example routes
app.get('/health', (c) => c.json({ status: 'ok' }))
app.get('/hello/:name', (c) => c.json({ message: `Hello, ${c.req.param('name')}!` }))

// Swagger UI and OpenAPI JSON
app.get('/docs', swaggerUI({
    title: 'Book A Smile API Docs',
    url: '/api/openapi.json',
}))
app.get('/openapi.json', (c) => c.json(openApiSpec))

// Export handlers for Next.js App Router
export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)
export const OPTIONS = handle(app)
