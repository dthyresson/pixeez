import { DescribePicJob } from 'src/jobs/DescribePicJob/DescribePicJob'
import { ProcessPicMetadataJob } from 'src/jobs/ProcessPicMetadataJob/ProcessPicMetadataJob'
import { RemoveImageBackgroundJob } from 'src/jobs/RemoveImageBackgroundJob/RemoveImageBackgroundJob'
import { jobs, later } from 'src/lib/jobs'

/**
 * The CreatePicFanOutJob is critical because it is the first job that is performed on a pic
 * and it fans out to other jobs that are required to fully process a pic
 */
export const CreatePicFanOutJob = jobs.createJob({
  queue: 'critical',
  priority: 10,
  perform: async (picId: string) => {
    jobs.logger.info('CreatePicFanOutJob is performing...')

    // fan out to other jobs
    await later(RemoveImageBackgroundJob, [picId])
    await later(DescribePicJob, [picId])
    await later(ProcessPicMetadataJob, [picId])

    jobs.logger.info('CreatePicFanOutJob is done!')
  },
})
