import type {
  AlbumsResolver,
  AlbumResolver,
  CreateAlbumResolver,
  UpdateAlbumResolver,
  DeleteAlbumResolver,
} from 'types/albums'

import { db } from 'src/lib/db'

export const albums: AlbumsResolver = async () => {
  const theAlbums = await db.album.findMany({
    orderBy: { name: 'asc' },
    include: {
      pics: true,
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
      pics: true,
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
