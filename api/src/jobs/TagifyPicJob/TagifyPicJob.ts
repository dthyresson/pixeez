import { db } from 'src/lib/db'
import { jobs } from 'src/lib/jobs'
import { tagify } from 'src/lib/langbase/tagify'
import { newId } from 'src/lib/uuid'

export const TagifyPicJob = jobs.createJob({
  queue: 'default',
  priority: 30,
  perform: async (picId: string) => {
    try {
      jobs.logger.info({ picId }, 'TagifyPicJob is performing...')

      const pic = await db.pic.findUnique({
        where: { id: picId },
      })

      if (!pic) {
        jobs.logger.error({ picId }, 'Pic not found')
        throw new Error('Pic not found')
      }

      if (!pic.description) {
        jobs.logger.warn({ picId }, 'Pic lacks description')
        throw new Error('Pic lacks description. Will be retried.')
      }

      const { tags } = await tagify(pic)

      if (!tags || tags.length === 0) {
        jobs.logger.warn({ picId }, 'No tags to connect or create')
      }

      // connect or create tags
      tags.forEach(async (tag) => {
        jobs.logger.debug({ picId, tag }, 'Connecting or creating tag')
        await db.pic.update({
          where: { id: picId },
          data: {
            tags: {
              connectOrCreate: {
                where: { name: tag },
                create: { id: newId('tag'), name: tag },
              },
            },
          },
        })
      })

      // send webhook to refresh tags live query for pic
      jobs.logger.debug(
        { picId },
        '>>>>>> Sending webhook to refresh tags live query for pic'
      )
      const webhookResponse = await fetch(`http://localhost:8911/graphql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          query: `
          mutation OnTagsCreated($input: OnTagsCreatedInput!) {
            onTagsCreated(input: $input) {
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

      jobs.logger.info({ picId }, 'TagifyPicJob done!')
    } catch (error) {
      jobs.logger.error({ picId, error }, 'TagifyPicJob error')
      throw error
    }
  },
})
