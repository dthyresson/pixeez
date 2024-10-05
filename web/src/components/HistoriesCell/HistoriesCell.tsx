import { useState } from 'react'

import type { HistoriesQuery, HistoriesQueryVariables } from 'types/graphql'

import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import { EmptyState } from 'src/components/CellStates/EmptyState'
import { FailureState } from 'src/components/CellStates/FailureState'
import { LoadingState } from 'src/components/CellStates/LoadingState'

export const QUERY: TypedDocumentNode<HistoriesQuery, HistoriesQueryVariables> =
  gql`
    query HistoriesQuery($jobName: String) {
      jobCount {
        id
        name
        jobCount
      }
      histories(jobName: $jobName) {
        id
        jobPicId
        name
        durationSeconds
        queue
        priority
        attempts
        createdAt
        updatedAt
        lockedAt
        lockedBy
        lastError
        picId
        albumId
        description
        format
        height
        width
        original
        thumbnail
        withoutBackground
      }
    }
  `
export const Empty = () => <EmptyState />

export const Failure = ({
  error,
}: CellFailureProps<HistoriesQueryVariables>) => <FailureState error={error} />

export const Loading = () => <LoadingState />

export const Success = ({
  histories,
  jobCount,
  queryResult,
}: CellSuccessProps<HistoriesQuery>) => {
  const [selectedJob, setSelectedJob] = useState('')

  const handleJobChange = async (event) => {
    const newJobName = event.target.value
    setSelectedJob(newJobName)

    await queryResult.refetch({ jobName: newJobName })
  }

  return (
    <div className="space-y-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">History</h1>
        <select
          value={selectedJob}
          onChange={handleJobChange}
          className="w-1/4 rounded-md border border-gray-300 p-2"
        >
          <option value="All">All</option>
          {jobCount.map((job) => (
            <option key={job.id} value={job.name}>
              {job.name} ({job.jobCount})
            </option>
          ))}
        </select>
      </div>

      {histories.map((item) => (
        <div
          key={item.id}
          className="flex flex-wrap items-stretch rounded-lg bg-white p-4 shadow-md"
        >
          <div className="mr-4 flex w-36 items-center">
            {item.original && (
              <img
                src={item.original}
                alt="Original"
                className="w-full rounded object-cover"
              />
            )}
          </div>
          <div className="flex-1">
            <h3 className="mb-2 text-xl font-bold">{item.name}</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <p>
                <span className="font-semibold text-gray-700">ID:</span>{' '}
                {item.id}
              </p>
              <p>
                <span className="font-semibold text-gray-700">Queue:</span>{' '}
                {item.queue}
              </p>
              <p>
                <span className="font-semibold text-gray-700">Priority:</span>{' '}
                {item.priority}
              </p>
              <p>
                <span className="font-semibold text-gray-700">
                  Duration (sec):
                </span>{' '}
                {item.durationSeconds || 'N/A'}{' '}
              </p>
              <p>
                <span className="font-semibold text-gray-700">Created:</span>{' '}
                {new Date(item.createdAt).toLocaleString()}
              </p>
              <p>
                <span className="font-semibold text-gray-700">Updated:</span>{' '}
                {new Date(item.updatedAt).toLocaleString()}
              </p>
              <p>
                <span className="font-semibold text-gray-700">Locked At:</span>{' '}
                {item.lockedAt
                  ? new Date(item.lockedAt).toLocaleString()
                  : 'N/A'}
              </p>
              <p>
                <span className="font-semibold text-gray-700">Locked By:</span>{' '}
                {item.lockedBy || 'N/A'}
              </p>
              <p className="col-span-2">
                <span className="font-semibold text-gray-700">Error:</span>{' '}
                {item.lastError || 'None'}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
