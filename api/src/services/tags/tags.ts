import type {
  TagsResolver,
  TagResolver,
  CreateTagResolver,
  UpdateTagResolver,
  DeleteTagResolver,
} from 'types/tags'

import { db } from 'src/lib/db'
import { logger } from 'src/lib/logger'

export const tags: TagsResolver = async () => {
  return await db.tag.findMany({
    orderBy: { name: 'asc' },
    include: {
      pics: {
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  })
}

export const tag: TagResolver = async ({ id }) => {
  logger.info({ id }, '>>>> id ')
  const theTag = await db.tag.findUnique({
    where: { id },
    include: {
      pics: {
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  })

  logger.info({ theTag }, '>>>> theTag ')
  const pics = theTag?.pics.map((pic) => {
    return {
      ...pic.withSignedUrl(),
    }
  })

  return {
    ...theTag,
    pics,
  }
}

export const createTag: CreateTagResolver = async ({ input }) => {
  const tag = await db.tag.create({
    data: input,
    include: {
      pics: {
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  })

  return {
    ...tag,
    pics: tag?.pics.map((pic) => ({ ...pic, original: pic.withSignedUrl() })),
  }
}

export const updateTag: UpdateTagResolver = async ({ id, input }) => {
  const tag = await db.tag.update({
    data: input,
    where: { id },
    include: {
      pics: {
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  })

  return {
    ...tag,
    pics: tag?.pics.map((pic) => ({ ...pic, original: pic.withSignedUrl() })),
  }
}

export const deleteTag: DeleteTagResolver = async ({ id }) => {
  return await db.tag.delete({
    where: { id },
  })
}
