import * as fal from '@fal-ai/serverless-client'

import { db } from 'src/lib/db'
import { jobs } from 'src/lib/jobs'

fal.config({
  credentials: process.env.FAL_KEY, // or a function that returns a string
})

export const RemoveImageBackgroundJob = jobs.createJob({
  queue: 'default',
  perform: async (picId: number) => {
    jobs.logger.info(picId, 'RemoveImageBackgroundJob is performing...')
    const pic = await db.pic.findUnique({
      where: { id: picId },
    })

    const processedPic = await pic.withDataUri()

    jobs.logger.debug(processedPic, 'processedPic')

    const result = await fal.run('fal-ai/imageutils/rembg', {
      input: {
        image_url: processedPic.original,
      },
    })

    jobs.logger.debug(result)

    const updatedPic = await db.pic.update({
      where: { id: picId },
      data: {
        processed: result['image']['url'],
      },
    })

    jobs.logger.debug(updatedPic, 'updatedPic')
    jobs.logger.info(picId, 'RemoveImageBackgroundJob done!')
  },
})
