import { getJobHistory, getJobCount } from '@prisma/client/sql'
import { HistoriesResolver, JobCountResolver } from 'types/history'

import { db } from 'src/lib/db'

export const histories: HistoriesResolver = async ({ jobName }) => {
  if (
    jobName === '' ||
    jobName === null ||
    jobName === undefined ||
    jobName.length === 0
  ) {
    const jobHistory = await db.$queryRawTyped(getJobHistory(null, null))
    return jobHistory
  }
  const jobHistory = await db.$queryRawTyped(getJobHistory(jobName, jobName))

  return jobHistory
}

export const jobCount: JobCountResolver = async () => {
  const result = await db.$queryRawTyped(getJobCount())
  return result.map((item) => ({ ...item, jobCount: Number(item.jobCount) }))
}
