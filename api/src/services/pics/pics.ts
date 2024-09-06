import type {
  PicsResolver,
  PicResolver,
  CreatePicResolver,
  UpdatePicResolver,
  DeletePicResolver,
} from 'types/pics'

import { db } from 'src/lib/db'

export const pics: PicsResolver = async () => {
  return await db.pic.findMany({
    orderBy: { id: 'asc' },
    include: {
      album: true,
    },
  })
}

export const pic: PicResolver = async ({ id }) => {
  return await db.pic.findUnique({
    where: { id },
    include: {
      album: true,
    },
  })
}

export const createPic: CreatePicResolver = async ({ input }) => {
  return await db.pic.create({
    data: input,
    include: {
      album: true,
    },
  })
}

export const updatePic: UpdatePicResolver = async ({ id, input }) => {
  return await db.pic.update({
    data: input,
    where: { id },
    include: {
      album: true,
    },
  })
}

export const deletePic: DeletePicResolver = async ({ id }) => {
  return await db.pic.delete({
    where: { id },
  })
}
