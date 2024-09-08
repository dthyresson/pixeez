import type {
  PicsResolver,
  PicResolver,
  CreatePicResolver,
  CreatePicsResolver,
  UpdatePicResolver,
  DeletePicResolver,
} from 'types/pics'
import type { Pic } from 'types/shared-return-types'

import { CreatePicFanOutJob } from 'src/jobs/CreatePicFanOutJob/CreatePicFanOutJob'
import { db } from 'src/lib/db'
import { later } from 'src/lib/jobs'
import { saveFiles } from 'src/lib/storage'
import { newId } from 'src/lib/uuid'

export const pics: PicsResolver = async () => {
  const p = await db.pic.findMany({
    orderBy: { id: 'desc' },
    include: {
      album: true,
    },
  })

  return p.map((p) => p.withSignedUrl())
}

export const pic: PicResolver = async ({ id }) => {
  const p = await db.pic.findUnique({
    where: { id },
    include: {
      album: true,
    },
  })

  return p.withSignedUrl()
}

export const createPic: CreatePicResolver = async ({ input }) => {
  const processedInput = await saveFiles.forPic(input)
  const data = {
    ...processedInput,
  }

  const pic = await db.pic.create({
    data: { ...data, id: newId('pic') },
    include: {
      album: true,
    },
  })

  await later(CreatePicFanOutJob, [pic.id])

  return pic.withSignedUrl()
}

export const createPics: CreatePicsResolver = async ({ input }) => {
  const result = [] as Pic[]

  const savedOriginalFiles = await saveFiles.inList(input.originals)

  for (const original of savedOriginalFiles) {
    const pic = await db.pic.create({
      data: {
        original,
        id: newId('pic'),
        albumId: input.albumId,
      },
    })

    result.push(pic.withSignedUrl())

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

  return p.withSignedUrl()
}

export const deletePic: DeletePicResolver = async ({ id }) => {
  return await db.pic.delete({
    where: { id },
  })
}
