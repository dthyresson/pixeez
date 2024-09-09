import { db } from 'src/lib/db'
import { jobs } from 'src/lib/jobs'
import { tagify } from 'src/lib/langbase/tagify'
import { newId } from 'src/lib/uuid'

import { executeGraphQLQuery } from '../utils'

/**
 * The TagifyPicJob is on the default queue to tagify the picture
 * its priority is higher than the describe job
 * so it can compete before another describe job is performed on a different pic
 */
export const TagifyPicJob = jobs.createJob({
  queue: 'default',
  priority: 10,
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
      const query = `
        mutation OnTagsCreated($input: OnTagsCreatedInput!) {
          onTagsCreated(input: $input) {
            id
          }
        }
      `

      try {
        await executeGraphQLQuery({ query, inputVariables: { id: picId } })
        jobs.logger.debug({ picId }, '>>>>>> Webhook sent')
      } catch (error) {
        jobs.logger.error({ picId, error }, '>>>>>> Webhook failed')
      }

      jobs.logger.info({ picId }, 'TagifyPicJob done!')
    } catch (error) {
      jobs.logger.error({ picId, error }, 'TagifyPicJob error')
      throw error
    }
  },
})
