import exifParser from 'exif-parser'
import sharp from 'sharp'

import { db } from 'src/lib/db'
import { jobs } from 'src/lib/jobs'
import { logger } from 'src/lib/logger'
import { fsStorage } from 'src/lib/uploads'

export const ProcessPicMetadataJob = jobs.createJob({
  queue: 'default',
  perform: async (picId: number) => {
    jobs.logger.info('ProcessPicMetadataJob is performing...')

    const pic = await db.pic.findUnique({ where: { id: picId } })
    if (!pic) {
      jobs.logger.error(`Pic with id ${picId} not found`)
      throw new Error(`Pic with id ${picId} not found`)
    }

    const image = await sharp(pic.original)
      .metadata()
      .then((metadata) => {
        return metadata
      })

    const { height, width, format } = image

    logger.debug({ height, width, format }, 'Image metadata')

    let exif = null

    if (format === 'jpeg' || format === 'jpg') {
      // Extract EXIF data using exif-parser
      const { contents } = await fsStorage.read(pic.original)
      const parser = exifParser.create(contents)
      parser.enableSimpleValues(true)

      const result = parser.parse()

      logger.debug({ result }, 'EXIF data')

      exif = JSON.stringify(result.tags || {})
    }

    await db.pic.update({
      where: { id: picId },
      data: {
        width,
        height,
        format,
        exif,
      },
    })
  },
})
