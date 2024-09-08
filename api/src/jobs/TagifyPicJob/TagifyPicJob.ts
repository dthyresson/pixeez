import { db } from 'src/lib/db'
import { jobs } from 'src/lib/jobs'
import { tagify } from 'src/lib/langbase'

export const TagifyPicJob = jobs.createJob({
  queue: 'default',
  perform: async (picId: number) => {
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
        throw new Error('Pic lacks description')
      }

      const result = await tagify(pic)
      jobs.logger.debug({ result }, 'TagifyPicJob result')
      const tags = result.tags

      jobs.logger.debug({ picId, tags }, 'Tags to connect or create')
      jobs.logger.debug(tags, '>>>>>>> Tags')

      if (!tags || tags.length === 0) {
        jobs.logger.warn({ picId }, 'No tags to connect or create')
      }

      tags.forEach(async (tag) => {
        jobs.logger.debug({ picId, tag }, 'Connecting or creating tag')
        await db.pic.update({
          where: { id: picId },
          data: {
            tags: {
              connectOrCreate: {
                where: { name: tag },
                create: { name: tag },
              },
            },
          },
        })
      })

      jobs.logger.info({ picId }, 'TagifyPicJob done!')
    } catch (error) {
      jobs.logger.error({ picId, error }, 'TagifyPicJob error')
      throw error
    }
  },
})
