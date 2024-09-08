import type { TagsQuery, TagsQueryVariables } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

export const beforeQuery = (props: TagsQueryVariables) => {
  return {
    variables: props,
    pollInterval: 10_000,
  }
}

export const QUERY: TypedDocumentNode<TagsQuery, TagsQueryVariables> = gql`
  query TagsQuery {
    tags {
      id
      name
      pics {
        id
      }
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({ tags }: CellSuccessProps<TagsQuery>) => {
  return (
    <>
      <Metadata title="Tags" description="Tags" />
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => {
          const label =
            tag.pics.length > 1 ? `${tag.name} (${tag.pics.length})` : tag.name
          return (
            <Link
              className="rounded-md bg-purple-600 p-4 text-white"
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
