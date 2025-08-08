export const openApiSpec = {
  openapi: '3.1.0',
  info: {
    title: 'Book A Smile API',
    version: '1.0.0',
    description: 'OpenAPI specification for the Book A Smile API.',
  },
  servers: [
    { url: 'http://localhost:3000', description: 'Local' },
    { url: 'https://book-a-smile.ph', description: 'Production' },
  ],
  paths: {
    '/api/health': {
      get: {
        summary: 'Health check',
        responses: {
          '200': {
            description: 'Service is up',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'ok' },
                  },
                  required: ['status'],
                },
              },
            },
          },
        },
      },
    },
    '/api/hello/{name}': {
      get: {
        summary: 'Greet a user by name',
        parameters: [
          {
            name: 'name',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          '200': {
            description: 'Greeting returned',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string', example: 'Hello, Jane!' },
                  },
                  required: ['message'],
                },
              },
            },
          },
        },
      },
    },
  },
  components: {},
} as const

export type OpenApiSpec = typeof openApiSpec
