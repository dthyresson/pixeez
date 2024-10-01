import { db } from 'src/lib/db'
import { extractMetadata } from 'src/lib/images'
import { jobs } from 'src/lib/jobs'

/**
 * The ProcessPicMetadataJob is on the default queue
 * to process the picture metadata
 * its priority is low because the metadata
 * isn't needed right away
 */
export const ProcessPicMetadataJob = jobs.createJob({
  queue: 'default',
  priority: 30,
  perform: async (picId: string) => {
    jobs.logger.info('ProcessPicMetadataJob is performing...')

    const pic = await db.pic.findUnique({ where: { id: picId } })
    if (!pic) {
      jobs.logger.error(`Pic with id ${picId} not found`)
      throw new Error(`Pic with id ${picId} not found`)
    }

    const { height, width, format, exif } = await extractMetadata(pic.original)

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
