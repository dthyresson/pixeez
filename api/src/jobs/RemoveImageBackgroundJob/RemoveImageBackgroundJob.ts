import { db } from 'src/lib/db'
import { removeBackground } from 'src/lib/fal/removeBackground'
import { jobs } from 'src/lib/jobs'

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

    const pidDataUri = await pic.withDataUri()

    jobs.logger.debug({ picId }, 'Pic to get data uri')

    const result = await removeBackground({ imageUrl: pidDataUri.original })

    jobs.logger.debug({ picId }, 'Fal processing done!')
    const withoutBackground = result['image']?.['url']

    if (!withoutBackground) {
      jobs.logger.error({ picId }, 'Fal processing failed')
      return
    }

    await db.pic.update({
      where: { id: picId },
      data: {
        withoutBackground,
      },
    })

    jobs.logger.debug({ picId }, 'Pic updated!')
    jobs.logger.info({ picId }, 'RemoveImageBackgroundJob done!')
  },
})
