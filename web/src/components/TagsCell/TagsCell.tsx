import type { TagsQuery, TagsQueryVariables } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import { EmptyState } from 'src/components/CellStates/EmptyState'
import { FailureState } from 'src/components/CellStates/FailureState'
import { LoadingState } from 'src/components/CellStates/LoadingState'

export const beforeQuery = (props: TagsQueryVariables) => {
  return {
    variables: props,
  }
}

export const QUERY: TypedDocumentNode<TagsQuery, TagsQueryVariables> = gql`
  query TagsQuery @live {
    tags {
      id
      name
      pics {
        id
      }
    }
  }
`

export const Empty = () => <EmptyState />

export const Failure = ({ error }: CellFailureProps) => (
  <FailureState error={error} />
)

export const Loading = () => <LoadingState />

export const Success = ({ tags }: CellSuccessProps<TagsQuery>) => {
  const picCounts = tags.map((tag) => tag.pics.length)
  const maxCount = Math.max(...picCounts)
  const binSize = maxCount / 5

  const getColorClass = (picCount: number) => {
    const bin = Math.min(Math.floor(picCount / binSize), 4)
    const colorClasses = [
      'bg-amber-500',
      'bg-pink-500',
      'bg-teal-500',
      'bg-cyan-500',
      'bg-sky-500',
    ]
    return colorClasses[bin]
  }

  return (
    <>
      <Metadata title="Tags" description="Tags" />
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => {
          const label =
            tag.pics.length > 1 ? `${tag.name} (${tag.pics.length})` : tag.name
          return (
            <Link
              className={`rounded-md p-4 text-white ${getColorClass(tag.pics.length)} opacity-100 hover:opacity-90`}
              key={`tag-${tag.id}-${tag.name}`}
              to={routes.tag({ id: tag.id })}
            >
              {label}
            </Link>
          )
        })}
      </div>
    </>
  )
}
