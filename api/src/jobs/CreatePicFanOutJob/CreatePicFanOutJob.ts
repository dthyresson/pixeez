import { DescribePicJob } from 'src/jobs/DescribePicJob/DescribePicJob'
import { ProcessPicMetadataJob } from 'src/jobs/ProcessPicMetadataJob/ProcessPicMetadataJob'
import { RemoveImageBackgroundJob } from 'src/jobs/RemoveImageBackgroundJob/RemoveImageBackgroundJob'
import { jobs, later } from 'src/lib/jobs'

export const CreatePicFanOutJob = jobs.createJob({
  queue: 'critical',
  priority: 10,
  perform: async (picId: string) => {
    jobs.logger.info('CreatePicFanOutJob is performing...')

    // fan out to other jobs
    await later(RemoveImageBackgroundJob, [picId])
    await later(ProcessPicMetadataJob, [picId])
    await later(DescribePicJob, [picId])
    jobs.logger.info('CreatePicFanOutJob is done!')
  },
})
