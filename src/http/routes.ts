import type { FastifyInstance } from 'fastify'
import { register } from './controllers/register'

export async function appRouter(app: FastifyInstance) {
  app.post('/users', register)
}
