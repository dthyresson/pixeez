// See https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/constructor
// for options.

import { PrismaClient } from '@prisma/client'

import { emitLogLevels, handlePrismaLogging } from '@redwoodjs/api/logger'
import { storagePrismaExtension } from './uploads'

import { logger } from './logger'
import { newId, prefixes } from './uuid'

const prismaClient = new PrismaClient({
  log: emitLogLevels(['info', 'warn', 'error']),
})

handlePrismaLogging({
  db: prismaClient,
  logger,
  logLevels: ['info', 'warn', 'error'],
})

const prismaClientWithNewId = prismaClient.$extends({
  query: {
    $allOperations({ model, operation, args, query }) {
      if (operation === 'create') {
        const prefix = model.toLowerCase() as keyof typeof prefixes
        args.data = { ...args.data, id: newId(prefix) }
      } else if (operation === 'createMany') {
        const prefix = model.toLowerCase() as keyof typeof prefixes
        args.data = args.data.map((item) => ({
          ...item,
          id: newId(prefix),
        }))
      }
      return query(args)
    },
  },
})

/**
 * Global Prisma client extensions should be added here, as $extend
 * returns a new instance.
 * export const db = prismaClient.$extend(...)
 * Add any .$on hooks before using $extend
 */
export const db = prismaClientWithNewId.$extends(storagePrismaExtension)
