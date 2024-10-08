import {
  LockClosedIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/20/solid'
import type { HistoriesQuery, HistoriesQueryVariables } from 'types/graphql'

import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import { EmptyState } from 'src/components/CellStates/EmptyState'
import { FailureState } from 'src/components/CellStates/FailureState'
import { LoadingState } from 'src/components/CellStates/LoadingState'

import JobStatus from './JobStatus'

export const beforeQuery = (props: HistoriesQueryVariables) => {
  return { variables: props, pollInterval: 1_250 }
}

export const QUERY: TypedDocumentNode<HistoriesQuery, HistoriesQueryVariables> =
  gql`
    query HistoriesQuery($jobName: String, $status: String) {
      histories(jobName: $jobName, status: $status) {
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
        status
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
}: CellSuccessProps<HistoriesQuery, HistoriesQueryVariables>) => {
  return (
    <div className="max-h-[calc(100vh-200px)] space-y-4 overflow-y-auto">
      {histories.map((item) => {
        const isLocked = item.lockedAt && item.lockedBy
        return (
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
              <div className="mb-2 flex items-center">
                <h3 className="mr-2 text-xl font-bold">{item.name}</h3>
                <JobStatus status={item.status} />
              </div>
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
                {isLocked && (
                  <div className="col-span-2 mt-2 flex items-center rounded-md bg-neutral-100 p-2 text-neutral-800">
                    <LockClosedIcon className="mr-2 h-5 w-5" />
                    <div>
                      <p>
                        <span className="font-semibold">Locked At:</span>{' '}
                        {new Date(item.lockedAt).toLocaleString()}
                      </p>
                      <p>
                        <span className="font-semibold">Locked By:</span>{' '}
                        {item.lockedBy}
                      </p>
                    </div>
                  </div>
                )}
                {item.lastError && (
                  <div className="col-span-2 mt-2 flex items-center rounded-md bg-red-100 p-2 text-red-500">
                    <ExclamationCircleIcon className="mr-2 h-5 w-5 flex-shrink-0" />
                    <div className="flex-grow">
                      <p className="word-break-break-word">
                        <span className="font-semibold">Error:</span>{' '}
                        {item.lastError}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
