import type {
  PicsResolver,
  PicResolver,
  CreatePicResolver,
  CreatePicsResolver,
  UpdatePicResolver,
  DeletePicResolver,
} from 'types/pics'

import { CreatePicFanOutJob } from 'src/jobs/CreatePicFanOutJob/CreatePicFanOutJob'
import { db } from 'src/lib/db'
import { later } from 'src/lib/jobs'
import { storage } from 'src/lib/storage'
import { newId } from 'src/lib/uuid'

export const pics: PicsResolver = async () => {
  const result = await db.pic.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return result.map((pic) => ({
    ...pic,
    signedUrl: pic.original,
    dataUri: pic.thumbnail,
  }))
}

export const pic: PicResolver = async ({ id }) => {
  return await db.pic.findUnique({
    where: { id },
    select: {
      id: true,
      createdAt: true,
      updatedAt: true,
      albumId: true,
      original: true,
      thumbnail: true,
      withoutBackground: true,
      width: true,
      height: true,
      format: true,
      exif: true,
      description: true,
    },
  })
}

export const createPic: CreatePicResolver = async ({ input }) => {
  const path = await storage.writeFile(input.original)
  const data = {
    ...input,
    original: path,
  }

  const pic = await db.pic.create({
    data: { ...data, id: newId('pic') },
    include: {
      album: true,
    },
  })

  await later(CreatePicFanOutJob, [pic.id])

  return pic
}

export const createPics: CreatePicsResolver = async ({ input }) => {
  const album = await db.album.findUnique({
    where: { id: input.albumId },
  })

  const result = await Promise.all(
    input.originals.map(async (original) => {
      const path = await storage.writeFile(original)

      // const path = await storage.findAdapter('s3').writeFile(original, {
      //   CacheControl: 'public, max-age=31536000',
      //   Metadata: {
      //     MadeWith: 'RedwoodJS',
      //   },
      //   tags: [
      //     { Key: 'albumId', Value: album.id },
      //     { Key: 'filename', Value: original.name },
      //     { Key: 'RedwoodJS-Version', Value: '8.3' },
      //   ],
      // })
      const pic = await db.pic.create({
        data: {
          original: path,
          id: newId('pic'),
          albumId: album.id,
        },
      })

      await later(CreatePicFanOutJob, [pic.id])

      return pic
    })
  )

  return result
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
