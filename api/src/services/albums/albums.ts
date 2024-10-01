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
      _count: { select: { pics: true } },
    },
  })

  return {
    albums: theAlbums.map((album) => ({
      ...album,
      picCount: album._count.pics || 0,
    })),
    albumCount: theAlbums.length,
  }
}

export const album: AlbumResolver = async ({ id }) => {
  const theAlbum = await db.album.findUnique({
    where: { id },
    include: {
      pics: { orderBy: { createdAt: 'desc' }, include: { album: true } },
      _count: { select: { pics: true } },
    },
  })

  return {
    ...theAlbum,
    picCount: theAlbum?._count.pics || 0,
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
      _count: { select: { pics: true } },
    },
  })

  const keys = ['Query.albums']
  liveQueryStore.invalidate(keys)

  return {
    ...theAlbum,
    picCount: theAlbum?._count.pics || 0,
  }
}

export const updateAlbum: UpdateAlbumResolver = async (
  { id, input },
  { context }
) => {
  const liveQueryStore = context.liveQueryStore as LiveQueryStorageMechanism

  const theAlbum = await db.album.update({
    data: input,
    where: { id },
    include: {
      pics: { orderBy: { createdAt: 'desc' } },
      _count: { select: { pics: true } },
    },
  })

  const keys = [`Album:${theAlbum.id}`, 'Query.albums']
  liveQueryStore.invalidate(keys)

  return {
    ...theAlbum,
    picCount: theAlbum?._count.pics || 0,
  }
}

export const deleteAlbum: DeleteAlbumResolver = async ({ id }, { context }) => {
  const liveQueryStore = context.liveQueryStore as LiveQueryStorageMechanism

  const theAlbum = await db.album.delete({
    where: { id },
    include: {
      pics: { orderBy: { createdAt: 'desc' } },
      _count: { select: { pics: true } },
    },
  })

  const keys = [`Album:${theAlbum.id}`, 'Query.albums']
  liveQueryStore.invalidate(keys)

  return theAlbum
}
