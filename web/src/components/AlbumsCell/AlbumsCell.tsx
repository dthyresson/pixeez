import type { FindAlbumsQuery, FindAlbumsQueryVariables } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

export const QUERY: TypedDocumentNode<
  FindAlbumsQuery,
  FindAlbumsQueryVariables
> = gql`
  query FindAlbumsQuery {
    albums {
      id
      name
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({ albums }: CellSuccessProps<FindAlbumsQuery>) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {albums.map((item) => (
        <div
          key={item.id}
          className="rounded-lg bg-gray-100 p-4 shadow-md dark:bg-gray-800"
        >
          <Link to={routes.album({ id: item.id })}>
            <p className="text-center font-semibold">{item.name}</p>
          </Link>
        </div>
      ))}
    </div>
  )
}
