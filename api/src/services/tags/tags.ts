import type {
  TagsResolver,
  TagResolver,
  CreateTagResolver,
  UpdateTagResolver,
  DeleteTagResolver,
} from 'types/tags'

import { db } from 'src/lib/db'
import { storage } from 'src/lib/storage'
import { newId } from 'src/lib/uuid'
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
  const theTag = await db.tag.findUnique({
    where: { id },
    include: {
      pics: {
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          album: true,
        },
      },
    },
  })

  return {
    ...theTag,
    pics: theTag?.pics.map(async (pic) => ({
      ...pic,
      original: await storage.getSignedUrl(pic.original),
    })),
  }
}

export const createTag: CreateTagResolver = async ({ input }) => {
  const tag = await db.tag.create({
    data: { id: newId('tag'), ...input },
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
    pics: tag?.pics.map(async (pic) => ({
      ...pic,
      original: await storage.getSignedUrl(pic.original),
    })),
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
    pics: tag?.pics.map(async (pic) => ({
      ...pic,
      original: await storage.getSignedUrl(pic.original),
    })),
  }
}

export const deleteTag: DeleteTagResolver = async ({ id }) => {
  return await db.tag.delete({
    where: { id },
  })
}
