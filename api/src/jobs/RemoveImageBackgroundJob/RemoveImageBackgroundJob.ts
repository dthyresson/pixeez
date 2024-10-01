import {
  executeGraphQLWebhook,
  OnBackgroundRemovedWebhook,
} from 'src/jobs/webhooks'
import { db } from 'src/lib/db'
import { removeBackground } from 'src/lib/fal/removeBackground'
import { jobs } from 'src/lib/jobs'
import { storage } from 'src/lib/storage'

/**
 * The RemoveImageBackgroundJob is critical because it performs the main background removal
 * its priority is slightly higher that the main fan out job
 */
export const RemoveImageBackgroundJob = jobs.createJob({
  queue: 'critical',
  priority: 20,
  perform: async (picId: string) => {
    jobs.logger.info({ picId }, 'RemoveImageBackgroundJob is performing...')
    const pic = await db.pic.findUnique({
      where: { id: picId },
    })

    if (!pic) {
      jobs.logger.error({ picId }, 'Pic not found')
      return
    }

    // send base64 data uri of the original image in the Pic to fal as imageUrl
    jobs.logger.debug({ picId }, 'Pic to get data uri')

    const data = await storage.readFile(pic.original)
    const arrayBuffer = await data.arrayBuffer()
    const base64Data = Buffer.from(arrayBuffer).toString('base64')
    const mimeType = data.type
    const imageUrl = `data:${mimeType};base64,${base64Data}`
    // jobs.logger.debug({ imageUrl }, 'Image URL')
    const result = await removeBackground({ imageUrl })

    jobs.logger.debug({ picId }, 'Fal processing done!')

    // get the url of the image without background from the fal result
    const withoutBackground = result['image']?.['url']

    if (!withoutBackground) {
      jobs.logger.error({ picId }, 'Fal processing failed')
      return
    }

    // update the Pic with the new image without background
    await db.pic.update({
      where: { id: picId },
      data: {
        withoutBackground,
      },
    })

    jobs.logger.debug({ picId }, 'Pic updated!')

    // send webhook to refresh album live query for pics
    await executeGraphQLWebhook({
      query: OnBackgroundRemovedWebhook,
      inputVariables: { id: picId },
    })

    jobs.logger.info({ picId }, 'RemoveImageBackgroundJob done!')
  },
})
