import { getJobHistory, getJobCount } from '@prisma/client/sql'
import { HistoriesResolver, JobCountResolver } from 'types/history'

import { db } from 'src/lib/db'

export const histories: HistoriesResolver = async ({ jobName, status }) => {
  const jobNameAll = jobName === 'All' ? null : jobName
  const statusAll = status === 'All' ? null : status

  const jobHistory = await db.$queryRawTyped(
    getJobHistory(
      jobNameAll,
      jobNameAll,
      statusAll,
      statusAll,
      jobNameAll,
      jobNameAll,
      statusAll,
      statusAll,
      jobNameAll,
      statusAll
    )
  )

  return jobHistory
}

export const jobCount: JobCountResolver = async () => {
  const result = await db.$queryRawTyped(getJobCount())
  return result.map((item) => ({ ...item, jobCount: Number(item.jobCount) }))
}
