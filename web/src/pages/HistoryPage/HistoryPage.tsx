import { useState } from 'react'

import { Metadata } from '@redwoodjs/web'

import HistoriesCell from 'src/components/HistoriesCell'
import JobNameSelectList from 'src/components/HistoriesCell/JobNameSelectList'
import JobStatusSelectList from 'src/components/HistoriesCell/JobStatusSelectList'
const HistoryPage = () => {
  const [selectedJob, setSelectedJob] = useState('All')

  const handleJobChange = (jobName: string) => {
    setSelectedJob(jobName)
  }

  const [selectedStatus, setSelectedStatus] = useState('All')

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status)
  }

  return (
    <>
      <Metadata title="History" description="History of job runs" />
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">History</h1>
        <div className="ml-auto flex gap-4">
          <JobStatusSelectList
            selectedStatus={selectedStatus}
            onStatusChange={handleStatusChange}
          />
          <JobNameSelectList
            selectedJob={selectedJob}
            onJobChange={handleJobChange}
          />
        </div>
      </div>
      <HistoriesCell jobName={selectedJob} status={selectedStatus} />
    </>
  )
}

export default HistoryPage
