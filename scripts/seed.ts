import fs from 'fs'

import { db } from 'api/src/lib/db'
import { storage } from 'api/src/lib/storage'
import { newId } from 'api/src/lib/uuid'

// Manually apply seeds via the `yarn rw prisma db seed` command.
//
// Seeds automatically run the first time you run the `yarn rw prisma migrate dev`
// command and every time you run the `yarn rw prisma migrate reset` command.
//
// See https://redwoodjs.com/docs/database-seeds for more info

export default async () => {
  try {
    console.info('delete all albums')
    await db.album.deleteMany()

    const albums = [
      { name: 'Photos' },
      { name: 'Screenshots' },
      { name: 'Projects' },
    ]
    await db.album.createMany({
      data: albums.map((album) => ({ id: newId('album'), ...album })),
    })

    console.info('delete all pics from storage directory')
    const adapter = storage.config.adapters.local
    const storageDir = adapter.config.root
    console.info(`delete and recreate storage directory: ${storageDir}`)
    fs.rmdirSync(storageDir, { recursive: true })
    fs.mkdirSync(storageDir)
  } catch (error) {
    console.error(error)
  }
}
