import React from 'react'

type JobNameStatusListProps = {
  selectedStatus: string
  onStatusChange: (status: string) => void
}

const JobNameStatusList = ({
  selectedStatus,
  onStatusChange,
}: JobNameStatusListProps) => {
  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onStatusChange(event.target.value)
  }

  const statuses = ['done', 'failed', 'running', 'scheduled']

  return (
    <select
      value={selectedStatus}
      onChange={handleStatusChange}
      className="rounded-md border border-gray-300 p-2"
    >
      <option value="All">All</option>
      {statuses.map((status) => (
        <option key={status} value={status}>
          {status}
        </option>
      ))}
    </select>
  )
}

export default JobNameStatusList
