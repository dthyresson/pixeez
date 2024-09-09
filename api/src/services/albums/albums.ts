import type {
  AlbumsResolver,
  AlbumResolver,
  CreateAlbumResolver,
  UpdateAlbumResolver,
  DeleteAlbumResolver,
} from 'types/albums'

import type { LiveQueryStorageMechanism } from '@redwoodjs/realtime'

import { db } from 'src/lib/db'
import { newId } from 'src/lib/uuid'

export const albums: AlbumsResolver = async () => {
  const theAlbums = await db.album.findMany({
    orderBy: { name: 'asc' },
    include: {
      pics: { orderBy: { createdAt: 'desc' } },
    },
  })

  const albums = theAlbums.map((album) => {
    return {
      ...album,
      pics: album.pics.map((pic) => {
        return {
          ...pic.withSignedUrl(),
        }
      }),
    }
  })

  return albums
}

export const album: AlbumResolver = async ({ id }) => {
  const theAlbum = await db.album.findUnique({
    where: { id },
    include: {
      pics: { orderBy: { createdAt: 'desc' }, include: { album: true } },
    },
  })

  const pics = theAlbum?.pics.map((pic) => {
    return {
      ...pic.withSignedUrl(),
    }
  })

  return {
    ...theAlbum,
    pics,
  }
}

export const createAlbum: CreateAlbumResolver = async (
  { input },
  { context }
) => {
  const liveQueryStore = context.liveQueryStore as LiveQueryStorageMechanism

  const theAlbum = await db.album.create({
    data: { ...input, id: newId('album') },
    include: {
      pics: { orderBy: { createdAt: 'desc' } },
    },
  })

  const keys = [`Album:${theAlbum.id}`, 'Query.albums']
  liveQueryStore.invalidate(keys)

  return theAlbum
}

export const updateAlbum: UpdateAlbumResolver = async ({ id, input }) => {
  return await db.album.update({
    data: input,
    where: { id },
    include: {
      pics: { orderBy: { createdAt: 'desc' } },
    },
  })
}

export const deleteAlbum: DeleteAlbumResolver = async ({ id }) => {
  return await db.album.delete({
    where: { id },
  })
}
