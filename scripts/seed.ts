import fs from 'fs'
import path from 'path'

import { db } from 'api/src/lib/db'

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

    const albums = [{ name: 'Family' }, { name: 'Work ' }]
    await db.album.createMany({ data: albums })

    console.info('delete all pics from uploads directory')
    const uploadsDir = path.join(getPaths().base, 'uploads')
    fs.rmSync(uploadsDir, { recursive: true, force: true })

    // create uploads directory
    fs.mkdirSync(uploadsDir)
  } catch (error) {
    console.error(error)
  }
}
