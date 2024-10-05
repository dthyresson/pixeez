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
    <div className="relative">
      <select
        value={selectedStatus}
        onChange={handleStatusChange}
        className="w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2 pr-8 leading-tight text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
      >
        <option value="All">All</option>
        {statuses.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <svg
          className="h-4 w-4 fill-current"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
    </div>
  )
}

export default JobNameStatusList
