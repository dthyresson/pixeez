import {
  executeGraphQLWebhook,
  OnThumbnailCreatedWebhook,
} from 'src/jobs/webhooks'
import { db } from 'src/lib/db'
import { makeThumbnail } from 'src/lib/images'
import { jobs } from 'src/lib/jobs'

export const CreateThumbnailJob = jobs.createJob({
  queue: 'critical',
  priority: 25,

  perform: async (picId: string) => {
    jobs.logger.info('CreateThumbnailJob is performing...')

    const pic = await db.pic.findUnique({ where: { id: picId } })
    if (!pic) {
      jobs.logger.error(`Pic ${picId} not found`)
      return
    }

    const thumbnail = await makeThumbnail(pic.original)

    await db.pic.update({
      where: { id: picId },
      data: { thumbnail },
    })

    // send webhook to refresh album live query for pics
    await executeGraphQLWebhook({
      query: OnThumbnailCreatedWebhook,
      inputVariables: { id: picId },
    })
  },
})
