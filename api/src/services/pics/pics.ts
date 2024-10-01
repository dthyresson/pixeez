import type {
  PicsResolver,
  PicResolver,
  CreatePicResolver,
  CreatePicsResolver,
  UpdatePicResolver,
  DeletePicResolver,
} from 'types/pics'
import type { Pic } from 'types/shared-return-types'

import { ValidationError } from '@redwoodjs/graphql-server'

import { CreatePicFanOutJob } from 'src/jobs/CreatePicFanOutJob/CreatePicFanOutJob'
import { db } from 'src/lib/db'
import { later } from 'src/lib/jobs'
import { storage } from 'src/lib/storage'
import { newId } from 'src/lib/uuid'

const validatePicInput = (file) => {
  const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  if (!validImageTypes.includes(file.type)) {
    throw new ValidationError(
      'Pic must be a valid image type (JPEG, PNG, GIF, or WebP)'
    )
  }
}

export const pics: PicsResolver = async () => {
  const results = await db.pic.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return await Promise.all(
    results.map(async (pic) => ({
      id: pic.id,
      createdAt: pic.createdAt,
      updatedAt: pic.updatedAt,
      albumId: pic.albumId,
      original: await storage.getSignedUrl(pic.original),
      thumbnail: pic.thumbnail
        ? await storage.getSignedUrl(pic.thumbnail)
        : null,
      withoutBackground: pic.withoutBackground || '',
      width: pic.width,
      height: pic.height,
      format: pic.format,
      exif: pic.exif || '',
      description: pic.description || '',
    }))
  )
}

export const pic: PicResolver = async ({ id }) => {
  const p = await db.pic.findUnique({
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

  return {
    ...p,
    original: await storage.getSignedUrl(p.original),
    thumbnail: p.thumbnail ? await storage.getSignedUrl(p.thumbnail) : null,
  }
}

export const createPic: CreatePicResolver = async ({ input }) => {
  validatePicInput(input.original)

  const path = await storage.writeStream(input.original.stream())
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

  return {
    ...pic,
    original: await storage.getSignedUrl(pic.original),
    thumbnail: pic.thumbnail ? await storage.getSignedUrl(pic.thumbnail) : null,
  }
}

export const createPics: CreatePicsResolver = async ({ input }) => {
  const result = [] as Pic[]

  if (input.originals.length > 20) {
    throw new ValidationError('Maximum of 20 pics can be uploaded at once')
  }

  input.originals.forEach(validatePicInput)

  const album = await db.album.findUnique({
    where: { id: input.albumId },
  })

  for (const original of input.originals) {
    const path = await storage.writeStream(original.stream())
    const pic = await db.pic.create({
      data: {
        original: path,
        id: newId('pic'),
        albumId: album.id,
      },
    })

    result.push({
      ...pic,
      original: await storage.getSignedUrl(pic.original),
      thumbnail: await storage.getSignedUrl(pic.thumbnail),
    })

    await later(CreatePicFanOutJob, [pic.id])
  }

  return result
}

export const updatePic: UpdatePicResolver = async ({ id, input }) => {
  const p = await db.pic.update({
    data: input,
    where: { id },
    include: {
      album: true,
    },
  })

  return {
    ...p,
    original: await storage.getSignedUrl(p.original),
    thumbnail: await storage.getSignedUrl(p.thumbnail),
  }
}

export const deletePic: DeletePicResolver = async ({ id }) => {
  return await db.pic.delete({
    where: { id },
  })
}
