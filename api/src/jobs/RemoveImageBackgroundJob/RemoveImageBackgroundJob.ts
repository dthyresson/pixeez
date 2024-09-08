import { db } from 'src/lib/db'
import { removeBackground } from 'src/lib/fal'
import { jobs } from 'src/lib/jobs'

export const RemoveImageBackgroundJob = jobs.createJob({
  queue: 'default',
  perform: async (picId: number) => {
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

    await db.pic.update({
      where: { id: picId },
      data: {
        processed: result['image']['url'],
      },
    })

    jobs.logger.debug({ picId }, 'Pic updated!')
    jobs.logger.info({ picId }, 'RemoveImageBackgroundJob done!')
  },
})
