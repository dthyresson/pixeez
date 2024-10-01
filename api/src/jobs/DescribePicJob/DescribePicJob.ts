import { TagifyPicJob } from 'src/jobs/TagifyPicJob/TagifyPicJob'
import { db } from 'src/lib/db'
import { describeImage } from 'src/lib/fal/describeImage'
import { jobs, later } from 'src/lib/jobs'
// import { storage } from 'src/lib/storage'
/**
 * The DescribePicJob is on the default queue
 * to describe the picture and then queue the TagifyPicJob
 */
export const DescribePicJob = jobs.createJob({
  queue: 'default',
  priority: 20,
  perform: async (picId: string) => {
    jobs.logger.info({ picId }, 'DescribePicJob is performing...')
    const pic = await db.pic.findUnique({
      where: { id: picId },
    })

    if (!pic) {
      jobs.logger.error({ picId }, 'Pic not found')
      return
    }

    // const picUri = storageManager.preferDataUri
    //   ? await pic.withDataUri()
    //   : await pic.withSignedUrl()

    jobs.logger.debug({ picId }, 'Pic to get data uri')

    const result = await describeImage({ imageUrl: pic.original })
    jobs.logger.debug({ result }, 'Fal describe result')

    const description = (result['results'] as string) || ''
    jobs.logger.debug({ picId }, 'Fal describe done!')

    await db.pic.update({
      where: { id: picId },
      data: {
        description,
      },
    })

    jobs.logger.debug({ picId }, 'Pic updated!')

    if (description && description.length > 0) {
      jobs.logger.debug({ picId }, 'Pic has description. Tagging queued ...')
      await later(TagifyPicJob, [picId])
    }

    jobs.logger.info({ picId }, 'DescribePicJob done!')
  },
})
