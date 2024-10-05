// Setup for background jobs. Jobs themselves live in api/src/jobs
// Execute jobs in dev with `yarn rw jobs work`
// See https://docs.redwoodjs.com/docs/background-jobs

import type { PrismaClient } from '@prisma/client'

import { PrismaAdapter, JobManager } from '@redwoodjs/jobs'

import { db } from 'src/lib/db'
import { logger } from 'src/lib/logger'

export const jobs = new JobManager({
  adapters: {
    prisma: new PrismaAdapter({ db: db as unknown as PrismaClient, logger }),
  },
  queues: ['critical', 'default'] as const,
  logger,
  workers: [
    {
      adapter: 'prisma',
      logger,
      queue: 'critical',
      count: 1,
      maxAttempts: 24,
      maxRuntime: 14_400,
      deleteFailedJobs: false,
      deleteSuccessfulJobs: false,
      sleepDelay: 3,
    },
    {
      adapter: 'prisma',
      logger,
      queue: 'default',
      count: 1,
      maxAttempts: 24,
      maxRuntime: 14_400,
      deleteFailedJobs: false,
      deleteSuccessfulJobs: false,
      sleepDelay: 7,
    },
  ],
})

export const later = jobs.createScheduler({
  adapter: 'prisma',
})
