import type { PicsQuery, PicsQueryVariables } from 'types/graphql'

import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

export const QUERY: TypedDocumentNode<PicsQuery, PicsQueryVariables> = gql`
  query PicsQuery {
    pics {
      id
      album {
        id
        name
      }
      original
      processed
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({ pics }: CellSuccessProps<PicsQuery>) => {
  return (
    <div>
      <ul className="grid grid-cols-3 gap-4">
        {pics.map((item) => {
          return (
            <li key={item.id}>
              <img src={item.original} alt={item.original} />
            </li>
          )
        })}
      </ul>
      <ul className="grid grid-cols-3 gap-4">
        {pics.map((item) => {
          return (
            <li key={item.id}>
              <img src={item.processed} alt={item.processed} />
            </li>
          )
        })}
      </ul>
    </div>
  )
}
