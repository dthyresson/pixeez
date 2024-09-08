import type {
  TagsResolver,
  TagResolver,
  CreateTagResolver,
  UpdateTagResolver,
  DeleteTagResolver,
} from 'types/tags'

import { db } from 'src/lib/db'

export const tags: TagsResolver = async () => {
  return await db.tag.findMany({
    orderBy: { id: 'asc' },
    include: {
      pics: true,
    },
  })
}

export const tag: TagResolver = async ({ id }) => {
  return await db.tag.findUnique({
    where: { id },
    include: {
      pics: true,
    },
  })
}

export const createTag: CreateTagResolver = async ({ input }) => {
  return await db.tag.create({
    data: input,
    include: {
      pics: true,
    },
  })
}

export const updateTag: UpdateTagResolver = async ({ id, input }) => {
  return await db.tag.update({
    data: input,
    where: { id },
    include: {
      pics: true,
    },
  })
}

export const deleteTag: DeleteTagResolver = async ({ id }) => {
  return await db.tag.delete({
    where: { id },
  })
}
