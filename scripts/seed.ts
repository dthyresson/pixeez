import fs from 'fs'
import path from 'path'

import { db } from 'api/src/lib/db'
import { fsStorage } from 'api/src/lib/storage'

import { getPaths } from '@redwoodjs/project-config'

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
    await db.album.createMany({ data: albums })

    console.info('delete all pics from storage directory')

    // get all files in storage directory
    const storageDir = path.join(getPaths().base, 'storage')
    const files = fs.readdirSync(storageDir)

    // remove all files in storage directory
    files.forEach((file) => {
      console.info(`removing ${file}`)
      fsStorage.remove(path.join(storageDir, file))
    })
  } catch (error) {
    console.error(error)
  }
}
