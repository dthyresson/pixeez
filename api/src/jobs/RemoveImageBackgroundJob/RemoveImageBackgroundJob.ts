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

    // send webhook to refresh album live query for pics
    jobs.logger.debug(
      { picId },
      '>>>>>> Sending webhook to refresh album live query for pic'
    )
    const webhookResponse = await fetch(`http://localhost:8911/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        query: `
          mutation OnBackgroundRemoved($input: OnBackgroundRemovedInput!) {
            onBackgroundRemoved(input: $input) {
              id
            }
          }
        `,
        variables: {
          input: {
            id: picId,
            secret: process.env.WEBHOOK_SECRET,
          },
        },
      }),
    })

    if (!webhookResponse.ok) {
      jobs.logger.error({ picId, webhookResponse }, '>>>>>> Webhook failed')
    }

    jobs.logger.debug(
      { picId, body: webhookResponse.body },
      '>>>>>> Webhook sent'
    )

    jobs.logger.debug({ picId }, 'Pic updated!')
    jobs.logger.info({ picId }, 'RemoveImageBackgroundJob done!')
  },
})
