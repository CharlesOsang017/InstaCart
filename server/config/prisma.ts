import 'dotenv/config'
import { neonConfig } from '@neondatabase/serverless'
import { PrismaNeon } from '@prisma/adapter-neon'
import { PrismaClient } from '../generated/prisma/client.js'
import ws from 'ws'

neonConfig.webSocketConstructor = ws

const connectionString = `${process.env.DATABASE_URL}`

// In Prisma 7, PrismaNeon is a factory that takes the connection config.
// The factory will create the Pool internally when needed.
const adapter = new PrismaNeon({ connectionString })

export const prisma = new PrismaClient({ adapter })