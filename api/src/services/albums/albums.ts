import type {
  AlbumsResolver,
  AlbumResolver,
  CreateAlbumResolver,
  UpdateAlbumResolver,
  DeleteAlbumResolver,
} from 'types/albums'

import { db } from 'src/lib/db'

export const albums: AlbumsResolver = async () => {
  return await db.album.findMany({
    orderBy: { id: 'asc' },
    include: {
      pics: true,
    },
  })
}

export const album: AlbumResolver = async ({ id }) => {
  return await db.album.findUnique({
    where: { id },
    include: {
      pics: true,
    },
  })
}

export const createAlbum: CreateAlbumResolver = async ({ input }) => {
  return await db.album.create({
    data: input,
    include: {
      pics: true,
    },
  })
}

export const updateAlbum: UpdateAlbumResolver = async ({ id, input }) => {
  return await db.album.update({
    data: input,
    where: { id },
    include: {
      pics: true,
    },
  })
}

export const deleteAlbum: DeleteAlbumResolver = async ({ id }) => {
  return await db.album.delete({
    where: { id },
  })
}
