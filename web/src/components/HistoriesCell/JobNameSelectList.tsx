import React from 'react'

import { useQuery } from '@redwoodjs/web'

type JobNameSelectListProps = {
  selectedJob: string
  onJobChange: (jobName: string) => void
}

const GET_JOBS = gql`
  query GetJobs {
    jobCount {
      id
      name
      jobCount
    }
  }
`

const JobNameSelectList = ({
  selectedJob,
  onJobChange,
}: JobNameSelectListProps) => {
  const { data } = useQuery(GET_JOBS)

  const handleJobChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onJobChange(event.target.value)
  }

  const jobs = data?.jobCount || []

  return (
    <select
      value={selectedJob}
      onChange={handleJobChange}
      className="rounded-md border border-gray-300 p-2"
    >
      <option value="All">All</option>
      {jobs.map((job) => (
        <option key={job.id} value={job.name}>
          {job.name} ({job.jobCount})
        </option>
      ))}
    </select>
  )
}

export default JobNameSelectList
