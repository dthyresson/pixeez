import type {
  OnBackgroundRemovedResolver,
  OnTagsCreatedResolver,
} from 'types/webhooks'

import { ValidationError } from '@redwoodjs/graphql-server'
import type { LiveQueryStorageMechanism } from '@redwoodjs/realtime'

import { db } from 'src/lib/db'
import { logger } from 'src/lib/logger'

export const onBackgroundRemoved: OnBackgroundRemovedResolver = async (
  { input },
  { context }
) => {
  const { id, secret } = input

  if (secret !== process.env.WEBHOOK_SECRET) {
    logger.error('Invalid secret')
    throw new ValidationError('Invalid secret')
  }

  const liveQueryStore = context.liveQueryStore as LiveQueryStorageMechanism

  if (!liveQueryStore) {
    logger.error('Live query store not found')
    throw new ValidationError('Live query store not found')
  }

  const pic = await db.pic.findUnique({
    where: { id },
    include: { album: true },
  })

  if (!pic) {
    logger.error({ id }, 'Pic not found')
    throw new ValidationError('Pic not found')
  }

  const key = `Album:${pic.albumId}`

  liveQueryStore.invalidate(key)

  logger.info({ id, key }, 'Pic invalidated')

  return pic
}

export const onTagsCreated: OnTagsCreatedResolver = async (
  { input },
  { context }
) => {
  const { id, secret } = input

  if (secret !== process.env.WEBHOOK_SECRET) {
    logger.error('Invalid secret')
    throw new ValidationError('Invalid secret')
  }

  const liveQueryStore = context.liveQueryStore as LiveQueryStorageMechanism

  if (!liveQueryStore) {
    logger.error('Live query store not found')
    throw new ValidationError('Live query store not found')
  }

  const pic = await db.pic.findUnique({
    where: { id },
    include: { album: true, tags: true },
  })

  if (!pic) {
    logger.error({ id }, 'Pic not found')
    throw new ValidationError('Pic not found')
  }

  const { tags = [] } = pic

  const key = 'Query.tags'

  liveQueryStore.invalidate(key)

  logger.info({ id, key, tagsCount: tags.length }, 'Tags invalidated')

  return pic
}
