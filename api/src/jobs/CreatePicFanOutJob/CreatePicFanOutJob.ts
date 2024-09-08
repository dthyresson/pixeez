import { RemoveImageBackgroundJob } from 'src/jobs/RemoveImageBackgroundJob/RemoveImageBackgroundJob'
import { jobs, later } from 'src/lib/jobs'

export const CreatePicFanOutJob = jobs.createJob({
  queue: 'default',
  perform: async (picId: number) => {
    jobs.logger.info('CreatePicFanOutJob is performing...')

    // fan out to other jobs
    await later(RemoveImageBackgroundJob, [picId])
    jobs.logger.info('CreatePicFanOutJob is done!')
  },
})
