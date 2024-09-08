import type { FindTagQuery, FindTagQueryVariables, Pic } from 'types/graphql'

import { Metadata } from '@redwoodjs/web'
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import { EmptyState } from 'src/components/CellStates/EmptyState'
import { FailureState } from 'src/components/CellStates/FailureState'
import { LoadingState } from 'src/components/CellStates/LoadingState'
import { PicsGrid } from 'src/components/Pics/PicsGrid'

export const QUERY: TypedDocumentNode<FindTagQuery, FindTagQueryVariables> =
  gql`
    query FindTagQuery($id: String!) {
      tag: tag(id: $id) {
        id
        name
        pics {
          id
          album {
            id
            name
          }
          original
          withoutBackground
          description
        }
      }
    }
  `

export const Empty = () => <EmptyState />

export const Failure = ({ error }: CellFailureProps<FindTagQueryVariables>) => (
  <FailureState error={error} />
)

export const Loading = () => <LoadingState />

export const Success = ({
  tag,
}: CellSuccessProps<FindTagQuery, FindTagQueryVariables>) => {
  return (
    <>
      <Metadata title={`${tag.name} Tag`} description={`${tag.name} Tag`} />
      <div>
        <h1 className="mb-4 text-2xl font-bold">{tag.name}</h1>
        <PicsGrid pics={tag.pics as Pic[]} />
      </div>
    </>
  )
}
