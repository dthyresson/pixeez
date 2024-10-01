import type { ThumbnailsQuery, ThumbnailsQueryVariables } from 'types/graphql'

import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import { EmptyState } from 'src/components/CellStates/EmptyState'
import { FailureState } from 'src/components/CellStates/FailureState'
import { LoadingState } from 'src/components/CellStates/LoadingState'

export const QUERY: TypedDocumentNode<
  ThumbnailsQuery,
  ThumbnailsQueryVariables
> = gql`
  query ThumbnailsQuery {
    thumbnails: pics {
      id
      thumbnail
    }
  }
`
export const Empty = () => <EmptyState />

export const Failure = ({
  error,
}: CellFailureProps<ThumbnailsQueryVariables>) => <FailureState error={error} />

export const Loading = () => <LoadingState />

export const Success = ({ thumbnails }: CellSuccessProps<ThumbnailsQuery>) => {
  return (
    <ul className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
      {thumbnails.map((item) => {
        return (
          <li key={item.id}>
            <img src={item.thumbnail} alt={item.id} />
          </li>
        )
      })}
    </ul>
  )
}
